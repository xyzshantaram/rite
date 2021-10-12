import { createDir, writeFile } from "@tauri-apps/api/fs";
import { dirname, resolve } from "@tauri-apps/api/path";
import { exit } from "@tauri-apps/api/process";
import { DEFAULT_KEYBINDS } from "./keybinds";
import { editorConfirm, editorAlert, editorChoose, editorPrompt, toChoices } from "./prompt";
import { dumpJSON, exists, PromptChoice } from "./utils";

export interface Setting {
    type: 'choice' | 'prompt' | 'confirm';
    message: string,
    choices?: PromptChoice[]
    allowEmpty?: boolean,
    allowNonOptions?: boolean,
    validate?: {
        re: RegExp,
        msg: string
    },
    prettyName: string,
    default: string | boolean
}


export const requestSetting = async (desc: Setting) => {
    if (desc.type === 'choice') {
        return await editorChoose(desc.message, desc.choices || [], desc.allowNonOptions);
    }
    else if (desc.type === 'confirm') {
        return await editorConfirm(desc.message, desc.choices || toChoices(['yes', 'no']));
    }
    else {
        let answer = await editorPrompt(desc.message, desc.allowEmpty);
        if (desc.validate) {
            if (!desc.validate.re.test(answer)) {
                await editorAlert(`Incorrect format for answer. ${desc.validate.msg}`)
                answer = await editorPrompt(desc.message, desc.allowEmpty);
            }
        }
        return answer;
    }
}

export const MODIFIABLE_SETTINGS: Record<string, Setting> = {
    font: {
        prettyName: "Font",
        type: 'choice',
        choices: toChoices(['monospace', 'sans-serif', 'serif']),
        message: 'Pick a font (type a font name, or pick one of the defaults below):',
        allowNonOptions: true,
        default: 'monospace'
    },
    lineNumbers: {
        prettyName: "Line numbers",
        type: 'confirm',
        message: 'Enable line numbers?',
        default: true
    },
    fontSize: {
        prettyName: "Font size",
        type: 'prompt',
        message: 'Pick a font size (in pixels): ',
        validate: {
            re: /^\d+$/,
            msg: 'You must enter only numbers!'
        },
        default: '16'
    },
    portraitMode: {
        prettyName: "Editor orientation",
        type: 'confirm',
        message: 'Editor orientation? ',
        choices: toChoices(['portrait', 'landscape']),
        default: true
    },
    useSpaces: {
        prettyName: "Use spaces, not tabs.",
        type: 'confirm',
        message: "Use spaces instead of tabs?",
        default: false
    },
    indentSize: {
        prettyName: "Tab size",
        type: 'prompt',
        message: 'Pick a tab size: ',
        validate: {
            re: /^\d+$/,
            msg: 'You must enter only numbers!'
        },
        default: '4'
    }
}

const defaultConfig = (): Record<string, any> => {
    let tmp: Record<string, any> = {};
    for (const entry of Object.entries(MODIFIABLE_SETTINGS)) {
        const [key, val] = entry;
        tmp[key] = val.default;
    }

    return tmp;
}

export const createConfig = async (configPath: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            await editorAlert(
                `Config file not found. It will be created as ${configPath}.`,
            );

            const tmp = defaultConfig();
            const dir = await dirname(configPath);

            if (!(await exists(dir))) await createDir(dir, { recursive: true })

            const string = dumpJSON(tmp);

            await writeFile({ contents: string, path: configPath })

            resolve(string);
        }

        catch (e) {
            reject(e);
        }
    })
}
