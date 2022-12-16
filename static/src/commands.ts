import { dialog } from "@tauri-apps/api"
import { readTextFile } from "@tauri-apps/api/fs"
import { RiteEditor } from "./RiteEditor"
import { editorAlert, editorChoose, editorConfirm, editorPrompt, hidePrompt, toChoices } from "./prompt"
import { AESDecrypt, AESEncrypt, CommandHandler, getConfigPath, GH_REPO, GH_REPO_URL, groupByProp, isOlder, PromptChoice, RiteCommands, riteFetch, RiteFile } from "./utils"
import { MODIFIABLE_SETTINGS, requestSetting, Setting } from "./config"
import cf from 'campfire.js'
import { open } from '@tauri-apps/api/shell'
import { getPreviewHtml } from "./preview"
import { Editor } from "codemirror"
import { marked } from 'marked'

class UploadFormResult {
    name: string;
    revision: string;
    contents: string;
    public: boolean;
    password: string;
}

class OpenFormResult {
    uuid: string | null;
}

type JSobj = Record<string, unknown>;

const openAndReadFile = async (): Promise<RiteFile> => {
    return new Promise(async (resolve, reject) => {
        try {
            const path = <string>await dialog.open({
                multiple: false,
                directory: false
            })

            if (path === null) resolve({
                contents: "",
                path: ""
            });

            resolve({
                path: path,
                contents: await readTextFile(path)
            });
        }
        catch (e) {
            reject(e);
        }
    })
}

const loadFile: CommandHandler = async (editor: RiteEditor) => {
    const file = await openAndReadFile();
    if (file.path === '') return;
    return editor.loadFile(file);
}

const openPalette = async (editor: RiteEditor) => {
    const choices: PromptChoice[] = [];
    for (const cmd in COMMANDS) {
        if (COMMANDS[cmd].palette) {
            choices.push({
                title: cmd,
                description: COMMANDS[cmd].description
            });
        }
    }

    await editor.execCommand(await editorChoose('Command:', choices, true, true, true), "palette");
}

const openSettings = async (editor: RiteEditor) => {
    const EXIT_STRING = "Save settings and exit."
    const settings: [string, Setting][] = Object.entries(MODIFIABLE_SETTINGS);
    const choices: PromptChoice[] = [{ title: EXIT_STRING }];

    const stringify = (value: Setting, existing: any): string => {
        if (existing === null) return 'not set';
        if (value.type !== 'confirm') {
            return String(existing);
        }
        else {
            const choiceNames = value.choices || toChoices(['on', 'off']);
            return existing ? choiceNames[0].title : choiceNames[1].title;
        }
    }

    for (const [key, value] of settings) {
        let existing = editor.getConfigVar(key);
        choices.push({
            title: value.prettyName,
            description: `Current value: ${stringify(value, existing)}`
        });
    }

    const newSettings: Record<string, any> = {};

    let userChoice: string;
    while ((userChoice = await editorChoose('What do you want to change?', choices, false)) !== EXIT_STRING) {
        settingLoop:
        for (const [key, value] of settings) {
            if (value.prettyName === userChoice) {
                newSettings[key] = await requestSetting(value);
                let changed = choices.find((choice) => choice.title === value.prettyName);
                if (changed) changed.description = `Current value: ${stringify(value, newSettings[key])}`;
                break settingLoop;
            }
        }
    }

    return await editor.extendConfig(newSettings);
}

const saveFile = async (editor: RiteEditor) => {
    await editor.save();
}

const saveAs = async (editor: RiteEditor) => {
    await editor.save(true);
}

/**
 * 
 * @param editor A RiteEditor instance
 * @param token The client token
 * @param url URL of the Rite Cloud instance
 * @param user username
 * @param open Whether the user is opening a document or saving it.
 * @returns Either an UploadFormResult or an OpenFormResult based on the value of the open flag
 */
