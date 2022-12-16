import { basename } from "@tauri-apps/api/path";
import { Editor, Position } from "codemirror";
import { dumpJSON, RiteCommands, RiteFile, RiteSettings, setAppFont, RiteKeybind, setCSSVar, getPaletteKeybind, writeFileAtomic } from "./utils";
import { DEFAULT_KEYBINDS } from "./keybinds";
import { editorAlert, editorAlertFatal, editorConfirm } from "./prompt";
import { dialog, path } from "@tauri-apps/api";
import cf from 'campfire.js';
import CodeMirror from "codemirror";
import { exit } from "@tauri-apps/api/process";
import { MODIFIABLE_SETTINGS } from "./config";
import { appWindow } from "@tauri-apps/api/window";
import { COMMANDS } from "./commands";

interface StatusLineControls {
    elem: HTMLElement;
    setFileName: (value: string) => any;
    setDirty: (value: string) => any;
    setRightMost: (value: string) => any;
}

const StatusLine = (parent: HTMLElement) => {
    const elem = cf.insert(cf.nu('div#statusline'), { atEndOf: parent }) as HTMLElement;
    const filenameElem = cf.insert(cf.nu('div#filename'), { atEndOf: elem }) as HTMLElement;
    const dirtyStateElem = cf.insert(
        cf.nu('div#statusline-dirty-state'), { atEndOf: elem }
    ) as HTMLElement;

    const rightMostElem = cf.insert(
        cf.nu('div#statusline-rightmost'), { atEndOf: elem }
    ) as HTMLElement;

    const setFileName = (value: string) => cf.extend(filenameElem, { c: value });
    const setDirty = (value: string) => cf.extend(dirtyStateElem, { c: value });
    const setRightMost = (value: string) => cf.extend(rightMostElem, { c: value });

    return { elem, setFileName, setDirty, setRightMost };
}

export class RiteEditor {
    currentFile: RiteFile | null = null;
    cm: Editor;
    commands: RiteCommands;
    statusLine: StatusLineControls;
    editorRoot: HTMLElement;
    config: RiteSettings;
    dirty: boolean = true;
    configPath: string;
    currentPos: Position;
    keybinds: RiteKeybind[] = [];
    acceptingKeybinds: boolean = true;
    platform: string;
    version: string;
    isComputingWordCount: boolean = false;
    preview: HTMLElement;
    focused: boolean = true;

    constructor(editorRoot: HTMLElement, commands: RiteCommands, platform: string) {
        this.commands = commands;
        this.editorRoot = editorRoot;
        this.platform = platform;
        this.preview = document.querySelector('div#preview') as HTMLElement;
        this.cm = CodeMirror(editorRoot, {
            mode: 'gfm', lineNumbers: true, lineWrapping: true, styleActiveLine: { nonEmpty: true }
        });

        getPaletteKeybind().then(keybind => {
            this.cm.setOption('placeholder', `Press ${keybind} at any time to bring up the command palette.`)
        }).catch(err => {
            this.cm.setOption('placeholder', `Press Ctrl+Alt+P at any time to bring up the command palette.`)
        })

        this.statusLine = StatusLine(this.editorRoot);
        this.setDirty(false);
        this.updateFileName();
        this.updateDocInfo();

        this.cm.on('change', () => {
            this.setDirty(true);
            this.updateDocInfo();
        })

        window.addEventListener('rite-prompt-show', () => {
            this.acceptingKeybinds = false;
        });
        window.addEventListener('rite-prompt-hide', () => {
            this.acceptingKeybinds = true;
        });

        this.setEditorCustomKeys();
    }

    insertAround(start: string, end: string = start) {
        var doc = this.cm.getDoc();
        var cursor = doc.getCursor();

        if (doc.somethingSelected()) {
            var selection = doc.getSelection();
            doc.replaceSelection(start + selection + end);
        } else {
            doc.replaceRange(start + end, { line: cursor.line, ch: cursor.ch });
            doc.setCursor({ line: cursor.line, ch: cursor.ch + start.length });
        }
    }

    setVersion(version: string) {
        this.version = version;
    }

