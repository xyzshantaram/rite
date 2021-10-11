import { createDir, writeFile } from "@tauri-apps/api/fs";
import { dirname, resolve } from "@tauri-apps/api/path";
import { exit } from "@tauri-apps/api/process";
import { DEFAULT_KEYBINDS } from "./keybinds";
import { editorConfirm, editorAlert, editorChoose, editorPrompt } from "./prompt";
import { dumpJSON, exists, PromptChoice } from "./utils";

interface PromptDescription {
    type: 'choice' | 'prompt' | 'confirm';
    message: string,
    choices?: PromptChoice[]
    allowEmpty?: boolean,
    allowNonOptions?: boolean,
    validate?: {
        re: RegExp,
        msg: string
    }
}


const promptFromDescription = async (desc: PromptDescription) => {
    if (desc.type === 'choice') {
        return await editorChoose(desc.message, desc.choices || [], desc.allowNonOptions);
    }
    else if (desc.type === 'confirm') {
        return await editorConfirm(desc.message, desc.choices || [{ title: 'yes' }, { title: 'no' }]);
    }
    else {
        let answer = await editorPrompt(desc.message, desc.allowEmpty);
        if (desc.validate) {
            if (!desc.validate.re.test(answer)) {
                await editorAlert(`Incorrect format for answer. ${desc.validate.msg}`)
                answer = await editorPrompt(desc.message, desc.allowEmpty);
            }
        }
    }
}

export const MODIFIABLE_SETTINGS: Record<string, PromptDescription> = {
    font: {
        type: 'choice',
        choices: [{ title: 'monospace' }, { title: 'sans-serif' }, { title: 'serif' }],
        message: 'Pick a font (type a font name, or pick one of the defaults below):',
        allowNonOptions: true
    },
    lineNumbers: {
        type: 'confirm',
        message: 'Enable line numbers?'
    },
    fontSize: {
        type: 'prompt',
        message: 'Pick a font size (in pixels): ',
        validate: {
            re: /^\d+$/,
            msg: 'You must enter only numbers!'
        }
    },
    portraitMode: {
        type: 'confirm',
        message: 'Editor orientation? ',
        choices: [{ title: 'portrait' }, { title: 'landscape' }]
    }
}

const defaultConfig = (): Promise<Record<string, any>> => {
    return new Promise(async (resolve, reject) => {
        const tmp: Record<string, any> = {
            keybinds: DEFAULT_KEYBINDS
        };
        try {
            for (const entry of Object.entries(MODIFIABLE_SETTINGS)) {
                const [key, val] = entry;
                tmp[key] = await promptFromDescription(val);
            }
            resolve(tmp);
        }
        catch (e) {
            reject(e);
        }
    })
}

export const createConfig = async (configPath: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const confirm = await editorConfirm('Config file not found. Would you like to create one?');
            if (!confirm) await editorAlert('Exiting...', async () => await exit(1));

            const tmp = await defaultConfig();
            const dir = await dirname(configPath);

            if (!(await exists(dir))) await createDir(dir, { recursive: true })

            const string = dumpJSON(tmp);

            await writeFile({ contents: string, path: configPath })
            await editorAlert(`Saved choices to ${configPath}`);

            resolve(string);
        }

        catch (e) {
            reject(e);
        }
    })
}
