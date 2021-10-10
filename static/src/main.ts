import { listen } from '@tauri-apps/api/event';
import { readTextFile } from '@tauri-apps/api/fs';
import cf from 'campfire.js';
import 'codemirror/mode/gfm/gfm';
import { COMMANDS } from './commands';
import { createConfig } from './config';
import { RiteEditor as RiteEditor } from './RiteEditor';
import { getConfigPath } from './utils';

window.addEventListener('DOMContentLoaded', async () => {
    const editorRoot = cf.insert(
        cf.nu('div#editor'),
        { atStartOf: document.querySelector('#app') }
    ) as HTMLElement;

    const editor = new RiteEditor(editorRoot, COMMANDS);

    let configPath = await getConfigPath();
    let contents = null;
    editor.setConfigPath(configPath);

    try {
        contents = await readTextFile(configPath);
    }
    catch (e) {
        contents = await createConfig(configPath);
    }

    await editor.loadConfig(contents);

    await listen('closerequest', () => {
        editor.close();
    });
})