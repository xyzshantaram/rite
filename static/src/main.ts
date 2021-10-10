import { readTextFile } from '@tauri-apps/api/fs';
import cf from 'campfire.js';
import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';
import { createConfig } from './config';
import { getConfigPath } from './utils';

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