const showCloudMenu = (editor: RiteEditor, token: string, url: string, user: string, open: boolean): Promise<UploadFormResult | OpenFormResult> => {
    document.querySelector("#upload-menu")?.remove();

    return new Promise((resolve, reject) => {
        riteFetch(`${url}/api/docs/list`, "POST",
            JSON.stringify({
                token, user
            }))
            .then(async (res) => {
                let json = JSON.parse(res.body);
                if (!res.ok) {
                    await editorAlert(`Error ${res.status}: ${json.message}`);
                    return;
                }
                let existingDocs = new Set<Record<string, unknown>>();
                json.forEach((elem: Record<string, any>) => {
                    existingDocs.add(elem);
                })

                const root = cf.insert(cf.nu('#upload-menu'), { atEndOf: document.body }) as HTMLElement;

                const form = cf.nu('form', {
                    raw: true,
                    c: `
                <div class='form-group'>
                    <label for='document-name'>
                        Document
                        ${open ? '' : '<a id="upload-create-new" href="javascript:void(0)">(Create&nbsp;new)</a>'}
                    </label>
                    <select id='document-name' required></select>
                </div>

                ${!open ? `<div class='form-group'><label for='upload-is-public'>Visibility</label><input type='checkbox' id='upload-is-public'></div>` : ''}

                <div class='form-group'>
                <label for='document-revision'>Revision</label>
                ${open ?
                            `<select id='document-revision' placeholder='Pick a revision' required>
                            <option value="" disabled selected>Select...</option>
                        </select>`
                            : `<input type='text' id='document-revision' required>`
                        }
                </div>

                ${!open ? `<div class='form-group'><label for='upload-password'>Password to encrypt this file with (Optional)</label><input type='password' id='upload-password'></div>` : ''}

                <div id='outcome-group' class='form-group'>
                    <button type='button' id='upload-cancel'>Cancel</button>
                    <button id='upload-confirm'>Confirm</button>
                </div>
            `,
                }) as HTMLFormElement;

                root.appendChild(form);

                const cancelBtn = form.querySelector("#upload-cancel")! as HTMLButtonElement;
                const nameField = form.querySelector("#document-name")! as HTMLInputElement;

                cancelBtn.onclick = () => {
                    reject("Cancelled.");
                }

                const documentSelect = form.querySelector("#document-name")! as HTMLSelectElement;
                documentSelect.innerHTML = '<option value="" disabled selected>Select...</option>';

                let grouped = groupByProp(existingDocs, 'name');

                let uniqueDocs = Object.keys(grouped);
                for (const x of uniqueDocs) {
                    cf.insert(cf.nu('option', {
                        c: x.trim()
                    }), { atEndOf: documentSelect });
                }

                if (open) {
                    documentSelect.onchange = () => {
                        let revisionSelect = form.querySelector('#document-revision')! as HTMLSelectElement;
                        revisionSelect.innerHTML = '<option value="" disabled selected>Select...</option>';
                        grouped[documentSelect.value].forEach(elem => {
                            cf.insert(cf.nu('option', {
                                c: elem.revision,
                                a: { value: elem.uuid }
                            }), { atEndOf: revisionSelect });
                        })
                    }
                }
                else {
                    const createLink = form.querySelector("#upload-create-new")! as HTMLAnchorElement;
                    createLink.onclick = async () => {
                        let newName = (await editorPrompt("Enter a name for the new document.", false));
                        if (!uniqueDocs.includes(newName.trim())) {
                            cf.insert(cf.nu("option", { c: newName.trim() }), { atEndOf: documentSelect });
                        }
                        documentSelect.value = newName.trim();
                    }
                }

                form.onsubmit = (e) => {
                    e.preventDefault();
                    if (open) {
                        const revisionSelect = form.querySelector('#document-revision')! as HTMLSelectElement;
                        resolve({
                            uuid: revisionSelect.value
                        });
                    }
                    else {
                        const publicCheckbox = form.querySelector("#upload-is-public")! as HTMLInputElement;
                        const revisionField = form.querySelector('#document-revision')! as HTMLInputElement;
                        const encrypted = form.querySelector('#upload-password') as HTMLInputElement;
                        resolve({
                            name: nameField.value,
                            revision: revisionField.value,
                            contents: editor.getContents(),
                            public: publicCheckbox.checked,
                            password: encrypted.value
                        });
                    }
                }
            })
    })
}

