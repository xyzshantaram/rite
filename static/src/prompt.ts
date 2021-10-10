import cf from 'campfire.js';
import { promptArgs } from './utils';

const fuzzySearch = (str, query) => {
    var string = str.toLowerCase();
    var compare = query.toLowerCase();
    var matches = 0;
    if (string.indexOf(compare) > -1) return true; // covers basic partial matches
    for (var i = 0; i < compare.length; i++) {
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

    let currentChoices: string[] = [];
    let currIndex = -1;
    let allowNonOptions = true;
    let allowBlank = false;

    let appendChoice = (choice) => {
        options.append(cf.nu('.prompt-option', {
            c: choice,
            a: { 'data-choice': choice }
        }))
    }

    const hide = () => {
        mask.style.display = 'none';
    }

    field.oninput = (e) => {
        let value = field.value.trim();

        for (let choice of currentChoices) {
            const elt = document.querySelector(`div[data-choice=${choice}]`);
            if (fuzzySearch(choice, value) > 0.5) {
                if (elt === null) appendChoice(choice);
            }
            else {
                if (elt) elt.remove();
            }
        }
    }

    const completePromptFlow = (value) => {
        msg.innerHTML = '';
        field.value = '';
        options.innerHTML = '';
        allowNonOptions = true;
        allowBlank = false;
        hide();
        currentCb(value);
    }

    const setSelectedOption = (idx) => {
        options.querySelector(`.prompt-option.selected`)?.classList.remove('selected');
        options.querySelector(`.prompt-option:nth-child(${idx})`)?.classList.add('selected');
    }

    prompt.onkeydown = (e) => {
        if (e.key === 'ArrowDown') {
            if (currIndex >= currentChoices.length) currIndex = currentChoices.length - 1;
            setSelectedOption(currIndex += 1);

        }
        else if (e.key === 'ArrowUp') {
            if (currIndex < 0) currIndex = 0;
            setSelectedOption(currIndex -= 1);
        }
        else if (e.key === 'Enter') {
            let value = field.value.trim();
            let selected = document.querySelector('.prompt-option.selected')?.getAttribute('data-choice');

            if (!allowBlank && !value && !selected) return;

            if (selected) {
                completePromptFlow(selected);
                return;
            }

            if (allowNonOptions || currentChoices.includes(value)) {
                completePromptFlow(value);
            }
        }
    }

    let currentCb: Function = (str) => { };

    const setChoices = (choices) => {
        currentChoices = choices;
        options.innerHTML = '';
        choices.forEach(appendChoice);
    }

    const show = (options: promptArgs) => {
        msg.innerHTML = <string>options.message || "";
        setChoices(options.choices || []);
        currentCb = <Function>options.callback || currentCb;
        allowBlank = options.allowBlank;
        allowNonOptions = options.allowNonOptions;
        mask.style.display = 'flex';
        field.focus();
    }

    return [show, hide];
}

const [show, hide] = initialisePrompt();

const editorAlert = (msg: string, callback: Function = () => {}): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            show({
                message: msg,
                choices: [],
                callback: (_: any) => resolve(),
                allowBlank: true,
                allowNonOptions: true
            })
        }

        catch (e) {
            reject(e);
        }
    })
}

const editorPrompt = (msg: string, allowBlank = false): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            show({
                message: msg,
                choices: [],
                callback: (val: string) => resolve(val),
                allowNonOptions: true
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

const editorChoose = (msg: string, choices: string[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            show({
                message: msg,
                choices: choices,
                callback: (val: string) => resolve(val),
                allowBlank: false,
                allowNonOptions: false
            })
        }

        catch (e) {
            reject(e);
        }
    })
}

const editorConfirm = (msg: string, choices = ['yes', 'no']): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await editorChoose(msg, choices);
            console.log(result);
            resolve(result === choices[0]);
        }
        catch (e) {
            reject(e);
        }
    })
};

export {
    show, hide, editorChoose, editorPrompt, editorAlert, editorConfirm, fuzzySearch
}