import { exit } from '@tauri-apps/api/process';
import cf from 'campfire.js';
import { clamp, PromptArgs, PromptChoice } from './utils';

export const toChoices = (arr: string[]): PromptChoice[] => {
    return arr.map((str) => {
        return { title: str }
    });
}

// from https://stackoverflow.com/a/39905590/16595846
const fuzzySearch = (str: string, query: string): number => {
    let string = str.toLowerCase();
    let compare = query.toLowerCase();
    let matches = 0;
    if (string.indexOf(compare) > -1) return 1; // covers basic partial matches
    for (let i = 0; i < compare.length; i++) {
        string.indexOf(compare[i]) > -1 ? matches += 1 : matches -= 1;
    }
    return query === "" ? 1 : matches / str.length;
};

const initialisePrompt = () => {
    const mask = cf.insert(cf.nu('div#mask'), { atEndOf: document.body }) as HTMLElement;
    const prompt = cf.insert(cf.nu('div#prompt'), { atEndOf: mask }) as HTMLElement;
    const promptWrapper = cf.insert(cf.nu('div#prompt-msg-wrapper'), { atEndOf: prompt }) as HTMLElement;
    const msg = cf.insert(cf.nu('div#prompt-message'), { atEndOf: promptWrapper }) as HTMLElement;
    const field = cf.insert(
        cf.nu('input#prompt-field', {
            a: { type: 'text', autocomplete: 'off' }
        }),
        { atEndOf: promptWrapper }
    ) as HTMLInputElement;

    const options = cf.insert(cf.nu('div#prompt-options',), { atEndOf: prompt }) as HTMLElement;

    let currentChoices: PromptChoice[] = [];
    let currIndex = 1;
    let allowNonOptions = true;
    let allowEmpty = false;

    let appendChoice = (choice: PromptChoice) => {
        options.append(cf.nu('.prompt-option', {
            c: `<span class='prompt-option-name'>${choice.title}</span>
            ${choice.description ? `<span class='prompt-option-desc'>${cf.escape(choice.description)}</span>` : ''}`,
            a: { 'data-choice': choice.title },
            on: {
                click: function(e) {
                    field.value = choice.title;
                    setSelectedOption(this);
                    field.focus();
                }
            },
            raw: true
        }))
    }

    const hide = () => {
        msg.innerHTML = '';
        field.value = '';
        options.innerHTML = '';
        allowNonOptions = true;
        allowEmpty = false;
        mask.style.display = 'none';
        currIndex = 1;

        window.dispatchEvent(new Event('rite-prompt-hide'));
    }

    field.oninput = (e) => {
        let value = field.value.trim();

        if (!currentChoices.find(elem => { elem.title === value})) setSelectedIdx(currIndex = 0);
        
        for (let choice of currentChoices) {
            const elt = document.querySelector(`div[data-choice=${choice.title}]`);
            if (fuzzySearch(choice.title, value) > 0.5) {
                if (elt === null) appendChoice(choice);
            }
            else {
                if (elt) elt.remove();
            }
        }
    }

    const completePromptFlow = (value: string) => {
        hide();
        currentCb(value);
    }

    const setSelectedIdx = (idx: number) => {
        currIndex = clamp(currIndex, 0, currentChoices.length);
        options.querySelector(`.prompt-option.selected`)?.classList.remove('selected');
        const selected: HTMLElement | null = options.querySelector(`.prompt-option:nth-child(${idx})`);
        if (selected) setSelectedOption(selected);
    }

    const setSelectedOption = (choice: HTMLElement) => {
        choice.classList.add('selected');
        choice.scrollIntoView(false);
        field.value = choice.getAttribute('data-choice')!;
    }

    const tryCompletingPromptFlow = () => {
        let value = field.value.trim();
        let selected = document.querySelector('.prompt-option.selected')?.getAttribute('data-choice');

        if (!allowEmpty && !value && !selected) return;

        if (selected) {
            completePromptFlow(selected);
            return;
        }

        if (allowNonOptions || Object.values(currentChoices).some(elem => elem.title === value)) {
            completePromptFlow(value);
        }
    }

    prompt.onkeydown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
        if (e.key === 'ArrowDown') {
            console.log(currIndex);
            setSelectedIdx(currIndex++);
            field.focus();
        }
        else if (e.key === 'ArrowUp') {
            setSelectedIdx(--currIndex);
            field.focus();
        }
        else if (e.key === 'Enter') {
            tryCompletingPromptFlow();
        }
    }

    let currentCb: Function = (str: string) => { };

    const setChoices = (choices: PromptChoice[]) => {
        currentChoices = choices;
        options.innerHTML = '';
        choices.forEach(appendChoice);
    }

    const show = (options: PromptArgs) => {
        hide();
        msg.innerHTML = <string>options.message || "";
        setChoices(options.choices || []);
        currentCb = <Function>options.callback || currentCb;
        allowEmpty = options.allowEmpty || false;
        allowNonOptions = options.allowNonOptions || true;
        mask.style.display = 'flex';
        field.focus();
        window.dispatchEvent(new Event('rite-prompt-show'));
    }

    return [show, hide];
}

const [show, hide] = initialisePrompt();

const editorAlertFatal = (msg: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        show({
            message: msg,
            choices: [],
            callback: (_: any) => exit(1),
            allowEmpty: false,
            allowNonOptions: false
        })

        resolve();
    })
}

const editorAlert = (msg: string, callback: Function = () => {}): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            show({
                message: msg,
                choices: toChoices(['okay']),
                callback: (_: any) => {
                    callback();
                    resolve();
                },
                allowEmpty: true,
                allowNonOptions: true
            })
        }

        catch (e) {
            reject(e);
        }
    })
}

const editorPrompt = (msg: string, allowEmpty = false): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            show({
                message: msg,
                choices: [],
                callback: (val: string) => resolve(val),
                allowNonOptions: true,
                allowEmpty: !!allowEmpty
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

const editorChoose = (msg: string, choices: PromptChoice[], nonOptions = false, allowEmpty = false): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            show({
                message: msg,
                choices: choices,
                callback: (val: string) => resolve(val),
                allowEmpty: !!allowEmpty,
                allowNonOptions: !!nonOptions
            })
        }

        catch (e) {
            reject(e);
        }
    })
}

const editorConfirm = (msg: string, choices: PromptChoice[] = [{title: 'yes'}, {title: 'no'}]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await editorChoose(msg, choices);
            resolve(result !== '' && result === choices[0].title);
        }
        catch (e) {
            reject(e);
        }
    })
};

export {
    show, hide, editorChoose, editorPrompt, editorAlert, editorAlertFatal, editorConfirm, fuzzySearch
}