const saveToCloud = async (editor: RiteEditor) => {
    const uploadDetails = await cloudAction(editor, "save");
    if (!uploadDetails || uploadDetails instanceof OpenFormResult) {
        return;
    }

    if (uploadDetails.password.trim() !== '') {
        uploadDetails.contents = AESEncrypt(uploadDetails.contents, uploadDetails.password);
    }

    let url: string = editor.getConfigVar("cloud_url");
    let doc = await riteFetch(`${url}/api/docs/upload`, "POST",
        JSON.stringify({
            name: uploadDetails.name,
            revision: uploadDetails.revision,
            contents: uploadDetails.contents,
            public: uploadDetails.public,
            user: editor.getConfigVar("cloud_username"),
            token: editor.getConfigVar("cloud_token"),
            encrypted: !!(uploadDetails.password)
        })
    );
    let ok = doc.ok;
    const code = doc.status;
    try {
        let contents = JSON.parse(doc.body);
        if (!ok) {
            const msg = contents.message;
            await editorAlert(`Error ${code}: ${msg}`);
        }
        else {
            await editorAlert(`Uploaded successfully. You can view your document by clicking
                <a href="${url}/docs/view/${contents.uuid}" target="_blank">here</a>.`
            );
        }
    }
    catch (e) {
        await editorAlert(`Error parsing response from server: ${e}`);
    }
}

const viewKeybinds = async (editor: RiteEditor) => {
    let keybinds: Record<string, string> = editor.getConfigVar('keybinds');

    const parseKeybind = (keybind: string) => {
        const split = keybind.split('+');
        return `<kbd>${split[0].replace('C', editor.platform === 'macos' ? '⌘+' : "Ctrl+").replace('A', 'Alt+').replace('S', 'Shift+') + split[1]}</kbd>`;
    }

    const tmpl = cf.template(
        `Current keybindings (change these in {{ configPath }}) 
        <ul style='margin-inline-start: 0.4rem; padding-inline-start: 0; margin-block-start: 0.4rem'>
            {{ list }}
        </ul>`,
        false
    );

    let list = '';
    for (const [key, val] of Object.entries(keybinds)) {
        list += `<li style='list-style-type: none; margin-bottom: 0.4rem'>${parseKeybind(key)} ${cf.escape(COMMANDS[val].description)}</li>`;
    }

    await editorAlert(tmpl({ list, configPath: await getConfigPath() }));
}

const openFromCloud = async (editor: RiteEditor) => {
    const openDetails = await cloudAction(editor, "open");
    if (!openDetails || openDetails instanceof UploadFormResult) {
        return;
    }

    let url: string = editor.getConfigVar("cloud_url");
    let doc = await riteFetch(`${url}/api/docs/contents`, "POST", JSON.stringify({
        uuid: openDetails.uuid,
        user: editor.getConfigVar("cloud_username"),
        token: editor.getConfigVar("cloud_token"),
    }));

    let json = JSON.parse(doc.body);
    let contents = json.contents;

    if (doc.ok) {
        if (json.encrypted) {
            const passphrase = await editorPrompt('This document is encrypted. Enter the password to decrypt it.', false);
            try {
                contents = AESDecrypt(json.contents, passphrase);
            }
            catch (e) {
                await editorAlert(`Error decrypting contents: ${e}`);
                return;
            }
        }
        editor.setContents(contents);
        editor.currentFile = null;
        editor.updateFileName();
    }
    else {
        await editorAlert(json.message);
    }
}

