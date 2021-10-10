import { createDir, writeFile } from "@tauri-apps/api/fs";
import { dirname } from "@tauri-apps/api/path";
import { exit } from "@tauri-apps/api/process";
import { DEFAULT_KEYBINDS } from "./keybinds";
import { editorConfirm, editorAlert, editorPrompt } from "./prompt";
import { dumpJSON, exists } from "./utils";

export const createConfig = async (configPath: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            const confirm = await editorConfirm('Config file not found. Would you like to create one?');

            if (!confirm) await editorAlert('Exiting...', async () => await exit(1));

            const tmp: Record<string, any> = {
                font: await editorPrompt('Pick a font.'),
                keybinds: DEFAULT_KEYBINDS,
                lineNumbers: await editorConfirm('Enable line numbers?')
            };

            const dir = await dirname(configPath);
            if (!(await exists(dir))) await createDir(dir, { recursive: true })

            const string = dumpJSON(tmp);
            await writeFile({ contents: string, path: configPath })
            await editorAlert(`Saved choices to ${configPath}`);
            resolve(string);
        }

        catch (e) {
            reject(e);
        }
    })
}
