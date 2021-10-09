import cf from 'campfire.js';
import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm';

window.addEventListener('DOMContentLoaded', () => {
    const editorRoot = cf.insert(
        cf.nu('div#editor', {
            
        }),
        { atStartOf: document.body }
    ) as HTMLElement;

    const cm = CodeMirror(editorRoot, {
        mode: 'gfm',
        lineNumbers: true
    });

    const statusLine = cf.insert(
        cf.nu('div#statusline'),
        { atEndOf: editorRoot }
    ) as HTMLElement;
})