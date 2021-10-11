export const DEFAULT_KEYBINDS: Record<string, string> = {
    "C+s": "saveCurrentFile",
    "C+o": "openFile",
    "CS+p": "openPalette",
    "C+i": "markRangeItalic",
    "C+b": "markRangeBold",
    "CA+d": "markRangeDeleted",
    "CA+1": "markRangeH1",
    "CA+2": "markRangeH2",
    "CA+3": "markRangeH3",
    "CA+4": "markRangeH4",
    "CA+5": "markRangeH5",
    "CA+6": "markRangeH6",
}

export const parseKeybind = (keybind: string) => {
    let components = keybind.split("+");
    let alpha = components[1][0];

    return (e: KeyboardEvent) => {
        let toCheckTrue: boolean[] = [];
        let toCheckFalse: boolean[] = [];
        (components[0].includes("C") ? toCheckTrue : toCheckFalse).push(e.ctrlKey);
        (components[0].includes("S") ? toCheckTrue : toCheckFalse).push(e.shiftKey);
        (components[0].includes("A") ? toCheckTrue : toCheckFalse).push(e.altKey);

        return (toCheckFalse.every((bool: boolean) => !bool)
            && toCheckTrue.every((bool: boolean) => bool)
            && e.key.toLocaleLowerCase() == alpha);
    }
}
