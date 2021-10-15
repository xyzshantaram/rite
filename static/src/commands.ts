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
                directory: false
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

    await editor.execCommand(await editorChoose('Command:', choices, true, true), "palette");
}

const openSettings = async(editor: RiteEditor) => {
    const EXIT_STRING = "Save settings and exit."
    const settings: [string, Setting][] = Object.entries(MODIFIABLE_SETTINGS);
    const choices: PromptChoice[] = [{title: EXIT_STRING}];

    const stringify = (value: Setting, existing: any): string => {
        if (existing === null) return 'not set';
        if (value.type !== 'confirm') {
            return String(existing);
        }
        else {
            const choiceNames = value.choices || toChoices(['on', 'off']);
            return existing ? choiceNames[0].title : choiceNames[1].title;
        }
    }

    for (const [key, value] of settings) {
        let existing = editor.getConfigVar(key);
        choices.push({
            title: value.prettyName,
            description: `Current value: ${stringify(value, existing)}`
        });
    }

    const newSettings: Record<string, any> = {};

    let userChoice: string;
    while ((userChoice = await editorChoose('What do you want to change?', choices, false)) !== EXIT_STRING) {
        settingLoop:
        for (const [key, value] of settings) {
            if (value.prettyName === userChoice) {
                newSettings[key] = await requestSetting(value);
                let changed = choices.find((choice) => choice.title === value.prettyName);
                if (changed) changed.description =  `Current value: ${stringify(value, newSettings[key])}`;
                break settingLoop;
            }
        }
    }

    return await editor.extendConfig(newSettings);
}

const saveFile = async (editor: RiteEditor) => {
    await editor.save();
}

const showAboutPrompt = async () => {
    await editorAlert(`<div>
                rite is free, open-source software under the MIT license. 
                Copyright © 2021 Siddharth Singh.
            </div>
            <div>rite depends on the following software:</div>
            <ul>
                <li>
                    <a href='https://marked.js.org'>Marked</a> used under the terms of the MIT License,
                    Copyright © 2018+, <a href='https://github.com/markedjs/'>MarkedJS</a> Copyright (c)
                    2011-2018, <a href='https://github.com/chjj/'>Christopher Jeffrey</a>.
                </li>
                <li>
                    <a href='https://codemirror.net'>CodeMirror</a> used under the terms of the MIT License,
                    Copyright © 2017 by <a href='Marijn Haverbeke'>marijnh@gmail.com</a> and others
                </li>
                <li>
                    <a href='https://tauri.studio'>Tauri</a> is the underlying runtime on which rite is built.
                    Code from Tauri is used under the MIT license. Copyright © 2017 - Present Tauri Apps Contributors
                </li>
            </ul>
    `);
}

export const COMMANDS: RiteCommands = {
    "open_file": {
        action: openFileCommand,
        description: "Open a file.",
        palette: true
    },
    "open_palette": {
        action: openPalette,
        description: "Show the palette."
    },
    "save_current_file": {
        action: saveFile,
        description: "Save current file.",
        palette: true
    },
    "open_settings": {
        action: openSettings,
        description: "Open settings.",
        palette: true
    },
    "close_palette": {
        action: () => {},
        description: "Close palette.",
        palette: true
    },
    "mark_range_italic": {
        action: (editor) => editor.insertAround('*'),
        description: "Mark the current editor selection as italic."
    },
    "mark_range_bold": {
        action: (editor) => editor.insertAround('**'),
        description: "Mark the current editor selection as bold."
    },
    "mark_range_deleted": {
        action: (editor) => editor.insertAround('~~'),
        description: "Mark the current editor selection as being struck through."
    },
    "mark_range_h1": {
        action: (editor) => editor.insertBefore('# ', 2),
        description: "Mark the current editor selection as an <h1>."
    },
    "mark_range_h2": {
        action: (editor) => editor.insertBefore('## ', 3),
        description: "Mark the current editor selection as an <h2>."
    },
    "mark_range_h3": {
        action: (editor) => editor.insertBefore('### ', 4),
        description: "Mark the current editor selection as an <h3>."
    },
    "mark_range_h4": {
        action: (editor) => editor.insertBefore('#### ', 5),
        description: "Mark the current editor selection as an <h4>."
    },
    "mark_range_h5": {
        action: (editor) => editor.insertBefore('##### ', 6),
        description: "Mark the current editor selection as an <h5>."
    },
    "mark_range_h6": {
        action: (editor) => editor.insertBefore('###### ', 7),
        description: "Mark the current editor selection as an <h6>."
    },
    "about": {
        action: showAboutPrompt,
        description: "Copyright and licensing information.",
        palette: true
    }
}