import { basename } from "@tauri-apps/api/path";
import { Editor } from "codemirror";
import { COMMANDS } from "./commands";
import { RiteCommands, RiteFile, RiteKeybind } from "./utils";
import { parseCommand } from "./commands";
import { DEFAULT_KEYBINDS, parseKeybind } from "./keybinds";
import { editorAlert, editorPrompt } from "./prompt";
import { dialog } from "@tauri-apps/api";
import { writeFile } from "@tauri-apps/api/fs";

export class EditorState {
    currentFile: RiteFile | null = null;
    currentFileName: string | null = null;
    editor: Editor;
    commands: RiteCommands;
    
    constructor(editor: Editor, commands: RiteCommands) {
        this.commands = commands;
        this.editor = editor;
    }

    async setCurrentFile(file: RiteFile) {
        this.currentFile = file;
        this.currentFileName = await basename(file.path);
        this.editor.setValue(file.contents);
    }

    async execCommand(raw: string) {
        const {cmd, args} = parseCommand(raw);
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
                action: DEFAULT_KEYBINDS[elem]
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

    async save(as: string | null = null) {
        let file;

        if (this.currentFile === null) {
            const savePath = await dialog.save();
            if (!savePath) {
                await editorAlert('returning');
                return;
            }

            file = {
                path: savePath,
                contents: ''
            }
        }
        else {
            file = this.currentFile;
        }

        this.currentFile = {
            path: file.path,
            contents: this.editor.getValue()
        };

        return this.saveFile();
    }

    async saveFile() {
        return writeFile(this.currentFile);
    }
}