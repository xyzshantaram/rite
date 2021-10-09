import { invoke } from '@tauri-apps/api';
import cf from 'campfire.js';
import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';

window.addEventListener('DOMContentLoaded', async () => {
    const editorRoot = cf.insert(
        cf.nu('div#editor', {

        }),
        { atStartOf: document.body }
    ) as HTMLElement;

    const editor = CodeMirror(editorRoot, {
        mode: 'gfm',
        lineNumbers: true
    });

    const statusLine = cf.insert(
        cf.nu('div#statusline'),
        { atEndOf: editorRoot }
    ) as HTMLElement;

    try {
        const cfgDir = await invoke('get_config_dir');
        cf.extend(statusLine, { c: `config dir: ${cfgDir}` });
    }
    catch (e) {
        cf.extend(statusLine, { c: `Error fetching config dir: ${e}` })
    }
})