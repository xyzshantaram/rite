<h1 align=center>rite</h1>

<p align=center>A minimalist markdown text editor.</p>

![Rite showing this readme in both normal and focus mode](https://github.com/xyzshantaram/rite/blob/main/res/banner.png?raw=true)

<div align=center>

<img src="https://github.com/xyzshantaram/rite/actions/workflows/release.yml/badge.svg" alt="Build status">
<a href="https://riteapp.co.in/help"><img src="https://img.shields.io/badge/docs-latest-blue"></a> <img src="https://img.shields.io/github/v/release/xyzshantaram/rite?display_name=tag&label=version" alt="Latest version">

**[Download](https://github.com/xyzshantaram/rite/releases) |
[Docs](https://riteapp.co.in/help) | [Rite Cloud](https://riteapp.co.in) |
[Build from source](#building-from-source) | [Contributing](#contributing) |
[Help](https://github.com/xyzshantaram/rite/issues)**

</div>

### Introduction

`rite` is an open-source, minimalist text editor designed for use with Markdown.

`rite` also has a cloud backup solution called Rite Cloud.

<div align=center><img width=720 height=400 src="https://github.com/xyzshantaram/rite/blob/main/res/command-palette.png?raw=true"></div>

#### Features

- **Flexible**: rite can be used completely offline, or as a client for Rite
  Cloud.
- **Fast**: rite is built on a lightweight Rust core and starts up instantly.
- **Small footprint**: rite ships as a tiny binary and has RAM usage in the tens
  of megabytes.
- **Cloud storage** with instant sharing and optional encryption
- **Blog system**: Rite Cloud allows you to publish your documents as blogs at
  the press of a button. See [blogs](https://riteapp.co.in/blog/) for details.

### Usage

#### Preliminary

Windows users will need to have
[WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
installed.

- Download the latest release from the
  [Releases](https://github.com/xyzshantaram/rite/releases) page.
- Install it the way you usually would for your operating system:
  - `msi` for Windows users
  - `dmg` for macOS users
  - `AppImage` or `deb` file for users of Debian-based distros
- Run it from your application launcher / start menu / terminal.

#### Using rite

To learn about using rite, check out the [guide](https://riteapp.co.in/help/).

### Building from source

- Make sure you've carried out the
  [initial setup](https://tauri.app/v1/guides/getting-started/prerequisites) for
  your operating system of choice. Also install the tauri cli with
  `cargo install tauri-cli`.
- Clone the repo.
- `cd rite`
- Install dependencies by running `yarn`.
- Build the release target with `cargo tauri build`.
- Run it by typing `src-tauri/target/release/rite`.
- For convenience, you can symlink rite into a directory that's on your path, or
  create an alias in your shell.

### Development setup

- Install the dependencies and carry out the initial Tauri setup (see above).
- You'll need to set up a web server (preferably one that can watch for changes
  and reload files) as the 'dev' command loads the page from 127.0.0.1:5500 for
  development convenience.

  An example:
  [Live Server for VSCode](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Once you've got one set up, you can simply run `tauri run dev` to get a debug
  build of the app running.

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

### Contributing

If you would like to contribute code, fork this repo and make a pull request.

However, you can also contribute by testing `rite` and giving your feedback!
Feel free to open an issue on the [issues](issues) page.

If you would like to contribute financially, you can donate using one of the
means listed [here](https://shantaram.xyz/contact/donate.html).

Thank you for using Rite!
