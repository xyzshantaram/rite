# rite

A minimalist markdown text editor.

### Contributing

If you would like to contribute code, fork this repo and make a pull request.

However, you can also contribute by testing `rite` and giving your feedback!
Feel free to open an issue on the [issues](issues) page.

### Usage

#### Preliminary

Windows users will need to have
[WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
installed.

Additionally, the macOS build currently does not work on systems other than Big
Sur.

- Download the latest release from the
  [Releases](https://github.com/xyzshantaram/rite/releases) page.
- Install it the way you usually would for your operating system (the AppImage
  does not need to be installed, however.)
- When you run `rite`, you will be prompted for the first-time configuration.
- Once this is done, you can start using `rite`!

### Building from source

- Make sure you've carried out the initial setup for your operating system of
  choice (Linux[https://tauri.studio/en/docs/getting-started/setup-linux],
  macOS[https://tauri.studio/en/docs/getting-started/setup-macos],
  Windows[https://tauri.studio/en/docs/getting-started/setup-windows]).
- Clone the repo.
- `cd rite`
- Install dependencies by running `yarn`.
- You can build the debug target by running `yarn tauri dev`.
- Build the release target with `yarn tauri build`.

### Acknowledgments

- [Marked](https://marked.js.org/) used under the terms of the MIT License,
  Copyright © 2018+, [MarkedJS](https://github.com/markedjs/) Copyright ©
  2011-2018, [Christopher Jeffrey](https://github.com/chjj/).
- [CodeMirror](https://codemirror.net) used under the terms of the MIT License,
  Copyright © 2017 by [Marijn Haverbeke](mailto:marijnh@gmail.com) and others
- rite is built with [tauri](tauri.studio). Tauri code is used under the terms
  of the MIT license.
- fuzzySearch in prompt.ts is based on
  `https://stackoverflow.com/a/39905590/16595846`.
