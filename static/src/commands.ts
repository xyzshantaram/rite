import { dialog } from "@tauri-apps/api"
import { readTextFile } from "@tauri-apps/api/fs"
import { RiteEditor } from "./RiteEditor"
import { editorAlert, editorChoose, editorPrompt, toChoices } from "./prompt"
import { CommandHandler, PromptChoice, RiteCommands, RiteFile } from "./utils"
import { MODIFIABLE_SETTINGS, requestSetting, Setting } from "./config"

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

const openSettings = async(editor: RiteEditor) => {
    const settings: [string, Setting][] = Object.entries(MODIFIABLE_SETTINGS);
    const choices: PromptChoice[] = [{title: 'Close settings.'}];
    for (const [key, value] of settings) {
        let existing = editor.getConfigVar(key);
        if (existing !== null && value.type === 'confirm') {
            if (value.choices) existing = existing ? value.choices[0].title : value.choices[1].title;
            else existing = existing ? 'yes' : 'no';
        }
        choices.push({
            title: value.prettyName,
            description: `Current value: ${existing}`
        });
    }

    const newSettings: Record<string, any> = {};

    let userChoice: string;
    while ((userChoice = await editorChoose('What do you want to change?', choices, false)) !== 'Close settings.') {
        settingLoop:
        for (const [key, value] of settings) {
            if (value.prettyName === userChoice) {
                newSettings[key] = await requestSetting(value);
                break settingLoop;
            }
        }
    }

    return await editor.extendConfig(newSettings);
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
    "openSettings": {
        action: openSettings,
        description: "Open settings.",
        palette: true
    },
    "closePalette": {
        action: () => {},
        description: "Close palette.",
        palette: true
    },
    "markRangeItalic": {
        action: (editor) => editor.insertAround('*'),
        description: "Mark the current editor selection as italic."
    },
    "markRangeBold": {
        action: (editor) => editor.insertAround('**'),
        description: "Mark the current editor selection as bold."
    },
    "markRangeDeleted": {
        action: (editor) => editor.insertAround('~~'),
        description: "Mark the current editor selection as being struck through."
    },
    "markRangeH1": {
        action: (editor) => editor.insertBefore('# ', 2),
        description: "Mark the current editor selection as an <h1>."
    },
    "markRangeH2": {
        action: (editor) => editor.insertBefore('## ', 3),
        description: "Mark the current editor selection as an <h2>."
    },
    "markRangeH3": {
        action: (editor) => editor.insertBefore('### ', 4),
        description: "Mark the current editor selection as an <h3>."
    },
    "markRangeH4": {
        action: (editor) => editor.insertBefore('#### ', 5),
        description: "Mark the current editor selection as an <h4>."
    },
    "markRangeH5": {
        action: (editor) => editor.insertBefore('##### ', 6),
        description: "Mark the current editor selection as an <h5>."
    },
    "markRangeH6": {
        action: (editor) => editor.insertBefore('###### ', 7),
        description: "Mark the current editor selection as an <h6>."
    }
}