import { readTextFile } from '@tauri-apps/api/fs';
import cf from 'campfire.js';
import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';
import { COMMANDS } from './commands';
import { createConfig, loadConfig } from './config';
import { EditorState } from './EditorState';
import { getConfigPath, RiteSettings } from './utils';

window.addEventListener('DOMContentLoaded', async () => {
    const editorRoot = cf.insert(
        cf.nu('div#editor'),
        { atStartOf: document.querySelector('#app') }
    ) as HTMLElement;

    const cmEditor = CodeMirror(editorRoot, {
        mode: 'gfm',
        lineNumbers: true
    });

    const editor = new EditorState(cmEditor, COMMANDS);

    let configPath = await getConfigPath();
    let contents = null;

    try {
        contents = await readTextFile(configPath);
    }
    catch (e) {
        contents = await createConfig(configPath);
    }

    const config = JSON.parse(contents) as RiteSettings;
    loadConfig(editor, config);

    const statusLine = cf.insert(
        cf.nu('div#statusline'),
        { atEndOf: editorRoot }
    ) as HTMLElement;
})