const cloudAction = async (editor: RiteEditor, action: "open" | "save") => {
    document.querySelector("#upload-menu")?.remove();
    if (action === 'open' && editor.dirty) {
        let choice = await editorChoose(
            'Current document is unsaved. Save before continuing?',
            toChoices(['Save', 'Continue without saving', 'Cancel']),
            false, false);
        switch (choice) {
            case 'Save': {
                await editor.save();
                break;
            }
            case 'Continue without saving': {
                break;
            }
            default:
                return;
        }

        if (editor.dirty && choice === 'Save') {
            await editorAlert("File not saved -- cancelling.");
            return;
        }
    }

    let { token, url, username } = {
        token: editor.getConfigVar("cloud_token"),
        url: editor.getConfigVar("cloud_url"),
        username: editor.getConfigVar("cloud_username")
    }
    if (!token || !url || !username) {
        await editorAlert("Cloud configuration settings not found. Ensure the cloud_url, cloud_token, and cloud_username settings options are set.")
        return;
    }
    try {
        const res = await showCloudMenu(editor, token, url, username, action === 'open');
        document.querySelector("#upload-menu")?.remove();
        return res;
    }
    catch (e) {
        await editorAlert(e);
        document.querySelector("#upload-menu")?.remove();
    }
}

const showAboutPrompt = async (editor: RiteEditor) => {
    let version = editor.getVersion();
    await editorAlert(`<div><strong>rite v${version}</strong></div>
            <div><strong>config file:</strong> <code>${await getConfigPath()}</code></div>
            <div>
                rite is free, open-source software under the MIT license. 
                Copyright © 2021 Siddharth Singh.
            </div>
            <div>rite depends on the following software:</div>
            <ul>
                <li>
                    <a target="_blank" href='https://marked.js.org'>Marked</a> used under the terms of the MIT License,
                    Copyright © 2018+, <a target="_blank" href='https://github.com/markedjs/'>MarkedJS</a> Copyright (c)
                    2011-2018, <a target="_blank" href='https://github.com/chjj/'>Christopher Jeffrey</a>.
                </li>
                <li>
                    <a target="_blank" href='https://codemirror.net'>CodeMirror</a> used under the terms of the MIT License,
                    Copyright © 2017 by <a target="_blank" href='mailto:marijnh@gmail.com'>Marijnh Haverbeke</a> and others
                </li>
                <li>
                    <a target="_blank" href='https://tauri.studio'>Tauri</a> is the underlying runtime on which rite is built.
                    Code from Tauri is used under the MIT license. Copyright © 2017 - Present Tauri Apps Contributors
                </li>
                <li>
                    The fonts Inconsolata and Crimson Pro, distributed under the
                    <a target="_blank" href='https://github.com/xyzshantaram/rite/tree/main/static/fonts/OFL.txt'>OFL</a>.
                </li>
            </ul>
    `);
}

const newFile = async (editor: RiteEditor) => {
    await editor.newFile();
}

export const checkForUpdates = async (editor: RiteEditor, manual = true) => {
    const currentVersion = editor.getVersion();
    if (!manual && !(await editor.getConfigVar("check_updates"))) {
        console.info("Update check skipped.");
        return;
    }
    try {
        let res = await riteFetch(`https://api.github.com/repos/${GH_REPO}/releases/latest`);
        let latestRelease = JSON.parse(res.body);
        if (latestRelease.prerelease || latestRelease.draft) {
            return;
        }
        let latestVersion = latestRelease.tag_name.replace('v', '');
        if (isOlder(currentVersion, latestVersion)) {
            await editorAlert(`A new version of rite is available! 
            Head to the 
            <a target="_blank" href='${GH_REPO_URL}/releases/'>releases</a> 
            page to download it.`);
        }
        else {
            let msg = "You are on the latest version of rite!";
            console.info(msg);
            if (manual) await editorAlert(msg);
        }
    }
    catch (e) {
        console.error(`error ${e} while trying to check for updates. Proceeding silently.`);
        if (manual) await editorAlert(`Caught error ${e} while trying to check for updates!`);
    }
}

