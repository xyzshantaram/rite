export const DEFAULT_KEYBINDS: Record<string, string> = {
    "C+s": "save_current_file",
    "C+o": "open_file",
    "CA+p": "open_palette",
    "C+i": "mark_range_italic",
    "C+b": "mark_range_bold",
    "CA+d": "mark_range_deleted",
    "CA+1": "mark_range_h1",
    "CA+2": "mark_range_h2",
    "CA+3": "mark_range_h3",
    "CA+4": "mark_range_h4",
    "CA+5": "mark_range_h5",
    "CA+6": "mark_range_h6"
}

export const parseKeybind = (keybind: string, platform: string) => {
    let components = keybind.split("+");
    let alpha = components[1];

    let isMac = platform === 'macos';

    return (e: KeyboardEvent) => {
        let toCheckTrue: boolean[] = [];
        let toCheckFalse: boolean[] = [];

        // check for cmd instead of ctrl on macs
        let cKey = isMac ? e.metaKey : e.ctrlKey;

        (components[0].includes("C") ? toCheckTrue : toCheckFalse).push(cKey);
        (components[0].includes("S") ? toCheckTrue : toCheckFalse).push(e.shiftKey);
        (components[0].includes("A") ? toCheckTrue : toCheckFalse).push(e.altKey);

        return (toCheckFalse.every((bool: boolean) => !bool)
            && toCheckTrue.every((bool: boolean) => bool)
            && e.key.toLocaleLowerCase() == alpha);
    }
}
