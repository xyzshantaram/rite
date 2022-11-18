import { invoke, os } from '@tauri-apps/api';
import { editorAlert } from './prompt';
import { RiteEditor } from './RiteEditor';
import CryptoJS from 'crypto-js';

export type CommandHandler = (editor: RiteEditor) => void | Promise<void>;

export type RiteSettings = Record<string, any>;

export interface RiteKeybind {
    checker: Function,
    action: string
}

export interface RiteFile {
    path: string,
    contents: string
}

export interface PromptArgs {
    message: string,
    choices: PromptChoice[],
    callback: Function,
    allowEmpty?: boolean,
    allowNonOptions?: boolean
    isPalette?: boolean
}

export interface PromptChoice {
    title: string,
    description?: string
}

export interface RiteCommand {
    description: string,
    action: CommandHandler,
    palette?: boolean
}

export interface RiteCommands {
    [key: string]: RiteCommand;
}

export const GH_REPO_URL = 'https://github.com/xyzshantaram/rite';
export const GH_REPO = 'xyzshantaram/rite';

export const semverCompare = (a: string, b: string) => {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);

    for (var i = 0; i < 3; i++) {
        if (pa[i] > pb[i]) return 1;
        if (pb[i] > pa[i]) return -1;
        if (!isNaN(pa[i]) && isNaN(pb[i])) return 1;
        if (isNaN(pa[i]) && !isNaN(pb[i])) return -1;
    }
    return 0;
}

/**
 * 
 * @param a the first version string
 * @param b the second version string
 * @returns true if a is older than b, false otherwise
 */
export const isOlder = (a: string, b: string) => {
    return semverCompare(a, b) < 0;
}

export const getConfigDir = () => invoke<string>('get_config_dir')
export const getConfigPath = () => invoke<string>('get_config_path')

export const rustLog = (line: string) => {
    invoke<void>('log', {
        line: line
    })
}

export const exists = (path: string) => {
    return invoke<boolean>('exists', {
        path: path
    });
}

export const existsDir = (path: string) => {
    return invoke<boolean>('dir_exists', {
        path: path
    });
}

export const setAppFont = (name: string) => {
    setCSSVar('font', name);
}

export interface FetchResponse {
    ok: boolean,
    status: number,
    body: string
}

export const riteFetch = async (url: string, method = "GET", body?: string) => {
    let args: Record<string, any> = {
        method,
        url,
    };
    if (body) args.body = body;
    return await invoke<FetchResponse>('rite_fetch', args);
}

/**
 * Set a CSS custom property.
 * @param key The property name to set, without the two preceding hyphens.
 * @param value The value of the property.
 * @param selector The selector for which the style should be applied.
 */
export const setCSSVar = (key: string, value: string, selector = 'html') => {
    let elem = document.querySelector(selector) as HTMLElement;
    if (!elem) return;
    elem.style.setProperty(`--${key}`, value);
}

export const dumpJSON = (obj: any, indent = 4) => {
    return JSON.stringify(obj, null, indent);
}

export const clamp = (value: number, min: number, max: number) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

export const getPlatform = async () => {
    return invoke<string>('get_platform');
}

export const getPaletteKeybind = async () => {
    return (await getPlatform() === 'darwin') ? '⌘+Option+P' : "Ctrl+Alt+P";
}

export const onboarding = async () => {
    const keybind = await getPaletteKeybind();
    await editorAlert(`<div>Thanks for using rite!</div>
        <div>Write markdown in the editor window.</div>
        <div>Bring up the command palette at any time by pressing
        <kbd>${keybind}</kbd> to get a list of actions and further help.
    </div>`);
}

export const writeFileAtomic = async (path: string, contents: string) => {
    try {
        await invoke<void>("atomic_write", {
            target: path,
            contents: contents
        })
        return;
    }
    catch (e) {
        return await editorAlert(`Error while writing ${path}: ${e}`);
    }
}

export const groupByProp = (arr: Iterable<Record<string, any>>, prop: string) => {
    let grouped: Record<string, Array<any>> = {};
    for (let x of arr) {
        if (x[prop] in grouped) {
            grouped[x[prop]].push(x);
        }
        else {
            grouped[x[prop]] = [x];
        }
    }

    return grouped;
}

export const AESDecrypt = (ciphertext: string, passphrase: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase, {
        format: CryptoJS.format.OpenSSL
    });
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const AESEncrypt = (cleartext: string, passphrase: string) => {
    return CryptoJS.AES.encrypt(cleartext, passphrase).toString(CryptoJS.format.OpenSSL);
}