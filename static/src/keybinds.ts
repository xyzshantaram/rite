export const DEFAULT_KEYBINDS: Record<string, string> = {
    "C+s": "saveCurrentFile",
    "C+o": "openFile",
    "CS+p": "openPalette"
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
