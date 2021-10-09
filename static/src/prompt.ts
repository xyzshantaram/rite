import cf from 'campfire.js';

export const fuzzySearch = (str, query) => {
    var string = str.toLowerCase();
    var compare = query.toLowerCase();
    var matches = 0;
    if (string.indexOf(compare) > -1) return true; // covers basic partial matches
    for (var i = 0; i < compare.length; i++) {
        string.indexOf(compare[i]) > -1 ? matches += 1 : matches -= 1;
    }
    return query === "" ? 1 : matches / str.length;
};


export const initialisePrompt = () => {
    const mask = cf.insert(cf.nu('div#mask'), { atEndOf: document.body }) as HTMLElement;
    const prompt = cf.insert(cf.nu('div#prompt'), { atEndOf: mask }) as HTMLElement;
    const promptWrapper = cf.insert(cf.nu('div#prompt-msg-wrapper'), { atEndOf: prompt }) as HTMLElement;
    const msg = cf.insert(cf.nu('span#prompt-message'), { atEndOf: promptWrapper }) as HTMLElement;
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
        currentCb(value);
        hide();
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

    const cfg = new cf.Store({});
    let currentCb: Function = (str) => { };

    const setChoices = (choices) => {
        currentChoices = choices;
        options.innerHTML = '';
        choices.forEach(appendChoice);
    }

    cfg.on("update", (options: Record<string, unknown>) => {
        console.log(options);
        msg.innerHTML = <string>options.message || "";
        setChoices(options.choices || []);
        currentCb = <Function>options.callback || currentCb;
        console.log(allowBlank);
    })

    const show = (options: Record<string, string>) => {
        cfg.update(options);
        mask.style.display = 'flex';
        field.focus();
    }

    return [show, hide];
}