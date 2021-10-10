import { invoke } from '@tauri-apps/api';

export interface RiteSettings {
    font: string
}

export interface promptArgs {
    message: string,
    choices: string[],
    callback: Function,
    allowBlank?: boolean,
    allowNonOptions?: boolean
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