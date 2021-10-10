import { createDir, readTextFile, writeFile } from '@tauri-apps/api/fs';
import { dirname } from '@tauri-apps/api/path';
import cf from 'campfire.js';
import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';
import { getConfigDir, rustLog, exists, getConfigPath } from './utils';
import { exit } from '@tauri-apps/api/process';
import { editorAlert, editorPrompt, editorChoose, editorConfirm } from './prompt';

// TODO: implement surrounding code
const parseKeybind = (keybind: string, e: KeyboardEvent) => {
    let components = keybind.split("+");
    let toCheck = [];
    let alpha = components[1][0];

    if (components[0].includes("C")) toCheck.push(e.ctrlKey);
    if (components[0].includes("S")) toCheck.push(e.shiftKey);
    if (components[0].includes("A")) toCheck.push(e.altKey);

    throw new Error("Not implemented.");

    return (toCheck.every((bool) => !!bool) && e.key.toLocaleLowerCase() == alpha);
}

const createConfig = async (configPath): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const confirm = await editorConfirm('Config file not found. Would you like to create one?');

            if (!confirm) await editorAlert('Exiting...', () => exit(1));

            const tmp: Record<string, any> = {
                font: await editorPrompt('Pick a font.')
            };

            const dir = await dirname(configPath);
            if (!(await exists(dir))) await createDir(dir, { recursive: true })

            const string = JSON.stringify(tmp);
            await writeFile({ contents: string, path: configPath })
            await editorAlert(`Saved choices to ${configPath}`);
            resolve(string);
        }

        catch (e) {
            reject(e);
        }
    })
}

window.addEventListener('DOMContentLoaded', async () => {
    let configPath = await getConfigPath();
    let contents = null;

    try {
        console.log(configPath);
        const contents = await readTextFile(configPath);
    }
    catch (e) {
        contents = await createConfig(configPath);
    }

    const config = JSON.parse(contents);

    const editorRoot = cf.insert(
        cf.nu('div#editor'),
        { atStartOf: document.querySelector('#app') }
    ) as HTMLElement;

    const editor = CodeMirror(editorRoot, {
        mode: 'gfm',
        lineNumbers: true
    });

    const statusLine = cf.insert(
        cf.nu('div#statusline'),
        { atEndOf: editorRoot }
    ) as HTMLElement;
})