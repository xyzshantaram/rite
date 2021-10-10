import { dialog } from "@tauri-apps/api"
import { readTextFile } from "@tauri-apps/api/fs"
import { EditorState } from "./EditorState"
import { editorAlert, editorChoose, editorPrompt } from "./prompt"
import { CommandHandler, PromptChoice, RiteCommands, RiteFile } from "./utils"

const openAndReadFile = async (): Promise<RiteFile> => {
    return new Promise(async (resolve, reject) => {
        try {
            const path = <string>await dialog.open({
                multiple: false,
                directory: false,
                filters: [{
                    extensions: [
                        'md', 'txt', ''
                    ], name: ''
                }]
            })

            if (path === null) resolve({
                contents: "",
                path: ""
            });

            resolve({
                path: path,
                contents: await readTextFile(path)
            });
        }
        catch (e) {
            reject(e);
        }
    })
}

const openFileCommand: CommandHandler = async (state, args: string) => {
    const file = await openAndReadFile();
    if (file.path === '') return;
    await state.setCurrentFile(file);
}

export const parseCommand = (command: string) => {
    const split = command.split(' ');
    return {
        cmd: split[0],
        args: split.slice(1).join(' ')
    };
}

const openPalette = async (state: EditorState) => {
    const choices: PromptChoice[] = [];
    for (const cmd in COMMANDS) {
        if (!COMMANDS[cmd].nonPalette) {
            choices.push({
                title: cmd,
                description: COMMANDS[cmd].description
            });
        }
    }

    await state.execCommand(await editorChoose('Command:', choices));
}

export const saveFile = async (state: EditorState) => {
    await state.save();
}

export const COMMANDS: RiteCommands = {
    "openFile": {
        action: openFileCommand,
        description: "Open a file."
    },
    "openPalette": {
        nonPalette: true,
        action: openPalette,
        description: "Show the palette."
    },
    "saveCurrentFile": {
        action: saveFile,
        description: "Save current file."
    }
}