const openHelp = async (_: RiteEditor) => {
    await open('https://riteapp.co.in/help');
}

const showPreview = (editor: RiteEditor) => {
    editor.cm.setOption('readOnly', true);
    editor.editorRoot.style.display = 'none';
    editor.preview.style.display = 'flex';
}

const hidePreview = (editor: RiteEditor) => {
    editor.cm.setOption('readOnly', false);
    editor.editorRoot.style.display = 'flex';
    editor.preview.style.display = 'none';
}

const openPreview = (editor: RiteEditor) => {
    const dark = !editor.getConfigVar('preview_theme');
    const html = getPreviewHtml(editor.getContents(), dark);
    editor.preview.innerHTML = '';
    showPreview(editor);
    cf.insert(cf.nu('iframe#preview-frame', {
        m: {
            srcdoc: html
        }
    }), { atStartOf: editor.preview });

    const buttonBar = cf.nu('div#preview-controls', {
        contents: `
        <button id='close-preview' type='button'>Go back</button>
        `,
        raw: true
    }) as HTMLElement;

    editor.preview.appendChild(buttonBar);
    const close = buttonBar.querySelector('#close-preview') as HTMLElement;
    close.onclick = () => {
        hidePreview(editor);
    }
}

let cursorListener = (instance: Editor) => {
    const line = instance.getCursor().line + 1;
    const selector = `.CodeMirror-code>div:nth-child(${line})`;
    let ln = document.querySelector(selector) as HTMLDivElement;
    if (ln) {
        let elt = ln.querySelector('.CodeMirror-linenumber')! as HTMLDivElement;
        elt.style.display = 'block';
        elt.style.color = 'white';
    }
}

const generateToc = (editor: RiteEditor) => {
    const headings: { level: number, text: string, slug: string }[] = [];
    const renderer = new marked.Renderer();
    renderer.heading = (text, level, raw, slugger) => {
        const slug = slugger.slug(raw);
        headings.push({ level, text, slug });
        return text;
    };

    marked(editor.getContents(), { renderer });
    const generatedToc = headings
        .map((t) => `${Array(t.level).join("  ")}* [${t.text}](#${t.slug})`)
        .join("\n");

    editor.cm.replaceSelection(generatedToc, 'end');
    editor.cm.focus();
}

const toggleFocusMode = async (editor: RiteEditor) => {
    if (document.querySelector('#active-line-styles')) {
        document.querySelector("#active-line-styles")?.remove();
        document.querySelector("#focus-mode-mask")?.remove();
        editor.cm.off('keyHandled', cursorListener);
        editor.cm.off('change', cursorListener);
        return;
    }

    if (editor.getConfigVar('light_theme')) {
        if (!await editorConfirm('Focus mode needs dark theme to be enabled. Continue?')) {
            return;
        }
        await editor.setConfigVar('light_theme', false);
    }

    editor.cm.on('keyHandled', cursorListener);
    editor.cm.on('change', cursorListener);

    const css = `
        #editor>.CodeMirror {
            background: inherit;
        }
        
        .CodeMirror-linenumber {
            display: none;
        }

        .CodeMirror-gutters, .CodeMirror-code>* {
            z-index: 0;
        }

        .CodeMirror-gutters {
            background: inherit;
            border-right-color: transparent;
        }

        #statusline:hover, .CodeMirror-code>*:hover, .CodeMirror-code > .CodeMirror-activeline {
            z-index: 2;
        }

        .CodeMirror-code>*:hover {
            color: grey;
        }

        .CodeMirror-code > .CodeMirror-activeline {
            background-color: black !important;
            color: white !important;
            box-shadow: 0 0 2px 2px black;
        }

        .CodeMirror {
            line-height: 22px;
        }
        
        .CodeMirror-cursors .CodeMirror-cursor {
            border-left-color: grey;
        }`;

    const style = cf.nu('style#active-line-styles', {
        raw: true,
        contents: css,
    })

    const mask = cf.nu('div#focus-mode-mask', {
        style: {
            width: '100%',
            position: 'fixed',
            height: '100%',
            zIndex: 1,
            background: 'rgba(0, 0, 0, 0.6)',
            '-webkit-backdrop-filter': 'blur(1px)',
            pointerEvents: 'none'
        }
    })

    const head = document.querySelector('head')!;
    head.appendChild(style);
    editor.editorRoot.appendChild(mask);
}