    getVersion() {
        return this.version;
    }

    insertBefore(insertion: string, cursorOffset = insertion.length) {
        var doc = this.cm.getDoc();
        var cursor = doc.getCursor();

        if (doc.somethingSelected()) {
            var selections = doc.listSelections();
            selections.forEach((selection) => {
                var pos = [selection.head.line, selection.anchor.line].sort();

                for (var i = pos[0]; i <= pos[1]; i++) {
                    doc.replaceRange(insertion, { line: i, ch: 0 });
                }

                doc.setCursor({ line: pos[0], ch: cursorOffset || 0 });
            });
        } else {
            doc.replaceRange(insertion, { line: cursor.line, ch: 0 });
            doc.setCursor({ line: cursor.line, ch: cursorOffset || 0 });
        }
    }

    refreshDirtyAfter(ms: number) {
        setTimeout(() => {
            this.setDirty(this.dirty);
        }, ms);
    }

    setDirty(dirty: boolean) {
        this.dirty = dirty;
        this.statusLine.setDirty(this.dirty ? '*' : '');
    }

    updateDocInfo() {
        if (!this.isComputingWordCount) {
            this.wordCount().then((val: number | string) => {
                this.setDocInfoString(val)
            });
        }
    }

    async setDocInfoString(count: string | number) {
        let pos: Position = this.cm.getCursor();
        this.statusLine.setRightMost(`${count} words ● Ln ${pos.line + 1}, Col ${pos.ch + 1}`);
    }

    updateFileName() {
        if (this.currentFile === null) {
            this.statusLine.setFileName('<new file>');
            appWindow.setTitle("New file - Rite");
        }
        else {
            basename(this.currentFile.path)
                .then(name => {
                    this.statusLine.setFileName(name)
                    return name
                }).then(async name => await appWindow.setTitle(`${name} - Rite`))
                .catch(err => this.statusLine.setFileName("ERROR: unable to get file name"));
        }
    }

    /**
     * Parses and loads the config file into the editor.
     * @param contents The JSON string from which to load the config.
     */
    async loadConfig(contents: string) {
        let config: RiteSettings = {};
        try {
            config = JSON.parse(contents) as RiteSettings;
        }
        catch (e) {
            await editorAlert(`Error parsing config file: ${e}`);
            await exit(1);
        }

        if (!config.keybinds || (Object.keys(config.keybinds).length < Object.keys(DEFAULT_KEYBINDS).length)) {
            const newKeyBinds = { ...DEFAULT_KEYBINDS };
            Object.assign(newKeyBinds, config.keybinds);
            config.keybinds = newKeyBinds;
        }

        await this.setConfig(config);
        await this.dumpConfig();
    }
    /**
     * Attempts to write the current state of the config to disk.
     * @returns Void promise - the result of writing the config file.
     */
    async dumpConfig() {
        return await writeFileAtomic(this.getConfigPath(), dumpJSON(this.config));
    }

    async setConfigVar(key: string, value: any) {
        const currentConfig = this.getConfig();
        currentConfig[key] = value;
        this.setConfig(currentConfig);
        await this.dumpConfig();
    }

    getConfigVar(key: string) {
        let stored = this.config && this.config[key];
        if (typeof stored !== 'undefined') return stored;
        if (!stored && Object.keys(MODIFIABLE_SETTINGS).includes(key)) {
            return MODIFIABLE_SETTINGS[key].default;
        }
        return null;
    }

    /**
     * Update the config values of the editors to new ones.
     * @param settings The new values of settings to set in the config.
     * @returns the promise returned by dumpConfig.
     */
    async extendConfig(settings: Record<string, any>) {
        const currentConfig = this.getConfig();
        Object.assign(currentConfig, settings);
        this.setConfig(currentConfig);
        return await this.dumpConfig();
    }

