import { basename } from "@tauri-apps/api/path";
import { Editor, Position } from "codemirror";
import { COMMANDS } from "./commands";
import { dumpJSON, RiteCommands, RiteFile, RiteSettings, setAppFont, RiteKeybind, setCSSVar } from "./utils";
import { parseCommand } from "./commands";
import { DEFAULT_KEYBINDS, parseKeybind } from "./keybinds";
import { editorAlert, editorAlertFatal, editorConfirm } from "./prompt";
import { dialog } from "@tauri-apps/api";
import { writeFile } from "@tauri-apps/api/fs";
import cf from 'campfire.js';
import CodeMirror from "codemirror";
import { exit } from "@tauri-apps/api/process";

interface StatusLineControls {
    elem: HTMLElement;
    setFileName: (value: string) => any;
    setDirty: (value: string) => any;
    setRightMost: (value: string) => any;
}

const StatusLine = (parent: HTMLElement) => {
    const elem = cf.insert(cf.nu('div#statusline'), { atEndOf: parent }) as HTMLElement;
    const filenameElem = cf.insert(cf.nu('div'), { atEndOf: elem }) as HTMLElement;
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
    editor: Editor;
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

    constructor(editorRoot: HTMLElement, commands: RiteCommands, platform: string) {
        this.commands = commands;
        this.editorRoot = editorRoot;
        this.editor = CodeMirror(editorRoot, {
            mode: 'gfm', lineNumbers: true, lineWrapping: true
        });

        this.statusLine = StatusLine(this.editorRoot);
        this.setDirty(true);
        this.updateFileName();
        this.updateDocInfo();

        this.editor.on('change', () => {
            this.setDirty(true);
            this.updateDocInfo();
        })

        window.addEventListener('rite-prompt-show', () => {
            this.acceptingKeybinds = false;
        });
        window.addEventListener('rite-prompt-hide', () => {
            this.acceptingKeybinds = true;
        });

        this.registerKeybindListener();
    }

    insertAround(start: string, end: string = start) {
        var doc = this.editor.getDoc();
        var cursor = doc.getCursor();

        if (doc.somethingSelected()) {
            var selection = doc.getSelection();
            doc.replaceSelection(start + selection + end);
        } else {
            doc.replaceRange(start + end, { line: cursor.line, ch: cursor.ch });
            doc.setCursor({ line: cursor.line, ch: cursor.ch + start.length });
        }
    }

    insertBefore(insertion: string, cursorOffset = insertion.length) {
        var doc = this.editor.getDoc();
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

    setDirty(dirty: boolean) {
        this.dirty = dirty;
        this.statusLine.setDirty(this.dirty ? '*' : '');
    }

    updateDocInfo() {
        let pos: Position = this.editor.getCursor();
        this.statusLine.setRightMost(`Ln ${pos.line + 1}, Col ${pos.ch + 1}`);
    }

    updateFileName() {
        if (this.currentFile === null) {
            this.statusLine.setFileName('<new file>');
        }
        else {
            basename(this.currentFile.path)
                .then(name => this.statusLine.setFileName(name))
                .catch(err => this.statusLine.setFileName("Error: couldn't get file name."));
        }
    }

    async loadConfig(contents: string) {
        const config = JSON.parse(contents) as RiteSettings;

        if (Object.keys(config.keybinds).length < Object.keys(DEFAULT_KEYBINDS).length) {
            const newKeyBinds = { ...DEFAULT_KEYBINDS };
            Object.assign(newKeyBinds, config.keybinds);
            config.keybinds = newKeyBinds;
        }
        await this.setConfig(config);
        await this.dumpConfig();
    }

    async dumpConfig() {
        return await writeFile({
            path: this.getConfigPath(),
            contents: dumpJSON(this.config)
        });
    }

    async setConfigVar(key: string, value: any) {
        const currentConfig = this.getConfig();
        currentConfig[key] = value;
        this.setConfig(currentConfig);
        await this.dumpConfig();
    }

    getConfigVar(key: string) {
        return this.config[key] || null;
    }

    async extendConfig(settings: Record<string, any>) {
        const currentConfig = this.getConfig();
        Object.assign(currentConfig, settings);
        this.setConfig(currentConfig);
        return await this.dumpConfig();
    }

    async setConfig(config: RiteSettings) {
        this.config = config;
        setAppFont(config.font);
        this.registerKeybinds(config.keybinds);
        this.editor.setOption('lineNumbers', config.lineNumbers);
        const editorElem = this.editorRoot.querySelector('.CodeMirror') as HTMLElement;
        if (config.portraitMode) {
            editorElem.style.maxWidth = '100ch';
        }
        else {
            editorElem.style.maxWidth = '100%';
        }

        if (config.fontSize) {
            setCSSVar('font-size', config.fontSize + 'px');
        }
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

    loadFile(file: RiteFile) {
        this.currentFile = file;
        this.editor.setValue(file.contents);
        this.updateFileName();
    }

    async execCommand(raw: string, source: 'palette' | 'keybind') {
        const { cmd, args } = parseCommand(raw);
        if (COMMANDS[cmd] && ((COMMANDS[cmd].palette && source === 'palette') || source === 'keybind')) {
            COMMANDS[cmd].action(this, args);
        }
        else if (cmd === '') {
            return;
        }
        else {
            await editorAlert('Unknown command');
        }
    }

    async processKeypress(e: KeyboardEvent) {
        if (!this.acceptingKeybinds) return;

        for (const keybind of this.keybinds) {
            if (keybind.checker(e)) {
                await this.execCommand(keybind.action, 'keybind');
                return;
            }
        }
    }

    registerKeybinds(rawKeybinds: Record<string, string>) {
        this.keybinds = [];
        this.keybinds = Object.keys(rawKeybinds).map(elem => {
            return {
                checker: parseKeybind(elem, this.platform),
                action: rawKeybinds[elem]
            };
        })
    }

    registerKeybindListener() {
        window.addEventListener('keyup', async (e) => {
            await this.processKeypress(<KeyboardEvent>e);
        });
    }

    async save(isSaveAs: boolean = false) {
        this.statusLine.setDirty('saving...');

        let file: RiteFile;
        if (this.currentFile === null || isSaveAs) {
            const savePath = await dialog.save();
            if (!savePath) {
                this.statusLine.setDirty('save cancelled.');
                setTimeout(() => this.setDirty(this.dirty), 5000);
                return;
            };

            file = { path: savePath, contents: '' };
        }
        else {
            file = this.currentFile;
        }

        this.statusLine.setFileName(file.path);
        this.currentFile = { path: file.path, contents: this.editor.getValue() };
        this.dirty = false;

        setTimeout(() => this.setDirty(this.dirty), 5000);

        try {
            await this.saveFile();
            this.statusLine.setDirty('saved.');
        }
        catch (e) {
            await editorAlertFatal(`Error saving: ${e}`);
        }
    }

    async saveFile() {
        if (this.currentFile) return writeFile(this.currentFile);
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