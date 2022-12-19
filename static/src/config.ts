import { createDir } from "@tauri-apps/api/fs";
import { dirname } from "@tauri-apps/api/path";
import { editorConfirm, editorAlert, editorChoose, editorPrompt, toChoices } from "./prompt";
import { dumpJSON, existsDir, PromptChoice, writeFileAtomic } from "./utils";

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
    default: string | boolean | null
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
    light_theme: {
        prettyName: 'Light theme?',
        type: 'confirm',
        message: "Use light theme?",
        default: false
    },
    preview_theme: {
        prettyName: 'Preview theme',
        type: 'confirm',
        message: "Select the preview theme",
        choices: toChoices(['light', 'dark']),
        default: true
    },
    line_numbers: {
        prettyName: "Line numbers",
        type: 'confirm',
        message: 'Enable line numbers?',
        default: true
    },
    font_size: {
        prettyName: "Font size",
        type: 'prompt',
        message: 'Pick a font size (in pixels): ',
        validate: {
            re: /^\d+$/,
            msg: 'You must enter only numbers!'
        },
        default: '16'
    },
    portrait_mode: {
        prettyName: "Editor orientation",
        type: 'confirm',
        message: 'Editor orientation? ',
        choices: toChoices(['portrait', 'landscape']),
        default: true
    },
    use_spaces: {
        prettyName: "Use spaces, not tabs.",
        type: 'confirm',
        message: "Use spaces instead of tabs?",
        default: false
    },
    indent_size: {
        prettyName: "Tab size",
        type: 'prompt',
        message: 'Pick a tab size: ',
        validate: {
            re: /^\d+$/,
            msg: 'You must enter only numbers!'
        },
        default: '2'
    },
    cloud_url: {
        prettyName: "URL of your Rite Cloud instance",
        type: "prompt",
        message: 'Enter your URL, including the port number.',
        validate: {
            re: /https?:\/\/.+$/,
            msg: 'You must enter a valid URL!'
        },
        default: null
    },
    cloud_username: {
        prettyName: "Your Rite Cloud username",
        type: "prompt",
        message: 'Enter the username for your Rite Cloud account.',
        default: null
    },
    cloud_token: {
        prettyName: "Your Rite Cloud token",
        type: "prompt",
        message: 'Enter the token for your Rite Cloud account.',
        default: null
    },
    check_updates: {
        prettyName: "Check for updates on startup",
        type: 'confirm',
        message: 'Check for updates on startup?',
        default: true
    },
    eighty_col_ruler: {
        type: 'confirm',
        message: 'Display a ruler at 80 columns?',
        prettyName: "80-column ruler",
        default: false
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
            await editorAlert(`Config file not found. It will be created as ${configPath}.`);

            const tmp = defaultConfig();
            const dir = await dirname(configPath);

            if (!(await existsDir(dir))) await createDir(dir, { recursive: true })

            const string = dumpJSON(tmp);
            await writeFileAtomic(configPath, string);

            resolve(string);
        }

        catch (e) {
            reject(e);
        }
    })
}
