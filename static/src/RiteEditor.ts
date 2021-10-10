import { basename } from "@tauri-apps/api/path";
import { Editor, Position } from "codemirror";
import { COMMANDS } from "./commands";
import { RiteCommands, RiteFile } from "./utils";
import { parseCommand } from "./commands";
import { DEFAULT_KEYBINDS, parseKeybind } from "./keybinds";
import { editorAlert, editorConfirm } from "./prompt";
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
    currentFileName: string | null = null;
    editor: Editor;
    commands: RiteCommands;
    statusLine: StatusLineControls;
    editorRoot: HTMLElement;
    dirty: boolean = true;

    constructor(editorRoot: HTMLElement, commands: RiteCommands) {
        this.commands = commands;
        this.editorRoot = editorRoot;
        this.editor = CodeMirror(editorRoot, {
            mode: 'gfm',
            lineNumbers: true
        });

        this.statusLine = StatusLine(this.editorRoot);
        this.statusLine.setDirty('*');
        this.statusLine.setFileName('<new file>');

        this.editor.on('change', () => {
            this.dirty = true;
            this.statusLine.setDirty('*');
            let pos: Position = this.editor.getCursor();

            this.statusLine.setRightMost(`Ln ${pos.line}, Col ${pos.ch}`)
        })
    }

    async setCurrentFile(file: RiteFile) {
        this.currentFile = file;
        this.currentFileName = await basename(file.path);
        this.editor.setValue(file.contents);
        this.statusLine.setFileName(this.currentFileName || '<new file>');
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

        window.addEventListener('keyup', async (e) => {
            for (const keybind of keybinds) {
                if (keybind.checker(e)) {
                    await this.execCommand(keybind.action);
                }
            }
        })
    }

    async save(asName: string | null = null) {
        this.statusLine.setDirty('saving...');
        let file: RiteFile;
        if (this.currentFile === null) {
            const savePath = asName || await dialog.save();
            
            if (!savePath) return;
            file = { path: savePath, contents: '' };
        }
        else {
            file = this.currentFile;
        }

        this.statusLine.setFileName(file.path);
        this.currentFile = { path: file.path, contents: this.editor.getValue() };
        this.dirty = false;
        
        setTimeout(() => {
            this.statusLine.setDirty(this.dirty ? '*' : '')
        }, 3000);

        return this.saveFile();
    }

    async saveFile() {
        return writeFile(this.currentFile);
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