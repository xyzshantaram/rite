import { invoke } from '@tauri-apps/api';
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
    allowBlank?: boolean,
    allowNonOptions?: boolean
}

export interface PromptChoice {
    title: string,
    description?: string
}

export interface RiteCommand {
    description: string,
    action: CommandHandler,
    nonPalette?: boolean
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