    /**
     * Actually does the config-loading work -- takes a config object and updates the editor state.
     * @param config The configuration to set.
     */
    async setConfig(config: RiteSettings) {
        this.config = config;
        setAppFont(config.font);
        this.registerFocusListeners();
        this.registerKeybindListeners(config.keybinds);
        this.cm.setOption('lineNumbers', config.line_numbers);
        const editorElem = this.editorRoot.querySelector('.CodeMirror') as HTMLElement;

        if (config.portrait_mode) {
            editorElem.style.maxWidth = '100ch';
        }
        else {
            editorElem.style.maxWidth = '100%';
        }

        if (config.font_size) {
            setCSSVar('font-size', config.font_size + 'px');
        }

        if (config.indent_size) {
            this.cm.setOption('tabSize', parseInt(config.indent_size));
            this.cm.setOption("indentUnit", parseInt(config.indent_size));
        }

        if (config.light_theme) {
            document.documentElement.classList.add('light');
        }
        else {
            document.documentElement.classList.remove('light');
        }

        if (config.custom_styles) {
            const styles: Record<string, string> = config.custom_styles;
            Object.entries(styles).forEach(([key, val]: [string, string]) => {
                setCSSVar(key, val);
            })
        }

        this.cm.setOption('indentWithTabs', !config.use_spaces);
    }

    setEditorCustomKeys() {
        let indentSize: number = this.getConfigVar('indent_size') || 2;
        let wsRe = new RegExp(`^ (([]{${indentSize}, })| (\t +)) +$`);
        let startsWsRe = new RegExp(`^ (([]{${indentSize}, })| (\t +)) +.* `);
        this.cm.addKeyMap({
            'Ctrl-F': 'findPersistent',
            'Cmd-F': 'findPersistent',
            'Ctrl-H': 'replace',
            'Shift-Ctrl-H': 'replaceAll',
            'Cmd-H': 'replace',
            'Shift-Cmd-H': 'replaceAll',
            Tab: (cm) => {
                if (cm.somethingSelected()) {
                    cm.indentSelection("add");
                } else {
                    cm.replaceSelection(
                        this.getConfigVar('use_spaces')
                            ? " ".repeat(indentSize)
                            : "\t",
                        "end"
                    );
                }
            },
            Backspace: (cm) => {
                let cursor = cm.getCursor();

                if (cm.somethingSelected()) {
                    cm.replaceSelection('');
                    return;
                }
                const line = cm.getLine(cursor.line);

                let reduceIndent = () => {
                    if (line.endsWith('\t')) {
                        cm.execCommand('delCharBefore');
                    }
                    else {
                        let size = indentSize;
                        if (!this.config.use_spaces) size = 1;

                        let spaced = line.substring(0,
                            cm.getCursor().ch)
                            .match(/^\t*([ ]+).*/);
                        if (spaced) {
                            size = (spaced[1].length % indentSize) || indentSize;
                        }
                        while (size--) cm.execCommand('delCharBefore');
                    }
                }
                if (wsRe.test(line) && this.getConfigVar('use_spaces') ||
                    startsWsRe.test(line) && wsRe.test(line.substring(0, cursor.ch))) {
                    reduceIndent();
                }
                else {
                    cm.execCommand('delCharBefore');
                }
            },
            'Shift-Tab': (cm) => {
                const line = cm.getLine(cm.getCursor().line);
                if (cm.somethingSelected()) {
                    cm.indentSelection("subtract");
                }
                else if (wsRe.test(line)) {
                    if (this.getConfigVar('use_spaces')) {
                        if (line.endsWith('\t')) {
                            cm.execCommand('delCharBefore');
                        }
                        else {
                            let size = this.getConfigVar('indent_size');
                            while (size--) cm.execCommand('delCharBefore');
                        }
                    }
                    else {
                        cm.execCommand("delCharBefore");
                    }
                }
                else {
                    cm.indentLine(cm.getCursor().line, "subtract");
                }
            }
        })
    }

    getConfig() {
        return this.config;
    }

    setConfigPath(configPath: string) {
        this.configPath = configPath;
    }

    getConfigPath() {
        return this.configPath;
    }

    loadFile(file: RiteFile | null) {
        this.currentFile = file;
        this.cm.setValue(file?.contents || "");
        this.cm.clearHistory();
        this.updateFileName();
        this.setDirty(false);
    }

