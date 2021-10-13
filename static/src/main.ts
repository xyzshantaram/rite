import { listen } from '@tauri-apps/api/event';
import { readTextFile } from '@tauri-apps/api/fs';
import cf from 'campfire.js';
import 'codemirror/mode/gfm/gfm';
import { COMMANDS } from './commands';
import { createConfig } from './config';
import { RiteEditor as RiteEditor } from './RiteEditor';
import { getConfigPath, onboarding, getPlatform } from './utils';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/display/rulers';
import 'codemirror/addon/display/placeholder';

window.addEventListener('DOMContentLoaded', async () => {
    const editorRoot = cf.insert(
        cf.nu('div#editor'),
        { atStartOf: document.querySelector('#app') as HTMLElement }
    ) as HTMLElement;
    
    const platform = await getPlatform();
    const editor = new RiteEditor(editorRoot, COMMANDS, platform);

    let configPath = await getConfigPath();
    let contents = null;
    editor.setConfigPath(configPath);

    try {
        contents = await readTextFile(configPath);
    }
    catch (e) {
        contents = await createConfig(configPath);
        await onboarding();
    }

    await editor.loadConfig(contents);
    (window as any).editor = editor;

    await listen('closerequest', () => {
        editor.close();
    });
})