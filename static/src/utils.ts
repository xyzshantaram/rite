import { invoke, os } from '@tauri-apps/api';
import { renameFile, writeFile } from '@tauri-apps/api/fs';
import { editorAlert } from './prompt';
import { RiteEditor } from './RiteEditor';

export type CommandHandler = (editor: RiteEditor, args: string) => void;

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

export const getConfigDir = () => invoke<string>('get_config_dir')
export const getConfigPath = () => invoke<string>('get_config_path')

export const rustLog = (line: string) => {
    invoke<void>('log', {
        line: line
    })
}

export const exists = (path: string) => {
    return invoke<boolean>('dir_exists', {
        path: path
    });
}

export const setAppFont = (name: string) => {
    setCSSVar('font', name);
}

export const setCSSVar = (key: string, value: string) => {
    document.documentElement.style.setProperty(`--${key}`, value);
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

export const writeFileAtomic = async(path: string, contents: string) => {
    const tmpPath = `${path}.tmp`;
    try {
        await writeFile({
            path: tmpPath,
            contents: contents
        });
        return await renameFile(tmpPath, path);
    }
    catch (e) {
        return await editorAlert(`Error writing file ${path}: ${e}. Changes have not been saved.`);
    }
}