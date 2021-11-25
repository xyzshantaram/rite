import { dialog } from "@tauri-apps/api"
import { readTextFile } from "@tauri-apps/api/fs"
import { RiteEditor } from "./RiteEditor"
import { editorAlert, editorChoose, editorConfirm, editorPrompt, hidePrompt, toChoices } from "./prompt"
import { CommandHandler, groupByProp, PromptChoice, RiteCommands, RiteFile } from "./utils"
import { MODIFIABLE_SETTINGS, requestSetting, Setting } from "./config"
import cf from 'campfire.js'

class UploadFormResult {
    name: string;
    revision: string;
    contents: string | null;
    public: boolean;
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

    await editor.execCommand(await editorChoose('Command:', choices, true, true), "palette");
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

const showCloudMenu = (editor: RiteEditor, token: string, url: string, user: string, open: boolean): Promise<UploadFormResult | OpenFormResult> => {
    document.querySelector("#upload-menu")?.remove();

    return new Promise((resolve, reject) => {
        fetch(url + "/api/docs/list", {
            method: 'POST',
            body: JSON.stringify({
                token, user
            })
        }).then(res => res.json()).then((list: Array<Record<string, unknown>>) => {
            let existingDocs = new Set<Record<string, unknown>>();
            list.forEach(elem => {
                existingDocs.add(elem);
            })

            const root = cf.insert(cf.nu('#upload-menu'), { atEndOf: document.body }) as HTMLElement;

            const form = cf.nu('form', {
                raw: true,
                c: `
                <div class='form-group'>
                    <label for='document-name'>
                        Document
                        ${open ? '' : '<a id="upload-create-new" href="javascript:void(0)">Create new</a>'}
                    </label>
                    <select id='document-name' required></select>
                </div>

                ${!open ? `<div class='form-group'>
                        <label for='upload-is-public'>Public?</label>
                        <input type='checkbox' id='upload-is-public'>
                    </div>` : ''}

                <div class='form-group'>
                <label for='document-revision'>Revision</label>
                ${open ?
                        `<select id='document-revision' placeholder='Pick a revision' required>
                        <option value="" disabled selected>Select...</option>
                    </select>`
                        : `<input type='text' id='document-revision' required>`
                    }
                </div>

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
                    resolve({
                        name: nameField.value,
                        revision: revisionField.value,
                        contents: editor.getContents(),
                        public: publicCheckbox.checked
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

    let url: string = editor.getConfigVar("cloud_url");
    let doc = await fetch(url + "/api/docs/upload", {
        body: JSON.stringify({
            name: uploadDetails.name,
            revision: uploadDetails.revision,
            contents: uploadDetails.contents,
            public: uploadDetails.public,
            user: editor.getConfigVar("cloud_username"),
            token: editor.getConfigVar("cloud_token"),
        }),
        method: "POST"
    });
    if (!doc.ok) {
        const code = doc.status;
        const msg = (await doc.json()).message;
        await editorAlert(`Error ${code}: ${msg}`);
    }
    else {
        await editorAlert("Uploaded successfully.");
    }
}

const openFromCloud = async (editor: RiteEditor) => {
    const openDetails = await cloudAction(editor, "open");
    if (!openDetails || openDetails instanceof UploadFormResult) {
        return;
    }

    let url: string = editor.getConfigVar("cloud_url");
    let doc = await fetch(url + "/api/docs/contents", {
        body: JSON.stringify({
            uuid: openDetails.uuid,
            user: editor.getConfigVar("cloud_username"),
            token: editor.getConfigVar("cloud_token"),
        }),
        method: "POST"
    });

    let json = await doc.json();

    if (doc.ok) {
        editor.setContents(json.contents);
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
        if (await editorConfirm("Current document must be saved. Continue?")) {
            await editor.save();
        }
        else return;
    }

    if (action === 'open' && editor.dirty) {
        await editorAlert("File not saved -- cancelling.");
        return;
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

const showAboutPrompt = async () => {
    await editorAlert(`<div>
                rite is free, open-source software under the MIT license. 
                Copyright © 2021 Siddharth Singh.
            </div>
            <div>rite depends on the following software:</div>
            <ul>
                <li>
                    <a href='https://marked.js.org'>Marked</a> used under the terms of the MIT License,
                    Copyright © 2018+, <a href='https://github.com/markedjs/'>MarkedJS</a> Copyright (c)
                    2011-2018, <a href='https://github.com/chjj/'>Christopher Jeffrey</a>.
                </li>
                <li>
                    <a href='https://codemirror.net'>CodeMirror</a> used under the terms of the MIT License,
                    Copyright © 2017 by <a href='Marijn Haverbeke'>marijnh@gmail.com</a> and others
                </li>
                <li>
                    <a href='https://tauri.studio'>Tauri</a> is the underlying runtime on which rite is built.
                    Code from Tauri is used under the MIT license. Copyright © 2017 - Present Tauri Apps Contributors
                </li>
            </ul>
    `);
}

const newFile = async (editor: RiteEditor) => {
    await editor.newFile();
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
        description: "Mark the current editor selection as an <h1>."
    },
    "mark_range_h2": {
        action: (editor) => editor.insertBefore('## ', 3),
        description: "Mark the current editor selection as an <h2>."
    },
    "mark_range_h3": {
        action: (editor) => editor.insertBefore('### ', 4),
        description: "Mark the current editor selection as an <h3>."
    },
    "mark_range_h4": {
        action: (editor) => editor.insertBefore('#### ', 5),
        description: "Mark the current editor selection as an <h4>."
    },
    "mark_range_h5": {
        action: (editor) => editor.insertBefore('##### ', 6),
        description: "Mark the current editor selection as an <h5>."
    },
    "mark_range_h6": {
        action: (editor) => editor.insertBefore('###### ', 7),
        description: "Mark the current editor selection as an <h6>."
    },
    "about": {
        action: showAboutPrompt,
        description: "Copyright and licensing information.",
        palette: true
    }
}