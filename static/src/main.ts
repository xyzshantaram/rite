import { readTextFile } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import cf from 'campfire.js';
import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';
import { initialisePrompt } from './prompt';
import { getConfigDir, rustLog } from './utils';
import { exit } from '@tauri-apps/api/process';

const [show, hide] = initialisePrompt();

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

const configCreation = (value) => {
    if (value === "no") {
        show({
            callback: () => exit(1),
            message: "Exiting...",
            choices: [''],
            allowBlank: true,
            allowNonOptions: true
        })
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    let config = null;

    try {
        const config = await join(await getConfigDir(), 'config.json');
        await rustLog(config);
        const contents = await readTextFile(config);
        await rustLog(contents);
    }
    catch(e) {
        show({
            message: "Config file not found. Would you like to create one?",
            choices: ["yes", "no"],
            callback: configCreation,
            allowBlank: false,
            allowNonOptions: false
        });
    }

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