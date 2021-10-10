import { basename } from "@tauri-apps/api/path";
import { Editor, Position } from "codemirror";
import { COMMANDS } from "./commands";
import { dumpJSON, RiteCommands, RiteFile, RiteSettings, setAppFont } from "./utils";
import { parseCommand } from "./commands";
import { parseKeybind } from "./keybinds";
import { editorAlert, editorAlertFatal, editorConfirm } from "./prompt";
import { dialog, path } from "@tauri-apps/api";
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
    keyDownListener: EventListener | null;

    constructor(editorRoot: HTMLElement, commands: RiteCommands) {
        this.commands = commands;
        this.editorRoot = editorRoot;
        this.editor = CodeMirror(editorRoot, {
            mode: 'gfm', lineNumbers: true
        });

        this.statusLine = StatusLine(this.editorRoot);
        this.setDirty(true);
        this.updateFileName();
        this.updateDocInfo();

        this.editor.on('change', () => {
            this.setDirty(true);

        })
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
        await this.setConfig(config);
    }

    async updateConfig(key: string, value: any) {
        const currentConfig = this.getConfig();
        currentConfig[key] = value;
        this.setConfig(currentConfig);
    
        return await writeFile({
            path: this.getConfigPath(),
            contents: dumpJSON(currentConfig)
        });
    }

    async setConfig(config: RiteSettings) {
        this.config = config;
        setAppFont(config.font);
        await this.registerKeybinds(config.keybinds);
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

    async execCommand(raw: string) {
        const { cmd, args } = parseCommand(raw);
        if (COMMANDS[cmd]) {
            COMMANDS[cmd].action(this, args);
        }
        else {
            await editorAlert('Unknown command');
        }
    }

    async registerKeybinds(rawKeybinds: Record<string, string>) {
        const keybinds = Object.keys(rawKeybinds).map(elem => {
            return {
                checker: parseKeybind(elem),
                action: rawKeybinds[elem]
            };
        })

        if (this.keyDownListener) {
            window.removeEventListener('keydown', this.keyDownListener);
        }

        this.keyDownListener = async (e) => {
            for (const keybind of keybinds) {
                if (keybind.checker(<KeyboardEvent>e)) {
                    await this.execCommand(keybind.action);
                    return;
                }
            }
        };

        window.addEventListener('keyup', this.keyDownListener);
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
            if (await editorConfirm('Are you sure you want to exit? Changes you made have not been saved.')) {
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