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
- [] spaces that behave like tabs
- [] add help menu that displays keybinds and maybe even markdown help

```js
// from https://github.com/codemirror/CodeMirror/issues/988
function betterTab(cm) {
  if (cm.somethingSelected()) {
    cm.indentSelection("add");
  } else {
    cm.replaceSelection(
      cm.getOption("indentWithTabs")
        ? "\t"
        : Array(cm.getOption("indentUnit") + 1).join(" "),
      "end",
      "+input",
    );
  }
}

CodeMirror.fromTextArea(document.getElementById("the-editor"), {
  extraKeys: { Tab: betterTab },
});
```

```js
// from simpleMDE
function wordCount(data) {
  var pattern =
    /[a-zA-Z0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g;
  var m = data.match(pattern);
  var count = 0;
  if (m === null) return count;
  for (var i = 0; i < m.length; i++) {
    if (m[i].charCodeAt(0) >= 0x4E00) {
      count += m[i].length;
    } else {
      count += 1;
    }
  }
  return count;
}
```