export const COMMANDS: RiteCommands = {
    "new_file": {
        action: newFile,
        description: "Create a new file.",
        palette: true
    },
    "open_file": {
        action: loadFile,
        description: "Open a file.",
        palette: true
    },
    "open_palette": {
        action: openPalette,
        description: "Show the palette."
    },
    "save": {
        action: saveFile,
        description: "Save current file.",
        palette: true
    },
    "save_as": {
        action: saveAs,
        description: "Save current file to a new location.",
        palette: true
    },
    "toc": {
        action: generateToc,
        description: "Insert a table of contents at the current cursor position.",
        palette: true
    },
    "preview": {
        action: openPreview,
        description: "Preview the current document.",
        palette: true
    },
    "cloud_save": {
        action: saveToCloud,
        description: "Upload current file to Rite Cloud.",
        palette: true
    },
    "cloud_open": {
        action: openFromCloud,
        description: "Open a file from Rite Cloud.",
        palette: true
    },
    "open_settings": {
        action: openSettings,
        description: "Open settings.",
        palette: true
    },
    "close_palette": {
        action: () => { },
        description: "Close palette.",
        palette: true
    },
    "focus_mode": {
        action: toggleFocusMode,
        description: "Toggle focus mode.",
        palette: true
    },
    "check_updates": {
        action: checkForUpdates,
        description: "Check for updates.",
        palette: true
    },
    "mark_range_italic": {
        action: (editor) => editor.insertAround('*'),
        description: "Mark the current editor selection as italic."
    },
    "mark_range_bold": {
        action: (editor) => editor.insertAround('**'),
        description: "Mark the current editor selection as bold."
    },
    "mark_range_deleted": {
        action: (editor) => editor.insertAround('~~'),
        description: "Mark the current editor selection as being struck through."
    },
    "mark_range_h1": {
        action: (editor) => editor.insertBefore('# ', 2),
        description: "Mark the current editor selection as a title (h1)."
    },
    "mark_range_h2": {
        action: (editor) => editor.insertBefore('## ', 3),
        description: "Mark the current editor selection as a sub-title (h2)."
    },
    "mark_range_h3": {
        action: (editor) => editor.insertBefore('### ', 4),
        description: "Mark the current editor selection as a third-level heading (h3)."
    },
    "mark_range_h4": {
        action: (editor) => editor.insertBefore('#### ', 5),
        description: "Mark the current editor selection as a fourth-level heading (h4)."
    },
    "mark_range_h5": {
        action: (editor) => editor.insertBefore('##### ', 6),
        description: "Mark the current editor selection as a fifth-level heading (h5)."
    },
    "mark_range_h6": {
        action: (editor) => editor.insertBefore('###### ', 7),
        description: "Mark the current editor selection as a sixth-level heading (h6)."
    },
    "about": {
        action: showAboutPrompt,
        description: "Copyright and licensing information.",
        palette: true
    },
    "view_keybinds": {
        action: viewKeybinds,
        description: "Show currently-assigned keybindings.",
        palette: true
    },
    "help": {
        action: openHelp,
        description: "Show the Rite guide (requires network).",
        palette: true
    },
}
