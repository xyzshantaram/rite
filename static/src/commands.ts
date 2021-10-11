import { dialog } from "@tauri-apps/api"
import { readTextFile } from "@tauri-apps/api/fs"
import { RiteEditor } from "./RiteEditor"
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

const openFileCommand: CommandHandler = async (editor: RiteEditor, args: string) => {
    const file = await openAndReadFile();
    if (file.path === '') return;
    editor.loadFile(file);
}

export const parseCommand = (command: string) => {
    const split = command.split(' ');
    return {
        cmd: split[0],
        args: split.slice(1).join(' ')
    };
}

const openPalette = async (editor: RiteEditor) => {
    const choices: PromptChoice[] = [];
    for (const cmd in COMMANDS) {
        if (COMMANDS[cmd].palette) {
            choices.push({
                title: cmd,
                description: COMMANDS[cmd].description
            });
        }
    }

    await editor.execCommand(await editorChoose('Command:', choices, true, true));
}

export const saveFile = async (editor: RiteEditor) => {
    await editor.save();
}

export const COMMANDS: RiteCommands = {
    "openFile": {
        action: openFileCommand,
        description: "Open a file.",
        palette: true
    },
    "openPalette": {
        action: openPalette,
        description: "Show the palette."
    },
    "saveCurrentFile": {
        action: saveFile,
        description: "Save current file.",
        palette: true
    },
    "markRangeItalic": {
        action: (state) => state.insertAround('*'),
        description: "Mark the current editor selection as italic."
    },
    "markRangeBold": {
        action: (state) => state.insertAround('**'),
        description: "Mark the current editor selection as bold."
    },
    "markRangeDeleted": {
        action: (state) => state.insertAround('~~'),
        description: "Mark the current editor selection as being struck through."
    },
    "markRangeH1": {
        action: (state) => state.insertBefore('# ', 2),
        description: "Mark the current editor selection as an <h1>."
    },
    "markRangeH2": {
        action: (state) => state.insertBefore('## ', 3),
        description: "Mark the current editor selection as an <h2>."
    },
    "markRangeH3": {
        action: (state) => state.insertBefore('### ', 4),
        description: "Mark the current editor selection as an <h3>."
    },
    "markRangeH4": {
        action: (state) => state.insertBefore('#### ', 5),
        description: "Mark the current editor selection as an <h4>."
    },
    "markRangeH5": {
        action: (state) => state.insertBefore('##### ', 6),
        description: "Mark the current editor selection as an <h5>."
    },
    "markRangeH6": {
        action: (state) => state.insertBefore('###### ', 7),
        description: "Mark the current editor selection as an <h6>."
    }
}