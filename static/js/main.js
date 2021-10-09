// node_modules/campfire.js/dist/campfire.esm.js
var _parseEltString = (str) => {
  var _a;
  const matches = str ? str.match(/([0-9a-zA-Z\-]*)?(#[0-9a-zA-Z\-]*)?((.[0-9a-zA-Z\-]+)*)/) : void 0;
  const results = matches ? (_a = matches.slice(1, 4)) === null || _a === void 0 ? void 0 : _a.map((elem) => elem ? elem.trim() : void 0) : Array(3).fill(void 0);
  if (results && results[1])
    results[1] = results[1].replace(/#*/g, "");
  return matches ? {
    tag: results[0] || void 0,
    id: results[1] || void 0,
    classes: results[2] ? results[2].split(".").filter((elem) => elem.trim()) : void 0
  } : {};
};
var extend = (elem, args = {}) => {
  let { contents, c, misc, m, style, s, on, attrs, a, raw } = args;
  contents = contents || c || "";
  contents = raw ? contents : escape(contents);
  elem.innerHTML = contents;
  Object.assign(elem, misc || m);
  Object.assign(elem.style, style || s);
  Object.entries(on || {}).forEach(([evt, listener]) => elem.addEventListener(evt, listener));
  Object.entries(attrs || a || {}).forEach(([attr, value]) => elem.setAttribute(attr, value));
  return elem;
};
var nu = (eltInfo, args = {}) => {
  let { tag, id, classes } = _parseEltString(eltInfo);
  if (!tag)
    tag = "div";
  let elem = document.createElement(tag);
  if (id)
    elem.id = id;
  (classes || []).forEach((cls) => elem.classList.add(cls));
  return extend(elem, args);
};
var insert = (elem, where) => {
  const keys = Object.keys(where);
  if (keys.length !== 1) {
    throw new Error("Too many or too few positions specified.");
  }
  const ref = Object.values(where)[0];
  let position = "afterend";
  if (where.after) {
    position = "afterend";
  } else if (where.before) {
    position = "beforebegin";
  } else if (where.atStartOf) {
    position = "afterbegin";
  } else if (where.atEndOf) {
    position = "beforeend";
  }
  ref.insertAdjacentElement(position, elem);
  return elem;
};
var Store = class {
  constructor(value) {
    this.value = null;
    this._subscribers = {};
    this._subscriberCounts = {};
    this._dead = false;
    this.value = value;
  }
  on(type, fn, callNow = false) {
    this._subscriberCounts[type] = this._subscriberCounts[type] || 0;
    this._subscribers[type] = this._subscribers[type] || {};
    this._subscribers[type][this._subscriberCounts[type]] = fn;
    if (callNow && !["push", "remove", "mutation", "setAt"].includes(type)) {
      fn(this.value);
    }
    return this._subscriberCounts[type]++;
  }
  unsubscribe(type, id) {
    delete this._subscribers[type][id];
  }
  update(value) {
    if (this._dead)
      return;
    this.value = value;
    this._sendEvent("update", value);
  }
  refresh() {
    this._sendEvent("refresh", this.value);
  }
  _sendEvent(type, value) {
    if (this._dead)
      return;
    this._subscribers[type] = this._subscribers[type] || {};
    for (const idx in Object.keys(this._subscribers[type])) {
      this._subscribers[type][idx](value);
    }
  }
  dispose() {
    this._dead = true;
    this._subscribers = {};
    this._subscriberCounts = {};
  }
};
var ListStore = class extends Store {
  constructor(ls) {
    super(ls);
  }
  clear() {
    this.update([]);
  }
  push(val) {
    this.value.push(val);
    this._sendEvent("push", {
      value: val,
      idx: this.value.length - 1
    });
  }
  remove(idx) {
    if (idx < 0 || idx >= this.value.length)
      throw new RangeError("Invalid index.");
    this._sendEvent("remove", {
      value: this.value.splice(idx, 1)[0],
      idx
    });
  }
  get(idx) {
    if (idx < 0 || idx > this.value.length)
      throw new RangeError("Invalid index.");
    return this.value instanceof Array && this.value[idx];
  }
  setAt(idx, val) {
    if (idx < 0 || idx >= this.value.length)
      throw new RangeError("Invalid index.");
    this.value[idx] = val;
    this._sendEvent("mutation", {
      value: val,
      idx
    });
  }
  get length() {
    return this.value.length;
  }
};
var _mustache = (string, data = {}) => {
  const escapeExpr = new RegExp("\\\\({{\\s*" + Object.keys(data).join("|") + "\\s*}})", "gi");
  new RegExp(Object.keys(data).join("|"), "gi");
  return string.replace(new RegExp("(^|[^\\\\]){{\\s*(" + Object.keys(data).join("|") + ")\\s*}}", "gi"), function(matched, p1, p2) {
    return `${p1 || ""}${data[p2]}`;
  }).replace(escapeExpr, "$1");
};
var mustache = (string, data = {}, shouldEscape = true) => {
  let escaped = Object.assign({}, data);
  if (shouldEscape) {
    escaped = Object.fromEntries(Object.entries(escaped).map(([key, value]) => {
      return [key, escape(value)];
    }));
  }
  return _mustache(string, escaped);
};
var template = (str, shouldEscape) => {
  return (data) => mustache(str, data, shouldEscape);
};
var escape = (str) => {
  if (!str)
    return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};
var unescape = (str) => {
  if (!str)
    return "";
  const expr = /&(?:amp|lt|gt|quot|#(0+)?39);/g;
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'"
  };
  return str.replace(expr, (entity) => entities[entity] || "'");
};
var campfire_default = {
  Store,
  ListStore,
  nu,
  mustache,
  template,
  escape,
  unescape,
  extend,
  insert
};

// static/src/main.ts
campfire_default.insert(campfire_default.nu("h1", {
  c: "test"
}), { atEndOf: document.body });
