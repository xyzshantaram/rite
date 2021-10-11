- [] tutorial
- [] pdf export
- [] other kinds of export? (html, gist, rentry?)
- [] word count
- [] color scheme configurator
- [] docs
- [] syntax highlighting for Marked
- [] command line interface
- [] dirty state fixes
- [] default config instead of prompt-driven
- [] make config save message appear in statusline
- [] clicking out of palette should close it 
- [] tab size config, spaces, smart indent
- [] rulers
- [] editorconfig support
- [] specialCharPlaceholder
- [] ctrl to cmd on Macs
- [] spaces that behave like tabs

```js
function betterTab(cm) {
  if (cm.somethingSelected()) {
    cm.indentSelection("add");
  } else {
    cm.replaceSelection(cm.getOption("indentWithTabs")? "\t":
      Array(cm.getOption("indentUnit") + 1).join(" "), "end", "+input");
  }
}

CodeMirror.fromTextArea(document.getElementById("the-editor"), {
  extraKeys: { Tab: betterTab }
});
```