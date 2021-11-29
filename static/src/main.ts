import { listen } from '@tauri-apps/api/event';
import { readTextFile, writeBinaryFile } from '@tauri-apps/api/fs';
import cf from 'campfire.js';
import 'codemirror/mode/gfm/gfm';
import { COMMANDS } from './commands';
import { createConfig } from './config';
import { RiteEditor as RiteEditor } from './RiteEditor';
import { getConfigPath, onboarding, getPlatform, existsDir, RiteFile, rustLog, writeFileAtomic, exists } from './utils';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/display/rulers';
import 'codemirror/addon/display/placeholder';
import { cli } from '@tauri-apps/api';
import { exit } from '@tauri-apps/api/process';
import { writeText } from '@tauri-apps/api/clipboard';

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


    let args;
    try {
        args = (await cli.getMatches()).args;
    }
    catch (e) {
        rustLog(`Error: ${e}`);
        exit(1);
    }
    if (args) {
        if (args.filename && args.filename.occurrences > 0) {
            let path = `${args.filename.value}`;
            let file: RiteFile = {
                path,
                contents: ''
            };
            try {
                if (await exists(path)) {
                    console.log(await readTextFile(path));
                    file.contents = await readTextFile(path);
                }
                else {
                    // await writeFileAtomic(path, "");
                    console.log(`file ${path} blank`);
                }

                editor.loadFile(file);
            }
            catch (e) {
                rustLog(`Error while loading file ${path}: ${e}`)
            }
        }
    }

    await listen('closerequest', () => {
        editor.close();
    });
})