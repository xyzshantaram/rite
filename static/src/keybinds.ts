import { COMMANDS } from './commands'

export const DEFAULT_KEYBINDS: Record<string, string> = {
    "C+s": "save",
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
    "CA+6": "mark_range_h6",
    "CS+s": "save_as",
    "C+n": "new_file",
    "+F1": "help",
    "CA+f": "focus_mode"
}