    async execCommand(cmd: string, source: 'palette' | 'keybind') {
        cmd = cmd.trim();
        if (this.commands[cmd] && ((this.commands[cmd].palette && source === 'palette') || source === 'keybind')) {
            await this.commands[cmd].action(this);
        }
        else if (cmd === '') {
            return;
        }
        else {
            await editorAlert('Unknown command');
        }
    }

    registerFocusListeners() {
        window.addEventListener('focus', () => {
            this.focused = true;
        })
        window.addEventListener('blur', () => {
            this.focused = false;
        })
    }

    parseKeybinds(rawKeybinds: Record<string, string>) {
        return Object.entries(rawKeybinds).map(([elem, cmd]) => {
            const isMac = this.platform === 'macos';
            const [modifiers, alpha] = elem.split('+');
            const components = {
                ctrl: modifiers.includes('C'),
                shift: modifiers.includes('S'),
                alt: modifiers.includes('A'),
            }

            return {
                checker: (e: KeyboardEvent) => {
                    if (components.ctrl) {
                        if (!e[isMac ? 'metaKey' : 'ctrlKey']) return false;
                    }
                    if (components.alt && !e.altKey) return;
                    if (components.shift && !e.shiftKey) return;
                    if (e.key === (alpha || '+')) return true;
                },
                action: () => COMMANDS[cmd].action(this)
            }
        })
    }

    registerKeybindListeners(rawKeybinds: Record<string, string>) {
        const actions = this.parseKeybinds(rawKeybinds);
        window.addEventListener('keydown', async (e) => {
            for (const action of actions) {
                if (action.checker(e)) {
                    await action.action();
                    break;
                }
            }
        })
    }

    async save(isSaveAs: boolean = false) {
        this.statusLine.setDirty('saving...');

        let file: RiteFile;
        if (this.currentFile === null || isSaveAs) {
            const options = {
                defaultPath: this.currentFile ? await path.dirname(this.currentFile.path) : undefined
            };
            const savePath = await dialog.save(options);
            if (!savePath) {
                this.statusLine.setDirty('save cancelled.');
                this.refreshDirtyAfter(5000);
                return;
            };

            file = { path: savePath, contents: '' };
        }
        else {
            file = this.currentFile;
        }

        this.statusLine.setFileName(file.path);
        this.currentFile = { path: file.path, contents: this.cm.getValue() };
        this.dirty = false;

        this.refreshDirtyAfter(5000);

        try {
            await this.saveFile();
            this.statusLine.setDirty('saved.');
        }
        catch (e) {
            await editorAlertFatal(`Error saving: ${e} `);
        }
    }

    async saveFile() {
        if (this.currentFile) return await writeFileAtomic(this.currentFile.path, this.currentFile.contents);
    }

    async newFile() {
        if (this.dirty && await editorConfirm("Save current file?")) {
            await this.save();
        }
        else {
            this.loadFile(null);
        }
    }

    getContents() {
        return this.cm.getValue();
    }

    setContents(c: string) {
        this.cm.setValue(c);
    }

    wordCount() {
        this.isComputingWordCount = true;
        return new Promise((actuallyResolve, reject) => {
            const resolve = (val: string | number) => {
                this.isComputingWordCount = false;
                actuallyResolve(val);
            }
            try {
                const data = this.cm.getValue();
                if (data.length > 5000000) {
                    resolve('file too long.');
                    return;
                }
                let pattern =
                    /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
                let matches = data.match(pattern);
                let count = 0;
                if (matches === null) {
                    resolve(count);
                    return;
                }
                for (let i = 0; i < matches.length; i++) {
                    count += matches[i].charCodeAt(0) >= 0x4E00 ? matches[i].length : 1;
                }
                resolve(count);
            }
            catch (e) {
                reject(e);
            }
        })
    }

    async close() {
        if (this.dirty) {
            if (await editorConfirm('Are you sure you want to exit? Changes you made may not have been saved.')) {
                await exit(1);
            }
            else {
                return;
            }
        }
        else {
            await exit(0);
        }
    }
}