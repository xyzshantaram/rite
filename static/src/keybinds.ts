export const DEFAULT_KEYBINDS: Record<string, string> = {
    "C+s": "saveCurrentFile",
    "C+o": "openFile",
    "CS+p": "openPalette",
    "C+i": "markRangeItalic",
    "C+b": "markRangeBold",
    "C+d": "markRangeDeleted",
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
        let toCheck = [];

        if (components[0].includes("C")) toCheck.push(e.ctrlKey);
        if (components[0].includes("S")) toCheck.push(e.shiftKey);
        if (components[0].includes("A")) toCheck.push(e.altKey);

        return (toCheck.every((bool: boolean) => bool) && e.key.toLocaleLowerCase() == alpha);
    }
}
