var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/codemirror/lib/codemirror.js
var require_codemirror = __commonJS({
  "node_modules/codemirror/lib/codemirror.js"(exports, module) {
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, global.CodeMirror = factory());
    })(exports, function() {
      "use strict";
      var userAgent = navigator.userAgent;
      var platform = navigator.platform;
      var gecko = /gecko\/\d/i.test(userAgent);
      var ie_upto10 = /MSIE \d/.test(userAgent);
      var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
      var edge = /Edge\/(\d+)/.exec(userAgent);
      var ie = ie_upto10 || ie_11up || edge;
      var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]);
      var webkit = !edge && /WebKit\//.test(userAgent);
      var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
      var chrome = !edge && /Chrome\//.test(userAgent);
      var presto = /Opera\//.test(userAgent);
      var safari = /Apple Computer/.test(navigator.vendor);
      var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
      var phantom = /PhantomJS/.test(userAgent);
      var ios = safari && (/Mobile\/\w+/.test(userAgent) || navigator.maxTouchPoints > 2);
      var android = /Android/.test(userAgent);
      var mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
      var mac = ios || /Mac/.test(platform);
      var chromeOS = /\bCrOS\b/.test(userAgent);
      var windows = /win/i.test(platform);
      var presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
      if (presto_version) {
        presto_version = Number(presto_version[1]);
      }
      if (presto_version && presto_version >= 15) {
        presto = false;
        webkit = true;
      }
      var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
      var captureRightClick = gecko || ie && ie_version >= 9;
      function classTest(cls) {
        return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*");
      }
      var rmClass = function(node, cls) {
        var current = node.className;
        var match = classTest(cls).exec(current);
        if (match) {
          var after = current.slice(match.index + match[0].length);
          node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
        }
      };
      function removeChildren(e4) {
        for (var count = e4.childNodes.length; count > 0; --count) {
          e4.removeChild(e4.firstChild);
        }
        return e4;
      }
      function removeChildrenAndAdd(parent, e4) {
        return removeChildren(parent).appendChild(e4);
      }
      function elt(tag, content, className, style) {
        var e4 = document.createElement(tag);
        if (className) {
          e4.className = className;
        }
        if (style) {
          e4.style.cssText = style;
        }
        if (typeof content == "string") {
          e4.appendChild(document.createTextNode(content));
        } else if (content) {
          for (var i11 = 0; i11 < content.length; ++i11) {
            e4.appendChild(content[i11]);
          }
        }
        return e4;
      }
      function eltP(tag, content, className, style) {
        var e4 = elt(tag, content, className, style);
        e4.setAttribute("role", "presentation");
        return e4;
      }
      var range;
      if (document.createRange) {
        range = function(node, start, end, endNode) {
          var r7 = document.createRange();
          r7.setEnd(endNode || node, end);
          r7.setStart(node, start);
          return r7;
        };
      } else {
        range = function(node, start, end) {
          var r7 = document.body.createTextRange();
          try {
            r7.moveToElementText(node.parentNode);
          } catch (e4) {
            return r7;
          }
          r7.collapse(true);
          r7.moveEnd("character", end);
          r7.moveStart("character", start);
          return r7;
        };
      }
      function contains(parent, child) {
        if (child.nodeType == 3) {
          child = child.parentNode;
        }
        if (parent.contains) {
          return parent.contains(child);
        }
        do {
          if (child.nodeType == 11) {
            child = child.host;
          }
          if (child == parent) {
            return true;
          }
        } while (child = child.parentNode);
      }
      function activeElt() {
        var activeElement;
        try {
          activeElement = document.activeElement;
        } catch (e4) {
          activeElement = document.body || null;
        }
        while (activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
        return activeElement;
      }
      function addClass(node, cls) {
        var current = node.className;
        if (!classTest(cls).test(current)) {
          node.className += (current ? " " : "") + cls;
        }
      }
      function joinClasses(a11, b3) {
        var as = a11.split(" ");
        for (var i11 = 0; i11 < as.length; i11++) {
          if (as[i11] && !classTest(as[i11]).test(b3)) {
            b3 += " " + as[i11];
          }
        }
        return b3;
      }
      var selectInput = function(node) {
        node.select();
      };
      if (ios) {
        selectInput = function(node) {
          node.selectionStart = 0;
          node.selectionEnd = node.value.length;
        };
      } else if (ie) {
        selectInput = function(node) {
          try {
            node.select();
          } catch (_e) {
          }
        };
      }
      function bind(f5) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
          return f5.apply(null, args);
        };
      }
      function copyObj(obj, target, overwrite) {
        if (!target) {
          target = {};
        }
        for (var prop2 in obj) {
          if (obj.hasOwnProperty(prop2) && (overwrite !== false || !target.hasOwnProperty(prop2))) {
            target[prop2] = obj[prop2];
          }
        }
        return target;
      }
      function countColumn(string, end, tabSize, startIndex, startValue) {
        if (end == null) {
          end = string.search(/[^\s\u00a0]/);
          if (end == -1) {
            end = string.length;
          }
        }
        for (var i11 = startIndex || 0, n10 = startValue || 0; ; ) {
          var nextTab = string.indexOf("	", i11);
          if (nextTab < 0 || nextTab >= end) {
            return n10 + (end - i11);
          }
          n10 += nextTab - i11;
          n10 += tabSize - n10 % tabSize;
          i11 = nextTab + 1;
        }
      }
      var Delayed = function() {
        this.id = null;
        this.f = null;
        this.time = 0;
        this.handler = bind(this.onTimeout, this);
      };
      Delayed.prototype.onTimeout = function(self2) {
        self2.id = 0;
        if (self2.time <= +new Date()) {
          self2.f();
        } else {
          setTimeout(self2.handler, self2.time - +new Date());
        }
      };
      Delayed.prototype.set = function(ms, f5) {
        this.f = f5;
        var time = +new Date() + ms;
        if (!this.id || time < this.time) {
          clearTimeout(this.id);
          this.id = setTimeout(this.handler, ms);
          this.time = time;
        }
      };
      function indexOf(array, elt2) {
        for (var i11 = 0; i11 < array.length; ++i11) {
          if (array[i11] == elt2) {
            return i11;
          }
        }
        return -1;
      }
      var scrollerGap = 50;
      var Pass = { toString: function() {
        return "CodeMirror.Pass";
      } };
      var sel_dontScroll = { scroll: false }, sel_mouse = { origin: "*mouse" }, sel_move = { origin: "+move" };
      function findColumn(string, goal, tabSize) {
        for (var pos = 0, col = 0; ; ) {
          var nextTab = string.indexOf("	", pos);
          if (nextTab == -1) {
            nextTab = string.length;
          }
          var skipped = nextTab - pos;
          if (nextTab == string.length || col + skipped >= goal) {
            return pos + Math.min(skipped, goal - col);
          }
          col += nextTab - pos;
          col += tabSize - col % tabSize;
          pos = nextTab + 1;
          if (col >= goal) {
            return pos;
          }
        }
      }
      var spaceStrs = [""];
      function spaceStr(n10) {
        while (spaceStrs.length <= n10) {
          spaceStrs.push(lst(spaceStrs) + " ");
        }
        return spaceStrs[n10];
      }
      function lst(arr) {
        return arr[arr.length - 1];
      }
      function map(array, f5) {
        var out = [];
        for (var i11 = 0; i11 < array.length; i11++) {
          out[i11] = f5(array[i11], i11);
        }
        return out;
      }
      function insertSorted(array, value, score) {
        var pos = 0, priority = score(value);
        while (pos < array.length && score(array[pos]) <= priority) {
          pos++;
        }
        array.splice(pos, 0, value);
      }
      function nothing() {
      }
      function createObj(base, props) {
        var inst;
        if (Object.create) {
          inst = Object.create(base);
        } else {
          nothing.prototype = base;
          inst = new nothing();
        }
        if (props) {
          copyObj(props, inst);
        }
        return inst;
      }
      var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
      function isWordCharBasic(ch) {
        return /\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
      }
      function isWordChar(ch, helper) {
        if (!helper) {
          return isWordCharBasic(ch);
        }
        if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) {
          return true;
        }
        return helper.test(ch);
      }
      function isEmpty(obj) {
        for (var n10 in obj) {
          if (obj.hasOwnProperty(n10) && obj[n10]) {
            return false;
          }
        }
        return true;
      }
      var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
      function isExtendingChar(ch) {
        return ch.charCodeAt(0) >= 768 && extendingChars.test(ch);
      }
      function skipExtendingChars(str, pos, dir) {
        while ((dir < 0 ? pos > 0 : pos < str.length) && isExtendingChar(str.charAt(pos))) {
          pos += dir;
        }
        return pos;
      }
      function findFirst(pred, from, to) {
        var dir = from > to ? -1 : 1;
        for (; ; ) {
          if (from == to) {
            return from;
          }
          var midF = (from + to) / 2, mid = dir < 0 ? Math.ceil(midF) : Math.floor(midF);
          if (mid == from) {
            return pred(mid) ? from : to;
          }
          if (pred(mid)) {
            to = mid;
          } else {
            from = mid + dir;
          }
        }
      }
      function iterateBidiSections(order, from, to, f5) {
        if (!order) {
          return f5(from, to, "ltr", 0);
        }
        var found = false;
        for (var i11 = 0; i11 < order.length; ++i11) {
          var part = order[i11];
          if (part.from < to && part.to > from || from == to && part.to == from) {
            f5(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr", i11);
            found = true;
          }
        }
        if (!found) {
          f5(from, to, "ltr");
        }
      }
      var bidiOther = null;
      function getBidiPartAt(order, ch, sticky) {
        var found;
        bidiOther = null;
        for (var i11 = 0; i11 < order.length; ++i11) {
          var cur = order[i11];
          if (cur.from < ch && cur.to > ch) {
            return i11;
          }
          if (cur.to == ch) {
            if (cur.from != cur.to && sticky == "before") {
              found = i11;
            } else {
              bidiOther = i11;
            }
          }
          if (cur.from == ch) {
            if (cur.from != cur.to && sticky != "before") {
              found = i11;
            } else {
              bidiOther = i11;
            }
          }
        }
        return found != null ? found : bidiOther;
      }
      var bidiOrdering = function() {
        var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
        var arabicTypes = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";
        function charType(code) {
          if (code <= 247) {
            return lowTypes.charAt(code);
          } else if (1424 <= code && code <= 1524) {
            return "R";
          } else if (1536 <= code && code <= 1785) {
            return arabicTypes.charAt(code - 1536);
          } else if (1774 <= code && code <= 2220) {
            return "r";
          } else if (8192 <= code && code <= 8203) {
            return "w";
          } else if (code == 8204) {
            return "b";
          } else {
            return "L";
          }
        }
        var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
        var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
        function BidiSpan(level, from, to) {
          this.level = level;
          this.from = from;
          this.to = to;
        }
        return function(str, direction) {
          var outerType = direction == "ltr" ? "L" : "R";
          if (str.length == 0 || direction == "ltr" && !bidiRE.test(str)) {
            return false;
          }
          var len = str.length, types = [];
          for (var i11 = 0; i11 < len; ++i11) {
            types.push(charType(str.charCodeAt(i11)));
          }
          for (var i$12 = 0, prev = outerType; i$12 < len; ++i$12) {
            var type = types[i$12];
            if (type == "m") {
              types[i$12] = prev;
            } else {
              prev = type;
            }
          }
          for (var i$22 = 0, cur = outerType; i$22 < len; ++i$22) {
            var type$1 = types[i$22];
            if (type$1 == "1" && cur == "r") {
              types[i$22] = "n";
            } else if (isStrong.test(type$1)) {
              cur = type$1;
              if (type$1 == "r") {
                types[i$22] = "R";
              }
            }
          }
          for (var i$3 = 1, prev$1 = types[0]; i$3 < len - 1; ++i$3) {
            var type$2 = types[i$3];
            if (type$2 == "+" && prev$1 == "1" && types[i$3 + 1] == "1") {
              types[i$3] = "1";
            } else if (type$2 == "," && prev$1 == types[i$3 + 1] && (prev$1 == "1" || prev$1 == "n")) {
              types[i$3] = prev$1;
            }
            prev$1 = type$2;
          }
          for (var i$4 = 0; i$4 < len; ++i$4) {
            var type$3 = types[i$4];
            if (type$3 == ",") {
              types[i$4] = "N";
            } else if (type$3 == "%") {
              var end = void 0;
              for (end = i$4 + 1; end < len && types[end] == "%"; ++end) {
              }
              var replace = i$4 && types[i$4 - 1] == "!" || end < len && types[end] == "1" ? "1" : "N";
              for (var j2 = i$4; j2 < end; ++j2) {
                types[j2] = replace;
              }
              i$4 = end - 1;
            }
          }
          for (var i$5 = 0, cur$1 = outerType; i$5 < len; ++i$5) {
            var type$4 = types[i$5];
            if (cur$1 == "L" && type$4 == "1") {
              types[i$5] = "L";
            } else if (isStrong.test(type$4)) {
              cur$1 = type$4;
            }
          }
          for (var i$6 = 0; i$6 < len; ++i$6) {
            if (isNeutral.test(types[i$6])) {
              var end$1 = void 0;
              for (end$1 = i$6 + 1; end$1 < len && isNeutral.test(types[end$1]); ++end$1) {
              }
              var before = (i$6 ? types[i$6 - 1] : outerType) == "L";
              var after = (end$1 < len ? types[end$1] : outerType) == "L";
              var replace$1 = before == after ? before ? "L" : "R" : outerType;
              for (var j$1 = i$6; j$1 < end$1; ++j$1) {
                types[j$1] = replace$1;
              }
              i$6 = end$1 - 1;
            }
          }
          var order = [], m4;
          for (var i$7 = 0; i$7 < len; ) {
            if (countsAsLeft.test(types[i$7])) {
              var start = i$7;
              for (++i$7; i$7 < len && countsAsLeft.test(types[i$7]); ++i$7) {
              }
              order.push(new BidiSpan(0, start, i$7));
            } else {
              var pos = i$7, at = order.length, isRTL = direction == "rtl" ? 1 : 0;
              for (++i$7; i$7 < len && types[i$7] != "L"; ++i$7) {
              }
              for (var j$2 = pos; j$2 < i$7; ) {
                if (countsAsNum.test(types[j$2])) {
                  if (pos < j$2) {
                    order.splice(at, 0, new BidiSpan(1, pos, j$2));
                    at += isRTL;
                  }
                  var nstart = j$2;
                  for (++j$2; j$2 < i$7 && countsAsNum.test(types[j$2]); ++j$2) {
                  }
                  order.splice(at, 0, new BidiSpan(2, nstart, j$2));
                  at += isRTL;
                  pos = j$2;
                } else {
                  ++j$2;
                }
              }
              if (pos < i$7) {
                order.splice(at, 0, new BidiSpan(1, pos, i$7));
              }
            }
          }
          if (direction == "ltr") {
            if (order[0].level == 1 && (m4 = str.match(/^\s+/))) {
              order[0].from = m4[0].length;
              order.unshift(new BidiSpan(0, 0, m4[0].length));
            }
            if (lst(order).level == 1 && (m4 = str.match(/\s+$/))) {
              lst(order).to -= m4[0].length;
              order.push(new BidiSpan(0, len - m4[0].length, len));
            }
          }
          return direction == "rtl" ? order.reverse() : order;
        };
      }();
      function getOrder(line, direction) {
        var order = line.order;
        if (order == null) {
          order = line.order = bidiOrdering(line.text, direction);
        }
        return order;
      }
      var noHandlers = [];
      var on = function(emitter, type, f5) {
        if (emitter.addEventListener) {
          emitter.addEventListener(type, f5, false);
        } else if (emitter.attachEvent) {
          emitter.attachEvent("on" + type, f5);
        } else {
          var map2 = emitter._handlers || (emitter._handlers = {});
          map2[type] = (map2[type] || noHandlers).concat(f5);
        }
      };
      function getHandlers(emitter, type) {
        return emitter._handlers && emitter._handlers[type] || noHandlers;
      }
      function off(emitter, type, f5) {
        if (emitter.removeEventListener) {
          emitter.removeEventListener(type, f5, false);
        } else if (emitter.detachEvent) {
          emitter.detachEvent("on" + type, f5);
        } else {
          var map2 = emitter._handlers, arr = map2 && map2[type];
          if (arr) {
            var index = indexOf(arr, f5);
            if (index > -1) {
              map2[type] = arr.slice(0, index).concat(arr.slice(index + 1));
            }
          }
        }
      }
      function signal(emitter, type) {
        var handlers = getHandlers(emitter, type);
        if (!handlers.length) {
          return;
        }
        var args = Array.prototype.slice.call(arguments, 2);
        for (var i11 = 0; i11 < handlers.length; ++i11) {
          handlers[i11].apply(null, args);
        }
      }
      function signalDOMEvent(cm, e4, override) {
        if (typeof e4 == "string") {
          e4 = { type: e4, preventDefault: function() {
            this.defaultPrevented = true;
          } };
        }
        signal(cm, override || e4.type, cm, e4);
        return e_defaultPrevented(e4) || e4.codemirrorIgnore;
      }
      function signalCursorActivity(cm) {
        var arr = cm._handlers && cm._handlers.cursorActivity;
        if (!arr) {
          return;
        }
        var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
        for (var i11 = 0; i11 < arr.length; ++i11) {
          if (indexOf(set, arr[i11]) == -1) {
            set.push(arr[i11]);
          }
        }
      }
      function hasHandler(emitter, type) {
        return getHandlers(emitter, type).length > 0;
      }
      function eventMixin(ctor) {
        ctor.prototype.on = function(type, f5) {
          on(this, type, f5);
        };
        ctor.prototype.off = function(type, f5) {
          off(this, type, f5);
        };
      }
      function e_preventDefault(e4) {
        if (e4.preventDefault) {
          e4.preventDefault();
        } else {
          e4.returnValue = false;
        }
      }
      function e_stopPropagation(e4) {
        if (e4.stopPropagation) {
          e4.stopPropagation();
        } else {
          e4.cancelBubble = true;
        }
      }
      function e_defaultPrevented(e4) {
        return e4.defaultPrevented != null ? e4.defaultPrevented : e4.returnValue == false;
      }
      function e_stop(e4) {
        e_preventDefault(e4);
        e_stopPropagation(e4);
      }
      function e_target(e4) {
        return e4.target || e4.srcElement;
      }
      function e_button(e4) {
        var b3 = e4.which;
        if (b3 == null) {
          if (e4.button & 1) {
            b3 = 1;
          } else if (e4.button & 2) {
            b3 = 3;
          } else if (e4.button & 4) {
            b3 = 2;
          }
        }
        if (mac && e4.ctrlKey && b3 == 1) {
          b3 = 3;
        }
        return b3;
      }
      var dragAndDrop = function() {
        if (ie && ie_version < 9) {
          return false;
        }
        var div = elt("div");
        return "draggable" in div || "dragDrop" in div;
      }();
      var zwspSupported;
      function zeroWidthElement(measure) {
        if (zwspSupported == null) {
          var test = elt("span", "\u200B");
          removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
          if (measure.firstChild.offsetHeight != 0) {
            zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8);
          }
        }
        var node = zwspSupported ? elt("span", "\u200B") : elt("span", "\xA0", null, "display: inline-block; width: 1px; margin-right: -1px");
        node.setAttribute("cm-text", "");
        return node;
      }
      var badBidiRects;
      function hasBadBidiRects(measure) {
        if (badBidiRects != null) {
          return badBidiRects;
        }
        var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062EA"));
        var r0 = range(txt, 0, 1).getBoundingClientRect();
        var r1 = range(txt, 1, 2).getBoundingClientRect();
        removeChildren(measure);
        if (!r0 || r0.left == r0.right) {
          return false;
        }
        return badBidiRects = r1.right - r0.right < 3;
      }
      var splitLinesAuto = "\n\nb".split(/\n/).length != 3 ? function(string) {
        var pos = 0, result = [], l4 = string.length;
        while (pos <= l4) {
          var nl = string.indexOf("\n", pos);
          if (nl == -1) {
            nl = string.length;
          }
          var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
          var rt = line.indexOf("\r");
          if (rt != -1) {
            result.push(line.slice(0, rt));
            pos += rt + 1;
          } else {
            result.push(line);
            pos = nl + 1;
          }
        }
        return result;
      } : function(string) {
        return string.split(/\r\n?|\n/);
      };
      var hasSelection = window.getSelection ? function(te) {
        try {
          return te.selectionStart != te.selectionEnd;
        } catch (e4) {
          return false;
        }
      } : function(te) {
        var range2;
        try {
          range2 = te.ownerDocument.selection.createRange();
        } catch (e4) {
        }
        if (!range2 || range2.parentElement() != te) {
          return false;
        }
        return range2.compareEndPoints("StartToEnd", range2) != 0;
      };
      var hasCopyEvent = function() {
        var e4 = elt("div");
        if ("oncopy" in e4) {
          return true;
        }
        e4.setAttribute("oncopy", "return;");
        return typeof e4.oncopy == "function";
      }();
      var badZoomedRects = null;
      function hasBadZoomedRects(measure) {
        if (badZoomedRects != null) {
          return badZoomedRects;
        }
        var node = removeChildrenAndAdd(measure, elt("span", "x"));
        var normal = node.getBoundingClientRect();
        var fromRange = range(node, 0, 1).getBoundingClientRect();
        return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
      }
      var modes = {}, mimeModes = {};
      function defineMode(name, mode) {
        if (arguments.length > 2) {
          mode.dependencies = Array.prototype.slice.call(arguments, 2);
        }
        modes[name] = mode;
      }
      function defineMIME(mime, spec) {
        mimeModes[mime] = spec;
      }
      function resolveMode(spec) {
        if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
          spec = mimeModes[spec];
        } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
          var found = mimeModes[spec.name];
          if (typeof found == "string") {
            found = { name: found };
          }
          spec = createObj(found, spec);
          spec.name = found.name;
        } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
          return resolveMode("application/xml");
        } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(spec)) {
          return resolveMode("application/json");
        }
        if (typeof spec == "string") {
          return { name: spec };
        } else {
          return spec || { name: "null" };
        }
      }
      function getMode(options, spec) {
        spec = resolveMode(spec);
        var mfactory = modes[spec.name];
        if (!mfactory) {
          return getMode(options, "text/plain");
        }
        var modeObj = mfactory(options, spec);
        if (modeExtensions.hasOwnProperty(spec.name)) {
          var exts = modeExtensions[spec.name];
          for (var prop2 in exts) {
            if (!exts.hasOwnProperty(prop2)) {
              continue;
            }
            if (modeObj.hasOwnProperty(prop2)) {
              modeObj["_" + prop2] = modeObj[prop2];
            }
            modeObj[prop2] = exts[prop2];
          }
        }
        modeObj.name = spec.name;
        if (spec.helperType) {
          modeObj.helperType = spec.helperType;
        }
        if (spec.modeProps) {
          for (var prop$1 in spec.modeProps) {
            modeObj[prop$1] = spec.modeProps[prop$1];
          }
        }
        return modeObj;
      }
      var modeExtensions = {};
      function extendMode(mode, properties) {
        var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : modeExtensions[mode] = {};
        copyObj(properties, exts);
      }
      function copyState(mode, state) {
        if (state === true) {
          return state;
        }
        if (mode.copyState) {
          return mode.copyState(state);
        }
        var nstate = {};
        for (var n10 in state) {
          var val = state[n10];
          if (val instanceof Array) {
            val = val.concat([]);
          }
          nstate[n10] = val;
        }
        return nstate;
      }
      function innerMode(mode, state) {
        var info;
        while (mode.innerMode) {
          info = mode.innerMode(state);
          if (!info || info.mode == mode) {
            break;
          }
          state = info.state;
          mode = info.mode;
        }
        return info || { mode, state };
      }
      function startState(mode, a1, a22) {
        return mode.startState ? mode.startState(a1, a22) : true;
      }
      var StringStream = function(string, tabSize, lineOracle) {
        this.pos = this.start = 0;
        this.string = string;
        this.tabSize = tabSize || 8;
        this.lastColumnPos = this.lastColumnValue = 0;
        this.lineStart = 0;
        this.lineOracle = lineOracle;
      };
      StringStream.prototype.eol = function() {
        return this.pos >= this.string.length;
      };
      StringStream.prototype.sol = function() {
        return this.pos == this.lineStart;
      };
      StringStream.prototype.peek = function() {
        return this.string.charAt(this.pos) || void 0;
      };
      StringStream.prototype.next = function() {
        if (this.pos < this.string.length) {
          return this.string.charAt(this.pos++);
        }
      };
      StringStream.prototype.eat = function(match) {
        var ch = this.string.charAt(this.pos);
        var ok;
        if (typeof match == "string") {
          ok = ch == match;
        } else {
          ok = ch && (match.test ? match.test(ch) : match(ch));
        }
        if (ok) {
          ++this.pos;
          return ch;
        }
      };
      StringStream.prototype.eatWhile = function(match) {
        var start = this.pos;
        while (this.eat(match)) {
        }
        return this.pos > start;
      };
      StringStream.prototype.eatSpace = function() {
        var start = this.pos;
        while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) {
          ++this.pos;
        }
        return this.pos > start;
      };
      StringStream.prototype.skipToEnd = function() {
        this.pos = this.string.length;
      };
      StringStream.prototype.skipTo = function(ch) {
        var found = this.string.indexOf(ch, this.pos);
        if (found > -1) {
          this.pos = found;
          return true;
        }
      };
      StringStream.prototype.backUp = function(n10) {
        this.pos -= n10;
      };
      StringStream.prototype.column = function() {
        if (this.lastColumnPos < this.start) {
          this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
          this.lastColumnPos = this.start;
        }
        return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
      };
      StringStream.prototype.indentation = function() {
        return countColumn(this.string, null, this.tabSize) - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
      };
      StringStream.prototype.match = function(pattern, consume, caseInsensitive) {
        if (typeof pattern == "string") {
          var cased = function(str) {
            return caseInsensitive ? str.toLowerCase() : str;
          };
          var substr = this.string.substr(this.pos, pattern.length);
          if (cased(substr) == cased(pattern)) {
            if (consume !== false) {
              this.pos += pattern.length;
            }
            return true;
          }
        } else {
          var match = this.string.slice(this.pos).match(pattern);
          if (match && match.index > 0) {
            return null;
          }
          if (match && consume !== false) {
            this.pos += match[0].length;
          }
          return match;
        }
      };
      StringStream.prototype.current = function() {
        return this.string.slice(this.start, this.pos);
      };
      StringStream.prototype.hideFirstChars = function(n10, inner) {
        this.lineStart += n10;
        try {
          return inner();
        } finally {
          this.lineStart -= n10;
        }
      };
      StringStream.prototype.lookAhead = function(n10) {
        var oracle = this.lineOracle;
        return oracle && oracle.lookAhead(n10);
      };
      StringStream.prototype.baseToken = function() {
        var oracle = this.lineOracle;
        return oracle && oracle.baseToken(this.pos);
      };
      function getLine(doc, n10) {
        n10 -= doc.first;
        if (n10 < 0 || n10 >= doc.size) {
          throw new Error("There is no line " + (n10 + doc.first) + " in the document.");
        }
        var chunk = doc;
        while (!chunk.lines) {
          for (var i11 = 0; ; ++i11) {
            var child = chunk.children[i11], sz = child.chunkSize();
            if (n10 < sz) {
              chunk = child;
              break;
            }
            n10 -= sz;
          }
        }
        return chunk.lines[n10];
      }
      function getBetween(doc, start, end) {
        var out = [], n10 = start.line;
        doc.iter(start.line, end.line + 1, function(line) {
          var text = line.text;
          if (n10 == end.line) {
            text = text.slice(0, end.ch);
          }
          if (n10 == start.line) {
            text = text.slice(start.ch);
          }
          out.push(text);
          ++n10;
        });
        return out;
      }
      function getLines(doc, from, to) {
        var out = [];
        doc.iter(from, to, function(line) {
          out.push(line.text);
        });
        return out;
      }
      function updateLineHeight(line, height) {
        var diff = height - line.height;
        if (diff) {
          for (var n10 = line; n10; n10 = n10.parent) {
            n10.height += diff;
          }
        }
      }
      function lineNo(line) {
        if (line.parent == null) {
          return null;
        }
        var cur = line.parent, no = indexOf(cur.lines, line);
        for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
          for (var i11 = 0; ; ++i11) {
            if (chunk.children[i11] == cur) {
              break;
            }
            no += chunk.children[i11].chunkSize();
          }
        }
        return no + cur.first;
      }
      function lineAtHeight(chunk, h5) {
        var n10 = chunk.first;
        outer:
          do {
            for (var i$12 = 0; i$12 < chunk.children.length; ++i$12) {
              var child = chunk.children[i$12], ch = child.height;
              if (h5 < ch) {
                chunk = child;
                continue outer;
              }
              h5 -= ch;
              n10 += child.chunkSize();
            }
            return n10;
          } while (!chunk.lines);
        var i11 = 0;
        for (; i11 < chunk.lines.length; ++i11) {
          var line = chunk.lines[i11], lh = line.height;
          if (h5 < lh) {
            break;
          }
          h5 -= lh;
        }
        return n10 + i11;
      }
      function isLine(doc, l4) {
        return l4 >= doc.first && l4 < doc.first + doc.size;
      }
      function lineNumberFor(options, i11) {
        return String(options.lineNumberFormatter(i11 + options.firstLineNumber));
      }
      function Pos(line, ch, sticky) {
        if (sticky === void 0)
          sticky = null;
        if (!(this instanceof Pos)) {
          return new Pos(line, ch, sticky);
        }
        this.line = line;
        this.ch = ch;
        this.sticky = sticky;
      }
      function cmp(a11, b3) {
        return a11.line - b3.line || a11.ch - b3.ch;
      }
      function equalCursorPos(a11, b3) {
        return a11.sticky == b3.sticky && cmp(a11, b3) == 0;
      }
      function copyPos(x2) {
        return Pos(x2.line, x2.ch);
      }
      function maxPos(a11, b3) {
        return cmp(a11, b3) < 0 ? b3 : a11;
      }
      function minPos(a11, b3) {
        return cmp(a11, b3) < 0 ? a11 : b3;
      }
      function clipLine(doc, n10) {
        return Math.max(doc.first, Math.min(n10, doc.first + doc.size - 1));
      }
      function clipPos(doc, pos) {
        if (pos.line < doc.first) {
          return Pos(doc.first, 0);
        }
        var last = doc.first + doc.size - 1;
        if (pos.line > last) {
          return Pos(last, getLine(doc, last).text.length);
        }
        return clipToLen(pos, getLine(doc, pos.line).text.length);
      }
      function clipToLen(pos, linelen) {
        var ch = pos.ch;
        if (ch == null || ch > linelen) {
          return Pos(pos.line, linelen);
        } else if (ch < 0) {
          return Pos(pos.line, 0);
        } else {
          return pos;
        }
      }
      function clipPosArray(doc, array) {
        var out = [];
        for (var i11 = 0; i11 < array.length; i11++) {
          out[i11] = clipPos(doc, array[i11]);
        }
        return out;
      }
      var SavedContext = function(state, lookAhead) {
        this.state = state;
        this.lookAhead = lookAhead;
      };
      var Context = function(doc, state, line, lookAhead) {
        this.state = state;
        this.doc = doc;
        this.line = line;
        this.maxLookAhead = lookAhead || 0;
        this.baseTokens = null;
        this.baseTokenPos = 1;
      };
      Context.prototype.lookAhead = function(n10) {
        var line = this.doc.getLine(this.line + n10);
        if (line != null && n10 > this.maxLookAhead) {
          this.maxLookAhead = n10;
        }
        return line;
      };
      Context.prototype.baseToken = function(n10) {
        if (!this.baseTokens) {
          return null;
        }
        while (this.baseTokens[this.baseTokenPos] <= n10) {
          this.baseTokenPos += 2;
        }
        var type = this.baseTokens[this.baseTokenPos + 1];
        return {
          type: type && type.replace(/( |^)overlay .*/, ""),
          size: this.baseTokens[this.baseTokenPos] - n10
        };
      };
      Context.prototype.nextLine = function() {
        this.line++;
        if (this.maxLookAhead > 0) {
          this.maxLookAhead--;
        }
      };
      Context.fromSaved = function(doc, saved, line) {
        if (saved instanceof SavedContext) {
          return new Context(doc, copyState(doc.mode, saved.state), line, saved.lookAhead);
        } else {
          return new Context(doc, copyState(doc.mode, saved), line);
        }
      };
      Context.prototype.save = function(copy) {
        var state = copy !== false ? copyState(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new SavedContext(state, this.maxLookAhead) : state;
      };
      function highlightLine(cm, line, context, forceToEnd) {
        var st = [cm.state.modeGen], lineClasses = {};
        runMode(cm, line.text, cm.doc.mode, context, function(end, style) {
          return st.push(end, style);
        }, lineClasses, forceToEnd);
        var state = context.state;
        var loop = function(o13) {
          context.baseTokens = st;
          var overlay = cm.state.overlays[o13], i11 = 1, at = 0;
          context.state = true;
          runMode(cm, line.text, overlay.mode, context, function(end, style) {
            var start = i11;
            while (at < end) {
              var i_end = st[i11];
              if (i_end > end) {
                st.splice(i11, 1, end, st[i11 + 1], i_end);
              }
              i11 += 2;
              at = Math.min(end, i_end);
            }
            if (!style) {
              return;
            }
            if (overlay.opaque) {
              st.splice(start, i11 - start, end, "overlay " + style);
              i11 = start + 2;
            } else {
              for (; start < i11; start += 2) {
                var cur = st[start + 1];
                st[start + 1] = (cur ? cur + " " : "") + "overlay " + style;
              }
            }
          }, lineClasses);
          context.state = state;
          context.baseTokens = null;
          context.baseTokenPos = 1;
        };
        for (var o12 = 0; o12 < cm.state.overlays.length; ++o12)
          loop(o12);
        return { styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null };
      }
      function getLineStyles(cm, line, updateFrontier) {
        if (!line.styles || line.styles[0] != cm.state.modeGen) {
          var context = getContextBefore(cm, lineNo(line));
          var resetState = line.text.length > cm.options.maxHighlightLength && copyState(cm.doc.mode, context.state);
          var result = highlightLine(cm, line, context);
          if (resetState) {
            context.state = resetState;
          }
          line.stateAfter = context.save(!resetState);
          line.styles = result.styles;
          if (result.classes) {
            line.styleClasses = result.classes;
          } else if (line.styleClasses) {
            line.styleClasses = null;
          }
          if (updateFrontier === cm.doc.highlightFrontier) {
            cm.doc.modeFrontier = Math.max(cm.doc.modeFrontier, ++cm.doc.highlightFrontier);
          }
        }
        return line.styles;
      }
      function getContextBefore(cm, n10, precise) {
        var doc = cm.doc, display = cm.display;
        if (!doc.mode.startState) {
          return new Context(doc, true, n10);
        }
        var start = findStartLine(cm, n10, precise);
        var saved = start > doc.first && getLine(doc, start - 1).stateAfter;
        var context = saved ? Context.fromSaved(doc, saved, start) : new Context(doc, startState(doc.mode), start);
        doc.iter(start, n10, function(line) {
          processLine(cm, line.text, context);
          var pos = context.line;
          line.stateAfter = pos == n10 - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo ? context.save() : null;
          context.nextLine();
        });
        if (precise) {
          doc.modeFrontier = context.line;
        }
        return context;
      }
      function processLine(cm, text, context, startAt) {
        var mode = cm.doc.mode;
        var stream = new StringStream(text, cm.options.tabSize, context);
        stream.start = stream.pos = startAt || 0;
        if (text == "") {
          callBlankLine(mode, context.state);
        }
        while (!stream.eol()) {
          readToken(mode, stream, context.state);
          stream.start = stream.pos;
        }
      }
      function callBlankLine(mode, state) {
        if (mode.blankLine) {
          return mode.blankLine(state);
        }
        if (!mode.innerMode) {
          return;
        }
        var inner = innerMode(mode, state);
        if (inner.mode.blankLine) {
          return inner.mode.blankLine(inner.state);
        }
      }
      function readToken(mode, stream, state, inner) {
        for (var i11 = 0; i11 < 10; i11++) {
          if (inner) {
            inner[0] = innerMode(mode, state).mode;
          }
          var style = mode.token(stream, state);
          if (stream.pos > stream.start) {
            return style;
          }
        }
        throw new Error("Mode " + mode.name + " failed to advance stream.");
      }
      var Token = function(stream, type, state) {
        this.start = stream.start;
        this.end = stream.pos;
        this.string = stream.current();
        this.type = type || null;
        this.state = state;
      };
      function takeToken(cm, pos, precise, asArray) {
        var doc = cm.doc, mode = doc.mode, style;
        pos = clipPos(doc, pos);
        var line = getLine(doc, pos.line), context = getContextBefore(cm, pos.line, precise);
        var stream = new StringStream(line.text, cm.options.tabSize, context), tokens;
        if (asArray) {
          tokens = [];
        }
        while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
          stream.start = stream.pos;
          style = readToken(mode, stream, context.state);
          if (asArray) {
            tokens.push(new Token(stream, style, copyState(doc.mode, context.state)));
          }
        }
        return asArray ? tokens : new Token(stream, style, context.state);
      }
      function extractLineClasses(type, output) {
        if (type) {
          for (; ; ) {
            var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
            if (!lineClass) {
              break;
            }
            type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
            var prop2 = lineClass[1] ? "bgClass" : "textClass";
            if (output[prop2] == null) {
              output[prop2] = lineClass[2];
            } else if (!new RegExp("(?:^|\\s)" + lineClass[2] + "(?:$|\\s)").test(output[prop2])) {
              output[prop2] += " " + lineClass[2];
            }
          }
        }
        return type;
      }
      function runMode(cm, text, mode, context, f5, lineClasses, forceToEnd) {
        var flattenSpans = mode.flattenSpans;
        if (flattenSpans == null) {
          flattenSpans = cm.options.flattenSpans;
        }
        var curStart = 0, curStyle = null;
        var stream = new StringStream(text, cm.options.tabSize, context), style;
        var inner = cm.options.addModeClass && [null];
        if (text == "") {
          extractLineClasses(callBlankLine(mode, context.state), lineClasses);
        }
        while (!stream.eol()) {
          if (stream.pos > cm.options.maxHighlightLength) {
            flattenSpans = false;
            if (forceToEnd) {
              processLine(cm, text, context, stream.pos);
            }
            stream.pos = text.length;
            style = null;
          } else {
            style = extractLineClasses(readToken(mode, stream, context.state, inner), lineClasses);
          }
          if (inner) {
            var mName = inner[0].name;
            if (mName) {
              style = "m-" + (style ? mName + " " + style : mName);
            }
          }
          if (!flattenSpans || curStyle != style) {
            while (curStart < stream.start) {
              curStart = Math.min(stream.start, curStart + 5e3);
              f5(curStart, curStyle);
            }
            curStyle = style;
          }
          stream.start = stream.pos;
        }
        while (curStart < stream.pos) {
          var pos = Math.min(stream.pos, curStart + 5e3);
          f5(pos, curStyle);
          curStart = pos;
        }
      }
      function findStartLine(cm, n10, precise) {
        var minindent, minline, doc = cm.doc;
        var lim = precise ? -1 : n10 - (cm.doc.mode.innerMode ? 1e3 : 100);
        for (var search = n10; search > lim; --search) {
          if (search <= doc.first) {
            return doc.first;
          }
          var line = getLine(doc, search - 1), after = line.stateAfter;
          if (after && (!precise || search + (after instanceof SavedContext ? after.lookAhead : 0) <= doc.modeFrontier)) {
            return search;
          }
          var indented = countColumn(line.text, null, cm.options.tabSize);
          if (minline == null || minindent > indented) {
            minline = search - 1;
            minindent = indented;
          }
        }
        return minline;
      }
      function retreatFrontier(doc, n10) {
        doc.modeFrontier = Math.min(doc.modeFrontier, n10);
        if (doc.highlightFrontier < n10 - 10) {
          return;
        }
        var start = doc.first;
        for (var line = n10 - 1; line > start; line--) {
          var saved = getLine(doc, line).stateAfter;
          if (saved && (!(saved instanceof SavedContext) || line + saved.lookAhead < n10)) {
            start = line + 1;
            break;
          }
        }
        doc.highlightFrontier = Math.min(doc.highlightFrontier, start);
      }
      var sawReadOnlySpans = false, sawCollapsedSpans = false;
      function seeReadOnlySpans() {
        sawReadOnlySpans = true;
      }
      function seeCollapsedSpans() {
        sawCollapsedSpans = true;
      }
      function MarkedSpan(marker, from, to) {
        this.marker = marker;
        this.from = from;
        this.to = to;
      }
      function getMarkedSpanFor(spans, marker) {
        if (spans) {
          for (var i11 = 0; i11 < spans.length; ++i11) {
            var span = spans[i11];
            if (span.marker == marker) {
              return span;
            }
          }
        }
      }
      function removeMarkedSpan(spans, span) {
        var r7;
        for (var i11 = 0; i11 < spans.length; ++i11) {
          if (spans[i11] != span) {
            (r7 || (r7 = [])).push(spans[i11]);
          }
        }
        return r7;
      }
      function addMarkedSpan(line, span, op) {
        var inThisOp = op && window.WeakSet && (op.markedSpans || (op.markedSpans = new WeakSet()));
        if (inThisOp && inThisOp.has(line.markedSpans)) {
          line.markedSpans.push(span);
        } else {
          line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
          if (inThisOp) {
            inThisOp.add(line.markedSpans);
          }
        }
        span.marker.attachLine(line);
      }
      function markedSpansBefore(old, startCh, isInsert) {
        var nw;
        if (old) {
          for (var i11 = 0; i11 < old.length; ++i11) {
            var span = old[i11], marker = span.marker;
            var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
            if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
              var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
              (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
            }
          }
        }
        return nw;
      }
      function markedSpansAfter(old, endCh, isInsert) {
        var nw;
        if (old) {
          for (var i11 = 0; i11 < old.length; ++i11) {
            var span = old[i11], marker = span.marker;
            var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
            if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
              var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
              (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh, span.to == null ? null : span.to - endCh));
            }
          }
        }
        return nw;
      }
      function stretchSpansOverChange(doc, change) {
        if (change.full) {
          return null;
        }
        var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
        var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
        if (!oldFirst && !oldLast) {
          return null;
        }
        var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
        var first = markedSpansBefore(oldFirst, startCh, isInsert);
        var last = markedSpansAfter(oldLast, endCh, isInsert);
        var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
        if (first) {
          for (var i11 = 0; i11 < first.length; ++i11) {
            var span = first[i11];
            if (span.to == null) {
              var found = getMarkedSpanFor(last, span.marker);
              if (!found) {
                span.to = startCh;
              } else if (sameLine) {
                span.to = found.to == null ? null : found.to + offset;
              }
            }
          }
        }
        if (last) {
          for (var i$12 = 0; i$12 < last.length; ++i$12) {
            var span$1 = last[i$12];
            if (span$1.to != null) {
              span$1.to += offset;
            }
            if (span$1.from == null) {
              var found$1 = getMarkedSpanFor(first, span$1.marker);
              if (!found$1) {
                span$1.from = offset;
                if (sameLine) {
                  (first || (first = [])).push(span$1);
                }
              }
            } else {
              span$1.from += offset;
              if (sameLine) {
                (first || (first = [])).push(span$1);
              }
            }
          }
        }
        if (first) {
          first = clearEmptySpans(first);
        }
        if (last && last != first) {
          last = clearEmptySpans(last);
        }
        var newMarkers = [first];
        if (!sameLine) {
          var gap = change.text.length - 2, gapMarkers;
          if (gap > 0 && first) {
            for (var i$22 = 0; i$22 < first.length; ++i$22) {
              if (first[i$22].to == null) {
                (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i$22].marker, null, null));
              }
            }
          }
          for (var i$3 = 0; i$3 < gap; ++i$3) {
            newMarkers.push(gapMarkers);
          }
          newMarkers.push(last);
        }
        return newMarkers;
      }
      function clearEmptySpans(spans) {
        for (var i11 = 0; i11 < spans.length; ++i11) {
          var span = spans[i11];
          if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false) {
            spans.splice(i11--, 1);
          }
        }
        if (!spans.length) {
          return null;
        }
        return spans;
      }
      function removeReadOnlyRanges(doc, from, to) {
        var markers = null;
        doc.iter(from.line, to.line + 1, function(line) {
          if (line.markedSpans) {
            for (var i12 = 0; i12 < line.markedSpans.length; ++i12) {
              var mark = line.markedSpans[i12].marker;
              if (mark.readOnly && (!markers || indexOf(markers, mark) == -1)) {
                (markers || (markers = [])).push(mark);
              }
            }
          }
        });
        if (!markers) {
          return null;
        }
        var parts = [{ from, to }];
        for (var i11 = 0; i11 < markers.length; ++i11) {
          var mk = markers[i11], m4 = mk.find(0);
          for (var j2 = 0; j2 < parts.length; ++j2) {
            var p4 = parts[j2];
            if (cmp(p4.to, m4.from) < 0 || cmp(p4.from, m4.to) > 0) {
              continue;
            }
            var newParts = [j2, 1], dfrom = cmp(p4.from, m4.from), dto = cmp(p4.to, m4.to);
            if (dfrom < 0 || !mk.inclusiveLeft && !dfrom) {
              newParts.push({ from: p4.from, to: m4.from });
            }
            if (dto > 0 || !mk.inclusiveRight && !dto) {
              newParts.push({ from: m4.to, to: p4.to });
            }
            parts.splice.apply(parts, newParts);
            j2 += newParts.length - 3;
          }
        }
        return parts;
      }
      function detachMarkedSpans(line) {
        var spans = line.markedSpans;
        if (!spans) {
          return;
        }
        for (var i11 = 0; i11 < spans.length; ++i11) {
          spans[i11].marker.detachLine(line);
        }
        line.markedSpans = null;
      }
      function attachMarkedSpans(line, spans) {
        if (!spans) {
          return;
        }
        for (var i11 = 0; i11 < spans.length; ++i11) {
          spans[i11].marker.attachLine(line);
        }
        line.markedSpans = spans;
      }
      function extraLeft(marker) {
        return marker.inclusiveLeft ? -1 : 0;
      }
      function extraRight(marker) {
        return marker.inclusiveRight ? 1 : 0;
      }
      function compareCollapsedMarkers(a11, b3) {
        var lenDiff = a11.lines.length - b3.lines.length;
        if (lenDiff != 0) {
          return lenDiff;
        }
        var aPos = a11.find(), bPos = b3.find();
        var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a11) - extraLeft(b3);
        if (fromCmp) {
          return -fromCmp;
        }
        var toCmp = cmp(aPos.to, bPos.to) || extraRight(a11) - extraRight(b3);
        if (toCmp) {
          return toCmp;
        }
        return b3.id - a11.id;
      }
      function collapsedSpanAtSide(line, start) {
        var sps = sawCollapsedSpans && line.markedSpans, found;
        if (sps) {
          for (var sp = void 0, i11 = 0; i11 < sps.length; ++i11) {
            sp = sps[i11];
            if (sp.marker.collapsed && (start ? sp.from : sp.to) == null && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) {
              found = sp.marker;
            }
          }
        }
        return found;
      }
      function collapsedSpanAtStart(line) {
        return collapsedSpanAtSide(line, true);
      }
      function collapsedSpanAtEnd(line) {
        return collapsedSpanAtSide(line, false);
      }
      function collapsedSpanAround(line, ch) {
        var sps = sawCollapsedSpans && line.markedSpans, found;
        if (sps) {
          for (var i11 = 0; i11 < sps.length; ++i11) {
            var sp = sps[i11];
            if (sp.marker.collapsed && (sp.from == null || sp.from < ch) && (sp.to == null || sp.to > ch) && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) {
              found = sp.marker;
            }
          }
        }
        return found;
      }
      function conflictingCollapsedRange(doc, lineNo2, from, to, marker) {
        var line = getLine(doc, lineNo2);
        var sps = sawCollapsedSpans && line.markedSpans;
        if (sps) {
          for (var i11 = 0; i11 < sps.length; ++i11) {
            var sp = sps[i11];
            if (!sp.marker.collapsed) {
              continue;
            }
            var found = sp.marker.find(0);
            var fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
            var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
            if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) {
              continue;
            }
            if (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.to, from) >= 0 : cmp(found.to, from) > 0) || fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.from, to) <= 0 : cmp(found.from, to) < 0)) {
              return true;
            }
          }
        }
      }
      function visualLine(line) {
        var merged;
        while (merged = collapsedSpanAtStart(line)) {
          line = merged.find(-1, true).line;
        }
        return line;
      }
      function visualLineEnd(line) {
        var merged;
        while (merged = collapsedSpanAtEnd(line)) {
          line = merged.find(1, true).line;
        }
        return line;
      }
      function visualLineContinued(line) {
        var merged, lines;
        while (merged = collapsedSpanAtEnd(line)) {
          line = merged.find(1, true).line;
          (lines || (lines = [])).push(line);
        }
        return lines;
      }
      function visualLineNo(doc, lineN) {
        var line = getLine(doc, lineN), vis = visualLine(line);
        if (line == vis) {
          return lineN;
        }
        return lineNo(vis);
      }
      function visualLineEndNo(doc, lineN) {
        if (lineN > doc.lastLine()) {
          return lineN;
        }
        var line = getLine(doc, lineN), merged;
        if (!lineIsHidden(doc, line)) {
          return lineN;
        }
        while (merged = collapsedSpanAtEnd(line)) {
          line = merged.find(1, true).line;
        }
        return lineNo(line) + 1;
      }
      function lineIsHidden(doc, line) {
        var sps = sawCollapsedSpans && line.markedSpans;
        if (sps) {
          for (var sp = void 0, i11 = 0; i11 < sps.length; ++i11) {
            sp = sps[i11];
            if (!sp.marker.collapsed) {
              continue;
            }
            if (sp.from == null) {
              return true;
            }
            if (sp.marker.widgetNode) {
              continue;
            }
            if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp)) {
              return true;
            }
          }
        }
      }
      function lineIsHiddenInner(doc, line, span) {
        if (span.to == null) {
          var end = span.marker.find(1, true);
          return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
        }
        if (span.marker.inclusiveRight && span.to == line.text.length) {
          return true;
        }
        for (var sp = void 0, i11 = 0; i11 < line.markedSpans.length; ++i11) {
          sp = line.markedSpans[i11];
          if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to && (sp.to == null || sp.to != span.from) && (sp.marker.inclusiveLeft || span.marker.inclusiveRight) && lineIsHiddenInner(doc, line, sp)) {
            return true;
          }
        }
      }
      function heightAtLine(lineObj) {
        lineObj = visualLine(lineObj);
        var h5 = 0, chunk = lineObj.parent;
        for (var i11 = 0; i11 < chunk.lines.length; ++i11) {
          var line = chunk.lines[i11];
          if (line == lineObj) {
            break;
          } else {
            h5 += line.height;
          }
        }
        for (var p4 = chunk.parent; p4; chunk = p4, p4 = chunk.parent) {
          for (var i$12 = 0; i$12 < p4.children.length; ++i$12) {
            var cur = p4.children[i$12];
            if (cur == chunk) {
              break;
            } else {
              h5 += cur.height;
            }
          }
        }
        return h5;
      }
      function lineLength(line) {
        if (line.height == 0) {
          return 0;
        }
        var len = line.text.length, merged, cur = line;
        while (merged = collapsedSpanAtStart(cur)) {
          var found = merged.find(0, true);
          cur = found.from.line;
          len += found.from.ch - found.to.ch;
        }
        cur = line;
        while (merged = collapsedSpanAtEnd(cur)) {
          var found$1 = merged.find(0, true);
          len -= cur.text.length - found$1.from.ch;
          cur = found$1.to.line;
          len += cur.text.length - found$1.to.ch;
        }
        return len;
      }
      function findMaxLine(cm) {
        var d6 = cm.display, doc = cm.doc;
        d6.maxLine = getLine(doc, doc.first);
        d6.maxLineLength = lineLength(d6.maxLine);
        d6.maxLineChanged = true;
        doc.iter(function(line) {
          var len = lineLength(line);
          if (len > d6.maxLineLength) {
            d6.maxLineLength = len;
            d6.maxLine = line;
          }
        });
      }
      var Line = function(text, markedSpans, estimateHeight2) {
        this.text = text;
        attachMarkedSpans(this, markedSpans);
        this.height = estimateHeight2 ? estimateHeight2(this) : 1;
      };
      Line.prototype.lineNo = function() {
        return lineNo(this);
      };
      eventMixin(Line);
      function updateLine(line, text, markedSpans, estimateHeight2) {
        line.text = text;
        if (line.stateAfter) {
          line.stateAfter = null;
        }
        if (line.styles) {
          line.styles = null;
        }
        if (line.order != null) {
          line.order = null;
        }
        detachMarkedSpans(line);
        attachMarkedSpans(line, markedSpans);
        var estHeight = estimateHeight2 ? estimateHeight2(line) : 1;
        if (estHeight != line.height) {
          updateLineHeight(line, estHeight);
        }
      }
      function cleanUpLine(line) {
        line.parent = null;
        detachMarkedSpans(line);
      }
      var styleToClassCache = {}, styleToClassCacheWithMode = {};
      function interpretTokenStyle(style, options) {
        if (!style || /^\s*$/.test(style)) {
          return null;
        }
        var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
        return cache[style] || (cache[style] = style.replace(/\S+/g, "cm-$&"));
      }
      function buildLineContent(cm, lineView) {
        var content = eltP("span", null, null, webkit ? "padding-right: .1px" : null);
        var builder = {
          pre: eltP("pre", [content], "CodeMirror-line"),
          content,
          col: 0,
          pos: 0,
          cm,
          trailingSpace: false,
          splitSpaces: cm.getOption("lineWrapping")
        };
        lineView.measure = {};
        for (var i11 = 0; i11 <= (lineView.rest ? lineView.rest.length : 0); i11++) {
          var line = i11 ? lineView.rest[i11 - 1] : lineView.line, order = void 0;
          builder.pos = 0;
          builder.addToken = buildToken;
          if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line, cm.doc.direction))) {
            builder.addToken = buildTokenBadBidi(builder.addToken, order);
          }
          builder.map = [];
          var allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
          insertLineContent(line, builder, getLineStyles(cm, line, allowFrontierUpdate));
          if (line.styleClasses) {
            if (line.styleClasses.bgClass) {
              builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
            }
            if (line.styleClasses.textClass) {
              builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
            }
          }
          if (builder.map.length == 0) {
            builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure)));
          }
          if (i11 == 0) {
            lineView.measure.map = builder.map;
            lineView.measure.cache = {};
          } else {
            (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
            (lineView.measure.caches || (lineView.measure.caches = [])).push({});
          }
        }
        if (webkit) {
          var last = builder.content.lastChild;
          if (/\bcm-tab\b/.test(last.className) || last.querySelector && last.querySelector(".cm-tab")) {
            builder.content.className = "cm-tab-wrap-hack";
          }
        }
        signal(cm, "renderLine", cm, lineView.line, builder.pre);
        if (builder.pre.className) {
          builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");
        }
        return builder;
      }
      function defaultSpecialCharPlaceholder(ch) {
        var token = elt("span", "\u2022", "cm-invalidchar");
        token.title = "\\u" + ch.charCodeAt(0).toString(16);
        token.setAttribute("aria-label", token.title);
        return token;
      }
      function buildToken(builder, text, style, startStyle, endStyle, css, attributes) {
        if (!text) {
          return;
        }
        var displayText = builder.splitSpaces ? splitSpaces(text, builder.trailingSpace) : text;
        var special = builder.cm.state.specialChars, mustWrap = false;
        var content;
        if (!special.test(text)) {
          builder.col += text.length;
          content = document.createTextNode(displayText);
          builder.map.push(builder.pos, builder.pos + text.length, content);
          if (ie && ie_version < 9) {
            mustWrap = true;
          }
          builder.pos += text.length;
        } else {
          content = document.createDocumentFragment();
          var pos = 0;
          while (true) {
            special.lastIndex = pos;
            var m4 = special.exec(text);
            var skipped = m4 ? m4.index - pos : text.length - pos;
            if (skipped) {
              var txt = document.createTextNode(displayText.slice(pos, pos + skipped));
              if (ie && ie_version < 9) {
                content.appendChild(elt("span", [txt]));
              } else {
                content.appendChild(txt);
              }
              builder.map.push(builder.pos, builder.pos + skipped, txt);
              builder.col += skipped;
              builder.pos += skipped;
            }
            if (!m4) {
              break;
            }
            pos += skipped + 1;
            var txt$1 = void 0;
            if (m4[0] == "	") {
              var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
              txt$1 = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
              txt$1.setAttribute("role", "presentation");
              txt$1.setAttribute("cm-text", "	");
              builder.col += tabWidth;
            } else if (m4[0] == "\r" || m4[0] == "\n") {
              txt$1 = content.appendChild(elt("span", m4[0] == "\r" ? "\u240D" : "\u2424", "cm-invalidchar"));
              txt$1.setAttribute("cm-text", m4[0]);
              builder.col += 1;
            } else {
              txt$1 = builder.cm.options.specialCharPlaceholder(m4[0]);
              txt$1.setAttribute("cm-text", m4[0]);
              if (ie && ie_version < 9) {
                content.appendChild(elt("span", [txt$1]));
              } else {
                content.appendChild(txt$1);
              }
              builder.col += 1;
            }
            builder.map.push(builder.pos, builder.pos + 1, txt$1);
            builder.pos++;
          }
        }
        builder.trailingSpace = displayText.charCodeAt(text.length - 1) == 32;
        if (style || startStyle || endStyle || mustWrap || css || attributes) {
          var fullStyle = style || "";
          if (startStyle) {
            fullStyle += startStyle;
          }
          if (endStyle) {
            fullStyle += endStyle;
          }
          var token = elt("span", [content], fullStyle, css);
          if (attributes) {
            for (var attr in attributes) {
              if (attributes.hasOwnProperty(attr) && attr != "style" && attr != "class") {
                token.setAttribute(attr, attributes[attr]);
              }
            }
          }
          return builder.content.appendChild(token);
        }
        builder.content.appendChild(content);
      }
      function splitSpaces(text, trailingBefore) {
        if (text.length > 1 && !/  /.test(text)) {
          return text;
        }
        var spaceBefore = trailingBefore, result = "";
        for (var i11 = 0; i11 < text.length; i11++) {
          var ch = text.charAt(i11);
          if (ch == " " && spaceBefore && (i11 == text.length - 1 || text.charCodeAt(i11 + 1) == 32)) {
            ch = "\xA0";
          }
          result += ch;
          spaceBefore = ch == " ";
        }
        return result;
      }
      function buildTokenBadBidi(inner, order) {
        return function(builder, text, style, startStyle, endStyle, css, attributes) {
          style = style ? style + " cm-force-border" : "cm-force-border";
          var start = builder.pos, end = start + text.length;
          for (; ; ) {
            var part = void 0;
            for (var i11 = 0; i11 < order.length; i11++) {
              part = order[i11];
              if (part.to > start && part.from <= start) {
                break;
              }
            }
            if (part.to >= end) {
              return inner(builder, text, style, startStyle, endStyle, css, attributes);
            }
            inner(builder, text.slice(0, part.to - start), style, startStyle, null, css, attributes);
            startStyle = null;
            text = text.slice(part.to - start);
            start = part.to;
          }
        };
      }
      function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
        var widget = !ignoreWidget && marker.widgetNode;
        if (widget) {
          builder.map.push(builder.pos, builder.pos + size, widget);
        }
        if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
          if (!widget) {
            widget = builder.content.appendChild(document.createElement("span"));
          }
          widget.setAttribute("cm-marker", marker.id);
        }
        if (widget) {
          builder.cm.display.input.setUneditable(widget);
          builder.content.appendChild(widget);
        }
        builder.pos += size;
        builder.trailingSpace = false;
      }
      function insertLineContent(line, builder, styles) {
        var spans = line.markedSpans, allText = line.text, at = 0;
        if (!spans) {
          for (var i$12 = 1; i$12 < styles.length; i$12 += 2) {
            builder.addToken(builder, allText.slice(at, at = styles[i$12]), interpretTokenStyle(styles[i$12 + 1], builder.cm.options));
          }
          return;
        }
        var len = allText.length, pos = 0, i11 = 1, text = "", style, css;
        var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, collapsed, attributes;
        for (; ; ) {
          if (nextChange == pos) {
            spanStyle = spanEndStyle = spanStartStyle = css = "";
            attributes = null;
            collapsed = null;
            nextChange = Infinity;
            var foundBookmarks = [], endStyles = void 0;
            for (var j2 = 0; j2 < spans.length; ++j2) {
              var sp = spans[j2], m4 = sp.marker;
              if (m4.type == "bookmark" && sp.from == pos && m4.widgetNode) {
                foundBookmarks.push(m4);
              } else if (sp.from <= pos && (sp.to == null || sp.to > pos || m4.collapsed && sp.to == pos && sp.from == pos)) {
                if (sp.to != null && sp.to != pos && nextChange > sp.to) {
                  nextChange = sp.to;
                  spanEndStyle = "";
                }
                if (m4.className) {
                  spanStyle += " " + m4.className;
                }
                if (m4.css) {
                  css = (css ? css + ";" : "") + m4.css;
                }
                if (m4.startStyle && sp.from == pos) {
                  spanStartStyle += " " + m4.startStyle;
                }
                if (m4.endStyle && sp.to == nextChange) {
                  (endStyles || (endStyles = [])).push(m4.endStyle, sp.to);
                }
                if (m4.title) {
                  (attributes || (attributes = {})).title = m4.title;
                }
                if (m4.attributes) {
                  for (var attr in m4.attributes) {
                    (attributes || (attributes = {}))[attr] = m4.attributes[attr];
                  }
                }
                if (m4.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m4) < 0)) {
                  collapsed = sp;
                }
              } else if (sp.from > pos && nextChange > sp.from) {
                nextChange = sp.from;
              }
            }
            if (endStyles) {
              for (var j$1 = 0; j$1 < endStyles.length; j$1 += 2) {
                if (endStyles[j$1 + 1] == nextChange) {
                  spanEndStyle += " " + endStyles[j$1];
                }
              }
            }
            if (!collapsed || collapsed.from == pos) {
              for (var j$2 = 0; j$2 < foundBookmarks.length; ++j$2) {
                buildCollapsedSpan(builder, 0, foundBookmarks[j$2]);
              }
            }
            if (collapsed && (collapsed.from || 0) == pos) {
              buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos, collapsed.marker, collapsed.from == null);
              if (collapsed.to == null) {
                return;
              }
              if (collapsed.to == pos) {
                collapsed = false;
              }
            }
          }
          if (pos >= len) {
            break;
          }
          var upto = Math.min(len, nextChange);
          while (true) {
            if (text) {
              var end = pos + text.length;
              if (!collapsed) {
                var tokenText = end > upto ? text.slice(0, upto - pos) : text;
                builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle, spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", css, attributes);
              }
              if (end >= upto) {
                text = text.slice(upto - pos);
                pos = upto;
                break;
              }
              pos = end;
              spanStartStyle = "";
            }
            text = allText.slice(at, at = styles[i11++]);
            style = interpretTokenStyle(styles[i11++], builder.cm.options);
          }
        }
      }
      function LineView(doc, line, lineN) {
        this.line = line;
        this.rest = visualLineContinued(line);
        this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
        this.node = this.text = null;
        this.hidden = lineIsHidden(doc, line);
      }
      function buildViewArray(cm, from, to) {
        var array = [], nextPos;
        for (var pos = from; pos < to; pos = nextPos) {
          var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
          nextPos = pos + view.size;
          array.push(view);
        }
        return array;
      }
      var operationGroup = null;
      function pushOperation(op) {
        if (operationGroup) {
          operationGroup.ops.push(op);
        } else {
          op.ownsGroup = operationGroup = {
            ops: [op],
            delayedCallbacks: []
          };
        }
      }
      function fireCallbacksForOps(group) {
        var callbacks = group.delayedCallbacks, i11 = 0;
        do {
          for (; i11 < callbacks.length; i11++) {
            callbacks[i11].call(null);
          }
          for (var j2 = 0; j2 < group.ops.length; j2++) {
            var op = group.ops[j2];
            if (op.cursorActivityHandlers) {
              while (op.cursorActivityCalled < op.cursorActivityHandlers.length) {
                op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
              }
            }
          }
        } while (i11 < callbacks.length);
      }
      function finishOperation(op, endCb) {
        var group = op.ownsGroup;
        if (!group) {
          return;
        }
        try {
          fireCallbacksForOps(group);
        } finally {
          operationGroup = null;
          endCb(group);
        }
      }
      var orphanDelayedCallbacks = null;
      function signalLater(emitter, type) {
        var arr = getHandlers(emitter, type);
        if (!arr.length) {
          return;
        }
        var args = Array.prototype.slice.call(arguments, 2), list;
        if (operationGroup) {
          list = operationGroup.delayedCallbacks;
        } else if (orphanDelayedCallbacks) {
          list = orphanDelayedCallbacks;
        } else {
          list = orphanDelayedCallbacks = [];
          setTimeout(fireOrphanDelayed, 0);
        }
        var loop = function(i12) {
          list.push(function() {
            return arr[i12].apply(null, args);
          });
        };
        for (var i11 = 0; i11 < arr.length; ++i11)
          loop(i11);
      }
      function fireOrphanDelayed() {
        var delayed = orphanDelayedCallbacks;
        orphanDelayedCallbacks = null;
        for (var i11 = 0; i11 < delayed.length; ++i11) {
          delayed[i11]();
        }
      }
      function updateLineForChanges(cm, lineView, lineN, dims) {
        for (var j2 = 0; j2 < lineView.changes.length; j2++) {
          var type = lineView.changes[j2];
          if (type == "text") {
            updateLineText(cm, lineView);
          } else if (type == "gutter") {
            updateLineGutter(cm, lineView, lineN, dims);
          } else if (type == "class") {
            updateLineClasses(cm, lineView);
          } else if (type == "widget") {
            updateLineWidgets(cm, lineView, dims);
          }
        }
        lineView.changes = null;
      }
      function ensureLineWrapped(lineView) {
        if (lineView.node == lineView.text) {
          lineView.node = elt("div", null, null, "position: relative");
          if (lineView.text.parentNode) {
            lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
          }
          lineView.node.appendChild(lineView.text);
          if (ie && ie_version < 8) {
            lineView.node.style.zIndex = 2;
          }
        }
        return lineView.node;
      }
      function updateLineBackground(cm, lineView) {
        var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
        if (cls) {
          cls += " CodeMirror-linebackground";
        }
        if (lineView.background) {
          if (cls) {
            lineView.background.className = cls;
          } else {
            lineView.background.parentNode.removeChild(lineView.background);
            lineView.background = null;
          }
        } else if (cls) {
          var wrap = ensureLineWrapped(lineView);
          lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
          cm.display.input.setUneditable(lineView.background);
        }
      }
      function getLineContent(cm, lineView) {
        var ext = cm.display.externalMeasured;
        if (ext && ext.line == lineView.line) {
          cm.display.externalMeasured = null;
          lineView.measure = ext.measure;
          return ext.built;
        }
        return buildLineContent(cm, lineView);
      }
      function updateLineText(cm, lineView) {
        var cls = lineView.text.className;
        var built = getLineContent(cm, lineView);
        if (lineView.text == lineView.node) {
          lineView.node = built.pre;
        }
        lineView.text.parentNode.replaceChild(built.pre, lineView.text);
        lineView.text = built.pre;
        if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
          lineView.bgClass = built.bgClass;
          lineView.textClass = built.textClass;
          updateLineClasses(cm, lineView);
        } else if (cls) {
          lineView.text.className = cls;
        }
      }
      function updateLineClasses(cm, lineView) {
        updateLineBackground(cm, lineView);
        if (lineView.line.wrapClass) {
          ensureLineWrapped(lineView).className = lineView.line.wrapClass;
        } else if (lineView.node != lineView.text) {
          lineView.node.className = "";
        }
        var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
        lineView.text.className = textClass || "";
      }
      function updateLineGutter(cm, lineView, lineN, dims) {
        if (lineView.gutter) {
          lineView.node.removeChild(lineView.gutter);
          lineView.gutter = null;
        }
        if (lineView.gutterBackground) {
          lineView.node.removeChild(lineView.gutterBackground);
          lineView.gutterBackground = null;
        }
        if (lineView.line.gutterClass) {
          var wrap = ensureLineWrapped(lineView);
          lineView.gutterBackground = elt("div", null, "CodeMirror-gutter-background " + lineView.line.gutterClass, "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px; width: " + dims.gutterTotalWidth + "px");
          cm.display.input.setUneditable(lineView.gutterBackground);
          wrap.insertBefore(lineView.gutterBackground, lineView.text);
        }
        var markers = lineView.line.gutterMarkers;
        if (cm.options.lineNumbers || markers) {
          var wrap$1 = ensureLineWrapped(lineView);
          var gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px");
          gutterWrap.setAttribute("aria-hidden", "true");
          cm.display.input.setUneditable(gutterWrap);
          wrap$1.insertBefore(gutterWrap, lineView.text);
          if (lineView.line.gutterClass) {
            gutterWrap.className += " " + lineView.line.gutterClass;
          }
          if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"])) {
            lineView.lineNumber = gutterWrap.appendChild(elt("div", lineNumberFor(cm.options, lineN), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + cm.display.lineNumInnerWidth + "px"));
          }
          if (markers) {
            for (var k2 = 0; k2 < cm.display.gutterSpecs.length; ++k2) {
              var id = cm.display.gutterSpecs[k2].className, found = markers.hasOwnProperty(id) && markers[id];
              if (found) {
                gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " + dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
              }
            }
          }
        }
      }
      function updateLineWidgets(cm, lineView, dims) {
        if (lineView.alignable) {
          lineView.alignable = null;
        }
        var isWidget = classTest("CodeMirror-linewidget");
        for (var node = lineView.node.firstChild, next = void 0; node; node = next) {
          next = node.nextSibling;
          if (isWidget.test(node.className)) {
            lineView.node.removeChild(node);
          }
        }
        insertLineWidgets(cm, lineView, dims);
      }
      function buildLineElement(cm, lineView, lineN, dims) {
        var built = getLineContent(cm, lineView);
        lineView.text = lineView.node = built.pre;
        if (built.bgClass) {
          lineView.bgClass = built.bgClass;
        }
        if (built.textClass) {
          lineView.textClass = built.textClass;
        }
        updateLineClasses(cm, lineView);
        updateLineGutter(cm, lineView, lineN, dims);
        insertLineWidgets(cm, lineView, dims);
        return lineView.node;
      }
      function insertLineWidgets(cm, lineView, dims) {
        insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
        if (lineView.rest) {
          for (var i11 = 0; i11 < lineView.rest.length; i11++) {
            insertLineWidgetsFor(cm, lineView.rest[i11], lineView, dims, false);
          }
        }
      }
      function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
        if (!line.widgets) {
          return;
        }
        var wrap = ensureLineWrapped(lineView);
        for (var i11 = 0, ws = line.widgets; i11 < ws.length; ++i11) {
          var widget = ws[i11], node = elt("div", [widget.node], "CodeMirror-linewidget" + (widget.className ? " " + widget.className : ""));
          if (!widget.handleMouseEvents) {
            node.setAttribute("cm-ignore-events", "true");
          }
          positionLineWidget(widget, node, lineView, dims);
          cm.display.input.setUneditable(node);
          if (allowAbove && widget.above) {
            wrap.insertBefore(node, lineView.gutter || lineView.text);
          } else {
            wrap.appendChild(node);
          }
          signalLater(widget, "redraw");
        }
      }
      function positionLineWidget(widget, node, lineView, dims) {
        if (widget.noHScroll) {
          (lineView.alignable || (lineView.alignable = [])).push(node);
          var width = dims.wrapperWidth;
          node.style.left = dims.fixedPos + "px";
          if (!widget.coverGutter) {
            width -= dims.gutterTotalWidth;
            node.style.paddingLeft = dims.gutterTotalWidth + "px";
          }
          node.style.width = width + "px";
        }
        if (widget.coverGutter) {
          node.style.zIndex = 5;
          node.style.position = "relative";
          if (!widget.noHScroll) {
            node.style.marginLeft = -dims.gutterTotalWidth + "px";
          }
        }
      }
      function widgetHeight(widget) {
        if (widget.height != null) {
          return widget.height;
        }
        var cm = widget.doc.cm;
        if (!cm) {
          return 0;
        }
        if (!contains(document.body, widget.node)) {
          var parentStyle = "position: relative;";
          if (widget.coverGutter) {
            parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;";
          }
          if (widget.noHScroll) {
            parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;";
          }
          removeChildrenAndAdd(cm.display.measure, elt("div", [widget.node], null, parentStyle));
        }
        return widget.height = widget.node.parentNode.offsetHeight;
      }
      function eventInWidget(display, e4) {
        for (var n10 = e_target(e4); n10 != display.wrapper; n10 = n10.parentNode) {
          if (!n10 || n10.nodeType == 1 && n10.getAttribute("cm-ignore-events") == "true" || n10.parentNode == display.sizer && n10 != display.mover) {
            return true;
          }
        }
      }
      function paddingTop(display) {
        return display.lineSpace.offsetTop;
      }
      function paddingVert(display) {
        return display.mover.offsetHeight - display.lineSpace.offsetHeight;
      }
      function paddingH(display) {
        if (display.cachedPaddingH) {
          return display.cachedPaddingH;
        }
        var e4 = removeChildrenAndAdd(display.measure, elt("pre", "x", "CodeMirror-line-like"));
        var style = window.getComputedStyle ? window.getComputedStyle(e4) : e4.currentStyle;
        var data = { left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight) };
        if (!isNaN(data.left) && !isNaN(data.right)) {
          display.cachedPaddingH = data;
        }
        return data;
      }
      function scrollGap(cm) {
        return scrollerGap - cm.display.nativeBarWidth;
      }
      function displayWidth(cm) {
        return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
      }
      function displayHeight(cm) {
        return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
      }
      function ensureLineHeights(cm, lineView, rect) {
        var wrapping = cm.options.lineWrapping;
        var curWidth = wrapping && displayWidth(cm);
        if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
          var heights = lineView.measure.heights = [];
          if (wrapping) {
            lineView.measure.width = curWidth;
            var rects = lineView.text.firstChild.getClientRects();
            for (var i11 = 0; i11 < rects.length - 1; i11++) {
              var cur = rects[i11], next = rects[i11 + 1];
              if (Math.abs(cur.bottom - next.bottom) > 2) {
                heights.push((cur.bottom + next.top) / 2 - rect.top);
              }
            }
          }
          heights.push(rect.bottom - rect.top);
        }
      }
      function mapFromLineView(lineView, line, lineN) {
        if (lineView.line == line) {
          return { map: lineView.measure.map, cache: lineView.measure.cache };
        }
        for (var i11 = 0; i11 < lineView.rest.length; i11++) {
          if (lineView.rest[i11] == line) {
            return { map: lineView.measure.maps[i11], cache: lineView.measure.caches[i11] };
          }
        }
        for (var i$12 = 0; i$12 < lineView.rest.length; i$12++) {
          if (lineNo(lineView.rest[i$12]) > lineN) {
            return { map: lineView.measure.maps[i$12], cache: lineView.measure.caches[i$12], before: true };
          }
        }
      }
      function updateExternalMeasurement(cm, line) {
        line = visualLine(line);
        var lineN = lineNo(line);
        var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
        view.lineN = lineN;
        var built = view.built = buildLineContent(cm, view);
        view.text = built.pre;
        removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
        return view;
      }
      function measureChar(cm, line, ch, bias) {
        return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
      }
      function findViewForLine(cm, lineN) {
        if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo) {
          return cm.display.view[findViewIndex(cm, lineN)];
        }
        var ext = cm.display.externalMeasured;
        if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size) {
          return ext;
        }
      }
      function prepareMeasureForLine(cm, line) {
        var lineN = lineNo(line);
        var view = findViewForLine(cm, lineN);
        if (view && !view.text) {
          view = null;
        } else if (view && view.changes) {
          updateLineForChanges(cm, view, lineN, getDimensions(cm));
          cm.curOp.forceUpdate = true;
        }
        if (!view) {
          view = updateExternalMeasurement(cm, line);
        }
        var info = mapFromLineView(view, line, lineN);
        return {
          line,
          view,
          rect: null,
          map: info.map,
          cache: info.cache,
          before: info.before,
          hasHeights: false
        };
      }
      function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
        if (prepared.before) {
          ch = -1;
        }
        var key = ch + (bias || ""), found;
        if (prepared.cache.hasOwnProperty(key)) {
          found = prepared.cache[key];
        } else {
          if (!prepared.rect) {
            prepared.rect = prepared.view.text.getBoundingClientRect();
          }
          if (!prepared.hasHeights) {
            ensureLineHeights(cm, prepared.view, prepared.rect);
            prepared.hasHeights = true;
          }
          found = measureCharInner(cm, prepared, ch, bias);
          if (!found.bogus) {
            prepared.cache[key] = found;
          }
        }
        return {
          left: found.left,
          right: found.right,
          top: varHeight ? found.rtop : found.top,
          bottom: varHeight ? found.rbottom : found.bottom
        };
      }
      var nullRect = { left: 0, right: 0, top: 0, bottom: 0 };
      function nodeAndOffsetInLineMap(map2, ch, bias) {
        var node, start, end, collapse, mStart, mEnd;
        for (var i11 = 0; i11 < map2.length; i11 += 3) {
          mStart = map2[i11];
          mEnd = map2[i11 + 1];
          if (ch < mStart) {
            start = 0;
            end = 1;
            collapse = "left";
          } else if (ch < mEnd) {
            start = ch - mStart;
            end = start + 1;
          } else if (i11 == map2.length - 3 || ch == mEnd && map2[i11 + 3] > ch) {
            end = mEnd - mStart;
            start = end - 1;
            if (ch >= mEnd) {
              collapse = "right";
            }
          }
          if (start != null) {
            node = map2[i11 + 2];
            if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right")) {
              collapse = bias;
            }
            if (bias == "left" && start == 0) {
              while (i11 && map2[i11 - 2] == map2[i11 - 3] && map2[i11 - 1].insertLeft) {
                node = map2[(i11 -= 3) + 2];
                collapse = "left";
              }
            }
            if (bias == "right" && start == mEnd - mStart) {
              while (i11 < map2.length - 3 && map2[i11 + 3] == map2[i11 + 4] && !map2[i11 + 5].insertLeft) {
                node = map2[(i11 += 3) + 2];
                collapse = "right";
              }
            }
            break;
          }
        }
        return { node, start, end, collapse, coverStart: mStart, coverEnd: mEnd };
      }
      function getUsefulRect(rects, bias) {
        var rect = nullRect;
        if (bias == "left") {
          for (var i11 = 0; i11 < rects.length; i11++) {
            if ((rect = rects[i11]).left != rect.right) {
              break;
            }
          }
        } else {
          for (var i$12 = rects.length - 1; i$12 >= 0; i$12--) {
            if ((rect = rects[i$12]).left != rect.right) {
              break;
            }
          }
        }
        return rect;
      }
      function measureCharInner(cm, prepared, ch, bias) {
        var place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
        var node = place.node, start = place.start, end = place.end, collapse = place.collapse;
        var rect;
        if (node.nodeType == 3) {
          for (var i$12 = 0; i$12 < 4; i$12++) {
            while (start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start))) {
              --start;
            }
            while (place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end))) {
              ++end;
            }
            if (ie && ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart) {
              rect = node.parentNode.getBoundingClientRect();
            } else {
              rect = getUsefulRect(range(node, start, end).getClientRects(), bias);
            }
            if (rect.left || rect.right || start == 0) {
              break;
            }
            end = start;
            start = start - 1;
            collapse = "right";
          }
          if (ie && ie_version < 11) {
            rect = maybeUpdateRectForZooming(cm.display.measure, rect);
          }
        } else {
          if (start > 0) {
            collapse = bias = "right";
          }
          var rects;
          if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1) {
            rect = rects[bias == "right" ? rects.length - 1 : 0];
          } else {
            rect = node.getBoundingClientRect();
          }
        }
        if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
          var rSpan = node.parentNode.getClientRects()[0];
          if (rSpan) {
            rect = { left: rSpan.left, right: rSpan.left + charWidth(cm.display), top: rSpan.top, bottom: rSpan.bottom };
          } else {
            rect = nullRect;
          }
        }
        var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
        var mid = (rtop + rbot) / 2;
        var heights = prepared.view.measure.heights;
        var i11 = 0;
        for (; i11 < heights.length - 1; i11++) {
          if (mid < heights[i11]) {
            break;
          }
        }
        var top = i11 ? heights[i11 - 1] : 0, bot = heights[i11];
        var result = {
          left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
          right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
          top,
          bottom: bot
        };
        if (!rect.left && !rect.right) {
          result.bogus = true;
        }
        if (!cm.options.singleCursorHeightPerLine) {
          result.rtop = rtop;
          result.rbottom = rbot;
        }
        return result;
      }
      function maybeUpdateRectForZooming(measure, rect) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure)) {
          return rect;
        }
        var scaleX = screen.logicalXDPI / screen.deviceXDPI;
        var scaleY = screen.logicalYDPI / screen.deviceYDPI;
        return {
          left: rect.left * scaleX,
          right: rect.right * scaleX,
          top: rect.top * scaleY,
          bottom: rect.bottom * scaleY
        };
      }
      function clearLineMeasurementCacheFor(lineView) {
        if (lineView.measure) {
          lineView.measure.cache = {};
          lineView.measure.heights = null;
          if (lineView.rest) {
            for (var i11 = 0; i11 < lineView.rest.length; i11++) {
              lineView.measure.caches[i11] = {};
            }
          }
        }
      }
      function clearLineMeasurementCache(cm) {
        cm.display.externalMeasure = null;
        removeChildren(cm.display.lineMeasure);
        for (var i11 = 0; i11 < cm.display.view.length; i11++) {
          clearLineMeasurementCacheFor(cm.display.view[i11]);
        }
      }
      function clearCaches(cm) {
        clearLineMeasurementCache(cm);
        cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
        if (!cm.options.lineWrapping) {
          cm.display.maxLineChanged = true;
        }
        cm.display.lineNumChars = null;
      }
      function pageScrollX() {
        if (chrome && android) {
          return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft));
        }
        return window.pageXOffset || (document.documentElement || document.body).scrollLeft;
      }
      function pageScrollY() {
        if (chrome && android) {
          return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop));
        }
        return window.pageYOffset || (document.documentElement || document.body).scrollTop;
      }
      function widgetTopHeight(lineObj) {
        var height = 0;
        if (lineObj.widgets) {
          for (var i11 = 0; i11 < lineObj.widgets.length; ++i11) {
            if (lineObj.widgets[i11].above) {
              height += widgetHeight(lineObj.widgets[i11]);
            }
          }
        }
        return height;
      }
      function intoCoordSystem(cm, lineObj, rect, context, includeWidgets) {
        if (!includeWidgets) {
          var height = widgetTopHeight(lineObj);
          rect.top += height;
          rect.bottom += height;
        }
        if (context == "line") {
          return rect;
        }
        if (!context) {
          context = "local";
        }
        var yOff = heightAtLine(lineObj);
        if (context == "local") {
          yOff += paddingTop(cm.display);
        } else {
          yOff -= cm.display.viewOffset;
        }
        if (context == "page" || context == "window") {
          var lOff = cm.display.lineSpace.getBoundingClientRect();
          yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
          var xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
          rect.left += xOff;
          rect.right += xOff;
        }
        rect.top += yOff;
        rect.bottom += yOff;
        return rect;
      }
      function fromCoordSystem(cm, coords, context) {
        if (context == "div") {
          return coords;
        }
        var left = coords.left, top = coords.top;
        if (context == "page") {
          left -= pageScrollX();
          top -= pageScrollY();
        } else if (context == "local" || !context) {
          var localBox = cm.display.sizer.getBoundingClientRect();
          left += localBox.left;
          top += localBox.top;
        }
        var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
        return { left: left - lineSpaceBox.left, top: top - lineSpaceBox.top };
      }
      function charCoords(cm, pos, context, lineObj, bias) {
        if (!lineObj) {
          lineObj = getLine(cm.doc, pos.line);
        }
        return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
      }
      function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
        lineObj = lineObj || getLine(cm.doc, pos.line);
        if (!preparedMeasure) {
          preparedMeasure = prepareMeasureForLine(cm, lineObj);
        }
        function get(ch2, right) {
          var m4 = measureCharPrepared(cm, preparedMeasure, ch2, right ? "right" : "left", varHeight);
          if (right) {
            m4.left = m4.right;
          } else {
            m4.right = m4.left;
          }
          return intoCoordSystem(cm, lineObj, m4, context);
        }
        var order = getOrder(lineObj, cm.doc.direction), ch = pos.ch, sticky = pos.sticky;
        if (ch >= lineObj.text.length) {
          ch = lineObj.text.length;
          sticky = "before";
        } else if (ch <= 0) {
          ch = 0;
          sticky = "after";
        }
        if (!order) {
          return get(sticky == "before" ? ch - 1 : ch, sticky == "before");
        }
        function getBidi(ch2, partPos2, invert) {
          var part = order[partPos2], right = part.level == 1;
          return get(invert ? ch2 - 1 : ch2, right != invert);
        }
        var partPos = getBidiPartAt(order, ch, sticky);
        var other = bidiOther;
        var val = getBidi(ch, partPos, sticky == "before");
        if (other != null) {
          val.other = getBidi(ch, other, sticky != "before");
        }
        return val;
      }
      function estimateCoords(cm, pos) {
        var left = 0;
        pos = clipPos(cm.doc, pos);
        if (!cm.options.lineWrapping) {
          left = charWidth(cm.display) * pos.ch;
        }
        var lineObj = getLine(cm.doc, pos.line);
        var top = heightAtLine(lineObj) + paddingTop(cm.display);
        return { left, right: left, top, bottom: top + lineObj.height };
      }
      function PosWithInfo(line, ch, sticky, outside, xRel) {
        var pos = Pos(line, ch, sticky);
        pos.xRel = xRel;
        if (outside) {
          pos.outside = outside;
        }
        return pos;
      }
      function coordsChar(cm, x2, y3) {
        var doc = cm.doc;
        y3 += cm.display.viewOffset;
        if (y3 < 0) {
          return PosWithInfo(doc.first, 0, null, -1, -1);
        }
        var lineN = lineAtHeight(doc, y3), last = doc.first + doc.size - 1;
        if (lineN > last) {
          return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, null, 1, 1);
        }
        if (x2 < 0) {
          x2 = 0;
        }
        var lineObj = getLine(doc, lineN);
        for (; ; ) {
          var found = coordsCharInner(cm, lineObj, lineN, x2, y3);
          var collapsed = collapsedSpanAround(lineObj, found.ch + (found.xRel > 0 || found.outside > 0 ? 1 : 0));
          if (!collapsed) {
            return found;
          }
          var rangeEnd = collapsed.find(1);
          if (rangeEnd.line == lineN) {
            return rangeEnd;
          }
          lineObj = getLine(doc, lineN = rangeEnd.line);
        }
      }
      function wrappedLineExtent(cm, lineObj, preparedMeasure, y3) {
        y3 -= widgetTopHeight(lineObj);
        var end = lineObj.text.length;
        var begin = findFirst(function(ch) {
          return measureCharPrepared(cm, preparedMeasure, ch - 1).bottom <= y3;
        }, end, 0);
        end = findFirst(function(ch) {
          return measureCharPrepared(cm, preparedMeasure, ch).top > y3;
        }, begin, end);
        return { begin, end };
      }
      function wrappedLineExtentChar(cm, lineObj, preparedMeasure, target) {
        if (!preparedMeasure) {
          preparedMeasure = prepareMeasureForLine(cm, lineObj);
        }
        var targetTop = intoCoordSystem(cm, lineObj, measureCharPrepared(cm, preparedMeasure, target), "line").top;
        return wrappedLineExtent(cm, lineObj, preparedMeasure, targetTop);
      }
      function boxIsAfter(box, x2, y3, left) {
        return box.bottom <= y3 ? false : box.top > y3 ? true : (left ? box.left : box.right) > x2;
      }
      function coordsCharInner(cm, lineObj, lineNo2, x2, y3) {
        y3 -= heightAtLine(lineObj);
        var preparedMeasure = prepareMeasureForLine(cm, lineObj);
        var widgetHeight2 = widgetTopHeight(lineObj);
        var begin = 0, end = lineObj.text.length, ltr = true;
        var order = getOrder(lineObj, cm.doc.direction);
        if (order) {
          var part = (cm.options.lineWrapping ? coordsBidiPartWrapped : coordsBidiPart)(cm, lineObj, lineNo2, preparedMeasure, order, x2, y3);
          ltr = part.level != 1;
          begin = ltr ? part.from : part.to - 1;
          end = ltr ? part.to : part.from - 1;
        }
        var chAround = null, boxAround = null;
        var ch = findFirst(function(ch2) {
          var box = measureCharPrepared(cm, preparedMeasure, ch2);
          box.top += widgetHeight2;
          box.bottom += widgetHeight2;
          if (!boxIsAfter(box, x2, y3, false)) {
            return false;
          }
          if (box.top <= y3 && box.left <= x2) {
            chAround = ch2;
            boxAround = box;
          }
          return true;
        }, begin, end);
        var baseX, sticky, outside = false;
        if (boxAround) {
          var atLeft = x2 - boxAround.left < boxAround.right - x2, atStart = atLeft == ltr;
          ch = chAround + (atStart ? 0 : 1);
          sticky = atStart ? "after" : "before";
          baseX = atLeft ? boxAround.left : boxAround.right;
        } else {
          if (!ltr && (ch == end || ch == begin)) {
            ch++;
          }
          sticky = ch == 0 ? "after" : ch == lineObj.text.length ? "before" : measureCharPrepared(cm, preparedMeasure, ch - (ltr ? 1 : 0)).bottom + widgetHeight2 <= y3 == ltr ? "after" : "before";
          var coords = cursorCoords(cm, Pos(lineNo2, ch, sticky), "line", lineObj, preparedMeasure);
          baseX = coords.left;
          outside = y3 < coords.top ? -1 : y3 >= coords.bottom ? 1 : 0;
        }
        ch = skipExtendingChars(lineObj.text, ch, 1);
        return PosWithInfo(lineNo2, ch, sticky, outside, x2 - baseX);
      }
      function coordsBidiPart(cm, lineObj, lineNo2, preparedMeasure, order, x2, y3) {
        var index = findFirst(function(i11) {
          var part2 = order[i11], ltr2 = part2.level != 1;
          return boxIsAfter(cursorCoords(cm, Pos(lineNo2, ltr2 ? part2.to : part2.from, ltr2 ? "before" : "after"), "line", lineObj, preparedMeasure), x2, y3, true);
        }, 0, order.length - 1);
        var part = order[index];
        if (index > 0) {
          var ltr = part.level != 1;
          var start = cursorCoords(cm, Pos(lineNo2, ltr ? part.from : part.to, ltr ? "after" : "before"), "line", lineObj, preparedMeasure);
          if (boxIsAfter(start, x2, y3, true) && start.top > y3) {
            part = order[index - 1];
          }
        }
        return part;
      }
      function coordsBidiPartWrapped(cm, lineObj, _lineNo, preparedMeasure, order, x2, y3) {
        var ref = wrappedLineExtent(cm, lineObj, preparedMeasure, y3);
        var begin = ref.begin;
        var end = ref.end;
        if (/\s/.test(lineObj.text.charAt(end - 1))) {
          end--;
        }
        var part = null, closestDist = null;
        for (var i11 = 0; i11 < order.length; i11++) {
          var p4 = order[i11];
          if (p4.from >= end || p4.to <= begin) {
            continue;
          }
          var ltr = p4.level != 1;
          var endX = measureCharPrepared(cm, preparedMeasure, ltr ? Math.min(end, p4.to) - 1 : Math.max(begin, p4.from)).right;
          var dist = endX < x2 ? x2 - endX + 1e9 : endX - x2;
          if (!part || closestDist > dist) {
            part = p4;
            closestDist = dist;
          }
        }
        if (!part) {
          part = order[order.length - 1];
        }
        if (part.from < begin) {
          part = { from: begin, to: part.to, level: part.level };
        }
        if (part.to > end) {
          part = { from: part.from, to: end, level: part.level };
        }
        return part;
      }
      var measureText;
      function textHeight(display) {
        if (display.cachedTextHeight != null) {
          return display.cachedTextHeight;
        }
        if (measureText == null) {
          measureText = elt("pre", null, "CodeMirror-line-like");
          for (var i11 = 0; i11 < 49; ++i11) {
            measureText.appendChild(document.createTextNode("x"));
            measureText.appendChild(elt("br"));
          }
          measureText.appendChild(document.createTextNode("x"));
        }
        removeChildrenAndAdd(display.measure, measureText);
        var height = measureText.offsetHeight / 50;
        if (height > 3) {
          display.cachedTextHeight = height;
        }
        removeChildren(display.measure);
        return height || 1;
      }
      function charWidth(display) {
        if (display.cachedCharWidth != null) {
          return display.cachedCharWidth;
        }
        var anchor = elt("span", "xxxxxxxxxx");
        var pre = elt("pre", [anchor], "CodeMirror-line-like");
        removeChildrenAndAdd(display.measure, pre);
        var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
        if (width > 2) {
          display.cachedCharWidth = width;
        }
        return width || 10;
      }
      function getDimensions(cm) {
        var d6 = cm.display, left = {}, width = {};
        var gutterLeft = d6.gutters.clientLeft;
        for (var n10 = d6.gutters.firstChild, i11 = 0; n10; n10 = n10.nextSibling, ++i11) {
          var id = cm.display.gutterSpecs[i11].className;
          left[id] = n10.offsetLeft + n10.clientLeft + gutterLeft;
          width[id] = n10.clientWidth;
        }
        return {
          fixedPos: compensateForHScroll(d6),
          gutterTotalWidth: d6.gutters.offsetWidth,
          gutterLeft: left,
          gutterWidth: width,
          wrapperWidth: d6.wrapper.clientWidth
        };
      }
      function compensateForHScroll(display) {
        return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
      }
      function estimateHeight(cm) {
        var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
        var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
        return function(line) {
          if (lineIsHidden(cm.doc, line)) {
            return 0;
          }
          var widgetsHeight = 0;
          if (line.widgets) {
            for (var i11 = 0; i11 < line.widgets.length; i11++) {
              if (line.widgets[i11].height) {
                widgetsHeight += line.widgets[i11].height;
              }
            }
          }
          if (wrapping) {
            return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
          } else {
            return widgetsHeight + th;
          }
        };
      }
      function estimateLineHeights(cm) {
        var doc = cm.doc, est = estimateHeight(cm);
        doc.iter(function(line) {
          var estHeight = est(line);
          if (estHeight != line.height) {
            updateLineHeight(line, estHeight);
          }
        });
      }
      function posFromMouse(cm, e4, liberal, forRect) {
        var display = cm.display;
        if (!liberal && e_target(e4).getAttribute("cm-not-content") == "true") {
          return null;
        }
        var x2, y3, space = display.lineSpace.getBoundingClientRect();
        try {
          x2 = e4.clientX - space.left;
          y3 = e4.clientY - space.top;
        } catch (e$1) {
          return null;
        }
        var coords = coordsChar(cm, x2, y3), line;
        if (forRect && coords.xRel > 0 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
          var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
          coords = Pos(coords.line, Math.max(0, Math.round((x2 - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
        }
        return coords;
      }
      function findViewIndex(cm, n10) {
        if (n10 >= cm.display.viewTo) {
          return null;
        }
        n10 -= cm.display.viewFrom;
        if (n10 < 0) {
          return null;
        }
        var view = cm.display.view;
        for (var i11 = 0; i11 < view.length; i11++) {
          n10 -= view[i11].size;
          if (n10 < 0) {
            return i11;
          }
        }
      }
      function regChange(cm, from, to, lendiff) {
        if (from == null) {
          from = cm.doc.first;
        }
        if (to == null) {
          to = cm.doc.first + cm.doc.size;
        }
        if (!lendiff) {
          lendiff = 0;
        }
        var display = cm.display;
        if (lendiff && to < display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers > from)) {
          display.updateLineNumbers = from;
        }
        cm.curOp.viewChanged = true;
        if (from >= display.viewTo) {
          if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo) {
            resetView(cm);
          }
        } else if (to <= display.viewFrom) {
          if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
            resetView(cm);
          } else {
            display.viewFrom += lendiff;
            display.viewTo += lendiff;
          }
        } else if (from <= display.viewFrom && to >= display.viewTo) {
          resetView(cm);
        } else if (from <= display.viewFrom) {
          var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
          if (cut) {
            display.view = display.view.slice(cut.index);
            display.viewFrom = cut.lineN;
            display.viewTo += lendiff;
          } else {
            resetView(cm);
          }
        } else if (to >= display.viewTo) {
          var cut$1 = viewCuttingPoint(cm, from, from, -1);
          if (cut$1) {
            display.view = display.view.slice(0, cut$1.index);
            display.viewTo = cut$1.lineN;
          } else {
            resetView(cm);
          }
        } else {
          var cutTop = viewCuttingPoint(cm, from, from, -1);
          var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
          if (cutTop && cutBot) {
            display.view = display.view.slice(0, cutTop.index).concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN)).concat(display.view.slice(cutBot.index));
            display.viewTo += lendiff;
          } else {
            resetView(cm);
          }
        }
        var ext = display.externalMeasured;
        if (ext) {
          if (to < ext.lineN) {
            ext.lineN += lendiff;
          } else if (from < ext.lineN + ext.size) {
            display.externalMeasured = null;
          }
        }
      }
      function regLineChange(cm, line, type) {
        cm.curOp.viewChanged = true;
        var display = cm.display, ext = cm.display.externalMeasured;
        if (ext && line >= ext.lineN && line < ext.lineN + ext.size) {
          display.externalMeasured = null;
        }
        if (line < display.viewFrom || line >= display.viewTo) {
          return;
        }
        var lineView = display.view[findViewIndex(cm, line)];
        if (lineView.node == null) {
          return;
        }
        var arr = lineView.changes || (lineView.changes = []);
        if (indexOf(arr, type) == -1) {
          arr.push(type);
        }
      }
      function resetView(cm) {
        cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
        cm.display.view = [];
        cm.display.viewOffset = 0;
      }
      function viewCuttingPoint(cm, oldN, newN, dir) {
        var index = findViewIndex(cm, oldN), diff, view = cm.display.view;
        if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size) {
          return { index, lineN: newN };
        }
        var n10 = cm.display.viewFrom;
        for (var i11 = 0; i11 < index; i11++) {
          n10 += view[i11].size;
        }
        if (n10 != oldN) {
          if (dir > 0) {
            if (index == view.length - 1) {
              return null;
            }
            diff = n10 + view[index].size - oldN;
            index++;
          } else {
            diff = n10 - oldN;
          }
          oldN += diff;
          newN += diff;
        }
        while (visualLineNo(cm.doc, newN) != newN) {
          if (index == (dir < 0 ? 0 : view.length - 1)) {
            return null;
          }
          newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
          index += dir;
        }
        return { index, lineN: newN };
      }
      function adjustView(cm, from, to) {
        var display = cm.display, view = display.view;
        if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
          display.view = buildViewArray(cm, from, to);
          display.viewFrom = from;
        } else {
          if (display.viewFrom > from) {
            display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view);
          } else if (display.viewFrom < from) {
            display.view = display.view.slice(findViewIndex(cm, from));
          }
          display.viewFrom = from;
          if (display.viewTo < to) {
            display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));
          } else if (display.viewTo > to) {
            display.view = display.view.slice(0, findViewIndex(cm, to));
          }
        }
        display.viewTo = to;
      }
      function countDirtyView(cm) {
        var view = cm.display.view, dirty = 0;
        for (var i11 = 0; i11 < view.length; i11++) {
          var lineView = view[i11];
          if (!lineView.hidden && (!lineView.node || lineView.changes)) {
            ++dirty;
          }
        }
        return dirty;
      }
      function updateSelection(cm) {
        cm.display.input.showSelection(cm.display.input.prepareSelection());
      }
      function prepareSelection(cm, primary) {
        if (primary === void 0)
          primary = true;
        var doc = cm.doc, result = {};
        var curFragment = result.cursors = document.createDocumentFragment();
        var selFragment = result.selection = document.createDocumentFragment();
        for (var i11 = 0; i11 < doc.sel.ranges.length; i11++) {
          if (!primary && i11 == doc.sel.primIndex) {
            continue;
          }
          var range2 = doc.sel.ranges[i11];
          if (range2.from().line >= cm.display.viewTo || range2.to().line < cm.display.viewFrom) {
            continue;
          }
          var collapsed = range2.empty();
          if (collapsed || cm.options.showCursorWhenSelecting) {
            drawSelectionCursor(cm, range2.head, curFragment);
          }
          if (!collapsed) {
            drawSelectionRange(cm, range2, selFragment);
          }
        }
        return result;
      }
      function drawSelectionCursor(cm, head, output) {
        var pos = cursorCoords(cm, head, "div", null, null, !cm.options.singleCursorHeightPerLine);
        var cursor = output.appendChild(elt("div", "\xA0", "CodeMirror-cursor"));
        cursor.style.left = pos.left + "px";
        cursor.style.top = pos.top + "px";
        cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";
        if (/\bcm-fat-cursor\b/.test(cm.getWrapperElement().className)) {
          var charPos = charCoords(cm, head, "div", null, null);
          if (charPos.right - charPos.left > 0) {
            cursor.style.width = charPos.right - charPos.left + "px";
          }
        }
        if (pos.other) {
          var otherCursor = output.appendChild(elt("div", "\xA0", "CodeMirror-cursor CodeMirror-secondarycursor"));
          otherCursor.style.display = "";
          otherCursor.style.left = pos.other.left + "px";
          otherCursor.style.top = pos.other.top + "px";
          otherCursor.style.height = (pos.other.bottom - pos.other.top) * 0.85 + "px";
        }
      }
      function cmpCoords(a11, b3) {
        return a11.top - b3.top || a11.left - b3.left;
      }
      function drawSelectionRange(cm, range2, output) {
        var display = cm.display, doc = cm.doc;
        var fragment = document.createDocumentFragment();
        var padding = paddingH(cm.display), leftSide = padding.left;
        var rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right;
        var docLTR = doc.direction == "ltr";
        function add(left, top, width, bottom) {
          if (top < 0) {
            top = 0;
          }
          top = Math.round(top);
          bottom = Math.round(bottom);
          fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left + "px;\n                             top: " + top + "px; width: " + (width == null ? rightSide - left : width) + "px;\n                             height: " + (bottom - top) + "px"));
        }
        function drawForLine(line, fromArg, toArg) {
          var lineObj = getLine(doc, line);
          var lineLen = lineObj.text.length;
          var start, end;
          function coords(ch, bias) {
            return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
          }
          function wrapX(pos, dir, side) {
            var extent = wrappedLineExtentChar(cm, lineObj, null, pos);
            var prop2 = dir == "ltr" == (side == "after") ? "left" : "right";
            var ch = side == "after" ? extent.begin : extent.end - (/\s/.test(lineObj.text.charAt(extent.end - 1)) ? 2 : 1);
            return coords(ch, prop2)[prop2];
          }
          var order = getOrder(lineObj, doc.direction);
          iterateBidiSections(order, fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir, i11) {
            var ltr = dir == "ltr";
            var fromPos = coords(from, ltr ? "left" : "right");
            var toPos = coords(to - 1, ltr ? "right" : "left");
            var openStart = fromArg == null && from == 0, openEnd = toArg == null && to == lineLen;
            var first = i11 == 0, last = !order || i11 == order.length - 1;
            if (toPos.top - fromPos.top <= 3) {
              var openLeft = (docLTR ? openStart : openEnd) && first;
              var openRight = (docLTR ? openEnd : openStart) && last;
              var left = openLeft ? leftSide : (ltr ? fromPos : toPos).left;
              var right = openRight ? rightSide : (ltr ? toPos : fromPos).right;
              add(left, fromPos.top, right - left, fromPos.bottom);
            } else {
              var topLeft, topRight, botLeft, botRight;
              if (ltr) {
                topLeft = docLTR && openStart && first ? leftSide : fromPos.left;
                topRight = docLTR ? rightSide : wrapX(from, dir, "before");
                botLeft = docLTR ? leftSide : wrapX(to, dir, "after");
                botRight = docLTR && openEnd && last ? rightSide : toPos.right;
              } else {
                topLeft = !docLTR ? leftSide : wrapX(from, dir, "before");
                topRight = !docLTR && openStart && first ? rightSide : fromPos.right;
                botLeft = !docLTR && openEnd && last ? leftSide : toPos.left;
                botRight = !docLTR ? rightSide : wrapX(to, dir, "after");
              }
              add(topLeft, fromPos.top, topRight - topLeft, fromPos.bottom);
              if (fromPos.bottom < toPos.top) {
                add(leftSide, fromPos.bottom, null, toPos.top);
              }
              add(botLeft, toPos.top, botRight - botLeft, toPos.bottom);
            }
            if (!start || cmpCoords(fromPos, start) < 0) {
              start = fromPos;
            }
            if (cmpCoords(toPos, start) < 0) {
              start = toPos;
            }
            if (!end || cmpCoords(fromPos, end) < 0) {
              end = fromPos;
            }
            if (cmpCoords(toPos, end) < 0) {
              end = toPos;
            }
          });
          return { start, end };
        }
        var sFrom = range2.from(), sTo = range2.to();
        if (sFrom.line == sTo.line) {
          drawForLine(sFrom.line, sFrom.ch, sTo.ch);
        } else {
          var fromLine = getLine(doc, sFrom.line), toLine = getLine(doc, sTo.line);
          var singleVLine = visualLine(fromLine) == visualLine(toLine);
          var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
          var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
          if (singleVLine) {
            if (leftEnd.top < rightStart.top - 2) {
              add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
              add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
            } else {
              add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
            }
          }
          if (leftEnd.bottom < rightStart.top) {
            add(leftSide, leftEnd.bottom, null, rightStart.top);
          }
        }
        output.appendChild(fragment);
      }
      function restartBlink(cm) {
        if (!cm.state.focused) {
          return;
        }
        var display = cm.display;
        clearInterval(display.blinker);
        var on2 = true;
        display.cursorDiv.style.visibility = "";
        if (cm.options.cursorBlinkRate > 0) {
          display.blinker = setInterval(function() {
            if (!cm.hasFocus()) {
              onBlur(cm);
            }
            display.cursorDiv.style.visibility = (on2 = !on2) ? "" : "hidden";
          }, cm.options.cursorBlinkRate);
        } else if (cm.options.cursorBlinkRate < 0) {
          display.cursorDiv.style.visibility = "hidden";
        }
      }
      function ensureFocus(cm) {
        if (!cm.hasFocus()) {
          cm.display.input.focus();
          if (!cm.state.focused) {
            onFocus(cm);
          }
        }
      }
      function delayBlurEvent(cm) {
        cm.state.delayingBlurEvent = true;
        setTimeout(function() {
          if (cm.state.delayingBlurEvent) {
            cm.state.delayingBlurEvent = false;
            if (cm.state.focused) {
              onBlur(cm);
            }
          }
        }, 100);
      }
      function onFocus(cm, e4) {
        if (cm.state.delayingBlurEvent && !cm.state.draggingText) {
          cm.state.delayingBlurEvent = false;
        }
        if (cm.options.readOnly == "nocursor") {
          return;
        }
        if (!cm.state.focused) {
          signal(cm, "focus", cm, e4);
          cm.state.focused = true;
          addClass(cm.display.wrapper, "CodeMirror-focused");
          if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
            cm.display.input.reset();
            if (webkit) {
              setTimeout(function() {
                return cm.display.input.reset(true);
              }, 20);
            }
          }
          cm.display.input.receivedFocus();
        }
        restartBlink(cm);
      }
      function onBlur(cm, e4) {
        if (cm.state.delayingBlurEvent) {
          return;
        }
        if (cm.state.focused) {
          signal(cm, "blur", cm, e4);
          cm.state.focused = false;
          rmClass(cm.display.wrapper, "CodeMirror-focused");
        }
        clearInterval(cm.display.blinker);
        setTimeout(function() {
          if (!cm.state.focused) {
            cm.display.shift = false;
          }
        }, 150);
      }
      function updateHeightsInViewport(cm) {
        var display = cm.display;
        var prevBottom = display.lineDiv.offsetTop;
        var viewTop = Math.max(0, display.scroller.getBoundingClientRect().top);
        var oldHeight = display.lineDiv.getBoundingClientRect().top;
        var mustScroll = 0;
        for (var i11 = 0; i11 < display.view.length; i11++) {
          var cur = display.view[i11], wrapping = cm.options.lineWrapping;
          var height = void 0, width = 0;
          if (cur.hidden) {
            continue;
          }
          oldHeight += cur.line.height;
          if (ie && ie_version < 8) {
            var bot = cur.node.offsetTop + cur.node.offsetHeight;
            height = bot - prevBottom;
            prevBottom = bot;
          } else {
            var box = cur.node.getBoundingClientRect();
            height = box.bottom - box.top;
            if (!wrapping && cur.text.firstChild) {
              width = cur.text.firstChild.getBoundingClientRect().right - box.left - 1;
            }
          }
          var diff = cur.line.height - height;
          if (diff > 5e-3 || diff < -5e-3) {
            if (oldHeight < viewTop) {
              mustScroll -= diff;
            }
            updateLineHeight(cur.line, height);
            updateWidgetHeight(cur.line);
            if (cur.rest) {
              for (var j2 = 0; j2 < cur.rest.length; j2++) {
                updateWidgetHeight(cur.rest[j2]);
              }
            }
          }
          if (width > cm.display.sizerWidth) {
            var chWidth = Math.ceil(width / charWidth(cm.display));
            if (chWidth > cm.display.maxLineLength) {
              cm.display.maxLineLength = chWidth;
              cm.display.maxLine = cur.line;
              cm.display.maxLineChanged = true;
            }
          }
        }
        if (Math.abs(mustScroll) > 2) {
          display.scroller.scrollTop += mustScroll;
        }
      }
      function updateWidgetHeight(line) {
        if (line.widgets) {
          for (var i11 = 0; i11 < line.widgets.length; ++i11) {
            var w3 = line.widgets[i11], parent = w3.node.parentNode;
            if (parent) {
              w3.height = parent.offsetHeight;
            }
          }
        }
      }
      function visibleLines(display, doc, viewport) {
        var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
        top = Math.floor(top - paddingTop(display));
        var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;
        var from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
        if (viewport && viewport.ensure) {
          var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
          if (ensureFrom < from) {
            from = ensureFrom;
            to = lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
          } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
            from = lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight);
            to = ensureTo;
          }
        }
        return { from, to: Math.max(to, from + 1) };
      }
      function maybeScrollWindow(cm, rect) {
        if (signalDOMEvent(cm, "scrollCursorIntoView")) {
          return;
        }
        var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
        if (rect.top + box.top < 0) {
          doScroll = true;
        } else if (rect.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) {
          doScroll = false;
        }
        if (doScroll != null && !phantom) {
          var scrollNode = elt("div", "\u200B", null, "position: absolute;\n                         top: " + (rect.top - display.viewOffset - paddingTop(cm.display)) + "px;\n                         height: " + (rect.bottom - rect.top + scrollGap(cm) + display.barHeight) + "px;\n                         left: " + rect.left + "px; width: " + Math.max(2, rect.right - rect.left) + "px;");
          cm.display.lineSpace.appendChild(scrollNode);
          scrollNode.scrollIntoView(doScroll);
          cm.display.lineSpace.removeChild(scrollNode);
        }
      }
      function scrollPosIntoView(cm, pos, end, margin) {
        if (margin == null) {
          margin = 0;
        }
        var rect;
        if (!cm.options.lineWrapping && pos == end) {
          end = pos.sticky == "before" ? Pos(pos.line, pos.ch + 1, "before") : pos;
          pos = pos.ch ? Pos(pos.line, pos.sticky == "before" ? pos.ch - 1 : pos.ch, "after") : pos;
        }
        for (var limit = 0; limit < 5; limit++) {
          var changed = false;
          var coords = cursorCoords(cm, pos);
          var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
          rect = {
            left: Math.min(coords.left, endCoords.left),
            top: Math.min(coords.top, endCoords.top) - margin,
            right: Math.max(coords.left, endCoords.left),
            bottom: Math.max(coords.bottom, endCoords.bottom) + margin
          };
          var scrollPos = calculateScrollPos(cm, rect);
          var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
          if (scrollPos.scrollTop != null) {
            updateScrollTop(cm, scrollPos.scrollTop);
            if (Math.abs(cm.doc.scrollTop - startTop) > 1) {
              changed = true;
            }
          }
          if (scrollPos.scrollLeft != null) {
            setScrollLeft(cm, scrollPos.scrollLeft);
            if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) {
              changed = true;
            }
          }
          if (!changed) {
            break;
          }
        }
        return rect;
      }
      function scrollIntoView(cm, rect) {
        var scrollPos = calculateScrollPos(cm, rect);
        if (scrollPos.scrollTop != null) {
          updateScrollTop(cm, scrollPos.scrollTop);
        }
        if (scrollPos.scrollLeft != null) {
          setScrollLeft(cm, scrollPos.scrollLeft);
        }
      }
      function calculateScrollPos(cm, rect) {
        var display = cm.display, snapMargin = textHeight(cm.display);
        if (rect.top < 0) {
          rect.top = 0;
        }
        var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
        var screen2 = displayHeight(cm), result = {};
        if (rect.bottom - rect.top > screen2) {
          rect.bottom = rect.top + screen2;
        }
        var docBottom = cm.doc.height + paddingVert(display);
        var atTop = rect.top < snapMargin, atBottom = rect.bottom > docBottom - snapMargin;
        if (rect.top < screentop) {
          result.scrollTop = atTop ? 0 : rect.top;
        } else if (rect.bottom > screentop + screen2) {
          var newTop = Math.min(rect.top, (atBottom ? docBottom : rect.bottom) - screen2);
          if (newTop != screentop) {
            result.scrollTop = newTop;
          }
        }
        var gutterSpace = cm.options.fixedGutter ? 0 : display.gutters.offsetWidth;
        var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft - gutterSpace;
        var screenw = displayWidth(cm) - display.gutters.offsetWidth;
        var tooWide = rect.right - rect.left > screenw;
        if (tooWide) {
          rect.right = rect.left + screenw;
        }
        if (rect.left < 10) {
          result.scrollLeft = 0;
        } else if (rect.left < screenleft) {
          result.scrollLeft = Math.max(0, rect.left + gutterSpace - (tooWide ? 0 : 10));
        } else if (rect.right > screenw + screenleft - 3) {
          result.scrollLeft = rect.right + (tooWide ? 0 : 10) - screenw;
        }
        return result;
      }
      function addToScrollTop(cm, top) {
        if (top == null) {
          return;
        }
        resolveScrollToPos(cm);
        cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
      }
      function ensureCursorVisible(cm) {
        resolveScrollToPos(cm);
        var cur = cm.getCursor();
        cm.curOp.scrollToPos = { from: cur, to: cur, margin: cm.options.cursorScrollMargin };
      }
      function scrollToCoords(cm, x2, y3) {
        if (x2 != null || y3 != null) {
          resolveScrollToPos(cm);
        }
        if (x2 != null) {
          cm.curOp.scrollLeft = x2;
        }
        if (y3 != null) {
          cm.curOp.scrollTop = y3;
        }
      }
      function scrollToRange(cm, range2) {
        resolveScrollToPos(cm);
        cm.curOp.scrollToPos = range2;
      }
      function resolveScrollToPos(cm) {
        var range2 = cm.curOp.scrollToPos;
        if (range2) {
          cm.curOp.scrollToPos = null;
          var from = estimateCoords(cm, range2.from), to = estimateCoords(cm, range2.to);
          scrollToCoordsRange(cm, from, to, range2.margin);
        }
      }
      function scrollToCoordsRange(cm, from, to, margin) {
        var sPos = calculateScrollPos(cm, {
          left: Math.min(from.left, to.left),
          top: Math.min(from.top, to.top) - margin,
          right: Math.max(from.right, to.right),
          bottom: Math.max(from.bottom, to.bottom) + margin
        });
        scrollToCoords(cm, sPos.scrollLeft, sPos.scrollTop);
      }
      function updateScrollTop(cm, val) {
        if (Math.abs(cm.doc.scrollTop - val) < 2) {
          return;
        }
        if (!gecko) {
          updateDisplaySimple(cm, { top: val });
        }
        setScrollTop(cm, val, true);
        if (gecko) {
          updateDisplaySimple(cm);
        }
        startWorker(cm, 100);
      }
      function setScrollTop(cm, val, forceScroll) {
        val = Math.max(0, Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, val));
        if (cm.display.scroller.scrollTop == val && !forceScroll) {
          return;
        }
        cm.doc.scrollTop = val;
        cm.display.scrollbars.setScrollTop(val);
        if (cm.display.scroller.scrollTop != val) {
          cm.display.scroller.scrollTop = val;
        }
      }
      function setScrollLeft(cm, val, isScroller, forceScroll) {
        val = Math.max(0, Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth));
        if ((isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) && !forceScroll) {
          return;
        }
        cm.doc.scrollLeft = val;
        alignHorizontally(cm);
        if (cm.display.scroller.scrollLeft != val) {
          cm.display.scroller.scrollLeft = val;
        }
        cm.display.scrollbars.setScrollLeft(val);
      }
      function measureForScrollbars(cm) {
        var d6 = cm.display, gutterW = d6.gutters.offsetWidth;
        var docH = Math.round(cm.doc.height + paddingVert(cm.display));
        return {
          clientHeight: d6.scroller.clientHeight,
          viewHeight: d6.wrapper.clientHeight,
          scrollWidth: d6.scroller.scrollWidth,
          clientWidth: d6.scroller.clientWidth,
          viewWidth: d6.wrapper.clientWidth,
          barLeft: cm.options.fixedGutter ? gutterW : 0,
          docHeight: docH,
          scrollHeight: docH + scrollGap(cm) + d6.barHeight,
          nativeBarWidth: d6.nativeBarWidth,
          gutterWidth: gutterW
        };
      }
      var NativeScrollbars = function(place, scroll, cm) {
        this.cm = cm;
        var vert = this.vert = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
        var horiz = this.horiz = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
        vert.tabIndex = horiz.tabIndex = -1;
        place(vert);
        place(horiz);
        on(vert, "scroll", function() {
          if (vert.clientHeight) {
            scroll(vert.scrollTop, "vertical");
          }
        });
        on(horiz, "scroll", function() {
          if (horiz.clientWidth) {
            scroll(horiz.scrollLeft, "horizontal");
          }
        });
        this.checkedZeroWidth = false;
        if (ie && ie_version < 8) {
          this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
        }
      };
      NativeScrollbars.prototype.update = function(measure) {
        var needsH = measure.scrollWidth > measure.clientWidth + 1;
        var needsV = measure.scrollHeight > measure.clientHeight + 1;
        var sWidth = measure.nativeBarWidth;
        if (needsV) {
          this.vert.style.display = "block";
          this.vert.style.bottom = needsH ? sWidth + "px" : "0";
          var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
          this.vert.firstChild.style.height = Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
        } else {
          this.vert.style.display = "";
          this.vert.firstChild.style.height = "0";
        }
        if (needsH) {
          this.horiz.style.display = "block";
          this.horiz.style.right = needsV ? sWidth + "px" : "0";
          this.horiz.style.left = measure.barLeft + "px";
          var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
          this.horiz.firstChild.style.width = Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
        } else {
          this.horiz.style.display = "";
          this.horiz.firstChild.style.width = "0";
        }
        if (!this.checkedZeroWidth && measure.clientHeight > 0) {
          if (sWidth == 0) {
            this.zeroWidthHack();
          }
          this.checkedZeroWidth = true;
        }
        return { right: needsV ? sWidth : 0, bottom: needsH ? sWidth : 0 };
      };
      NativeScrollbars.prototype.setScrollLeft = function(pos) {
        if (this.horiz.scrollLeft != pos) {
          this.horiz.scrollLeft = pos;
        }
        if (this.disableHoriz) {
          this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
        }
      };
      NativeScrollbars.prototype.setScrollTop = function(pos) {
        if (this.vert.scrollTop != pos) {
          this.vert.scrollTop = pos;
        }
        if (this.disableVert) {
          this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
        }
      };
      NativeScrollbars.prototype.zeroWidthHack = function() {
        var w3 = mac && !mac_geMountainLion ? "12px" : "18px";
        this.horiz.style.height = this.vert.style.width = w3;
        this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
        this.disableHoriz = new Delayed();
        this.disableVert = new Delayed();
      };
      NativeScrollbars.prototype.enableZeroWidthBar = function(bar, delay, type) {
        bar.style.pointerEvents = "auto";
        function maybeDisable() {
          var box = bar.getBoundingClientRect();
          var elt2 = type == "vert" ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2) : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
          if (elt2 != bar) {
            bar.style.pointerEvents = "none";
          } else {
            delay.set(1e3, maybeDisable);
          }
        }
        delay.set(1e3, maybeDisable);
      };
      NativeScrollbars.prototype.clear = function() {
        var parent = this.horiz.parentNode;
        parent.removeChild(this.horiz);
        parent.removeChild(this.vert);
      };
      var NullScrollbars = function() {
      };
      NullScrollbars.prototype.update = function() {
        return { bottom: 0, right: 0 };
      };
      NullScrollbars.prototype.setScrollLeft = function() {
      };
      NullScrollbars.prototype.setScrollTop = function() {
      };
      NullScrollbars.prototype.clear = function() {
      };
      function updateScrollbars(cm, measure) {
        if (!measure) {
          measure = measureForScrollbars(cm);
        }
        var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
        updateScrollbarsInner(cm, measure);
        for (var i11 = 0; i11 < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i11++) {
          if (startWidth != cm.display.barWidth && cm.options.lineWrapping) {
            updateHeightsInViewport(cm);
          }
          updateScrollbarsInner(cm, measureForScrollbars(cm));
          startWidth = cm.display.barWidth;
          startHeight = cm.display.barHeight;
        }
      }
      function updateScrollbarsInner(cm, measure) {
        var d6 = cm.display;
        var sizes = d6.scrollbars.update(measure);
        d6.sizer.style.paddingRight = (d6.barWidth = sizes.right) + "px";
        d6.sizer.style.paddingBottom = (d6.barHeight = sizes.bottom) + "px";
        d6.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent";
        if (sizes.right && sizes.bottom) {
          d6.scrollbarFiller.style.display = "block";
          d6.scrollbarFiller.style.height = sizes.bottom + "px";
          d6.scrollbarFiller.style.width = sizes.right + "px";
        } else {
          d6.scrollbarFiller.style.display = "";
        }
        if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
          d6.gutterFiller.style.display = "block";
          d6.gutterFiller.style.height = sizes.bottom + "px";
          d6.gutterFiller.style.width = measure.gutterWidth + "px";
        } else {
          d6.gutterFiller.style.display = "";
        }
      }
      var scrollbarModel = { "native": NativeScrollbars, "null": NullScrollbars };
      function initScrollbars(cm) {
        if (cm.display.scrollbars) {
          cm.display.scrollbars.clear();
          if (cm.display.scrollbars.addClass) {
            rmClass(cm.display.wrapper, cm.display.scrollbars.addClass);
          }
        }
        cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](function(node) {
          cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
          on(node, "mousedown", function() {
            if (cm.state.focused) {
              setTimeout(function() {
                return cm.display.input.focus();
              }, 0);
            }
          });
          node.setAttribute("cm-not-content", "true");
        }, function(pos, axis) {
          if (axis == "horizontal") {
            setScrollLeft(cm, pos);
          } else {
            updateScrollTop(cm, pos);
          }
        }, cm);
        if (cm.display.scrollbars.addClass) {
          addClass(cm.display.wrapper, cm.display.scrollbars.addClass);
        }
      }
      var nextOpId = 0;
      function startOperation(cm) {
        cm.curOp = {
          cm,
          viewChanged: false,
          startHeight: cm.doc.height,
          forceUpdate: false,
          updateInput: 0,
          typing: false,
          changeObjs: null,
          cursorActivityHandlers: null,
          cursorActivityCalled: 0,
          selectionChanged: false,
          updateMaxLine: false,
          scrollLeft: null,
          scrollTop: null,
          scrollToPos: null,
          focus: false,
          id: ++nextOpId,
          markArrays: null
        };
        pushOperation(cm.curOp);
      }
      function endOperation(cm) {
        var op = cm.curOp;
        if (op) {
          finishOperation(op, function(group) {
            for (var i11 = 0; i11 < group.ops.length; i11++) {
              group.ops[i11].cm.curOp = null;
            }
            endOperations(group);
          });
        }
      }
      function endOperations(group) {
        var ops = group.ops;
        for (var i11 = 0; i11 < ops.length; i11++) {
          endOperation_R1(ops[i11]);
        }
        for (var i$12 = 0; i$12 < ops.length; i$12++) {
          endOperation_W1(ops[i$12]);
        }
        for (var i$22 = 0; i$22 < ops.length; i$22++) {
          endOperation_R2(ops[i$22]);
        }
        for (var i$3 = 0; i$3 < ops.length; i$3++) {
          endOperation_W2(ops[i$3]);
        }
        for (var i$4 = 0; i$4 < ops.length; i$4++) {
          endOperation_finish(ops[i$4]);
        }
      }
      function endOperation_R1(op) {
        var cm = op.cm, display = cm.display;
        maybeClipScrollbars(cm);
        if (op.updateMaxLine) {
          findMaxLine(cm);
        }
        op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null || op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom || op.scrollToPos.to.line >= display.viewTo) || display.maxLineChanged && cm.options.lineWrapping;
        op.update = op.mustUpdate && new DisplayUpdate(cm, op.mustUpdate && { top: op.scrollTop, ensure: op.scrollToPos }, op.forceUpdate);
      }
      function endOperation_W1(op) {
        op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
      }
      function endOperation_R2(op) {
        var cm = op.cm, display = cm.display;
        if (op.updatedDisplay) {
          updateHeightsInViewport(cm);
        }
        op.barMeasure = measureForScrollbars(cm);
        if (display.maxLineChanged && !cm.options.lineWrapping) {
          op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
          cm.display.sizerWidth = op.adjustWidthTo;
          op.barMeasure.scrollWidth = Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
          op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
        }
        if (op.updatedDisplay || op.selectionChanged) {
          op.preparedSelection = display.input.prepareSelection();
        }
      }
      function endOperation_W2(op) {
        var cm = op.cm;
        if (op.adjustWidthTo != null) {
          cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
          if (op.maxScrollLeft < cm.doc.scrollLeft) {
            setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
          }
          cm.display.maxLineChanged = false;
        }
        var takeFocus = op.focus && op.focus == activeElt();
        if (op.preparedSelection) {
          cm.display.input.showSelection(op.preparedSelection, takeFocus);
        }
        if (op.updatedDisplay || op.startHeight != cm.doc.height) {
          updateScrollbars(cm, op.barMeasure);
        }
        if (op.updatedDisplay) {
          setDocumentHeight(cm, op.barMeasure);
        }
        if (op.selectionChanged) {
          restartBlink(cm);
        }
        if (cm.state.focused && op.updateInput) {
          cm.display.input.reset(op.typing);
        }
        if (takeFocus) {
          ensureFocus(op.cm);
        }
      }
      function endOperation_finish(op) {
        var cm = op.cm, display = cm.display, doc = cm.doc;
        if (op.updatedDisplay) {
          postUpdateDisplay(cm, op.update);
        }
        if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos)) {
          display.wheelStartX = display.wheelStartY = null;
        }
        if (op.scrollTop != null) {
          setScrollTop(cm, op.scrollTop, op.forceScroll);
        }
        if (op.scrollLeft != null) {
          setScrollLeft(cm, op.scrollLeft, true, true);
        }
        if (op.scrollToPos) {
          var rect = scrollPosIntoView(cm, clipPos(doc, op.scrollToPos.from), clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
          maybeScrollWindow(cm, rect);
        }
        var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
        if (hidden) {
          for (var i11 = 0; i11 < hidden.length; ++i11) {
            if (!hidden[i11].lines.length) {
              signal(hidden[i11], "hide");
            }
          }
        }
        if (unhidden) {
          for (var i$12 = 0; i$12 < unhidden.length; ++i$12) {
            if (unhidden[i$12].lines.length) {
              signal(unhidden[i$12], "unhide");
            }
          }
        }
        if (display.wrapper.offsetHeight) {
          doc.scrollTop = cm.display.scroller.scrollTop;
        }
        if (op.changeObjs) {
          signal(cm, "changes", cm, op.changeObjs);
        }
        if (op.update) {
          op.update.finish();
        }
      }
      function runInOp(cm, f5) {
        if (cm.curOp) {
          return f5();
        }
        startOperation(cm);
        try {
          return f5();
        } finally {
          endOperation(cm);
        }
      }
      function operation(cm, f5) {
        return function() {
          if (cm.curOp) {
            return f5.apply(cm, arguments);
          }
          startOperation(cm);
          try {
            return f5.apply(cm, arguments);
          } finally {
            endOperation(cm);
          }
        };
      }
      function methodOp(f5) {
        return function() {
          if (this.curOp) {
            return f5.apply(this, arguments);
          }
          startOperation(this);
          try {
            return f5.apply(this, arguments);
          } finally {
            endOperation(this);
          }
        };
      }
      function docMethodOp(f5) {
        return function() {
          var cm = this.cm;
          if (!cm || cm.curOp) {
            return f5.apply(this, arguments);
          }
          startOperation(cm);
          try {
            return f5.apply(this, arguments);
          } finally {
            endOperation(cm);
          }
        };
      }
      function startWorker(cm, time) {
        if (cm.doc.highlightFrontier < cm.display.viewTo) {
          cm.state.highlight.set(time, bind(highlightWorker, cm));
        }
      }
      function highlightWorker(cm) {
        var doc = cm.doc;
        if (doc.highlightFrontier >= cm.display.viewTo) {
          return;
        }
        var end = +new Date() + cm.options.workTime;
        var context = getContextBefore(cm, doc.highlightFrontier);
        var changedLines = [];
        doc.iter(context.line, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function(line) {
          if (context.line >= cm.display.viewFrom) {
            var oldStyles = line.styles;
            var resetState = line.text.length > cm.options.maxHighlightLength ? copyState(doc.mode, context.state) : null;
            var highlighted = highlightLine(cm, line, context, true);
            if (resetState) {
              context.state = resetState;
            }
            line.styles = highlighted.styles;
            var oldCls = line.styleClasses, newCls = highlighted.classes;
            if (newCls) {
              line.styleClasses = newCls;
            } else if (oldCls) {
              line.styleClasses = null;
            }
            var ischange = !oldStyles || oldStyles.length != line.styles.length || oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
            for (var i11 = 0; !ischange && i11 < oldStyles.length; ++i11) {
              ischange = oldStyles[i11] != line.styles[i11];
            }
            if (ischange) {
              changedLines.push(context.line);
            }
            line.stateAfter = context.save();
            context.nextLine();
          } else {
            if (line.text.length <= cm.options.maxHighlightLength) {
              processLine(cm, line.text, context);
            }
            line.stateAfter = context.line % 5 == 0 ? context.save() : null;
            context.nextLine();
          }
          if (+new Date() > end) {
            startWorker(cm, cm.options.workDelay);
            return true;
          }
        });
        doc.highlightFrontier = context.line;
        doc.modeFrontier = Math.max(doc.modeFrontier, context.line);
        if (changedLines.length) {
          runInOp(cm, function() {
            for (var i11 = 0; i11 < changedLines.length; i11++) {
              regLineChange(cm, changedLines[i11], "text");
            }
          });
        }
      }
      var DisplayUpdate = function(cm, viewport, force) {
        var display = cm.display;
        this.viewport = viewport;
        this.visible = visibleLines(display, cm.doc, viewport);
        this.editorIsHidden = !display.wrapper.offsetWidth;
        this.wrapperHeight = display.wrapper.clientHeight;
        this.wrapperWidth = display.wrapper.clientWidth;
        this.oldDisplayWidth = displayWidth(cm);
        this.force = force;
        this.dims = getDimensions(cm);
        this.events = [];
      };
      DisplayUpdate.prototype.signal = function(emitter, type) {
        if (hasHandler(emitter, type)) {
          this.events.push(arguments);
        }
      };
      DisplayUpdate.prototype.finish = function() {
        for (var i11 = 0; i11 < this.events.length; i11++) {
          signal.apply(null, this.events[i11]);
        }
      };
      function maybeClipScrollbars(cm) {
        var display = cm.display;
        if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
          display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
          display.heightForcer.style.height = scrollGap(cm) + "px";
          display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
          display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
          display.scrollbarsClipped = true;
        }
      }
      function selectionSnapshot(cm) {
        if (cm.hasFocus()) {
          return null;
        }
        var active = activeElt();
        if (!active || !contains(cm.display.lineDiv, active)) {
          return null;
        }
        var result = { activeElt: active };
        if (window.getSelection) {
          var sel = window.getSelection();
          if (sel.anchorNode && sel.extend && contains(cm.display.lineDiv, sel.anchorNode)) {
            result.anchorNode = sel.anchorNode;
            result.anchorOffset = sel.anchorOffset;
            result.focusNode = sel.focusNode;
            result.focusOffset = sel.focusOffset;
          }
        }
        return result;
      }
      function restoreSelection(snapshot) {
        if (!snapshot || !snapshot.activeElt || snapshot.activeElt == activeElt()) {
          return;
        }
        snapshot.activeElt.focus();
        if (!/^(INPUT|TEXTAREA)$/.test(snapshot.activeElt.nodeName) && snapshot.anchorNode && contains(document.body, snapshot.anchorNode) && contains(document.body, snapshot.focusNode)) {
          var sel = window.getSelection(), range2 = document.createRange();
          range2.setEnd(snapshot.anchorNode, snapshot.anchorOffset);
          range2.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range2);
          sel.extend(snapshot.focusNode, snapshot.focusOffset);
        }
      }
      function updateDisplayIfNeeded(cm, update) {
        var display = cm.display, doc = cm.doc;
        if (update.editorIsHidden) {
          resetView(cm);
          return false;
        }
        if (!update.force && update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) && display.renderedView == display.view && countDirtyView(cm) == 0) {
          return false;
        }
        if (maybeUpdateLineNumberWidth(cm)) {
          resetView(cm);
          update.dims = getDimensions(cm);
        }
        var end = doc.first + doc.size;
        var from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
        var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
        if (display.viewFrom < from && from - display.viewFrom < 20) {
          from = Math.max(doc.first, display.viewFrom);
        }
        if (display.viewTo > to && display.viewTo - to < 20) {
          to = Math.min(end, display.viewTo);
        }
        if (sawCollapsedSpans) {
          from = visualLineNo(cm.doc, from);
          to = visualLineEndNo(cm.doc, to);
        }
        var different = from != display.viewFrom || to != display.viewTo || display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
        adjustView(cm, from, to);
        display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
        cm.display.mover.style.top = display.viewOffset + "px";
        var toUpdate = countDirtyView(cm);
        if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo)) {
          return false;
        }
        var selSnapshot = selectionSnapshot(cm);
        if (toUpdate > 4) {
          display.lineDiv.style.display = "none";
        }
        patchDisplay(cm, display.updateLineNumbers, update.dims);
        if (toUpdate > 4) {
          display.lineDiv.style.display = "";
        }
        display.renderedView = display.view;
        restoreSelection(selSnapshot);
        removeChildren(display.cursorDiv);
        removeChildren(display.selectionDiv);
        display.gutters.style.height = display.sizer.style.minHeight = 0;
        if (different) {
          display.lastWrapHeight = update.wrapperHeight;
          display.lastWrapWidth = update.wrapperWidth;
          startWorker(cm, 400);
        }
        display.updateLineNumbers = null;
        return true;
      }
      function postUpdateDisplay(cm, update) {
        var viewport = update.viewport;
        for (var first = true; ; first = false) {
          if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == displayWidth(cm)) {
            if (viewport && viewport.top != null) {
              viewport = { top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top) };
            }
            update.visible = visibleLines(cm.display, cm.doc, viewport);
            if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo) {
              break;
            }
          } else if (first) {
            update.visible = visibleLines(cm.display, cm.doc, viewport);
          }
          if (!updateDisplayIfNeeded(cm, update)) {
            break;
          }
          updateHeightsInViewport(cm);
          var barMeasure = measureForScrollbars(cm);
          updateSelection(cm);
          updateScrollbars(cm, barMeasure);
          setDocumentHeight(cm, barMeasure);
          update.force = false;
        }
        update.signal(cm, "update", cm);
        if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
          update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
          cm.display.reportedViewFrom = cm.display.viewFrom;
          cm.display.reportedViewTo = cm.display.viewTo;
        }
      }
      function updateDisplaySimple(cm, viewport) {
        var update = new DisplayUpdate(cm, viewport);
        if (updateDisplayIfNeeded(cm, update)) {
          updateHeightsInViewport(cm);
          postUpdateDisplay(cm, update);
          var barMeasure = measureForScrollbars(cm);
          updateSelection(cm);
          updateScrollbars(cm, barMeasure);
          setDocumentHeight(cm, barMeasure);
          update.finish();
        }
      }
      function patchDisplay(cm, updateNumbersFrom, dims) {
        var display = cm.display, lineNumbers = cm.options.lineNumbers;
        var container = display.lineDiv, cur = container.firstChild;
        function rm(node2) {
          var next = node2.nextSibling;
          if (webkit && mac && cm.display.currentWheelTarget == node2) {
            node2.style.display = "none";
          } else {
            node2.parentNode.removeChild(node2);
          }
          return next;
        }
        var view = display.view, lineN = display.viewFrom;
        for (var i11 = 0; i11 < view.length; i11++) {
          var lineView = view[i11];
          if (lineView.hidden)
            ;
          else if (!lineView.node || lineView.node.parentNode != container) {
            var node = buildLineElement(cm, lineView, lineN, dims);
            container.insertBefore(node, cur);
          } else {
            while (cur != lineView.node) {
              cur = rm(cur);
            }
            var updateNumber = lineNumbers && updateNumbersFrom != null && updateNumbersFrom <= lineN && lineView.lineNumber;
            if (lineView.changes) {
              if (indexOf(lineView.changes, "gutter") > -1) {
                updateNumber = false;
              }
              updateLineForChanges(cm, lineView, lineN, dims);
            }
            if (updateNumber) {
              removeChildren(lineView.lineNumber);
              lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
            }
            cur = lineView.node.nextSibling;
          }
          lineN += lineView.size;
        }
        while (cur) {
          cur = rm(cur);
        }
      }
      function updateGutterSpace(display) {
        var width = display.gutters.offsetWidth;
        display.sizer.style.marginLeft = width + "px";
        signalLater(display, "gutterChanged", display);
      }
      function setDocumentHeight(cm, measure) {
        cm.display.sizer.style.minHeight = measure.docHeight + "px";
        cm.display.heightForcer.style.top = measure.docHeight + "px";
        cm.display.gutters.style.height = measure.docHeight + cm.display.barHeight + scrollGap(cm) + "px";
      }
      function alignHorizontally(cm) {
        var display = cm.display, view = display.view;
        if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) {
          return;
        }
        var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
        var gutterW = display.gutters.offsetWidth, left = comp + "px";
        for (var i11 = 0; i11 < view.length; i11++) {
          if (!view[i11].hidden) {
            if (cm.options.fixedGutter) {
              if (view[i11].gutter) {
                view[i11].gutter.style.left = left;
              }
              if (view[i11].gutterBackground) {
                view[i11].gutterBackground.style.left = left;
              }
            }
            var align = view[i11].alignable;
            if (align) {
              for (var j2 = 0; j2 < align.length; j2++) {
                align[j2].style.left = left;
              }
            }
          }
        }
        if (cm.options.fixedGutter) {
          display.gutters.style.left = comp + gutterW + "px";
        }
      }
      function maybeUpdateLineNumberWidth(cm) {
        if (!cm.options.lineNumbers) {
          return false;
        }
        var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
        if (last.length != display.lineNumChars) {
          var test = display.measure.appendChild(elt("div", [elt("div", last)], "CodeMirror-linenumber CodeMirror-gutter-elt"));
          var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
          display.lineGutter.style.width = "";
          display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
          display.lineNumWidth = display.lineNumInnerWidth + padding;
          display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
          display.lineGutter.style.width = display.lineNumWidth + "px";
          updateGutterSpace(cm.display);
          return true;
        }
        return false;
      }
      function getGutters(gutters, lineNumbers) {
        var result = [], sawLineNumbers = false;
        for (var i11 = 0; i11 < gutters.length; i11++) {
          var name = gutters[i11], style = null;
          if (typeof name != "string") {
            style = name.style;
            name = name.className;
          }
          if (name == "CodeMirror-linenumbers") {
            if (!lineNumbers) {
              continue;
            } else {
              sawLineNumbers = true;
            }
          }
          result.push({ className: name, style });
        }
        if (lineNumbers && !sawLineNumbers) {
          result.push({ className: "CodeMirror-linenumbers", style: null });
        }
        return result;
      }
      function renderGutters(display) {
        var gutters = display.gutters, specs = display.gutterSpecs;
        removeChildren(gutters);
        display.lineGutter = null;
        for (var i11 = 0; i11 < specs.length; ++i11) {
          var ref = specs[i11];
          var className = ref.className;
          var style = ref.style;
          var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + className));
          if (style) {
            gElt.style.cssText = style;
          }
          if (className == "CodeMirror-linenumbers") {
            display.lineGutter = gElt;
            gElt.style.width = (display.lineNumWidth || 1) + "px";
          }
        }
        gutters.style.display = specs.length ? "" : "none";
        updateGutterSpace(display);
      }
      function updateGutters(cm) {
        renderGutters(cm.display);
        regChange(cm);
        alignHorizontally(cm);
      }
      function Display(place, doc, input, options) {
        var d6 = this;
        this.input = input;
        d6.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
        d6.scrollbarFiller.setAttribute("cm-not-content", "true");
        d6.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
        d6.gutterFiller.setAttribute("cm-not-content", "true");
        d6.lineDiv = eltP("div", null, "CodeMirror-code");
        d6.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
        d6.cursorDiv = elt("div", null, "CodeMirror-cursors");
        d6.measure = elt("div", null, "CodeMirror-measure");
        d6.lineMeasure = elt("div", null, "CodeMirror-measure");
        d6.lineSpace = eltP("div", [d6.measure, d6.lineMeasure, d6.selectionDiv, d6.cursorDiv, d6.lineDiv], null, "position: relative; outline: none");
        var lines = eltP("div", [d6.lineSpace], "CodeMirror-lines");
        d6.mover = elt("div", [lines], null, "position: relative");
        d6.sizer = elt("div", [d6.mover], "CodeMirror-sizer");
        d6.sizerWidth = null;
        d6.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;");
        d6.gutters = elt("div", null, "CodeMirror-gutters");
        d6.lineGutter = null;
        d6.scroller = elt("div", [d6.sizer, d6.heightForcer, d6.gutters], "CodeMirror-scroll");
        d6.scroller.setAttribute("tabIndex", "-1");
        d6.wrapper = elt("div", [d6.scrollbarFiller, d6.gutterFiller, d6.scroller], "CodeMirror");
        d6.wrapper.setAttribute("translate", "no");
        if (ie && ie_version < 8) {
          d6.gutters.style.zIndex = -1;
          d6.scroller.style.paddingRight = 0;
        }
        if (!webkit && !(gecko && mobile)) {
          d6.scroller.draggable = true;
        }
        if (place) {
          if (place.appendChild) {
            place.appendChild(d6.wrapper);
          } else {
            place(d6.wrapper);
          }
        }
        d6.viewFrom = d6.viewTo = doc.first;
        d6.reportedViewFrom = d6.reportedViewTo = doc.first;
        d6.view = [];
        d6.renderedView = null;
        d6.externalMeasured = null;
        d6.viewOffset = 0;
        d6.lastWrapHeight = d6.lastWrapWidth = 0;
        d6.updateLineNumbers = null;
        d6.nativeBarWidth = d6.barHeight = d6.barWidth = 0;
        d6.scrollbarsClipped = false;
        d6.lineNumWidth = d6.lineNumInnerWidth = d6.lineNumChars = null;
        d6.alignWidgets = false;
        d6.cachedCharWidth = d6.cachedTextHeight = d6.cachedPaddingH = null;
        d6.maxLine = null;
        d6.maxLineLength = 0;
        d6.maxLineChanged = false;
        d6.wheelDX = d6.wheelDY = d6.wheelStartX = d6.wheelStartY = null;
        d6.shift = false;
        d6.selForContextMenu = null;
        d6.activeTouch = null;
        d6.gutterSpecs = getGutters(options.gutters, options.lineNumbers);
        renderGutters(d6);
        input.init(d6);
      }
      var wheelSamples = 0, wheelPixelsPerUnit = null;
      if (ie) {
        wheelPixelsPerUnit = -0.53;
      } else if (gecko) {
        wheelPixelsPerUnit = 15;
      } else if (chrome) {
        wheelPixelsPerUnit = -0.7;
      } else if (safari) {
        wheelPixelsPerUnit = -1 / 3;
      }
      function wheelEventDelta(e4) {
        var dx = e4.wheelDeltaX, dy = e4.wheelDeltaY;
        if (dx == null && e4.detail && e4.axis == e4.HORIZONTAL_AXIS) {
          dx = e4.detail;
        }
        if (dy == null && e4.detail && e4.axis == e4.VERTICAL_AXIS) {
          dy = e4.detail;
        } else if (dy == null) {
          dy = e4.wheelDelta;
        }
        return { x: dx, y: dy };
      }
      function wheelEventPixels(e4) {
        var delta = wheelEventDelta(e4);
        delta.x *= wheelPixelsPerUnit;
        delta.y *= wheelPixelsPerUnit;
        return delta;
      }
      function onScrollWheel(cm, e4) {
        var delta = wheelEventDelta(e4), dx = delta.x, dy = delta.y;
        var pixelsPerUnit = wheelPixelsPerUnit;
        if (event.deltaMode === 0) {
          dx = e4.deltaX;
          dy = e4.deltaY;
          pixelsPerUnit = 1;
        }
        var display = cm.display, scroll = display.scroller;
        var canScrollX = scroll.scrollWidth > scroll.clientWidth;
        var canScrollY = scroll.scrollHeight > scroll.clientHeight;
        if (!(dx && canScrollX || dy && canScrollY)) {
          return;
        }
        if (dy && mac && webkit) {
          outer:
            for (var cur = e4.target, view = display.view; cur != scroll; cur = cur.parentNode) {
              for (var i11 = 0; i11 < view.length; i11++) {
                if (view[i11].node == cur) {
                  cm.display.currentWheelTarget = cur;
                  break outer;
                }
              }
            }
        }
        if (dx && !gecko && !presto && pixelsPerUnit != null) {
          if (dy && canScrollY) {
            updateScrollTop(cm, Math.max(0, scroll.scrollTop + dy * pixelsPerUnit));
          }
          setScrollLeft(cm, Math.max(0, scroll.scrollLeft + dx * pixelsPerUnit));
          if (!dy || dy && canScrollY) {
            e_preventDefault(e4);
          }
          display.wheelStartX = null;
          return;
        }
        if (dy && pixelsPerUnit != null) {
          var pixels = dy * pixelsPerUnit;
          var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
          if (pixels < 0) {
            top = Math.max(0, top + pixels - 50);
          } else {
            bot = Math.min(cm.doc.height, bot + pixels + 50);
          }
          updateDisplaySimple(cm, { top, bottom: bot });
        }
        if (wheelSamples < 20 && e4.deltaMode !== 0) {
          if (display.wheelStartX == null) {
            display.wheelStartX = scroll.scrollLeft;
            display.wheelStartY = scroll.scrollTop;
            display.wheelDX = dx;
            display.wheelDY = dy;
            setTimeout(function() {
              if (display.wheelStartX == null) {
                return;
              }
              var movedX = scroll.scrollLeft - display.wheelStartX;
              var movedY = scroll.scrollTop - display.wheelStartY;
              var sample = movedY && display.wheelDY && movedY / display.wheelDY || movedX && display.wheelDX && movedX / display.wheelDX;
              display.wheelStartX = display.wheelStartY = null;
              if (!sample) {
                return;
              }
              wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
              ++wheelSamples;
            }, 200);
          } else {
            display.wheelDX += dx;
            display.wheelDY += dy;
          }
        }
      }
      var Selection = function(ranges, primIndex) {
        this.ranges = ranges;
        this.primIndex = primIndex;
      };
      Selection.prototype.primary = function() {
        return this.ranges[this.primIndex];
      };
      Selection.prototype.equals = function(other) {
        if (other == this) {
          return true;
        }
        if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) {
          return false;
        }
        for (var i11 = 0; i11 < this.ranges.length; i11++) {
          var here = this.ranges[i11], there = other.ranges[i11];
          if (!equalCursorPos(here.anchor, there.anchor) || !equalCursorPos(here.head, there.head)) {
            return false;
          }
        }
        return true;
      };
      Selection.prototype.deepCopy = function() {
        var out = [];
        for (var i11 = 0; i11 < this.ranges.length; i11++) {
          out[i11] = new Range(copyPos(this.ranges[i11].anchor), copyPos(this.ranges[i11].head));
        }
        return new Selection(out, this.primIndex);
      };
      Selection.prototype.somethingSelected = function() {
        for (var i11 = 0; i11 < this.ranges.length; i11++) {
          if (!this.ranges[i11].empty()) {
            return true;
          }
        }
        return false;
      };
      Selection.prototype.contains = function(pos, end) {
        if (!end) {
          end = pos;
        }
        for (var i11 = 0; i11 < this.ranges.length; i11++) {
          var range2 = this.ranges[i11];
          if (cmp(end, range2.from()) >= 0 && cmp(pos, range2.to()) <= 0) {
            return i11;
          }
        }
        return -1;
      };
      var Range = function(anchor, head) {
        this.anchor = anchor;
        this.head = head;
      };
      Range.prototype.from = function() {
        return minPos(this.anchor, this.head);
      };
      Range.prototype.to = function() {
        return maxPos(this.anchor, this.head);
      };
      Range.prototype.empty = function() {
        return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
      };
      function normalizeSelection(cm, ranges, primIndex) {
        var mayTouch = cm && cm.options.selectionsMayTouch;
        var prim = ranges[primIndex];
        ranges.sort(function(a11, b3) {
          return cmp(a11.from(), b3.from());
        });
        primIndex = indexOf(ranges, prim);
        for (var i11 = 1; i11 < ranges.length; i11++) {
          var cur = ranges[i11], prev = ranges[i11 - 1];
          var diff = cmp(prev.to(), cur.from());
          if (mayTouch && !cur.empty() ? diff > 0 : diff >= 0) {
            var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
            var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
            if (i11 <= primIndex) {
              --primIndex;
            }
            ranges.splice(--i11, 2, new Range(inv ? to : from, inv ? from : to));
          }
        }
        return new Selection(ranges, primIndex);
      }
      function simpleSelection(anchor, head) {
        return new Selection([new Range(anchor, head || anchor)], 0);
      }
      function changeEnd(change) {
        if (!change.text) {
          return change.to;
        }
        return Pos(change.from.line + change.text.length - 1, lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
      }
      function adjustForChange(pos, change) {
        if (cmp(pos, change.from) < 0) {
          return pos;
        }
        if (cmp(pos, change.to) <= 0) {
          return changeEnd(change);
        }
        var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
        if (pos.line == change.to.line) {
          ch += changeEnd(change).ch - change.to.ch;
        }
        return Pos(line, ch);
      }
      function computeSelAfterChange(doc, change) {
        var out = [];
        for (var i11 = 0; i11 < doc.sel.ranges.length; i11++) {
          var range2 = doc.sel.ranges[i11];
          out.push(new Range(adjustForChange(range2.anchor, change), adjustForChange(range2.head, change)));
        }
        return normalizeSelection(doc.cm, out, doc.sel.primIndex);
      }
      function offsetPos(pos, old, nw) {
        if (pos.line == old.line) {
          return Pos(nw.line, pos.ch - old.ch + nw.ch);
        } else {
          return Pos(nw.line + (pos.line - old.line), pos.ch);
        }
      }
      function computeReplacedSel(doc, changes, hint) {
        var out = [];
        var oldPrev = Pos(doc.first, 0), newPrev = oldPrev;
        for (var i11 = 0; i11 < changes.length; i11++) {
          var change = changes[i11];
          var from = offsetPos(change.from, oldPrev, newPrev);
          var to = offsetPos(changeEnd(change), oldPrev, newPrev);
          oldPrev = change.to;
          newPrev = to;
          if (hint == "around") {
            var range2 = doc.sel.ranges[i11], inv = cmp(range2.head, range2.anchor) < 0;
            out[i11] = new Range(inv ? to : from, inv ? from : to);
          } else {
            out[i11] = new Range(from, from);
          }
        }
        return new Selection(out, doc.sel.primIndex);
      }
      function loadMode(cm) {
        cm.doc.mode = getMode(cm.options, cm.doc.modeOption);
        resetModeState(cm);
      }
      function resetModeState(cm) {
        cm.doc.iter(function(line) {
          if (line.stateAfter) {
            line.stateAfter = null;
          }
          if (line.styles) {
            line.styles = null;
          }
        });
        cm.doc.modeFrontier = cm.doc.highlightFrontier = cm.doc.first;
        startWorker(cm, 100);
        cm.state.modeGen++;
        if (cm.curOp) {
          regChange(cm);
        }
      }
      function isWholeLineUpdate(doc, change) {
        return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" && (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
      }
      function updateDoc(doc, change, markedSpans, estimateHeight2) {
        function spansFor(n10) {
          return markedSpans ? markedSpans[n10] : null;
        }
        function update(line, text2, spans) {
          updateLine(line, text2, spans, estimateHeight2);
          signalLater(line, "change", line, change);
        }
        function linesFor(start, end) {
          var result = [];
          for (var i11 = start; i11 < end; ++i11) {
            result.push(new Line(text[i11], spansFor(i11), estimateHeight2));
          }
          return result;
        }
        var from = change.from, to = change.to, text = change.text;
        var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
        var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;
        if (change.full) {
          doc.insert(0, linesFor(0, text.length));
          doc.remove(text.length, doc.size - text.length);
        } else if (isWholeLineUpdate(doc, change)) {
          var added = linesFor(0, text.length - 1);
          update(lastLine, lastLine.text, lastSpans);
          if (nlines) {
            doc.remove(from.line, nlines);
          }
          if (added.length) {
            doc.insert(from.line, added);
          }
        } else if (firstLine == lastLine) {
          if (text.length == 1) {
            update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
          } else {
            var added$1 = linesFor(1, text.length - 1);
            added$1.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight2));
            update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
            doc.insert(from.line + 1, added$1);
          }
        } else if (text.length == 1) {
          update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
          doc.remove(from.line + 1, nlines);
        } else {
          update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
          update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
          var added$2 = linesFor(1, text.length - 1);
          if (nlines > 1) {
            doc.remove(from.line + 1, nlines - 1);
          }
          doc.insert(from.line + 1, added$2);
        }
        signalLater(doc, "change", doc, change);
      }
      function linkedDocs(doc, f5, sharedHistOnly) {
        function propagate(doc2, skip, sharedHist) {
          if (doc2.linked) {
            for (var i11 = 0; i11 < doc2.linked.length; ++i11) {
              var rel = doc2.linked[i11];
              if (rel.doc == skip) {
                continue;
              }
              var shared = sharedHist && rel.sharedHist;
              if (sharedHistOnly && !shared) {
                continue;
              }
              f5(rel.doc, shared);
              propagate(rel.doc, doc2, shared);
            }
          }
        }
        propagate(doc, null, true);
      }
      function attachDoc(cm, doc) {
        if (doc.cm) {
          throw new Error("This document is already in use.");
        }
        cm.doc = doc;
        doc.cm = cm;
        estimateLineHeights(cm);
        loadMode(cm);
        setDirectionClass(cm);
        cm.options.direction = doc.direction;
        if (!cm.options.lineWrapping) {
          findMaxLine(cm);
        }
        cm.options.mode = doc.modeOption;
        regChange(cm);
      }
      function setDirectionClass(cm) {
        (cm.doc.direction == "rtl" ? addClass : rmClass)(cm.display.lineDiv, "CodeMirror-rtl");
      }
      function directionChanged(cm) {
        runInOp(cm, function() {
          setDirectionClass(cm);
          regChange(cm);
        });
      }
      function History(prev) {
        this.done = [];
        this.undone = [];
        this.undoDepth = prev ? prev.undoDepth : Infinity;
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        this.generation = this.maxGeneration = prev ? prev.maxGeneration : 1;
      }
      function historyChangeFromChange(doc, change) {
        var histChange = { from: copyPos(change.from), to: changeEnd(change), text: getBetween(doc, change.from, change.to) };
        attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
        linkedDocs(doc, function(doc2) {
          return attachLocalSpans(doc2, histChange, change.from.line, change.to.line + 1);
        }, true);
        return histChange;
      }
      function clearSelectionEvents(array) {
        while (array.length) {
          var last = lst(array);
          if (last.ranges) {
            array.pop();
          } else {
            break;
          }
        }
      }
      function lastChangeEvent(hist, force) {
        if (force) {
          clearSelectionEvents(hist.done);
          return lst(hist.done);
        } else if (hist.done.length && !lst(hist.done).ranges) {
          return lst(hist.done);
        } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
          hist.done.pop();
          return lst(hist.done);
        }
      }
      function addChangeToHistory(doc, change, selAfter, opId) {
        var hist = doc.history;
        hist.undone.length = 0;
        var time = +new Date(), cur;
        var last;
        if ((hist.lastOp == opId || hist.lastOrigin == change.origin && change.origin && (change.origin.charAt(0) == "+" && hist.lastModTime > time - (doc.cm ? doc.cm.options.historyEventDelay : 500) || change.origin.charAt(0) == "*")) && (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
          last = lst(cur.changes);
          if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) {
            last.to = changeEnd(change);
          } else {
            cur.changes.push(historyChangeFromChange(doc, change));
          }
        } else {
          var before = lst(hist.done);
          if (!before || !before.ranges) {
            pushSelectionToHistory(doc.sel, hist.done);
          }
          cur = {
            changes: [historyChangeFromChange(doc, change)],
            generation: hist.generation
          };
          hist.done.push(cur);
          while (hist.done.length > hist.undoDepth) {
            hist.done.shift();
            if (!hist.done[0].ranges) {
              hist.done.shift();
            }
          }
        }
        hist.done.push(selAfter);
        hist.generation = ++hist.maxGeneration;
        hist.lastModTime = hist.lastSelTime = time;
        hist.lastOp = hist.lastSelOp = opId;
        hist.lastOrigin = hist.lastSelOrigin = change.origin;
        if (!last) {
          signal(doc, "historyAdded");
        }
      }
      function selectionEventCanBeMerged(doc, origin, prev, sel) {
        var ch = origin.charAt(0);
        return ch == "*" || ch == "+" && prev.ranges.length == sel.ranges.length && prev.somethingSelected() == sel.somethingSelected() && new Date() - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
      }
      function addSelectionToHistory(doc, sel, opId, options) {
        var hist = doc.history, origin = options && options.origin;
        if (opId == hist.lastSelOp || origin && hist.lastSelOrigin == origin && (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin || selectionEventCanBeMerged(doc, origin, lst(hist.done), sel))) {
          hist.done[hist.done.length - 1] = sel;
        } else {
          pushSelectionToHistory(sel, hist.done);
        }
        hist.lastSelTime = +new Date();
        hist.lastSelOrigin = origin;
        hist.lastSelOp = opId;
        if (options && options.clearRedo !== false) {
          clearSelectionEvents(hist.undone);
        }
      }
      function pushSelectionToHistory(sel, dest) {
        var top = lst(dest);
        if (!(top && top.ranges && top.equals(sel))) {
          dest.push(sel);
        }
      }
      function attachLocalSpans(doc, change, from, to) {
        var existing = change["spans_" + doc.id], n10 = 0;
        doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
          if (line.markedSpans) {
            (existing || (existing = change["spans_" + doc.id] = {}))[n10] = line.markedSpans;
          }
          ++n10;
        });
      }
      function removeClearedSpans(spans) {
        if (!spans) {
          return null;
        }
        var out;
        for (var i11 = 0; i11 < spans.length; ++i11) {
          if (spans[i11].marker.explicitlyCleared) {
            if (!out) {
              out = spans.slice(0, i11);
            }
          } else if (out) {
            out.push(spans[i11]);
          }
        }
        return !out ? spans : out.length ? out : null;
      }
      function getOldSpans(doc, change) {
        var found = change["spans_" + doc.id];
        if (!found) {
          return null;
        }
        var nw = [];
        for (var i11 = 0; i11 < change.text.length; ++i11) {
          nw.push(removeClearedSpans(found[i11]));
        }
        return nw;
      }
      function mergeOldSpans(doc, change) {
        var old = getOldSpans(doc, change);
        var stretched = stretchSpansOverChange(doc, change);
        if (!old) {
          return stretched;
        }
        if (!stretched) {
          return old;
        }
        for (var i11 = 0; i11 < old.length; ++i11) {
          var oldCur = old[i11], stretchCur = stretched[i11];
          if (oldCur && stretchCur) {
            spans:
              for (var j2 = 0; j2 < stretchCur.length; ++j2) {
                var span = stretchCur[j2];
                for (var k2 = 0; k2 < oldCur.length; ++k2) {
                  if (oldCur[k2].marker == span.marker) {
                    continue spans;
                  }
                }
                oldCur.push(span);
              }
          } else if (stretchCur) {
            old[i11] = stretchCur;
          }
        }
        return old;
      }
      function copyHistoryArray(events, newGroup, instantiateSel) {
        var copy = [];
        for (var i11 = 0; i11 < events.length; ++i11) {
          var event2 = events[i11];
          if (event2.ranges) {
            copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event2) : event2);
            continue;
          }
          var changes = event2.changes, newChanges = [];
          copy.push({ changes: newChanges });
          for (var j2 = 0; j2 < changes.length; ++j2) {
            var change = changes[j2], m4 = void 0;
            newChanges.push({ from: change.from, to: change.to, text: change.text });
            if (newGroup) {
              for (var prop2 in change) {
                if (m4 = prop2.match(/^spans_(\d+)$/)) {
                  if (indexOf(newGroup, Number(m4[1])) > -1) {
                    lst(newChanges)[prop2] = change[prop2];
                    delete change[prop2];
                  }
                }
              }
            }
          }
        }
        return copy;
      }
      function extendRange(range2, head, other, extend2) {
        if (extend2) {
          var anchor = range2.anchor;
          if (other) {
            var posBefore = cmp(head, anchor) < 0;
            if (posBefore != cmp(other, anchor) < 0) {
              anchor = head;
              head = other;
            } else if (posBefore != cmp(head, other) < 0) {
              head = other;
            }
          }
          return new Range(anchor, head);
        } else {
          return new Range(other || head, head);
        }
      }
      function extendSelection(doc, head, other, options, extend2) {
        if (extend2 == null) {
          extend2 = doc.cm && (doc.cm.display.shift || doc.extend);
        }
        setSelection(doc, new Selection([extendRange(doc.sel.primary(), head, other, extend2)], 0), options);
      }
      function extendSelections(doc, heads, options) {
        var out = [];
        var extend2 = doc.cm && (doc.cm.display.shift || doc.extend);
        for (var i11 = 0; i11 < doc.sel.ranges.length; i11++) {
          out[i11] = extendRange(doc.sel.ranges[i11], heads[i11], null, extend2);
        }
        var newSel = normalizeSelection(doc.cm, out, doc.sel.primIndex);
        setSelection(doc, newSel, options);
      }
      function replaceOneSelection(doc, i11, range2, options) {
        var ranges = doc.sel.ranges.slice(0);
        ranges[i11] = range2;
        setSelection(doc, normalizeSelection(doc.cm, ranges, doc.sel.primIndex), options);
      }
      function setSimpleSelection(doc, anchor, head, options) {
        setSelection(doc, simpleSelection(anchor, head), options);
      }
      function filterSelectionChange(doc, sel, options) {
        var obj = {
          ranges: sel.ranges,
          update: function(ranges) {
            this.ranges = [];
            for (var i11 = 0; i11 < ranges.length; i11++) {
              this.ranges[i11] = new Range(clipPos(doc, ranges[i11].anchor), clipPos(doc, ranges[i11].head));
            }
          },
          origin: options && options.origin
        };
        signal(doc, "beforeSelectionChange", doc, obj);
        if (doc.cm) {
          signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
        }
        if (obj.ranges != sel.ranges) {
          return normalizeSelection(doc.cm, obj.ranges, obj.ranges.length - 1);
        } else {
          return sel;
        }
      }
      function setSelectionReplaceHistory(doc, sel, options) {
        var done = doc.history.done, last = lst(done);
        if (last && last.ranges) {
          done[done.length - 1] = sel;
          setSelectionNoUndo(doc, sel, options);
        } else {
          setSelection(doc, sel, options);
        }
      }
      function setSelection(doc, sel, options) {
        setSelectionNoUndo(doc, sel, options);
        addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
      }
      function setSelectionNoUndo(doc, sel, options) {
        if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange")) {
          sel = filterSelectionChange(doc, sel, options);
        }
        var bias = options && options.bias || (cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
        setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));
        if (!(options && options.scroll === false) && doc.cm && doc.cm.getOption("readOnly") != "nocursor") {
          ensureCursorVisible(doc.cm);
        }
      }
      function setSelectionInner(doc, sel) {
        if (sel.equals(doc.sel)) {
          return;
        }
        doc.sel = sel;
        if (doc.cm) {
          doc.cm.curOp.updateInput = 1;
          doc.cm.curOp.selectionChanged = true;
          signalCursorActivity(doc.cm);
        }
        signalLater(doc, "cursorActivity", doc);
      }
      function reCheckSelection(doc) {
        setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false));
      }
      function skipAtomicInSelection(doc, sel, bias, mayClear) {
        var out;
        for (var i11 = 0; i11 < sel.ranges.length; i11++) {
          var range2 = sel.ranges[i11];
          var old = sel.ranges.length == doc.sel.ranges.length && doc.sel.ranges[i11];
          var newAnchor = skipAtomic(doc, range2.anchor, old && old.anchor, bias, mayClear);
          var newHead = skipAtomic(doc, range2.head, old && old.head, bias, mayClear);
          if (out || newAnchor != range2.anchor || newHead != range2.head) {
            if (!out) {
              out = sel.ranges.slice(0, i11);
            }
            out[i11] = new Range(newAnchor, newHead);
          }
        }
        return out ? normalizeSelection(doc.cm, out, sel.primIndex) : sel;
      }
      function skipAtomicInner(doc, pos, oldPos, dir, mayClear) {
        var line = getLine(doc, pos.line);
        if (line.markedSpans) {
          for (var i11 = 0; i11 < line.markedSpans.length; ++i11) {
            var sp = line.markedSpans[i11], m4 = sp.marker;
            var preventCursorLeft = "selectLeft" in m4 ? !m4.selectLeft : m4.inclusiveLeft;
            var preventCursorRight = "selectRight" in m4 ? !m4.selectRight : m4.inclusiveRight;
            if ((sp.from == null || (preventCursorLeft ? sp.from <= pos.ch : sp.from < pos.ch)) && (sp.to == null || (preventCursorRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
              if (mayClear) {
                signal(m4, "beforeCursorEnter");
                if (m4.explicitlyCleared) {
                  if (!line.markedSpans) {
                    break;
                  } else {
                    --i11;
                    continue;
                  }
                }
              }
              if (!m4.atomic) {
                continue;
              }
              if (oldPos) {
                var near = m4.find(dir < 0 ? 1 : -1), diff = void 0;
                if (dir < 0 ? preventCursorRight : preventCursorLeft) {
                  near = movePos(doc, near, -dir, near && near.line == pos.line ? line : null);
                }
                if (near && near.line == pos.line && (diff = cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0)) {
                  return skipAtomicInner(doc, near, pos, dir, mayClear);
                }
              }
              var far = m4.find(dir < 0 ? -1 : 1);
              if (dir < 0 ? preventCursorLeft : preventCursorRight) {
                far = movePos(doc, far, dir, far.line == pos.line ? line : null);
              }
              return far ? skipAtomicInner(doc, far, pos, dir, mayClear) : null;
            }
          }
        }
        return pos;
      }
      function skipAtomic(doc, pos, oldPos, bias, mayClear) {
        var dir = bias || 1;
        var found = skipAtomicInner(doc, pos, oldPos, dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, dir, true) || skipAtomicInner(doc, pos, oldPos, -dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, -dir, true);
        if (!found) {
          doc.cantEdit = true;
          return Pos(doc.first, 0);
        }
        return found;
      }
      function movePos(doc, pos, dir, line) {
        if (dir < 0 && pos.ch == 0) {
          if (pos.line > doc.first) {
            return clipPos(doc, Pos(pos.line - 1));
          } else {
            return null;
          }
        } else if (dir > 0 && pos.ch == (line || getLine(doc, pos.line)).text.length) {
          if (pos.line < doc.first + doc.size - 1) {
            return Pos(pos.line + 1, 0);
          } else {
            return null;
          }
        } else {
          return new Pos(pos.line, pos.ch + dir);
        }
      }
      function selectAll(cm) {
        cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);
      }
      function filterChange(doc, change, update) {
        var obj = {
          canceled: false,
          from: change.from,
          to: change.to,
          text: change.text,
          origin: change.origin,
          cancel: function() {
            return obj.canceled = true;
          }
        };
        if (update) {
          obj.update = function(from, to, text, origin) {
            if (from) {
              obj.from = clipPos(doc, from);
            }
            if (to) {
              obj.to = clipPos(doc, to);
            }
            if (text) {
              obj.text = text;
            }
            if (origin !== void 0) {
              obj.origin = origin;
            }
          };
        }
        signal(doc, "beforeChange", doc, obj);
        if (doc.cm) {
          signal(doc.cm, "beforeChange", doc.cm, obj);
        }
        if (obj.canceled) {
          if (doc.cm) {
            doc.cm.curOp.updateInput = 2;
          }
          return null;
        }
        return { from: obj.from, to: obj.to, text: obj.text, origin: obj.origin };
      }
      function makeChange(doc, change, ignoreReadOnly) {
        if (doc.cm) {
          if (!doc.cm.curOp) {
            return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
          }
          if (doc.cm.state.suppressEdits) {
            return;
          }
        }
        if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
          change = filterChange(doc, change, true);
          if (!change) {
            return;
          }
        }
        var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
        if (split) {
          for (var i11 = split.length - 1; i11 >= 0; --i11) {
            makeChangeInner(doc, { from: split[i11].from, to: split[i11].to, text: i11 ? [""] : change.text, origin: change.origin });
          }
        } else {
          makeChangeInner(doc, change);
        }
      }
      function makeChangeInner(doc, change) {
        if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) {
          return;
        }
        var selAfter = computeSelAfterChange(doc, change);
        addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);
        makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
        var rebased = [];
        linkedDocs(doc, function(doc2, sharedHist) {
          if (!sharedHist && indexOf(rebased, doc2.history) == -1) {
            rebaseHist(doc2.history, change);
            rebased.push(doc2.history);
          }
          makeChangeSingleDoc(doc2, change, null, stretchSpansOverChange(doc2, change));
        });
      }
      function makeChangeFromHistory(doc, type, allowSelectionOnly) {
        var suppress = doc.cm && doc.cm.state.suppressEdits;
        if (suppress && !allowSelectionOnly) {
          return;
        }
        var hist = doc.history, event2, selAfter = doc.sel;
        var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;
        var i11 = 0;
        for (; i11 < source.length; i11++) {
          event2 = source[i11];
          if (allowSelectionOnly ? event2.ranges && !event2.equals(doc.sel) : !event2.ranges) {
            break;
          }
        }
        if (i11 == source.length) {
          return;
        }
        hist.lastOrigin = hist.lastSelOrigin = null;
        for (; ; ) {
          event2 = source.pop();
          if (event2.ranges) {
            pushSelectionToHistory(event2, dest);
            if (allowSelectionOnly && !event2.equals(doc.sel)) {
              setSelection(doc, event2, { clearRedo: false });
              return;
            }
            selAfter = event2;
          } else if (suppress) {
            source.push(event2);
            return;
          } else {
            break;
          }
        }
        var antiChanges = [];
        pushSelectionToHistory(selAfter, dest);
        dest.push({ changes: antiChanges, generation: hist.generation });
        hist.generation = event2.generation || ++hist.maxGeneration;
        var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");
        var loop = function(i12) {
          var change = event2.changes[i12];
          change.origin = type;
          if (filter && !filterChange(doc, change, false)) {
            source.length = 0;
            return {};
          }
          antiChanges.push(historyChangeFromChange(doc, change));
          var after = i12 ? computeSelAfterChange(doc, change) : lst(source);
          makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
          if (!i12 && doc.cm) {
            doc.cm.scrollIntoView({ from: change.from, to: changeEnd(change) });
          }
          var rebased = [];
          linkedDocs(doc, function(doc2, sharedHist) {
            if (!sharedHist && indexOf(rebased, doc2.history) == -1) {
              rebaseHist(doc2.history, change);
              rebased.push(doc2.history);
            }
            makeChangeSingleDoc(doc2, change, null, mergeOldSpans(doc2, change));
          });
        };
        for (var i$12 = event2.changes.length - 1; i$12 >= 0; --i$12) {
          var returned = loop(i$12);
          if (returned)
            return returned.v;
        }
      }
      function shiftDoc(doc, distance) {
        if (distance == 0) {
          return;
        }
        doc.first += distance;
        doc.sel = new Selection(map(doc.sel.ranges, function(range2) {
          return new Range(Pos(range2.anchor.line + distance, range2.anchor.ch), Pos(range2.head.line + distance, range2.head.ch));
        }), doc.sel.primIndex);
        if (doc.cm) {
          regChange(doc.cm, doc.first, doc.first - distance, distance);
          for (var d6 = doc.cm.display, l4 = d6.viewFrom; l4 < d6.viewTo; l4++) {
            regLineChange(doc.cm, l4, "gutter");
          }
        }
      }
      function makeChangeSingleDoc(doc, change, selAfter, spans) {
        if (doc.cm && !doc.cm.curOp) {
          return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);
        }
        if (change.to.line < doc.first) {
          shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
          return;
        }
        if (change.from.line > doc.lastLine()) {
          return;
        }
        if (change.from.line < doc.first) {
          var shift = change.text.length - 1 - (doc.first - change.from.line);
          shiftDoc(doc, shift);
          change = {
            from: Pos(doc.first, 0),
            to: Pos(change.to.line + shift, change.to.ch),
            text: [lst(change.text)],
            origin: change.origin
          };
        }
        var last = doc.lastLine();
        if (change.to.line > last) {
          change = {
            from: change.from,
            to: Pos(last, getLine(doc, last).text.length),
            text: [change.text[0]],
            origin: change.origin
          };
        }
        change.removed = getBetween(doc, change.from, change.to);
        if (!selAfter) {
          selAfter = computeSelAfterChange(doc, change);
        }
        if (doc.cm) {
          makeChangeSingleDocInEditor(doc.cm, change, spans);
        } else {
          updateDoc(doc, change, spans);
        }
        setSelectionNoUndo(doc, selAfter, sel_dontScroll);
        if (doc.cantEdit && skipAtomic(doc, Pos(doc.firstLine(), 0))) {
          doc.cantEdit = false;
        }
      }
      function makeChangeSingleDocInEditor(cm, change, spans) {
        var doc = cm.doc, display = cm.display, from = change.from, to = change.to;
        var recomputeMaxLength = false, checkWidthStart = from.line;
        if (!cm.options.lineWrapping) {
          checkWidthStart = lineNo(visualLine(getLine(doc, from.line)));
          doc.iter(checkWidthStart, to.line + 1, function(line) {
            if (line == display.maxLine) {
              recomputeMaxLength = true;
              return true;
            }
          });
        }
        if (doc.sel.contains(change.from, change.to) > -1) {
          signalCursorActivity(cm);
        }
        updateDoc(doc, change, spans, estimateHeight(cm));
        if (!cm.options.lineWrapping) {
          doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
            var len = lineLength(line);
            if (len > display.maxLineLength) {
              display.maxLine = line;
              display.maxLineLength = len;
              display.maxLineChanged = true;
              recomputeMaxLength = false;
            }
          });
          if (recomputeMaxLength) {
            cm.curOp.updateMaxLine = true;
          }
        }
        retreatFrontier(doc, from.line);
        startWorker(cm, 400);
        var lendiff = change.text.length - (to.line - from.line) - 1;
        if (change.full) {
          regChange(cm);
        } else if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change)) {
          regLineChange(cm, from.line, "text");
        } else {
          regChange(cm, from.line, to.line + 1, lendiff);
        }
        var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
        if (changeHandler || changesHandler) {
          var obj = {
            from,
            to,
            text: change.text,
            removed: change.removed,
            origin: change.origin
          };
          if (changeHandler) {
            signalLater(cm, "change", cm, obj);
          }
          if (changesHandler) {
            (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
          }
        }
        cm.display.selForContextMenu = null;
      }
      function replaceRange(doc, code, from, to, origin) {
        var assign;
        if (!to) {
          to = from;
        }
        if (cmp(to, from) < 0) {
          assign = [to, from], from = assign[0], to = assign[1];
        }
        if (typeof code == "string") {
          code = doc.splitLines(code);
        }
        makeChange(doc, { from, to, text: code, origin });
      }
      function rebaseHistSelSingle(pos, from, to, diff) {
        if (to < pos.line) {
          pos.line += diff;
        } else if (from < pos.line) {
          pos.line = from;
          pos.ch = 0;
        }
      }
      function rebaseHistArray(array, from, to, diff) {
        for (var i11 = 0; i11 < array.length; ++i11) {
          var sub = array[i11], ok = true;
          if (sub.ranges) {
            if (!sub.copied) {
              sub = array[i11] = sub.deepCopy();
              sub.copied = true;
            }
            for (var j2 = 0; j2 < sub.ranges.length; j2++) {
              rebaseHistSelSingle(sub.ranges[j2].anchor, from, to, diff);
              rebaseHistSelSingle(sub.ranges[j2].head, from, to, diff);
            }
            continue;
          }
          for (var j$1 = 0; j$1 < sub.changes.length; ++j$1) {
            var cur = sub.changes[j$1];
            if (to < cur.from.line) {
              cur.from = Pos(cur.from.line + diff, cur.from.ch);
              cur.to = Pos(cur.to.line + diff, cur.to.ch);
            } else if (from <= cur.to.line) {
              ok = false;
              break;
            }
          }
          if (!ok) {
            array.splice(0, i11 + 1);
            i11 = 0;
          }
        }
      }
      function rebaseHist(hist, change) {
        var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
        rebaseHistArray(hist.done, from, to, diff);
        rebaseHistArray(hist.undone, from, to, diff);
      }
      function changeLine(doc, handle, changeType, op) {
        var no = handle, line = handle;
        if (typeof handle == "number") {
          line = getLine(doc, clipLine(doc, handle));
        } else {
          no = lineNo(handle);
        }
        if (no == null) {
          return null;
        }
        if (op(line, no) && doc.cm) {
          regLineChange(doc.cm, no, changeType);
        }
        return line;
      }
      function LeafChunk(lines) {
        this.lines = lines;
        this.parent = null;
        var height = 0;
        for (var i11 = 0; i11 < lines.length; ++i11) {
          lines[i11].parent = this;
          height += lines[i11].height;
        }
        this.height = height;
      }
      LeafChunk.prototype = {
        chunkSize: function() {
          return this.lines.length;
        },
        removeInner: function(at, n10) {
          for (var i11 = at, e4 = at + n10; i11 < e4; ++i11) {
            var line = this.lines[i11];
            this.height -= line.height;
            cleanUpLine(line);
            signalLater(line, "delete");
          }
          this.lines.splice(at, n10);
        },
        collapse: function(lines) {
          lines.push.apply(lines, this.lines);
        },
        insertInner: function(at, lines, height) {
          this.height += height;
          this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
          for (var i11 = 0; i11 < lines.length; ++i11) {
            lines[i11].parent = this;
          }
        },
        iterN: function(at, n10, op) {
          for (var e4 = at + n10; at < e4; ++at) {
            if (op(this.lines[at])) {
              return true;
            }
          }
        }
      };
      function BranchChunk(children) {
        this.children = children;
        var size = 0, height = 0;
        for (var i11 = 0; i11 < children.length; ++i11) {
          var ch = children[i11];
          size += ch.chunkSize();
          height += ch.height;
          ch.parent = this;
        }
        this.size = size;
        this.height = height;
        this.parent = null;
      }
      BranchChunk.prototype = {
        chunkSize: function() {
          return this.size;
        },
        removeInner: function(at, n10) {
          this.size -= n10;
          for (var i11 = 0; i11 < this.children.length; ++i11) {
            var child = this.children[i11], sz = child.chunkSize();
            if (at < sz) {
              var rm = Math.min(n10, sz - at), oldHeight = child.height;
              child.removeInner(at, rm);
              this.height -= oldHeight - child.height;
              if (sz == rm) {
                this.children.splice(i11--, 1);
                child.parent = null;
              }
              if ((n10 -= rm) == 0) {
                break;
              }
              at = 0;
            } else {
              at -= sz;
            }
          }
          if (this.size - n10 < 25 && (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
            var lines = [];
            this.collapse(lines);
            this.children = [new LeafChunk(lines)];
            this.children[0].parent = this;
          }
        },
        collapse: function(lines) {
          for (var i11 = 0; i11 < this.children.length; ++i11) {
            this.children[i11].collapse(lines);
          }
        },
        insertInner: function(at, lines, height) {
          this.size += lines.length;
          this.height += height;
          for (var i11 = 0; i11 < this.children.length; ++i11) {
            var child = this.children[i11], sz = child.chunkSize();
            if (at <= sz) {
              child.insertInner(at, lines, height);
              if (child.lines && child.lines.length > 50) {
                var remaining = child.lines.length % 25 + 25;
                for (var pos = remaining; pos < child.lines.length; ) {
                  var leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
                  child.height -= leaf.height;
                  this.children.splice(++i11, 0, leaf);
                  leaf.parent = this;
                }
                child.lines = child.lines.slice(0, remaining);
                this.maybeSpill();
              }
              break;
            }
            at -= sz;
          }
        },
        maybeSpill: function() {
          if (this.children.length <= 10) {
            return;
          }
          var me = this;
          do {
            var spilled = me.children.splice(me.children.length - 5, 5);
            var sibling = new BranchChunk(spilled);
            if (!me.parent) {
              var copy = new BranchChunk(me.children);
              copy.parent = me;
              me.children = [copy, sibling];
              me = copy;
            } else {
              me.size -= sibling.size;
              me.height -= sibling.height;
              var myIndex = indexOf(me.parent.children, me);
              me.parent.children.splice(myIndex + 1, 0, sibling);
            }
            sibling.parent = me.parent;
          } while (me.children.length > 10);
          me.parent.maybeSpill();
        },
        iterN: function(at, n10, op) {
          for (var i11 = 0; i11 < this.children.length; ++i11) {
            var child = this.children[i11], sz = child.chunkSize();
            if (at < sz) {
              var used = Math.min(n10, sz - at);
              if (child.iterN(at, used, op)) {
                return true;
              }
              if ((n10 -= used) == 0) {
                break;
              }
              at = 0;
            } else {
              at -= sz;
            }
          }
        }
      };
      var LineWidget = function(doc, node, options) {
        if (options) {
          for (var opt in options) {
            if (options.hasOwnProperty(opt)) {
              this[opt] = options[opt];
            }
          }
        }
        this.doc = doc;
        this.node = node;
      };
      LineWidget.prototype.clear = function() {
        var cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
        if (no == null || !ws) {
          return;
        }
        for (var i11 = 0; i11 < ws.length; ++i11) {
          if (ws[i11] == this) {
            ws.splice(i11--, 1);
          }
        }
        if (!ws.length) {
          line.widgets = null;
        }
        var height = widgetHeight(this);
        updateLineHeight(line, Math.max(0, line.height - height));
        if (cm) {
          runInOp(cm, function() {
            adjustScrollWhenAboveVisible(cm, line, -height);
            regLineChange(cm, no, "widget");
          });
          signalLater(cm, "lineWidgetCleared", cm, this, no);
        }
      };
      LineWidget.prototype.changed = function() {
        var this$1 = this;
        var oldH = this.height, cm = this.doc.cm, line = this.line;
        this.height = null;
        var diff = widgetHeight(this) - oldH;
        if (!diff) {
          return;
        }
        if (!lineIsHidden(this.doc, line)) {
          updateLineHeight(line, line.height + diff);
        }
        if (cm) {
          runInOp(cm, function() {
            cm.curOp.forceUpdate = true;
            adjustScrollWhenAboveVisible(cm, line, diff);
            signalLater(cm, "lineWidgetChanged", cm, this$1, lineNo(line));
          });
        }
      };
      eventMixin(LineWidget);
      function adjustScrollWhenAboveVisible(cm, line, diff) {
        if (heightAtLine(line) < (cm.curOp && cm.curOp.scrollTop || cm.doc.scrollTop)) {
          addToScrollTop(cm, diff);
        }
      }
      function addLineWidget(doc, handle, node, options) {
        var widget = new LineWidget(doc, node, options);
        var cm = doc.cm;
        if (cm && widget.noHScroll) {
          cm.display.alignWidgets = true;
        }
        changeLine(doc, handle, "widget", function(line) {
          var widgets = line.widgets || (line.widgets = []);
          if (widget.insertAt == null) {
            widgets.push(widget);
          } else {
            widgets.splice(Math.min(widgets.length, Math.max(0, widget.insertAt)), 0, widget);
          }
          widget.line = line;
          if (cm && !lineIsHidden(doc, line)) {
            var aboveVisible = heightAtLine(line) < doc.scrollTop;
            updateLineHeight(line, line.height + widgetHeight(widget));
            if (aboveVisible) {
              addToScrollTop(cm, widget.height);
            }
            cm.curOp.forceUpdate = true;
          }
          return true;
        });
        if (cm) {
          signalLater(cm, "lineWidgetAdded", cm, widget, typeof handle == "number" ? handle : lineNo(handle));
        }
        return widget;
      }
      var nextMarkerId = 0;
      var TextMarker = function(doc, type) {
        this.lines = [];
        this.type = type;
        this.doc = doc;
        this.id = ++nextMarkerId;
      };
      TextMarker.prototype.clear = function() {
        if (this.explicitlyCleared) {
          return;
        }
        var cm = this.doc.cm, withOp = cm && !cm.curOp;
        if (withOp) {
          startOperation(cm);
        }
        if (hasHandler(this, "clear")) {
          var found = this.find();
          if (found) {
            signalLater(this, "clear", found.from, found.to);
          }
        }
        var min = null, max = null;
        for (var i11 = 0; i11 < this.lines.length; ++i11) {
          var line = this.lines[i11];
          var span = getMarkedSpanFor(line.markedSpans, this);
          if (cm && !this.collapsed) {
            regLineChange(cm, lineNo(line), "text");
          } else if (cm) {
            if (span.to != null) {
              max = lineNo(line);
            }
            if (span.from != null) {
              min = lineNo(line);
            }
          }
          line.markedSpans = removeMarkedSpan(line.markedSpans, span);
          if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm) {
            updateLineHeight(line, textHeight(cm.display));
          }
        }
        if (cm && this.collapsed && !cm.options.lineWrapping) {
          for (var i$12 = 0; i$12 < this.lines.length; ++i$12) {
            var visual = visualLine(this.lines[i$12]), len = lineLength(visual);
            if (len > cm.display.maxLineLength) {
              cm.display.maxLine = visual;
              cm.display.maxLineLength = len;
              cm.display.maxLineChanged = true;
            }
          }
        }
        if (min != null && cm && this.collapsed) {
          regChange(cm, min, max + 1);
        }
        this.lines.length = 0;
        this.explicitlyCleared = true;
        if (this.atomic && this.doc.cantEdit) {
          this.doc.cantEdit = false;
          if (cm) {
            reCheckSelection(cm.doc);
          }
        }
        if (cm) {
          signalLater(cm, "markerCleared", cm, this, min, max);
        }
        if (withOp) {
          endOperation(cm);
        }
        if (this.parent) {
          this.parent.clear();
        }
      };
      TextMarker.prototype.find = function(side, lineObj) {
        if (side == null && this.type == "bookmark") {
          side = 1;
        }
        var from, to;
        for (var i11 = 0; i11 < this.lines.length; ++i11) {
          var line = this.lines[i11];
          var span = getMarkedSpanFor(line.markedSpans, this);
          if (span.from != null) {
            from = Pos(lineObj ? line : lineNo(line), span.from);
            if (side == -1) {
              return from;
            }
          }
          if (span.to != null) {
            to = Pos(lineObj ? line : lineNo(line), span.to);
            if (side == 1) {
              return to;
            }
          }
        }
        return from && { from, to };
      };
      TextMarker.prototype.changed = function() {
        var this$1 = this;
        var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
        if (!pos || !cm) {
          return;
        }
        runInOp(cm, function() {
          var line = pos.line, lineN = lineNo(pos.line);
          var view = findViewForLine(cm, lineN);
          if (view) {
            clearLineMeasurementCacheFor(view);
            cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
          }
          cm.curOp.updateMaxLine = true;
          if (!lineIsHidden(widget.doc, line) && widget.height != null) {
            var oldHeight = widget.height;
            widget.height = null;
            var dHeight = widgetHeight(widget) - oldHeight;
            if (dHeight) {
              updateLineHeight(line, line.height + dHeight);
            }
          }
          signalLater(cm, "markerChanged", cm, this$1);
        });
      };
      TextMarker.prototype.attachLine = function(line) {
        if (!this.lines.length && this.doc.cm) {
          var op = this.doc.cm.curOp;
          if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1) {
            (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
          }
        }
        this.lines.push(line);
      };
      TextMarker.prototype.detachLine = function(line) {
        this.lines.splice(indexOf(this.lines, line), 1);
        if (!this.lines.length && this.doc.cm) {
          var op = this.doc.cm.curOp;
          (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
        }
      };
      eventMixin(TextMarker);
      function markText(doc, from, to, options, type) {
        if (options && options.shared) {
          return markTextShared(doc, from, to, options, type);
        }
        if (doc.cm && !doc.cm.curOp) {
          return operation(doc.cm, markText)(doc, from, to, options, type);
        }
        var marker = new TextMarker(doc, type), diff = cmp(from, to);
        if (options) {
          copyObj(options, marker, false);
        }
        if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false) {
          return marker;
        }
        if (marker.replacedWith) {
          marker.collapsed = true;
          marker.widgetNode = eltP("span", [marker.replacedWith], "CodeMirror-widget");
          if (!options.handleMouseEvents) {
            marker.widgetNode.setAttribute("cm-ignore-events", "true");
          }
          if (options.insertLeft) {
            marker.widgetNode.insertLeft = true;
          }
        }
        if (marker.collapsed) {
          if (conflictingCollapsedRange(doc, from.line, from, to, marker) || from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker)) {
            throw new Error("Inserting collapsed marker partially overlapping an existing one");
          }
          seeCollapsedSpans();
        }
        if (marker.addToHistory) {
          addChangeToHistory(doc, { from, to, origin: "markText" }, doc.sel, NaN);
        }
        var curLine = from.line, cm = doc.cm, updateMaxLine;
        doc.iter(curLine, to.line + 1, function(line) {
          if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine) {
            updateMaxLine = true;
          }
          if (marker.collapsed && curLine != from.line) {
            updateLineHeight(line, 0);
          }
          addMarkedSpan(line, new MarkedSpan(marker, curLine == from.line ? from.ch : null, curLine == to.line ? to.ch : null), doc.cm && doc.cm.curOp);
          ++curLine;
        });
        if (marker.collapsed) {
          doc.iter(from.line, to.line + 1, function(line) {
            if (lineIsHidden(doc, line)) {
              updateLineHeight(line, 0);
            }
          });
        }
        if (marker.clearOnEnter) {
          on(marker, "beforeCursorEnter", function() {
            return marker.clear();
          });
        }
        if (marker.readOnly) {
          seeReadOnlySpans();
          if (doc.history.done.length || doc.history.undone.length) {
            doc.clearHistory();
          }
        }
        if (marker.collapsed) {
          marker.id = ++nextMarkerId;
          marker.atomic = true;
        }
        if (cm) {
          if (updateMaxLine) {
            cm.curOp.updateMaxLine = true;
          }
          if (marker.collapsed) {
            regChange(cm, from.line, to.line + 1);
          } else if (marker.className || marker.startStyle || marker.endStyle || marker.css || marker.attributes || marker.title) {
            for (var i11 = from.line; i11 <= to.line; i11++) {
              regLineChange(cm, i11, "text");
            }
          }
          if (marker.atomic) {
            reCheckSelection(cm.doc);
          }
          signalLater(cm, "markerAdded", cm, marker);
        }
        return marker;
      }
      var SharedTextMarker = function(markers, primary) {
        this.markers = markers;
        this.primary = primary;
        for (var i11 = 0; i11 < markers.length; ++i11) {
          markers[i11].parent = this;
        }
      };
      SharedTextMarker.prototype.clear = function() {
        if (this.explicitlyCleared) {
          return;
        }
        this.explicitlyCleared = true;
        for (var i11 = 0; i11 < this.markers.length; ++i11) {
          this.markers[i11].clear();
        }
        signalLater(this, "clear");
      };
      SharedTextMarker.prototype.find = function(side, lineObj) {
        return this.primary.find(side, lineObj);
      };
      eventMixin(SharedTextMarker);
      function markTextShared(doc, from, to, options, type) {
        options = copyObj(options);
        options.shared = false;
        var markers = [markText(doc, from, to, options, type)], primary = markers[0];
        var widget = options.widgetNode;
        linkedDocs(doc, function(doc2) {
          if (widget) {
            options.widgetNode = widget.cloneNode(true);
          }
          markers.push(markText(doc2, clipPos(doc2, from), clipPos(doc2, to), options, type));
          for (var i11 = 0; i11 < doc2.linked.length; ++i11) {
            if (doc2.linked[i11].isParent) {
              return;
            }
          }
          primary = lst(markers);
        });
        return new SharedTextMarker(markers, primary);
      }
      function findSharedMarkers(doc) {
        return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())), function(m4) {
          return m4.parent;
        });
      }
      function copySharedMarkers(doc, markers) {
        for (var i11 = 0; i11 < markers.length; i11++) {
          var marker = markers[i11], pos = marker.find();
          var mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
          if (cmp(mFrom, mTo)) {
            var subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
            marker.markers.push(subMark);
            subMark.parent = marker;
          }
        }
      }
      function detachSharedMarkers(markers) {
        var loop = function(i12) {
          var marker = markers[i12], linked = [marker.primary.doc];
          linkedDocs(marker.primary.doc, function(d6) {
            return linked.push(d6);
          });
          for (var j2 = 0; j2 < marker.markers.length; j2++) {
            var subMarker = marker.markers[j2];
            if (indexOf(linked, subMarker.doc) == -1) {
              subMarker.parent = null;
              marker.markers.splice(j2--, 1);
            }
          }
        };
        for (var i11 = 0; i11 < markers.length; i11++)
          loop(i11);
      }
      var nextDocId = 0;
      var Doc = function(text, mode, firstLine, lineSep, direction) {
        if (!(this instanceof Doc)) {
          return new Doc(text, mode, firstLine, lineSep, direction);
        }
        if (firstLine == null) {
          firstLine = 0;
        }
        BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
        this.first = firstLine;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = firstLine;
        var start = Pos(firstLine, 0);
        this.sel = simpleSelection(start);
        this.history = new History(null);
        this.id = ++nextDocId;
        this.modeOption = mode;
        this.lineSep = lineSep;
        this.direction = direction == "rtl" ? "rtl" : "ltr";
        this.extend = false;
        if (typeof text == "string") {
          text = this.splitLines(text);
        }
        updateDoc(this, { from: start, to: start, text });
        setSelection(this, simpleSelection(start), sel_dontScroll);
      };
      Doc.prototype = createObj(BranchChunk.prototype, {
        constructor: Doc,
        iter: function(from, to, op) {
          if (op) {
            this.iterN(from - this.first, to - from, op);
          } else {
            this.iterN(this.first, this.first + this.size, from);
          }
        },
        insert: function(at, lines) {
          var height = 0;
          for (var i11 = 0; i11 < lines.length; ++i11) {
            height += lines[i11].height;
          }
          this.insertInner(at - this.first, lines, height);
        },
        remove: function(at, n10) {
          this.removeInner(at - this.first, n10);
        },
        getValue: function(lineSep) {
          var lines = getLines(this, this.first, this.first + this.size);
          if (lineSep === false) {
            return lines;
          }
          return lines.join(lineSep || this.lineSeparator());
        },
        setValue: docMethodOp(function(code) {
          var top = Pos(this.first, 0), last = this.first + this.size - 1;
          makeChange(this, {
            from: top,
            to: Pos(last, getLine(this, last).text.length),
            text: this.splitLines(code),
            origin: "setValue",
            full: true
          }, true);
          if (this.cm) {
            scrollToCoords(this.cm, 0, 0);
          }
          setSelection(this, simpleSelection(top), sel_dontScroll);
        }),
        replaceRange: function(code, from, to, origin) {
          from = clipPos(this, from);
          to = to ? clipPos(this, to) : from;
          replaceRange(this, code, from, to, origin);
        },
        getRange: function(from, to, lineSep) {
          var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
          if (lineSep === false) {
            return lines;
          }
          if (lineSep === "") {
            return lines.join("");
          }
          return lines.join(lineSep || this.lineSeparator());
        },
        getLine: function(line) {
          var l4 = this.getLineHandle(line);
          return l4 && l4.text;
        },
        getLineHandle: function(line) {
          if (isLine(this, line)) {
            return getLine(this, line);
          }
        },
        getLineNumber: function(line) {
          return lineNo(line);
        },
        getLineHandleVisualStart: function(line) {
          if (typeof line == "number") {
            line = getLine(this, line);
          }
          return visualLine(line);
        },
        lineCount: function() {
          return this.size;
        },
        firstLine: function() {
          return this.first;
        },
        lastLine: function() {
          return this.first + this.size - 1;
        },
        clipPos: function(pos) {
          return clipPos(this, pos);
        },
        getCursor: function(start) {
          var range2 = this.sel.primary(), pos;
          if (start == null || start == "head") {
            pos = range2.head;
          } else if (start == "anchor") {
            pos = range2.anchor;
          } else if (start == "end" || start == "to" || start === false) {
            pos = range2.to();
          } else {
            pos = range2.from();
          }
          return pos;
        },
        listSelections: function() {
          return this.sel.ranges;
        },
        somethingSelected: function() {
          return this.sel.somethingSelected();
        },
        setCursor: docMethodOp(function(line, ch, options) {
          setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
        }),
        setSelection: docMethodOp(function(anchor, head, options) {
          setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
        }),
        extendSelection: docMethodOp(function(head, other, options) {
          extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
        }),
        extendSelections: docMethodOp(function(heads, options) {
          extendSelections(this, clipPosArray(this, heads), options);
        }),
        extendSelectionsBy: docMethodOp(function(f5, options) {
          var heads = map(this.sel.ranges, f5);
          extendSelections(this, clipPosArray(this, heads), options);
        }),
        setSelections: docMethodOp(function(ranges, primary, options) {
          if (!ranges.length) {
            return;
          }
          var out = [];
          for (var i11 = 0; i11 < ranges.length; i11++) {
            out[i11] = new Range(clipPos(this, ranges[i11].anchor), clipPos(this, ranges[i11].head || ranges[i11].anchor));
          }
          if (primary == null) {
            primary = Math.min(ranges.length - 1, this.sel.primIndex);
          }
          setSelection(this, normalizeSelection(this.cm, out, primary), options);
        }),
        addSelection: docMethodOp(function(anchor, head, options) {
          var ranges = this.sel.ranges.slice(0);
          ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
          setSelection(this, normalizeSelection(this.cm, ranges, ranges.length - 1), options);
        }),
        getSelection: function(lineSep) {
          var ranges = this.sel.ranges, lines;
          for (var i11 = 0; i11 < ranges.length; i11++) {
            var sel = getBetween(this, ranges[i11].from(), ranges[i11].to());
            lines = lines ? lines.concat(sel) : sel;
          }
          if (lineSep === false) {
            return lines;
          } else {
            return lines.join(lineSep || this.lineSeparator());
          }
        },
        getSelections: function(lineSep) {
          var parts = [], ranges = this.sel.ranges;
          for (var i11 = 0; i11 < ranges.length; i11++) {
            var sel = getBetween(this, ranges[i11].from(), ranges[i11].to());
            if (lineSep !== false) {
              sel = sel.join(lineSep || this.lineSeparator());
            }
            parts[i11] = sel;
          }
          return parts;
        },
        replaceSelection: function(code, collapse, origin) {
          var dup = [];
          for (var i11 = 0; i11 < this.sel.ranges.length; i11++) {
            dup[i11] = code;
          }
          this.replaceSelections(dup, collapse, origin || "+input");
        },
        replaceSelections: docMethodOp(function(code, collapse, origin) {
          var changes = [], sel = this.sel;
          for (var i11 = 0; i11 < sel.ranges.length; i11++) {
            var range2 = sel.ranges[i11];
            changes[i11] = { from: range2.from(), to: range2.to(), text: this.splitLines(code[i11]), origin };
          }
          var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
          for (var i$12 = changes.length - 1; i$12 >= 0; i$12--) {
            makeChange(this, changes[i$12]);
          }
          if (newSel) {
            setSelectionReplaceHistory(this, newSel);
          } else if (this.cm) {
            ensureCursorVisible(this.cm);
          }
        }),
        undo: docMethodOp(function() {
          makeChangeFromHistory(this, "undo");
        }),
        redo: docMethodOp(function() {
          makeChangeFromHistory(this, "redo");
        }),
        undoSelection: docMethodOp(function() {
          makeChangeFromHistory(this, "undo", true);
        }),
        redoSelection: docMethodOp(function() {
          makeChangeFromHistory(this, "redo", true);
        }),
        setExtending: function(val) {
          this.extend = val;
        },
        getExtending: function() {
          return this.extend;
        },
        historySize: function() {
          var hist = this.history, done = 0, undone = 0;
          for (var i11 = 0; i11 < hist.done.length; i11++) {
            if (!hist.done[i11].ranges) {
              ++done;
            }
          }
          for (var i$12 = 0; i$12 < hist.undone.length; i$12++) {
            if (!hist.undone[i$12].ranges) {
              ++undone;
            }
          }
          return { undo: done, redo: undone };
        },
        clearHistory: function() {
          var this$1 = this;
          this.history = new History(this.history);
          linkedDocs(this, function(doc) {
            return doc.history = this$1.history;
          }, true);
        },
        markClean: function() {
          this.cleanGeneration = this.changeGeneration(true);
        },
        changeGeneration: function(forceSplit) {
          if (forceSplit) {
            this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
          }
          return this.history.generation;
        },
        isClean: function(gen) {
          return this.history.generation == (gen || this.cleanGeneration);
        },
        getHistory: function() {
          return {
            done: copyHistoryArray(this.history.done),
            undone: copyHistoryArray(this.history.undone)
          };
        },
        setHistory: function(histData) {
          var hist = this.history = new History(this.history);
          hist.done = copyHistoryArray(histData.done.slice(0), null, true);
          hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
        },
        setGutterMarker: docMethodOp(function(line, gutterID, value) {
          return changeLine(this, line, "gutter", function(line2) {
            var markers = line2.gutterMarkers || (line2.gutterMarkers = {});
            markers[gutterID] = value;
            if (!value && isEmpty(markers)) {
              line2.gutterMarkers = null;
            }
            return true;
          });
        }),
        clearGutter: docMethodOp(function(gutterID) {
          var this$1 = this;
          this.iter(function(line) {
            if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
              changeLine(this$1, line, "gutter", function() {
                line.gutterMarkers[gutterID] = null;
                if (isEmpty(line.gutterMarkers)) {
                  line.gutterMarkers = null;
                }
                return true;
              });
            }
          });
        }),
        lineInfo: function(line) {
          var n10;
          if (typeof line == "number") {
            if (!isLine(this, line)) {
              return null;
            }
            n10 = line;
            line = getLine(this, line);
            if (!line) {
              return null;
            }
          } else {
            n10 = lineNo(line);
            if (n10 == null) {
              return null;
            }
          }
          return {
            line: n10,
            handle: line,
            text: line.text,
            gutterMarkers: line.gutterMarkers,
            textClass: line.textClass,
            bgClass: line.bgClass,
            wrapClass: line.wrapClass,
            widgets: line.widgets
          };
        },
        addLineClass: docMethodOp(function(handle, where, cls) {
          return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
            var prop2 = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
            if (!line[prop2]) {
              line[prop2] = cls;
            } else if (classTest(cls).test(line[prop2])) {
              return false;
            } else {
              line[prop2] += " " + cls;
            }
            return true;
          });
        }),
        removeLineClass: docMethodOp(function(handle, where, cls) {
          return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
            var prop2 = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
            var cur = line[prop2];
            if (!cur) {
              return false;
            } else if (cls == null) {
              line[prop2] = null;
            } else {
              var found = cur.match(classTest(cls));
              if (!found) {
                return false;
              }
              var end = found.index + found[0].length;
              line[prop2] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
            }
            return true;
          });
        }),
        addLineWidget: docMethodOp(function(handle, node, options) {
          return addLineWidget(this, handle, node, options);
        }),
        removeLineWidget: function(widget) {
          widget.clear();
        },
        markText: function(from, to, options) {
          return markText(this, clipPos(this, from), clipPos(this, to), options, options && options.type || "range");
        },
        setBookmark: function(pos, options) {
          var realOpts = {
            replacedWith: options && (options.nodeType == null ? options.widget : options),
            insertLeft: options && options.insertLeft,
            clearWhenEmpty: false,
            shared: options && options.shared,
            handleMouseEvents: options && options.handleMouseEvents
          };
          pos = clipPos(this, pos);
          return markText(this, pos, pos, realOpts, "bookmark");
        },
        findMarksAt: function(pos) {
          pos = clipPos(this, pos);
          var markers = [], spans = getLine(this, pos.line).markedSpans;
          if (spans) {
            for (var i11 = 0; i11 < spans.length; ++i11) {
              var span = spans[i11];
              if ((span.from == null || span.from <= pos.ch) && (span.to == null || span.to >= pos.ch)) {
                markers.push(span.marker.parent || span.marker);
              }
            }
          }
          return markers;
        },
        findMarks: function(from, to, filter) {
          from = clipPos(this, from);
          to = clipPos(this, to);
          var found = [], lineNo2 = from.line;
          this.iter(from.line, to.line + 1, function(line) {
            var spans = line.markedSpans;
            if (spans) {
              for (var i11 = 0; i11 < spans.length; i11++) {
                var span = spans[i11];
                if (!(span.to != null && lineNo2 == from.line && from.ch >= span.to || span.from == null && lineNo2 != from.line || span.from != null && lineNo2 == to.line && span.from >= to.ch) && (!filter || filter(span.marker))) {
                  found.push(span.marker.parent || span.marker);
                }
              }
            }
            ++lineNo2;
          });
          return found;
        },
        getAllMarks: function() {
          var markers = [];
          this.iter(function(line) {
            var sps = line.markedSpans;
            if (sps) {
              for (var i11 = 0; i11 < sps.length; ++i11) {
                if (sps[i11].from != null) {
                  markers.push(sps[i11].marker);
                }
              }
            }
          });
          return markers;
        },
        posFromIndex: function(off2) {
          var ch, lineNo2 = this.first, sepSize = this.lineSeparator().length;
          this.iter(function(line) {
            var sz = line.text.length + sepSize;
            if (sz > off2) {
              ch = off2;
              return true;
            }
            off2 -= sz;
            ++lineNo2;
          });
          return clipPos(this, Pos(lineNo2, ch));
        },
        indexFromPos: function(coords) {
          coords = clipPos(this, coords);
          var index = coords.ch;
          if (coords.line < this.first || coords.ch < 0) {
            return 0;
          }
          var sepSize = this.lineSeparator().length;
          this.iter(this.first, coords.line, function(line) {
            index += line.text.length + sepSize;
          });
          return index;
        },
        copy: function(copyHistory) {
          var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
          doc.scrollTop = this.scrollTop;
          doc.scrollLeft = this.scrollLeft;
          doc.sel = this.sel;
          doc.extend = false;
          if (copyHistory) {
            doc.history.undoDepth = this.history.undoDepth;
            doc.setHistory(this.getHistory());
          }
          return doc;
        },
        linkedDoc: function(options) {
          if (!options) {
            options = {};
          }
          var from = this.first, to = this.first + this.size;
          if (options.from != null && options.from > from) {
            from = options.from;
          }
          if (options.to != null && options.to < to) {
            to = options.to;
          }
          var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep, this.direction);
          if (options.sharedHist) {
            copy.history = this.history;
          }
          (this.linked || (this.linked = [])).push({ doc: copy, sharedHist: options.sharedHist });
          copy.linked = [{ doc: this, isParent: true, sharedHist: options.sharedHist }];
          copySharedMarkers(copy, findSharedMarkers(this));
          return copy;
        },
        unlinkDoc: function(other) {
          if (other instanceof CodeMirror3) {
            other = other.doc;
          }
          if (this.linked) {
            for (var i11 = 0; i11 < this.linked.length; ++i11) {
              var link = this.linked[i11];
              if (link.doc != other) {
                continue;
              }
              this.linked.splice(i11, 1);
              other.unlinkDoc(this);
              detachSharedMarkers(findSharedMarkers(this));
              break;
            }
          }
          if (other.history == this.history) {
            var splitIds = [other.id];
            linkedDocs(other, function(doc) {
              return splitIds.push(doc.id);
            }, true);
            other.history = new History(null);
            other.history.done = copyHistoryArray(this.history.done, splitIds);
            other.history.undone = copyHistoryArray(this.history.undone, splitIds);
          }
        },
        iterLinkedDocs: function(f5) {
          linkedDocs(this, f5);
        },
        getMode: function() {
          return this.mode;
        },
        getEditor: function() {
          return this.cm;
        },
        splitLines: function(str) {
          if (this.lineSep) {
            return str.split(this.lineSep);
          }
          return splitLinesAuto(str);
        },
        lineSeparator: function() {
          return this.lineSep || "\n";
        },
        setDirection: docMethodOp(function(dir) {
          if (dir != "rtl") {
            dir = "ltr";
          }
          if (dir == this.direction) {
            return;
          }
          this.direction = dir;
          this.iter(function(line) {
            return line.order = null;
          });
          if (this.cm) {
            directionChanged(this.cm);
          }
        })
      });
      Doc.prototype.eachLine = Doc.prototype.iter;
      var lastDrop = 0;
      function onDrop(e4) {
        var cm = this;
        clearDragCursor(cm);
        if (signalDOMEvent(cm, e4) || eventInWidget(cm.display, e4)) {
          return;
        }
        e_preventDefault(e4);
        if (ie) {
          lastDrop = +new Date();
        }
        var pos = posFromMouse(cm, e4, true), files = e4.dataTransfer.files;
        if (!pos || cm.isReadOnly()) {
          return;
        }
        if (files && files.length && window.FileReader && window.File) {
          var n10 = files.length, text = Array(n10), read = 0;
          var markAsReadAndPasteIfAllFilesAreRead = function() {
            if (++read == n10) {
              operation(cm, function() {
                pos = clipPos(cm.doc, pos);
                var change = {
                  from: pos,
                  to: pos,
                  text: cm.doc.splitLines(text.filter(function(t2) {
                    return t2 != null;
                  }).join(cm.doc.lineSeparator())),
                  origin: "paste"
                };
                makeChange(cm.doc, change);
                setSelectionReplaceHistory(cm.doc, simpleSelection(clipPos(cm.doc, pos), clipPos(cm.doc, changeEnd(change))));
              })();
            }
          };
          var readTextFromFile = function(file, i12) {
            if (cm.options.allowDropFileTypes && indexOf(cm.options.allowDropFileTypes, file.type) == -1) {
              markAsReadAndPasteIfAllFilesAreRead();
              return;
            }
            var reader = new FileReader();
            reader.onerror = function() {
              return markAsReadAndPasteIfAllFilesAreRead();
            };
            reader.onload = function() {
              var content = reader.result;
              if (/[\x00-\x08\x0e-\x1f]{2}/.test(content)) {
                markAsReadAndPasteIfAllFilesAreRead();
                return;
              }
              text[i12] = content;
              markAsReadAndPasteIfAllFilesAreRead();
            };
            reader.readAsText(file);
          };
          for (var i11 = 0; i11 < files.length; i11++) {
            readTextFromFile(files[i11], i11);
          }
        } else {
          if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
            cm.state.draggingText(e4);
            setTimeout(function() {
              return cm.display.input.focus();
            }, 20);
            return;
          }
          try {
            var text$1 = e4.dataTransfer.getData("Text");
            if (text$1) {
              var selected;
              if (cm.state.draggingText && !cm.state.draggingText.copy) {
                selected = cm.listSelections();
              }
              setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
              if (selected) {
                for (var i$12 = 0; i$12 < selected.length; ++i$12) {
                  replaceRange(cm.doc, "", selected[i$12].anchor, selected[i$12].head, "drag");
                }
              }
              cm.replaceSelection(text$1, "around", "paste");
              cm.display.input.focus();
            }
          } catch (e$1) {
          }
        }
      }
      function onDragStart(cm, e4) {
        if (ie && (!cm.state.draggingText || +new Date() - lastDrop < 100)) {
          e_stop(e4);
          return;
        }
        if (signalDOMEvent(cm, e4) || eventInWidget(cm.display, e4)) {
          return;
        }
        e4.dataTransfer.setData("Text", cm.getSelection());
        e4.dataTransfer.effectAllowed = "copyMove";
        if (e4.dataTransfer.setDragImage && !safari) {
          var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
          img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
          if (presto) {
            img.width = img.height = 1;
            cm.display.wrapper.appendChild(img);
            img._top = img.offsetTop;
          }
          e4.dataTransfer.setDragImage(img, 0, 0);
          if (presto) {
            img.parentNode.removeChild(img);
          }
        }
      }
      function onDragOver(cm, e4) {
        var pos = posFromMouse(cm, e4);
        if (!pos) {
          return;
        }
        var frag = document.createDocumentFragment();
        drawSelectionCursor(cm, pos, frag);
        if (!cm.display.dragCursor) {
          cm.display.dragCursor = elt("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
          cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
        }
        removeChildrenAndAdd(cm.display.dragCursor, frag);
      }
      function clearDragCursor(cm) {
        if (cm.display.dragCursor) {
          cm.display.lineSpace.removeChild(cm.display.dragCursor);
          cm.display.dragCursor = null;
        }
      }
      function forEachCodeMirror(f5) {
        if (!document.getElementsByClassName) {
          return;
        }
        var byClass = document.getElementsByClassName("CodeMirror"), editors = [];
        for (var i11 = 0; i11 < byClass.length; i11++) {
          var cm = byClass[i11].CodeMirror;
          if (cm) {
            editors.push(cm);
          }
        }
        if (editors.length) {
          editors[0].operation(function() {
            for (var i12 = 0; i12 < editors.length; i12++) {
              f5(editors[i12]);
            }
          });
        }
      }
      var globalsRegistered = false;
      function ensureGlobalHandlers() {
        if (globalsRegistered) {
          return;
        }
        registerGlobalHandlers();
        globalsRegistered = true;
      }
      function registerGlobalHandlers() {
        var resizeTimer;
        on(window, "resize", function() {
          if (resizeTimer == null) {
            resizeTimer = setTimeout(function() {
              resizeTimer = null;
              forEachCodeMirror(onResize);
            }, 100);
          }
        });
        on(window, "blur", function() {
          return forEachCodeMirror(onBlur);
        });
      }
      function onResize(cm) {
        var d6 = cm.display;
        d6.cachedCharWidth = d6.cachedTextHeight = d6.cachedPaddingH = null;
        d6.scrollbarsClipped = false;
        cm.setSize();
      }
      var keyNames = {
        3: "Pause",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        106: "*",
        107: "=",
        109: "-",
        110: ".",
        111: "/",
        145: "ScrollLock",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        224: "Mod",
        63232: "Up",
        63233: "Down",
        63234: "Left",
        63235: "Right",
        63272: "Delete",
        63273: "Home",
        63275: "End",
        63276: "PageUp",
        63277: "PageDown",
        63302: "Insert"
      };
      for (var i10 = 0; i10 < 10; i10++) {
        keyNames[i10 + 48] = keyNames[i10 + 96] = String(i10);
      }
      for (var i$1 = 65; i$1 <= 90; i$1++) {
        keyNames[i$1] = String.fromCharCode(i$1);
      }
      for (var i$2 = 1; i$2 <= 12; i$2++) {
        keyNames[i$2 + 111] = keyNames[i$2 + 63235] = "F" + i$2;
      }
      var keyMap = {};
      keyMap.basic = {
        "Left": "goCharLeft",
        "Right": "goCharRight",
        "Up": "goLineUp",
        "Down": "goLineDown",
        "End": "goLineEnd",
        "Home": "goLineStartSmart",
        "PageUp": "goPageUp",
        "PageDown": "goPageDown",
        "Delete": "delCharAfter",
        "Backspace": "delCharBefore",
        "Shift-Backspace": "delCharBefore",
        "Tab": "defaultTab",
        "Shift-Tab": "indentAuto",
        "Enter": "newlineAndIndent",
        "Insert": "toggleOverwrite",
        "Esc": "singleSelection"
      };
      keyMap.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Up": "goLineUp",
        "Ctrl-Down": "goLineDown",
        "Ctrl-Left": "goGroupLeft",
        "Ctrl-Right": "goGroupRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delGroupBefore",
        "Ctrl-Delete": "delGroupAfter",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        "Ctrl-U": "undoSelection",
        "Shift-Ctrl-U": "redoSelection",
        "Alt-U": "redoSelection",
        "fallthrough": "basic"
      };
      keyMap.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageDown",
        "Shift-Ctrl-V": "goPageUp",
        "Ctrl-D": "delCharAfter",
        "Ctrl-H": "delCharBefore",
        "Alt-Backspace": "delWordBefore",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars",
        "Ctrl-O": "openLine"
      };
      keyMap.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Home": "goDocStart",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
        "Cmd-Left": "goLineLeft",
        "Cmd-Right": "goLineRight",
        "Alt-Backspace": "delGroupBefore",
        "Ctrl-Alt-Backspace": "delGroupAfter",
        "Alt-Delete": "delGroupAfter",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        "Cmd-Backspace": "delWrappedLineLeft",
        "Cmd-Delete": "delWrappedLineRight",
        "Cmd-U": "undoSelection",
        "Shift-Cmd-U": "redoSelection",
        "Ctrl-Up": "goDocStart",
        "Ctrl-Down": "goDocEnd",
        "fallthrough": ["basic", "emacsy"]
      };
      keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;
      function normalizeKeyName(name) {
        var parts = name.split(/-(?!$)/);
        name = parts[parts.length - 1];
        var alt, ctrl, shift, cmd;
        for (var i11 = 0; i11 < parts.length - 1; i11++) {
          var mod = parts[i11];
          if (/^(cmd|meta|m)$/i.test(mod)) {
            cmd = true;
          } else if (/^a(lt)?$/i.test(mod)) {
            alt = true;
          } else if (/^(c|ctrl|control)$/i.test(mod)) {
            ctrl = true;
          } else if (/^s(hift)?$/i.test(mod)) {
            shift = true;
          } else {
            throw new Error("Unrecognized modifier name: " + mod);
          }
        }
        if (alt) {
          name = "Alt-" + name;
        }
        if (ctrl) {
          name = "Ctrl-" + name;
        }
        if (cmd) {
          name = "Cmd-" + name;
        }
        if (shift) {
          name = "Shift-" + name;
        }
        return name;
      }
      function normalizeKeyMap(keymap) {
        var copy = {};
        for (var keyname in keymap) {
          if (keymap.hasOwnProperty(keyname)) {
            var value = keymap[keyname];
            if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) {
              continue;
            }
            if (value == "...") {
              delete keymap[keyname];
              continue;
            }
            var keys = map(keyname.split(" "), normalizeKeyName);
            for (var i11 = 0; i11 < keys.length; i11++) {
              var val = void 0, name = void 0;
              if (i11 == keys.length - 1) {
                name = keys.join(" ");
                val = value;
              } else {
                name = keys.slice(0, i11 + 1).join(" ");
                val = "...";
              }
              var prev = copy[name];
              if (!prev) {
                copy[name] = val;
              } else if (prev != val) {
                throw new Error("Inconsistent bindings for " + name);
              }
            }
            delete keymap[keyname];
          }
        }
        for (var prop2 in copy) {
          keymap[prop2] = copy[prop2];
        }
        return keymap;
      }
      function lookupKey(key, map2, handle, context) {
        map2 = getKeyMap(map2);
        var found = map2.call ? map2.call(key, context) : map2[key];
        if (found === false) {
          return "nothing";
        }
        if (found === "...") {
          return "multi";
        }
        if (found != null && handle(found)) {
          return "handled";
        }
        if (map2.fallthrough) {
          if (Object.prototype.toString.call(map2.fallthrough) != "[object Array]") {
            return lookupKey(key, map2.fallthrough, handle, context);
          }
          for (var i11 = 0; i11 < map2.fallthrough.length; i11++) {
            var result = lookupKey(key, map2.fallthrough[i11], handle, context);
            if (result) {
              return result;
            }
          }
        }
      }
      function isModifierKey(value) {
        var name = typeof value == "string" ? value : keyNames[value.keyCode];
        return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
      }
      function addModifierNames(name, event2, noShift) {
        var base = name;
        if (event2.altKey && base != "Alt") {
          name = "Alt-" + name;
        }
        if ((flipCtrlCmd ? event2.metaKey : event2.ctrlKey) && base != "Ctrl") {
          name = "Ctrl-" + name;
        }
        if ((flipCtrlCmd ? event2.ctrlKey : event2.metaKey) && base != "Mod") {
          name = "Cmd-" + name;
        }
        if (!noShift && event2.shiftKey && base != "Shift") {
          name = "Shift-" + name;
        }
        return name;
      }
      function keyName(event2, noShift) {
        if (presto && event2.keyCode == 34 && event2["char"]) {
          return false;
        }
        var name = keyNames[event2.keyCode];
        if (name == null || event2.altGraphKey) {
          return false;
        }
        if (event2.keyCode == 3 && event2.code) {
          name = event2.code;
        }
        return addModifierNames(name, event2, noShift);
      }
      function getKeyMap(val) {
        return typeof val == "string" ? keyMap[val] : val;
      }
      function deleteNearSelection(cm, compute) {
        var ranges = cm.doc.sel.ranges, kill = [];
        for (var i11 = 0; i11 < ranges.length; i11++) {
          var toKill = compute(ranges[i11]);
          while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
            var replaced = kill.pop();
            if (cmp(replaced.from, toKill.from) < 0) {
              toKill.from = replaced.from;
              break;
            }
          }
          kill.push(toKill);
        }
        runInOp(cm, function() {
          for (var i12 = kill.length - 1; i12 >= 0; i12--) {
            replaceRange(cm.doc, "", kill[i12].from, kill[i12].to, "+delete");
          }
          ensureCursorVisible(cm);
        });
      }
      function moveCharLogically(line, ch, dir) {
        var target = skipExtendingChars(line.text, ch + dir, dir);
        return target < 0 || target > line.text.length ? null : target;
      }
      function moveLogically(line, start, dir) {
        var ch = moveCharLogically(line, start.ch, dir);
        return ch == null ? null : new Pos(start.line, ch, dir < 0 ? "after" : "before");
      }
      function endOfLine(visually, cm, lineObj, lineNo2, dir) {
        if (visually) {
          if (cm.doc.direction == "rtl") {
            dir = -dir;
          }
          var order = getOrder(lineObj, cm.doc.direction);
          if (order) {
            var part = dir < 0 ? lst(order) : order[0];
            var moveInStorageOrder = dir < 0 == (part.level == 1);
            var sticky = moveInStorageOrder ? "after" : "before";
            var ch;
            if (part.level > 0 || cm.doc.direction == "rtl") {
              var prep = prepareMeasureForLine(cm, lineObj);
              ch = dir < 0 ? lineObj.text.length - 1 : 0;
              var targetTop = measureCharPrepared(cm, prep, ch).top;
              ch = findFirst(function(ch2) {
                return measureCharPrepared(cm, prep, ch2).top == targetTop;
              }, dir < 0 == (part.level == 1) ? part.from : part.to - 1, ch);
              if (sticky == "before") {
                ch = moveCharLogically(lineObj, ch, 1);
              }
            } else {
              ch = dir < 0 ? part.to : part.from;
            }
            return new Pos(lineNo2, ch, sticky);
          }
        }
        return new Pos(lineNo2, dir < 0 ? lineObj.text.length : 0, dir < 0 ? "before" : "after");
      }
      function moveVisually(cm, line, start, dir) {
        var bidi = getOrder(line, cm.doc.direction);
        if (!bidi) {
          return moveLogically(line, start, dir);
        }
        if (start.ch >= line.text.length) {
          start.ch = line.text.length;
          start.sticky = "before";
        } else if (start.ch <= 0) {
          start.ch = 0;
          start.sticky = "after";
        }
        var partPos = getBidiPartAt(bidi, start.ch, start.sticky), part = bidi[partPos];
        if (cm.doc.direction == "ltr" && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) {
          return moveLogically(line, start, dir);
        }
        var mv = function(pos, dir2) {
          return moveCharLogically(line, pos instanceof Pos ? pos.ch : pos, dir2);
        };
        var prep;
        var getWrappedLineExtent = function(ch2) {
          if (!cm.options.lineWrapping) {
            return { begin: 0, end: line.text.length };
          }
          prep = prep || prepareMeasureForLine(cm, line);
          return wrappedLineExtentChar(cm, line, prep, ch2);
        };
        var wrappedLineExtent2 = getWrappedLineExtent(start.sticky == "before" ? mv(start, -1) : start.ch);
        if (cm.doc.direction == "rtl" || part.level == 1) {
          var moveInStorageOrder = part.level == 1 == dir < 0;
          var ch = mv(start, moveInStorageOrder ? 1 : -1);
          if (ch != null && (!moveInStorageOrder ? ch >= part.from && ch >= wrappedLineExtent2.begin : ch <= part.to && ch <= wrappedLineExtent2.end)) {
            var sticky = moveInStorageOrder ? "before" : "after";
            return new Pos(start.line, ch, sticky);
          }
        }
        var searchInVisualLine = function(partPos2, dir2, wrappedLineExtent3) {
          var getRes = function(ch3, moveInStorageOrder3) {
            return moveInStorageOrder3 ? new Pos(start.line, mv(ch3, 1), "before") : new Pos(start.line, ch3, "after");
          };
          for (; partPos2 >= 0 && partPos2 < bidi.length; partPos2 += dir2) {
            var part2 = bidi[partPos2];
            var moveInStorageOrder2 = dir2 > 0 == (part2.level != 1);
            var ch2 = moveInStorageOrder2 ? wrappedLineExtent3.begin : mv(wrappedLineExtent3.end, -1);
            if (part2.from <= ch2 && ch2 < part2.to) {
              return getRes(ch2, moveInStorageOrder2);
            }
            ch2 = moveInStorageOrder2 ? part2.from : mv(part2.to, -1);
            if (wrappedLineExtent3.begin <= ch2 && ch2 < wrappedLineExtent3.end) {
              return getRes(ch2, moveInStorageOrder2);
            }
          }
        };
        var res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent2);
        if (res) {
          return res;
        }
        var nextCh = dir > 0 ? wrappedLineExtent2.end : mv(wrappedLineExtent2.begin, -1);
        if (nextCh != null && !(dir > 0 && nextCh == line.text.length)) {
          res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh));
          if (res) {
            return res;
          }
        }
        return null;
      }
      var commands = {
        selectAll,
        singleSelection: function(cm) {
          return cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
        },
        killLine: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            if (range2.empty()) {
              var len = getLine(cm.doc, range2.head.line).text.length;
              if (range2.head.ch == len && range2.head.line < cm.lastLine()) {
                return { from: range2.head, to: Pos(range2.head.line + 1, 0) };
              } else {
                return { from: range2.head, to: Pos(range2.head.line, len) };
              }
            } else {
              return { from: range2.from(), to: range2.to() };
            }
          });
        },
        deleteLine: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            return {
              from: Pos(range2.from().line, 0),
              to: clipPos(cm.doc, Pos(range2.to().line + 1, 0))
            };
          });
        },
        delLineLeft: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            return {
              from: Pos(range2.from().line, 0),
              to: range2.from()
            };
          });
        },
        delWrappedLineLeft: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            var top = cm.charCoords(range2.head, "div").top + 5;
            var leftPos = cm.coordsChar({ left: 0, top }, "div");
            return { from: leftPos, to: range2.from() };
          });
        },
        delWrappedLineRight: function(cm) {
          return deleteNearSelection(cm, function(range2) {
            var top = cm.charCoords(range2.head, "div").top + 5;
            var rightPos = cm.coordsChar({ left: cm.display.lineDiv.offsetWidth + 100, top }, "div");
            return { from: range2.from(), to: rightPos };
          });
        },
        undo: function(cm) {
          return cm.undo();
        },
        redo: function(cm) {
          return cm.redo();
        },
        undoSelection: function(cm) {
          return cm.undoSelection();
        },
        redoSelection: function(cm) {
          return cm.redoSelection();
        },
        goDocStart: function(cm) {
          return cm.extendSelection(Pos(cm.firstLine(), 0));
        },
        goDocEnd: function(cm) {
          return cm.extendSelection(Pos(cm.lastLine()));
        },
        goLineStart: function(cm) {
          return cm.extendSelectionsBy(function(range2) {
            return lineStart(cm, range2.head.line);
          }, { origin: "+move", bias: 1 });
        },
        goLineStartSmart: function(cm) {
          return cm.extendSelectionsBy(function(range2) {
            return lineStartSmart(cm, range2.head);
          }, { origin: "+move", bias: 1 });
        },
        goLineEnd: function(cm) {
          return cm.extendSelectionsBy(function(range2) {
            return lineEnd(cm, range2.head.line);
          }, { origin: "+move", bias: -1 });
        },
        goLineRight: function(cm) {
          return cm.extendSelectionsBy(function(range2) {
            var top = cm.cursorCoords(range2.head, "div").top + 5;
            return cm.coordsChar({ left: cm.display.lineDiv.offsetWidth + 100, top }, "div");
          }, sel_move);
        },
        goLineLeft: function(cm) {
          return cm.extendSelectionsBy(function(range2) {
            var top = cm.cursorCoords(range2.head, "div").top + 5;
            return cm.coordsChar({ left: 0, top }, "div");
          }, sel_move);
        },
        goLineLeftSmart: function(cm) {
          return cm.extendSelectionsBy(function(range2) {
            var top = cm.cursorCoords(range2.head, "div").top + 5;
            var pos = cm.coordsChar({ left: 0, top }, "div");
            if (pos.ch < cm.getLine(pos.line).search(/\S/)) {
              return lineStartSmart(cm, range2.head);
            }
            return pos;
          }, sel_move);
        },
        goLineUp: function(cm) {
          return cm.moveV(-1, "line");
        },
        goLineDown: function(cm) {
          return cm.moveV(1, "line");
        },
        goPageUp: function(cm) {
          return cm.moveV(-1, "page");
        },
        goPageDown: function(cm) {
          return cm.moveV(1, "page");
        },
        goCharLeft: function(cm) {
          return cm.moveH(-1, "char");
        },
        goCharRight: function(cm) {
          return cm.moveH(1, "char");
        },
        goColumnLeft: function(cm) {
          return cm.moveH(-1, "column");
        },
        goColumnRight: function(cm) {
          return cm.moveH(1, "column");
        },
        goWordLeft: function(cm) {
          return cm.moveH(-1, "word");
        },
        goGroupRight: function(cm) {
          return cm.moveH(1, "group");
        },
        goGroupLeft: function(cm) {
          return cm.moveH(-1, "group");
        },
        goWordRight: function(cm) {
          return cm.moveH(1, "word");
        },
        delCharBefore: function(cm) {
          return cm.deleteH(-1, "codepoint");
        },
        delCharAfter: function(cm) {
          return cm.deleteH(1, "char");
        },
        delWordBefore: function(cm) {
          return cm.deleteH(-1, "word");
        },
        delWordAfter: function(cm) {
          return cm.deleteH(1, "word");
        },
        delGroupBefore: function(cm) {
          return cm.deleteH(-1, "group");
        },
        delGroupAfter: function(cm) {
          return cm.deleteH(1, "group");
        },
        indentAuto: function(cm) {
          return cm.indentSelection("smart");
        },
        indentMore: function(cm) {
          return cm.indentSelection("add");
        },
        indentLess: function(cm) {
          return cm.indentSelection("subtract");
        },
        insertTab: function(cm) {
          return cm.replaceSelection("	");
        },
        insertSoftTab: function(cm) {
          var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
          for (var i11 = 0; i11 < ranges.length; i11++) {
            var pos = ranges[i11].from();
            var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
            spaces.push(spaceStr(tabSize - col % tabSize));
          }
          cm.replaceSelections(spaces);
        },
        defaultTab: function(cm) {
          if (cm.somethingSelected()) {
            cm.indentSelection("add");
          } else {
            cm.execCommand("insertTab");
          }
        },
        transposeChars: function(cm) {
          return runInOp(cm, function() {
            var ranges = cm.listSelections(), newSel = [];
            for (var i11 = 0; i11 < ranges.length; i11++) {
              if (!ranges[i11].empty()) {
                continue;
              }
              var cur = ranges[i11].head, line = getLine(cm.doc, cur.line).text;
              if (line) {
                if (cur.ch == line.length) {
                  cur = new Pos(cur.line, cur.ch - 1);
                }
                if (cur.ch > 0) {
                  cur = new Pos(cur.line, cur.ch + 1);
                  cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2), Pos(cur.line, cur.ch - 2), cur, "+transpose");
                } else if (cur.line > cm.doc.first) {
                  var prev = getLine(cm.doc, cur.line - 1).text;
                  if (prev) {
                    cur = new Pos(cur.line, 1);
                    cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() + prev.charAt(prev.length - 1), Pos(cur.line - 1, prev.length - 1), cur, "+transpose");
                  }
                }
              }
              newSel.push(new Range(cur, cur));
            }
            cm.setSelections(newSel);
          });
        },
        newlineAndIndent: function(cm) {
          return runInOp(cm, function() {
            var sels = cm.listSelections();
            for (var i11 = sels.length - 1; i11 >= 0; i11--) {
              cm.replaceRange(cm.doc.lineSeparator(), sels[i11].anchor, sels[i11].head, "+input");
            }
            sels = cm.listSelections();
            for (var i$12 = 0; i$12 < sels.length; i$12++) {
              cm.indentLine(sels[i$12].from().line, null, true);
            }
            ensureCursorVisible(cm);
          });
        },
        openLine: function(cm) {
          return cm.replaceSelection("\n", "start");
        },
        toggleOverwrite: function(cm) {
          return cm.toggleOverwrite();
        }
      };
      function lineStart(cm, lineN) {
        var line = getLine(cm.doc, lineN);
        var visual = visualLine(line);
        if (visual != line) {
          lineN = lineNo(visual);
        }
        return endOfLine(true, cm, visual, lineN, 1);
      }
      function lineEnd(cm, lineN) {
        var line = getLine(cm.doc, lineN);
        var visual = visualLineEnd(line);
        if (visual != line) {
          lineN = lineNo(visual);
        }
        return endOfLine(true, cm, line, lineN, -1);
      }
      function lineStartSmart(cm, pos) {
        var start = lineStart(cm, pos.line);
        var line = getLine(cm.doc, start.line);
        var order = getOrder(line, cm.doc.direction);
        if (!order || order[0].level == 0) {
          var firstNonWS = Math.max(start.ch, line.text.search(/\S/));
          var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
          return Pos(start.line, inWS ? 0 : firstNonWS, start.sticky);
        }
        return start;
      }
      function doHandleBinding(cm, bound, dropShift) {
        if (typeof bound == "string") {
          bound = commands[bound];
          if (!bound) {
            return false;
          }
        }
        cm.display.input.ensurePolled();
        var prevShift = cm.display.shift, done = false;
        try {
          if (cm.isReadOnly()) {
            cm.state.suppressEdits = true;
          }
          if (dropShift) {
            cm.display.shift = false;
          }
          done = bound(cm) != Pass;
        } finally {
          cm.display.shift = prevShift;
          cm.state.suppressEdits = false;
        }
        return done;
      }
      function lookupKeyForEditor(cm, name, handle) {
        for (var i11 = 0; i11 < cm.state.keyMaps.length; i11++) {
          var result = lookupKey(name, cm.state.keyMaps[i11], handle, cm);
          if (result) {
            return result;
          }
        }
        return cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm) || lookupKey(name, cm.options.keyMap, handle, cm);
      }
      var stopSeq = new Delayed();
      function dispatchKey(cm, name, e4, handle) {
        var seq = cm.state.keySeq;
        if (seq) {
          if (isModifierKey(name)) {
            return "handled";
          }
          if (/\'$/.test(name)) {
            cm.state.keySeq = null;
          } else {
            stopSeq.set(50, function() {
              if (cm.state.keySeq == seq) {
                cm.state.keySeq = null;
                cm.display.input.reset();
              }
            });
          }
          if (dispatchKeyInner(cm, seq + " " + name, e4, handle)) {
            return true;
          }
        }
        return dispatchKeyInner(cm, name, e4, handle);
      }
      function dispatchKeyInner(cm, name, e4, handle) {
        var result = lookupKeyForEditor(cm, name, handle);
        if (result == "multi") {
          cm.state.keySeq = name;
        }
        if (result == "handled") {
          signalLater(cm, "keyHandled", cm, name, e4);
        }
        if (result == "handled" || result == "multi") {
          e_preventDefault(e4);
          restartBlink(cm);
        }
        return !!result;
      }
      function handleKeyBinding(cm, e4) {
        var name = keyName(e4, true);
        if (!name) {
          return false;
        }
        if (e4.shiftKey && !cm.state.keySeq) {
          return dispatchKey(cm, "Shift-" + name, e4, function(b3) {
            return doHandleBinding(cm, b3, true);
          }) || dispatchKey(cm, name, e4, function(b3) {
            if (typeof b3 == "string" ? /^go[A-Z]/.test(b3) : b3.motion) {
              return doHandleBinding(cm, b3);
            }
          });
        } else {
          return dispatchKey(cm, name, e4, function(b3) {
            return doHandleBinding(cm, b3);
          });
        }
      }
      function handleCharBinding(cm, e4, ch) {
        return dispatchKey(cm, "'" + ch + "'", e4, function(b3) {
          return doHandleBinding(cm, b3, true);
        });
      }
      var lastStoppedKey = null;
      function onKeyDown(e4) {
        var cm = this;
        if (e4.target && e4.target != cm.display.input.getField()) {
          return;
        }
        cm.curOp.focus = activeElt();
        if (signalDOMEvent(cm, e4)) {
          return;
        }
        if (ie && ie_version < 11 && e4.keyCode == 27) {
          e4.returnValue = false;
        }
        var code = e4.keyCode;
        cm.display.shift = code == 16 || e4.shiftKey;
        var handled = handleKeyBinding(cm, e4);
        if (presto) {
          lastStoppedKey = handled ? code : null;
          if (!handled && code == 88 && !hasCopyEvent && (mac ? e4.metaKey : e4.ctrlKey)) {
            cm.replaceSelection("", null, "cut");
          }
        }
        if (gecko && !mac && !handled && code == 46 && e4.shiftKey && !e4.ctrlKey && document.execCommand) {
          document.execCommand("cut");
        }
        if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className)) {
          showCrossHair(cm);
        }
      }
      function showCrossHair(cm) {
        var lineDiv = cm.display.lineDiv;
        addClass(lineDiv, "CodeMirror-crosshair");
        function up(e4) {
          if (e4.keyCode == 18 || !e4.altKey) {
            rmClass(lineDiv, "CodeMirror-crosshair");
            off(document, "keyup", up);
            off(document, "mouseover", up);
          }
        }
        on(document, "keyup", up);
        on(document, "mouseover", up);
      }
      function onKeyUp(e4) {
        if (e4.keyCode == 16) {
          this.doc.sel.shift = false;
        }
        signalDOMEvent(this, e4);
      }
      function onKeyPress(e4) {
        var cm = this;
        if (e4.target && e4.target != cm.display.input.getField()) {
          return;
        }
        if (eventInWidget(cm.display, e4) || signalDOMEvent(cm, e4) || e4.ctrlKey && !e4.altKey || mac && e4.metaKey) {
          return;
        }
        var keyCode = e4.keyCode, charCode = e4.charCode;
        if (presto && keyCode == lastStoppedKey) {
          lastStoppedKey = null;
          e_preventDefault(e4);
          return;
        }
        if (presto && (!e4.which || e4.which < 10) && handleKeyBinding(cm, e4)) {
          return;
        }
        var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
        if (ch == "\b") {
          return;
        }
        if (handleCharBinding(cm, e4, ch)) {
          return;
        }
        cm.display.input.onKeyPress(e4);
      }
      var DOUBLECLICK_DELAY = 400;
      var PastClick = function(time, pos, button) {
        this.time = time;
        this.pos = pos;
        this.button = button;
      };
      PastClick.prototype.compare = function(time, pos, button) {
        return this.time + DOUBLECLICK_DELAY > time && cmp(pos, this.pos) == 0 && button == this.button;
      };
      var lastClick, lastDoubleClick;
      function clickRepeat(pos, button) {
        var now = +new Date();
        if (lastDoubleClick && lastDoubleClick.compare(now, pos, button)) {
          lastClick = lastDoubleClick = null;
          return "triple";
        } else if (lastClick && lastClick.compare(now, pos, button)) {
          lastDoubleClick = new PastClick(now, pos, button);
          lastClick = null;
          return "double";
        } else {
          lastClick = new PastClick(now, pos, button);
          lastDoubleClick = null;
          return "single";
        }
      }
      function onMouseDown(e4) {
        var cm = this, display = cm.display;
        if (signalDOMEvent(cm, e4) || display.activeTouch && display.input.supportsTouch()) {
          return;
        }
        display.input.ensurePolled();
        display.shift = e4.shiftKey;
        if (eventInWidget(display, e4)) {
          if (!webkit) {
            display.scroller.draggable = false;
            setTimeout(function() {
              return display.scroller.draggable = true;
            }, 100);
          }
          return;
        }
        if (clickInGutter(cm, e4)) {
          return;
        }
        var pos = posFromMouse(cm, e4), button = e_button(e4), repeat = pos ? clickRepeat(pos, button) : "single";
        window.focus();
        if (button == 1 && cm.state.selectingText) {
          cm.state.selectingText(e4);
        }
        if (pos && handleMappedButton(cm, button, pos, repeat, e4)) {
          return;
        }
        if (button == 1) {
          if (pos) {
            leftButtonDown(cm, pos, repeat, e4);
          } else if (e_target(e4) == display.scroller) {
            e_preventDefault(e4);
          }
        } else if (button == 2) {
          if (pos) {
            extendSelection(cm.doc, pos);
          }
          setTimeout(function() {
            return display.input.focus();
          }, 20);
        } else if (button == 3) {
          if (captureRightClick) {
            cm.display.input.onContextMenu(e4);
          } else {
            delayBlurEvent(cm);
          }
        }
      }
      function handleMappedButton(cm, button, pos, repeat, event2) {
        var name = "Click";
        if (repeat == "double") {
          name = "Double" + name;
        } else if (repeat == "triple") {
          name = "Triple" + name;
        }
        name = (button == 1 ? "Left" : button == 2 ? "Middle" : "Right") + name;
        return dispatchKey(cm, addModifierNames(name, event2), event2, function(bound) {
          if (typeof bound == "string") {
            bound = commands[bound];
          }
          if (!bound) {
            return false;
          }
          var done = false;
          try {
            if (cm.isReadOnly()) {
              cm.state.suppressEdits = true;
            }
            done = bound(cm, pos) != Pass;
          } finally {
            cm.state.suppressEdits = false;
          }
          return done;
        });
      }
      function configureMouse(cm, repeat, event2) {
        var option = cm.getOption("configureMouse");
        var value = option ? option(cm, repeat, event2) : {};
        if (value.unit == null) {
          var rect = chromeOS ? event2.shiftKey && event2.metaKey : event2.altKey;
          value.unit = rect ? "rectangle" : repeat == "single" ? "char" : repeat == "double" ? "word" : "line";
        }
        if (value.extend == null || cm.doc.extend) {
          value.extend = cm.doc.extend || event2.shiftKey;
        }
        if (value.addNew == null) {
          value.addNew = mac ? event2.metaKey : event2.ctrlKey;
        }
        if (value.moveOnDrag == null) {
          value.moveOnDrag = !(mac ? event2.altKey : event2.ctrlKey);
        }
        return value;
      }
      function leftButtonDown(cm, pos, repeat, event2) {
        if (ie) {
          setTimeout(bind(ensureFocus, cm), 0);
        } else {
          cm.curOp.focus = activeElt();
        }
        var behavior = configureMouse(cm, repeat, event2);
        var sel = cm.doc.sel, contained;
        if (cm.options.dragDrop && dragAndDrop && !cm.isReadOnly() && repeat == "single" && (contained = sel.contains(pos)) > -1 && (cmp((contained = sel.ranges[contained]).from(), pos) < 0 || pos.xRel > 0) && (cmp(contained.to(), pos) > 0 || pos.xRel < 0)) {
          leftButtonStartDrag(cm, event2, pos, behavior);
        } else {
          leftButtonSelect(cm, event2, pos, behavior);
        }
      }
      function leftButtonStartDrag(cm, event2, pos, behavior) {
        var display = cm.display, moved = false;
        var dragEnd = operation(cm, function(e4) {
          if (webkit) {
            display.scroller.draggable = false;
          }
          cm.state.draggingText = false;
          if (cm.state.delayingBlurEvent) {
            if (cm.hasFocus()) {
              cm.state.delayingBlurEvent = false;
            } else {
              delayBlurEvent(cm);
            }
          }
          off(display.wrapper.ownerDocument, "mouseup", dragEnd);
          off(display.wrapper.ownerDocument, "mousemove", mouseMove);
          off(display.scroller, "dragstart", dragStart);
          off(display.scroller, "drop", dragEnd);
          if (!moved) {
            e_preventDefault(e4);
            if (!behavior.addNew) {
              extendSelection(cm.doc, pos, null, null, behavior.extend);
            }
            if (webkit && !safari || ie && ie_version == 9) {
              setTimeout(function() {
                display.wrapper.ownerDocument.body.focus({ preventScroll: true });
                display.input.focus();
              }, 20);
            } else {
              display.input.focus();
            }
          }
        });
        var mouseMove = function(e22) {
          moved = moved || Math.abs(event2.clientX - e22.clientX) + Math.abs(event2.clientY - e22.clientY) >= 10;
        };
        var dragStart = function() {
          return moved = true;
        };
        if (webkit) {
          display.scroller.draggable = true;
        }
        cm.state.draggingText = dragEnd;
        dragEnd.copy = !behavior.moveOnDrag;
        on(display.wrapper.ownerDocument, "mouseup", dragEnd);
        on(display.wrapper.ownerDocument, "mousemove", mouseMove);
        on(display.scroller, "dragstart", dragStart);
        on(display.scroller, "drop", dragEnd);
        cm.state.delayingBlurEvent = true;
        setTimeout(function() {
          return display.input.focus();
        }, 20);
        if (display.scroller.dragDrop) {
          display.scroller.dragDrop();
        }
      }
      function rangeForUnit(cm, pos, unit) {
        if (unit == "char") {
          return new Range(pos, pos);
        }
        if (unit == "word") {
          return cm.findWordAt(pos);
        }
        if (unit == "line") {
          return new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
        }
        var result = unit(cm, pos);
        return new Range(result.from, result.to);
      }
      function leftButtonSelect(cm, event2, start, behavior) {
        if (ie) {
          delayBlurEvent(cm);
        }
        var display = cm.display, doc = cm.doc;
        e_preventDefault(event2);
        var ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
        if (behavior.addNew && !behavior.extend) {
          ourIndex = doc.sel.contains(start);
          if (ourIndex > -1) {
            ourRange = ranges[ourIndex];
          } else {
            ourRange = new Range(start, start);
          }
        } else {
          ourRange = doc.sel.primary();
          ourIndex = doc.sel.primIndex;
        }
        if (behavior.unit == "rectangle") {
          if (!behavior.addNew) {
            ourRange = new Range(start, start);
          }
          start = posFromMouse(cm, event2, true, true);
          ourIndex = -1;
        } else {
          var range2 = rangeForUnit(cm, start, behavior.unit);
          if (behavior.extend) {
            ourRange = extendRange(ourRange, range2.anchor, range2.head, behavior.extend);
          } else {
            ourRange = range2;
          }
        }
        if (!behavior.addNew) {
          ourIndex = 0;
          setSelection(doc, new Selection([ourRange], 0), sel_mouse);
          startSel = doc.sel;
        } else if (ourIndex == -1) {
          ourIndex = ranges.length;
          setSelection(doc, normalizeSelection(cm, ranges.concat([ourRange]), ourIndex), { scroll: false, origin: "*mouse" });
        } else if (ranges.length > 1 && ranges[ourIndex].empty() && behavior.unit == "char" && !behavior.extend) {
          setSelection(doc, normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0), { scroll: false, origin: "*mouse" });
          startSel = doc.sel;
        } else {
          replaceOneSelection(doc, ourIndex, ourRange, sel_mouse);
        }
        var lastPos = start;
        function extendTo(pos) {
          if (cmp(lastPos, pos) == 0) {
            return;
          }
          lastPos = pos;
          if (behavior.unit == "rectangle") {
            var ranges2 = [], tabSize = cm.options.tabSize;
            var startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize);
            var posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize);
            var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
            for (var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line)); line <= end; line++) {
              var text = getLine(doc, line).text, leftPos = findColumn(text, left, tabSize);
              if (left == right) {
                ranges2.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));
              } else if (text.length > leftPos) {
                ranges2.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
              }
            }
            if (!ranges2.length) {
              ranges2.push(new Range(start, start));
            }
            setSelection(doc, normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges2), ourIndex), { origin: "*mouse", scroll: false });
            cm.scrollIntoView(pos);
          } else {
            var oldRange = ourRange;
            var range3 = rangeForUnit(cm, pos, behavior.unit);
            var anchor = oldRange.anchor, head;
            if (cmp(range3.anchor, anchor) > 0) {
              head = range3.head;
              anchor = minPos(oldRange.from(), range3.anchor);
            } else {
              head = range3.anchor;
              anchor = maxPos(oldRange.to(), range3.head);
            }
            var ranges$1 = startSel.ranges.slice(0);
            ranges$1[ourIndex] = bidiSimplify(cm, new Range(clipPos(doc, anchor), head));
            setSelection(doc, normalizeSelection(cm, ranges$1, ourIndex), sel_mouse);
          }
        }
        var editorSize = display.wrapper.getBoundingClientRect();
        var counter = 0;
        function extend2(e4) {
          var curCount = ++counter;
          var cur = posFromMouse(cm, e4, true, behavior.unit == "rectangle");
          if (!cur) {
            return;
          }
          if (cmp(cur, lastPos) != 0) {
            cm.curOp.focus = activeElt();
            extendTo(cur);
            var visible = visibleLines(display, doc);
            if (cur.line >= visible.to || cur.line < visible.from) {
              setTimeout(operation(cm, function() {
                if (counter == curCount) {
                  extend2(e4);
                }
              }), 150);
            }
          } else {
            var outside = e4.clientY < editorSize.top ? -20 : e4.clientY > editorSize.bottom ? 20 : 0;
            if (outside) {
              setTimeout(operation(cm, function() {
                if (counter != curCount) {
                  return;
                }
                display.scroller.scrollTop += outside;
                extend2(e4);
              }), 50);
            }
          }
        }
        function done(e4) {
          cm.state.selectingText = false;
          counter = Infinity;
          if (e4) {
            e_preventDefault(e4);
            display.input.focus();
          }
          off(display.wrapper.ownerDocument, "mousemove", move);
          off(display.wrapper.ownerDocument, "mouseup", up);
          doc.history.lastSelOrigin = null;
        }
        var move = operation(cm, function(e4) {
          if (e4.buttons === 0 || !e_button(e4)) {
            done(e4);
          } else {
            extend2(e4);
          }
        });
        var up = operation(cm, done);
        cm.state.selectingText = up;
        on(display.wrapper.ownerDocument, "mousemove", move);
        on(display.wrapper.ownerDocument, "mouseup", up);
      }
      function bidiSimplify(cm, range2) {
        var anchor = range2.anchor;
        var head = range2.head;
        var anchorLine = getLine(cm.doc, anchor.line);
        if (cmp(anchor, head) == 0 && anchor.sticky == head.sticky) {
          return range2;
        }
        var order = getOrder(anchorLine);
        if (!order) {
          return range2;
        }
        var index = getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index];
        if (part.from != anchor.ch && part.to != anchor.ch) {
          return range2;
        }
        var boundary = index + (part.from == anchor.ch == (part.level != 1) ? 0 : 1);
        if (boundary == 0 || boundary == order.length) {
          return range2;
        }
        var leftSide;
        if (head.line != anchor.line) {
          leftSide = (head.line - anchor.line) * (cm.doc.direction == "ltr" ? 1 : -1) > 0;
        } else {
          var headIndex = getBidiPartAt(order, head.ch, head.sticky);
          var dir = headIndex - index || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
          if (headIndex == boundary - 1 || headIndex == boundary) {
            leftSide = dir < 0;
          } else {
            leftSide = dir > 0;
          }
        }
        var usePart = order[boundary + (leftSide ? -1 : 0)];
        var from = leftSide == (usePart.level == 1);
        var ch = from ? usePart.from : usePart.to, sticky = from ? "after" : "before";
        return anchor.ch == ch && anchor.sticky == sticky ? range2 : new Range(new Pos(anchor.line, ch, sticky), head);
      }
      function gutterEvent(cm, e4, type, prevent) {
        var mX, mY;
        if (e4.touches) {
          mX = e4.touches[0].clientX;
          mY = e4.touches[0].clientY;
        } else {
          try {
            mX = e4.clientX;
            mY = e4.clientY;
          } catch (e$1) {
            return false;
          }
        }
        if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) {
          return false;
        }
        if (prevent) {
          e_preventDefault(e4);
        }
        var display = cm.display;
        var lineBox = display.lineDiv.getBoundingClientRect();
        if (mY > lineBox.bottom || !hasHandler(cm, type)) {
          return e_defaultPrevented(e4);
        }
        mY -= lineBox.top - display.viewOffset;
        for (var i11 = 0; i11 < cm.display.gutterSpecs.length; ++i11) {
          var g3 = display.gutters.childNodes[i11];
          if (g3 && g3.getBoundingClientRect().right >= mX) {
            var line = lineAtHeight(cm.doc, mY);
            var gutter = cm.display.gutterSpecs[i11];
            signal(cm, type, cm, line, gutter.className, e4);
            return e_defaultPrevented(e4);
          }
        }
      }
      function clickInGutter(cm, e4) {
        return gutterEvent(cm, e4, "gutterClick", true);
      }
      function onContextMenu(cm, e4) {
        if (eventInWidget(cm.display, e4) || contextMenuInGutter(cm, e4)) {
          return;
        }
        if (signalDOMEvent(cm, e4, "contextmenu")) {
          return;
        }
        if (!captureRightClick) {
          cm.display.input.onContextMenu(e4);
        }
      }
      function contextMenuInGutter(cm, e4) {
        if (!hasHandler(cm, "gutterContextMenu")) {
          return false;
        }
        return gutterEvent(cm, e4, "gutterContextMenu", false);
      }
      function themeChanged(cm) {
        cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
        clearCaches(cm);
      }
      var Init = { toString: function() {
        return "CodeMirror.Init";
      } };
      var defaults = {};
      var optionHandlers = {};
      function defineOptions(CodeMirror4) {
        var optionHandlers2 = CodeMirror4.optionHandlers;
        function option(name, deflt, handle, notOnInit) {
          CodeMirror4.defaults[name] = deflt;
          if (handle) {
            optionHandlers2[name] = notOnInit ? function(cm, val, old) {
              if (old != Init) {
                handle(cm, val, old);
              }
            } : handle;
          }
        }
        CodeMirror4.defineOption = option;
        CodeMirror4.Init = Init;
        option("value", "", function(cm, val) {
          return cm.setValue(val);
        }, true);
        option("mode", null, function(cm, val) {
          cm.doc.modeOption = val;
          loadMode(cm);
        }, true);
        option("indentUnit", 2, loadMode, true);
        option("indentWithTabs", false);
        option("smartIndent", true);
        option("tabSize", 4, function(cm) {
          resetModeState(cm);
          clearCaches(cm);
          regChange(cm);
        }, true);
        option("lineSeparator", null, function(cm, val) {
          cm.doc.lineSep = val;
          if (!val) {
            return;
          }
          var newBreaks = [], lineNo2 = cm.doc.first;
          cm.doc.iter(function(line) {
            for (var pos = 0; ; ) {
              var found = line.text.indexOf(val, pos);
              if (found == -1) {
                break;
              }
              pos = found + val.length;
              newBreaks.push(Pos(lineNo2, found));
            }
            lineNo2++;
          });
          for (var i11 = newBreaks.length - 1; i11 >= 0; i11--) {
            replaceRange(cm.doc, val, newBreaks[i11], Pos(newBreaks[i11].line, newBreaks[i11].ch + val.length));
          }
        });
        option("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/g, function(cm, val, old) {
          cm.state.specialChars = new RegExp(val.source + (val.test("	") ? "" : "|	"), "g");
          if (old != Init) {
            cm.refresh();
          }
        });
        option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {
          return cm.refresh();
        }, true);
        option("electricChars", true);
        option("inputStyle", mobile ? "contenteditable" : "textarea", function() {
          throw new Error("inputStyle can not (yet) be changed in a running editor");
        }, true);
        option("spellcheck", false, function(cm, val) {
          return cm.getInputField().spellcheck = val;
        }, true);
        option("autocorrect", false, function(cm, val) {
          return cm.getInputField().autocorrect = val;
        }, true);
        option("autocapitalize", false, function(cm, val) {
          return cm.getInputField().autocapitalize = val;
        }, true);
        option("rtlMoveVisually", !windows);
        option("wholeLineUpdateBefore", true);
        option("theme", "default", function(cm) {
          themeChanged(cm);
          updateGutters(cm);
        }, true);
        option("keyMap", "default", function(cm, val, old) {
          var next = getKeyMap(val);
          var prev = old != Init && getKeyMap(old);
          if (prev && prev.detach) {
            prev.detach(cm, next);
          }
          if (next.attach) {
            next.attach(cm, prev || null);
          }
        });
        option("extraKeys", null);
        option("configureMouse", null);
        option("lineWrapping", false, wrappingChanged, true);
        option("gutters", [], function(cm, val) {
          cm.display.gutterSpecs = getGutters(val, cm.options.lineNumbers);
          updateGutters(cm);
        }, true);
        option("fixedGutter", true, function(cm, val) {
          cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
          cm.refresh();
        }, true);
        option("coverGutterNextToScrollbar", false, function(cm) {
          return updateScrollbars(cm);
        }, true);
        option("scrollbarStyle", "native", function(cm) {
          initScrollbars(cm);
          updateScrollbars(cm);
          cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
          cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
        }, true);
        option("lineNumbers", false, function(cm, val) {
          cm.display.gutterSpecs = getGutters(cm.options.gutters, val);
          updateGutters(cm);
        }, true);
        option("firstLineNumber", 1, updateGutters, true);
        option("lineNumberFormatter", function(integer) {
          return integer;
        }, updateGutters, true);
        option("showCursorWhenSelecting", false, updateSelection, true);
        option("resetSelectionOnContextMenu", true);
        option("lineWiseCopyCut", true);
        option("pasteLinesPerSelection", true);
        option("selectionsMayTouch", false);
        option("readOnly", false, function(cm, val) {
          if (val == "nocursor") {
            onBlur(cm);
            cm.display.input.blur();
          }
          cm.display.input.readOnlyChanged(val);
        });
        option("screenReaderLabel", null, function(cm, val) {
          val = val === "" ? null : val;
          cm.display.input.screenReaderLabelChanged(val);
        });
        option("disableInput", false, function(cm, val) {
          if (!val) {
            cm.display.input.reset();
          }
        }, true);
        option("dragDrop", true, dragDropChanged);
        option("allowDropFileTypes", null);
        option("cursorBlinkRate", 530);
        option("cursorScrollMargin", 0);
        option("cursorHeight", 1, updateSelection, true);
        option("singleCursorHeightPerLine", true, updateSelection, true);
        option("workTime", 100);
        option("workDelay", 100);
        option("flattenSpans", true, resetModeState, true);
        option("addModeClass", false, resetModeState, true);
        option("pollInterval", 100);
        option("undoDepth", 200, function(cm, val) {
          return cm.doc.history.undoDepth = val;
        });
        option("historyEventDelay", 1250);
        option("viewportMargin", 10, function(cm) {
          return cm.refresh();
        }, true);
        option("maxHighlightLength", 1e4, resetModeState, true);
        option("moveInputWithCursor", true, function(cm, val) {
          if (!val) {
            cm.display.input.resetPosition();
          }
        });
        option("tabindex", null, function(cm, val) {
          return cm.display.input.getField().tabIndex = val || "";
        });
        option("autofocus", null);
        option("direction", "ltr", function(cm, val) {
          return cm.doc.setDirection(val);
        }, true);
        option("phrases", null);
      }
      function dragDropChanged(cm, value, old) {
        var wasOn = old && old != Init;
        if (!value != !wasOn) {
          var funcs = cm.display.dragFunctions;
          var toggle = value ? on : off;
          toggle(cm.display.scroller, "dragstart", funcs.start);
          toggle(cm.display.scroller, "dragenter", funcs.enter);
          toggle(cm.display.scroller, "dragover", funcs.over);
          toggle(cm.display.scroller, "dragleave", funcs.leave);
          toggle(cm.display.scroller, "drop", funcs.drop);
        }
      }
      function wrappingChanged(cm) {
        if (cm.options.lineWrapping) {
          addClass(cm.display.wrapper, "CodeMirror-wrap");
          cm.display.sizer.style.minWidth = "";
          cm.display.sizerWidth = null;
        } else {
          rmClass(cm.display.wrapper, "CodeMirror-wrap");
          findMaxLine(cm);
        }
        estimateLineHeights(cm);
        regChange(cm);
        clearCaches(cm);
        setTimeout(function() {
          return updateScrollbars(cm);
        }, 100);
      }
      function CodeMirror3(place, options) {
        var this$1 = this;
        if (!(this instanceof CodeMirror3)) {
          return new CodeMirror3(place, options);
        }
        this.options = options = options ? copyObj(options) : {};
        copyObj(defaults, options, false);
        var doc = options.value;
        if (typeof doc == "string") {
          doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction);
        } else if (options.mode) {
          doc.modeOption = options.mode;
        }
        this.doc = doc;
        var input = new CodeMirror3.inputStyles[options.inputStyle](this);
        var display = this.display = new Display(place, doc, input, options);
        display.wrapper.CodeMirror = this;
        themeChanged(this);
        if (options.lineWrapping) {
          this.display.wrapper.className += " CodeMirror-wrap";
        }
        initScrollbars(this);
        this.state = {
          keyMaps: [],
          overlays: [],
          modeGen: 0,
          overwrite: false,
          delayingBlurEvent: false,
          focused: false,
          suppressEdits: false,
          pasteIncoming: -1,
          cutIncoming: -1,
          selectingText: false,
          draggingText: false,
          highlight: new Delayed(),
          keySeq: null,
          specialChars: null
        };
        if (options.autofocus && !mobile) {
          display.input.focus();
        }
        if (ie && ie_version < 11) {
          setTimeout(function() {
            return this$1.display.input.reset(true);
          }, 20);
        }
        registerEventHandlers(this);
        ensureGlobalHandlers();
        startOperation(this);
        this.curOp.forceUpdate = true;
        attachDoc(this, doc);
        if (options.autofocus && !mobile || this.hasFocus()) {
          setTimeout(function() {
            if (this$1.hasFocus() && !this$1.state.focused) {
              onFocus(this$1);
            }
          }, 20);
        } else {
          onBlur(this);
        }
        for (var opt in optionHandlers) {
          if (optionHandlers.hasOwnProperty(opt)) {
            optionHandlers[opt](this, options[opt], Init);
          }
        }
        maybeUpdateLineNumberWidth(this);
        if (options.finishInit) {
          options.finishInit(this);
        }
        for (var i11 = 0; i11 < initHooks.length; ++i11) {
          initHooks[i11](this);
        }
        endOperation(this);
        if (webkit && options.lineWrapping && getComputedStyle(display.lineDiv).textRendering == "optimizelegibility") {
          display.lineDiv.style.textRendering = "auto";
        }
      }
      CodeMirror3.defaults = defaults;
      CodeMirror3.optionHandlers = optionHandlers;
      function registerEventHandlers(cm) {
        var d6 = cm.display;
        on(d6.scroller, "mousedown", operation(cm, onMouseDown));
        if (ie && ie_version < 11) {
          on(d6.scroller, "dblclick", operation(cm, function(e4) {
            if (signalDOMEvent(cm, e4)) {
              return;
            }
            var pos = posFromMouse(cm, e4);
            if (!pos || clickInGutter(cm, e4) || eventInWidget(cm.display, e4)) {
              return;
            }
            e_preventDefault(e4);
            var word = cm.findWordAt(pos);
            extendSelection(cm.doc, word.anchor, word.head);
          }));
        } else {
          on(d6.scroller, "dblclick", function(e4) {
            return signalDOMEvent(cm, e4) || e_preventDefault(e4);
          });
        }
        on(d6.scroller, "contextmenu", function(e4) {
          return onContextMenu(cm, e4);
        });
        on(d6.input.getField(), "contextmenu", function(e4) {
          if (!d6.scroller.contains(e4.target)) {
            onContextMenu(cm, e4);
          }
        });
        var touchFinished, prevTouch = { end: 0 };
        function finishTouch() {
          if (d6.activeTouch) {
            touchFinished = setTimeout(function() {
              return d6.activeTouch = null;
            }, 1e3);
            prevTouch = d6.activeTouch;
            prevTouch.end = +new Date();
          }
        }
        function isMouseLikeTouchEvent(e4) {
          if (e4.touches.length != 1) {
            return false;
          }
          var touch = e4.touches[0];
          return touch.radiusX <= 1 && touch.radiusY <= 1;
        }
        function farAway(touch, other) {
          if (other.left == null) {
            return true;
          }
          var dx = other.left - touch.left, dy = other.top - touch.top;
          return dx * dx + dy * dy > 20 * 20;
        }
        on(d6.scroller, "touchstart", function(e4) {
          if (!signalDOMEvent(cm, e4) && !isMouseLikeTouchEvent(e4) && !clickInGutter(cm, e4)) {
            d6.input.ensurePolled();
            clearTimeout(touchFinished);
            var now = +new Date();
            d6.activeTouch = {
              start: now,
              moved: false,
              prev: now - prevTouch.end <= 300 ? prevTouch : null
            };
            if (e4.touches.length == 1) {
              d6.activeTouch.left = e4.touches[0].pageX;
              d6.activeTouch.top = e4.touches[0].pageY;
            }
          }
        });
        on(d6.scroller, "touchmove", function() {
          if (d6.activeTouch) {
            d6.activeTouch.moved = true;
          }
        });
        on(d6.scroller, "touchend", function(e4) {
          var touch = d6.activeTouch;
          if (touch && !eventInWidget(d6, e4) && touch.left != null && !touch.moved && new Date() - touch.start < 300) {
            var pos = cm.coordsChar(d6.activeTouch, "page"), range2;
            if (!touch.prev || farAway(touch, touch.prev)) {
              range2 = new Range(pos, pos);
            } else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) {
              range2 = cm.findWordAt(pos);
            } else {
              range2 = new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
            }
            cm.setSelection(range2.anchor, range2.head);
            cm.focus();
            e_preventDefault(e4);
          }
          finishTouch();
        });
        on(d6.scroller, "touchcancel", finishTouch);
        on(d6.scroller, "scroll", function() {
          if (d6.scroller.clientHeight) {
            updateScrollTop(cm, d6.scroller.scrollTop);
            setScrollLeft(cm, d6.scroller.scrollLeft, true);
            signal(cm, "scroll", cm);
          }
        });
        on(d6.scroller, "mousewheel", function(e4) {
          return onScrollWheel(cm, e4);
        });
        on(d6.scroller, "DOMMouseScroll", function(e4) {
          return onScrollWheel(cm, e4);
        });
        on(d6.wrapper, "scroll", function() {
          return d6.wrapper.scrollTop = d6.wrapper.scrollLeft = 0;
        });
        d6.dragFunctions = {
          enter: function(e4) {
            if (!signalDOMEvent(cm, e4)) {
              e_stop(e4);
            }
          },
          over: function(e4) {
            if (!signalDOMEvent(cm, e4)) {
              onDragOver(cm, e4);
              e_stop(e4);
            }
          },
          start: function(e4) {
            return onDragStart(cm, e4);
          },
          drop: operation(cm, onDrop),
          leave: function(e4) {
            if (!signalDOMEvent(cm, e4)) {
              clearDragCursor(cm);
            }
          }
        };
        var inp = d6.input.getField();
        on(inp, "keyup", function(e4) {
          return onKeyUp.call(cm, e4);
        });
        on(inp, "keydown", operation(cm, onKeyDown));
        on(inp, "keypress", operation(cm, onKeyPress));
        on(inp, "focus", function(e4) {
          return onFocus(cm, e4);
        });
        on(inp, "blur", function(e4) {
          return onBlur(cm, e4);
        });
      }
      var initHooks = [];
      CodeMirror3.defineInitHook = function(f5) {
        return initHooks.push(f5);
      };
      function indentLine(cm, n10, how, aggressive) {
        var doc = cm.doc, state;
        if (how == null) {
          how = "add";
        }
        if (how == "smart") {
          if (!doc.mode.indent) {
            how = "prev";
          } else {
            state = getContextBefore(cm, n10).state;
          }
        }
        var tabSize = cm.options.tabSize;
        var line = getLine(doc, n10), curSpace = countColumn(line.text, null, tabSize);
        if (line.stateAfter) {
          line.stateAfter = null;
        }
        var curSpaceString = line.text.match(/^\s*/)[0], indentation;
        if (!aggressive && !/\S/.test(line.text)) {
          indentation = 0;
          how = "not";
        } else if (how == "smart") {
          indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
          if (indentation == Pass || indentation > 150) {
            if (!aggressive) {
              return;
            }
            how = "prev";
          }
        }
        if (how == "prev") {
          if (n10 > doc.first) {
            indentation = countColumn(getLine(doc, n10 - 1).text, null, tabSize);
          } else {
            indentation = 0;
          }
        } else if (how == "add") {
          indentation = curSpace + cm.options.indentUnit;
        } else if (how == "subtract") {
          indentation = curSpace - cm.options.indentUnit;
        } else if (typeof how == "number") {
          indentation = curSpace + how;
        }
        indentation = Math.max(0, indentation);
        var indentString = "", pos = 0;
        if (cm.options.indentWithTabs) {
          for (var i11 = Math.floor(indentation / tabSize); i11; --i11) {
            pos += tabSize;
            indentString += "	";
          }
        }
        if (pos < indentation) {
          indentString += spaceStr(indentation - pos);
        }
        if (indentString != curSpaceString) {
          replaceRange(doc, indentString, Pos(n10, 0), Pos(n10, curSpaceString.length), "+input");
          line.stateAfter = null;
          return true;
        } else {
          for (var i$12 = 0; i$12 < doc.sel.ranges.length; i$12++) {
            var range2 = doc.sel.ranges[i$12];
            if (range2.head.line == n10 && range2.head.ch < curSpaceString.length) {
              var pos$1 = Pos(n10, curSpaceString.length);
              replaceOneSelection(doc, i$12, new Range(pos$1, pos$1));
              break;
            }
          }
        }
      }
      var lastCopied = null;
      function setLastCopied(newLastCopied) {
        lastCopied = newLastCopied;
      }
      function applyTextInput(cm, inserted, deleted, sel, origin) {
        var doc = cm.doc;
        cm.display.shift = false;
        if (!sel) {
          sel = doc.sel;
        }
        var recent = +new Date() - 200;
        var paste = origin == "paste" || cm.state.pasteIncoming > recent;
        var textLines = splitLinesAuto(inserted), multiPaste = null;
        if (paste && sel.ranges.length > 1) {
          if (lastCopied && lastCopied.text.join("\n") == inserted) {
            if (sel.ranges.length % lastCopied.text.length == 0) {
              multiPaste = [];
              for (var i11 = 0; i11 < lastCopied.text.length; i11++) {
                multiPaste.push(doc.splitLines(lastCopied.text[i11]));
              }
            }
          } else if (textLines.length == sel.ranges.length && cm.options.pasteLinesPerSelection) {
            multiPaste = map(textLines, function(l4) {
              return [l4];
            });
          }
        }
        var updateInput = cm.curOp.updateInput;
        for (var i$12 = sel.ranges.length - 1; i$12 >= 0; i$12--) {
          var range2 = sel.ranges[i$12];
          var from = range2.from(), to = range2.to();
          if (range2.empty()) {
            if (deleted && deleted > 0) {
              from = Pos(from.line, from.ch - deleted);
            } else if (cm.state.overwrite && !paste) {
              to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length));
            } else if (paste && lastCopied && lastCopied.lineWise && lastCopied.text.join("\n") == textLines.join("\n")) {
              from = to = Pos(from.line, 0);
            }
          }
          var changeEvent = {
            from,
            to,
            text: multiPaste ? multiPaste[i$12 % multiPaste.length] : textLines,
            origin: origin || (paste ? "paste" : cm.state.cutIncoming > recent ? "cut" : "+input")
          };
          makeChange(cm.doc, changeEvent);
          signalLater(cm, "inputRead", cm, changeEvent);
        }
        if (inserted && !paste) {
          triggerElectric(cm, inserted);
        }
        ensureCursorVisible(cm);
        if (cm.curOp.updateInput < 2) {
          cm.curOp.updateInput = updateInput;
        }
        cm.curOp.typing = true;
        cm.state.pasteIncoming = cm.state.cutIncoming = -1;
      }
      function handlePaste(e4, cm) {
        var pasted = e4.clipboardData && e4.clipboardData.getData("Text");
        if (pasted) {
          e4.preventDefault();
          if (!cm.isReadOnly() && !cm.options.disableInput) {
            runInOp(cm, function() {
              return applyTextInput(cm, pasted, 0, null, "paste");
            });
          }
          return true;
        }
      }
      function triggerElectric(cm, inserted) {
        if (!cm.options.electricChars || !cm.options.smartIndent) {
          return;
        }
        var sel = cm.doc.sel;
        for (var i11 = sel.ranges.length - 1; i11 >= 0; i11--) {
          var range2 = sel.ranges[i11];
          if (range2.head.ch > 100 || i11 && sel.ranges[i11 - 1].head.line == range2.head.line) {
            continue;
          }
          var mode = cm.getModeAt(range2.head);
          var indented = false;
          if (mode.electricChars) {
            for (var j2 = 0; j2 < mode.electricChars.length; j2++) {
              if (inserted.indexOf(mode.electricChars.charAt(j2)) > -1) {
                indented = indentLine(cm, range2.head.line, "smart");
                break;
              }
            }
          } else if (mode.electricInput) {
            if (mode.electricInput.test(getLine(cm.doc, range2.head.line).text.slice(0, range2.head.ch))) {
              indented = indentLine(cm, range2.head.line, "smart");
            }
          }
          if (indented) {
            signalLater(cm, "electricInput", cm, range2.head.line);
          }
        }
      }
      function copyableRanges(cm) {
        var text = [], ranges = [];
        for (var i11 = 0; i11 < cm.doc.sel.ranges.length; i11++) {
          var line = cm.doc.sel.ranges[i11].head.line;
          var lineRange = { anchor: Pos(line, 0), head: Pos(line + 1, 0) };
          ranges.push(lineRange);
          text.push(cm.getRange(lineRange.anchor, lineRange.head));
        }
        return { text, ranges };
      }
      function disableBrowserMagic(field, spellcheck, autocorrect, autocapitalize) {
        field.setAttribute("autocorrect", autocorrect ? "" : "off");
        field.setAttribute("autocapitalize", autocapitalize ? "" : "off");
        field.setAttribute("spellcheck", !!spellcheck);
      }
      function hiddenTextarea() {
        var te = elt("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; outline: none");
        var div = elt("div", [te], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        if (webkit) {
          te.style.width = "1000px";
        } else {
          te.setAttribute("wrap", "off");
        }
        if (ios) {
          te.style.border = "1px solid black";
        }
        disableBrowserMagic(te);
        return div;
      }
      function addEditorMethods(CodeMirror4) {
        var optionHandlers2 = CodeMirror4.optionHandlers;
        var helpers = CodeMirror4.helpers = {};
        CodeMirror4.prototype = {
          constructor: CodeMirror4,
          focus: function() {
            window.focus();
            this.display.input.focus();
          },
          setOption: function(option, value) {
            var options = this.options, old = options[option];
            if (options[option] == value && option != "mode") {
              return;
            }
            options[option] = value;
            if (optionHandlers2.hasOwnProperty(option)) {
              operation(this, optionHandlers2[option])(this, value, old);
            }
            signal(this, "optionChange", this, option);
          },
          getOption: function(option) {
            return this.options[option];
          },
          getDoc: function() {
            return this.doc;
          },
          addKeyMap: function(map2, bottom) {
            this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map2));
          },
          removeKeyMap: function(map2) {
            var maps = this.state.keyMaps;
            for (var i11 = 0; i11 < maps.length; ++i11) {
              if (maps[i11] == map2 || maps[i11].name == map2) {
                maps.splice(i11, 1);
                return true;
              }
            }
          },
          addOverlay: methodOp(function(spec, options) {
            var mode = spec.token ? spec : CodeMirror4.getMode(this.options, spec);
            if (mode.startState) {
              throw new Error("Overlays may not be stateful.");
            }
            insertSorted(this.state.overlays, {
              mode,
              modeSpec: spec,
              opaque: options && options.opaque,
              priority: options && options.priority || 0
            }, function(overlay) {
              return overlay.priority;
            });
            this.state.modeGen++;
            regChange(this);
          }),
          removeOverlay: methodOp(function(spec) {
            var overlays = this.state.overlays;
            for (var i11 = 0; i11 < overlays.length; ++i11) {
              var cur = overlays[i11].modeSpec;
              if (cur == spec || typeof spec == "string" && cur.name == spec) {
                overlays.splice(i11, 1);
                this.state.modeGen++;
                regChange(this);
                return;
              }
            }
          }),
          indentLine: methodOp(function(n10, dir, aggressive) {
            if (typeof dir != "string" && typeof dir != "number") {
              if (dir == null) {
                dir = this.options.smartIndent ? "smart" : "prev";
              } else {
                dir = dir ? "add" : "subtract";
              }
            }
            if (isLine(this.doc, n10)) {
              indentLine(this, n10, dir, aggressive);
            }
          }),
          indentSelection: methodOp(function(how) {
            var ranges = this.doc.sel.ranges, end = -1;
            for (var i11 = 0; i11 < ranges.length; i11++) {
              var range2 = ranges[i11];
              if (!range2.empty()) {
                var from = range2.from(), to = range2.to();
                var start = Math.max(end, from.line);
                end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
                for (var j2 = start; j2 < end; ++j2) {
                  indentLine(this, j2, how);
                }
                var newRanges = this.doc.sel.ranges;
                if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i11].from().ch > 0) {
                  replaceOneSelection(this.doc, i11, new Range(from, newRanges[i11].to()), sel_dontScroll);
                }
              } else if (range2.head.line > end) {
                indentLine(this, range2.head.line, how, true);
                end = range2.head.line;
                if (i11 == this.doc.sel.primIndex) {
                  ensureCursorVisible(this);
                }
              }
            }
          }),
          getTokenAt: function(pos, precise) {
            return takeToken(this, pos, precise);
          },
          getLineTokens: function(line, precise) {
            return takeToken(this, Pos(line), precise, true);
          },
          getTokenTypeAt: function(pos) {
            pos = clipPos(this.doc, pos);
            var styles = getLineStyles(this, getLine(this.doc, pos.line));
            var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
            var type;
            if (ch == 0) {
              type = styles[2];
            } else {
              for (; ; ) {
                var mid = before + after >> 1;
                if ((mid ? styles[mid * 2 - 1] : 0) >= ch) {
                  after = mid;
                } else if (styles[mid * 2 + 1] < ch) {
                  before = mid + 1;
                } else {
                  type = styles[mid * 2 + 2];
                  break;
                }
              }
            }
            var cut = type ? type.indexOf("overlay ") : -1;
            return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
          },
          getModeAt: function(pos) {
            var mode = this.doc.mode;
            if (!mode.innerMode) {
              return mode;
            }
            return CodeMirror4.innerMode(mode, this.getTokenAt(pos).state).mode;
          },
          getHelper: function(pos, type) {
            return this.getHelpers(pos, type)[0];
          },
          getHelpers: function(pos, type) {
            var found = [];
            if (!helpers.hasOwnProperty(type)) {
              return found;
            }
            var help = helpers[type], mode = this.getModeAt(pos);
            if (typeof mode[type] == "string") {
              if (help[mode[type]]) {
                found.push(help[mode[type]]);
              }
            } else if (mode[type]) {
              for (var i11 = 0; i11 < mode[type].length; i11++) {
                var val = help[mode[type][i11]];
                if (val) {
                  found.push(val);
                }
              }
            } else if (mode.helperType && help[mode.helperType]) {
              found.push(help[mode.helperType]);
            } else if (help[mode.name]) {
              found.push(help[mode.name]);
            }
            for (var i$12 = 0; i$12 < help._global.length; i$12++) {
              var cur = help._global[i$12];
              if (cur.pred(mode, this) && indexOf(found, cur.val) == -1) {
                found.push(cur.val);
              }
            }
            return found;
          },
          getStateAfter: function(line, precise) {
            var doc = this.doc;
            line = clipLine(doc, line == null ? doc.first + doc.size - 1 : line);
            return getContextBefore(this, line + 1, precise).state;
          },
          cursorCoords: function(start, mode) {
            var pos, range2 = this.doc.sel.primary();
            if (start == null) {
              pos = range2.head;
            } else if (typeof start == "object") {
              pos = clipPos(this.doc, start);
            } else {
              pos = start ? range2.from() : range2.to();
            }
            return cursorCoords(this, pos, mode || "page");
          },
          charCoords: function(pos, mode) {
            return charCoords(this, clipPos(this.doc, pos), mode || "page");
          },
          coordsChar: function(coords, mode) {
            coords = fromCoordSystem(this, coords, mode || "page");
            return coordsChar(this, coords.left, coords.top);
          },
          lineAtHeight: function(height, mode) {
            height = fromCoordSystem(this, { top: height, left: 0 }, mode || "page").top;
            return lineAtHeight(this.doc, height + this.display.viewOffset);
          },
          heightAtLine: function(line, mode, includeWidgets) {
            var end = false, lineObj;
            if (typeof line == "number") {
              var last = this.doc.first + this.doc.size - 1;
              if (line < this.doc.first) {
                line = this.doc.first;
              } else if (line > last) {
                line = last;
                end = true;
              }
              lineObj = getLine(this.doc, line);
            } else {
              lineObj = line;
            }
            return intoCoordSystem(this, lineObj, { top: 0, left: 0 }, mode || "page", includeWidgets || end).top + (end ? this.doc.height - heightAtLine(lineObj) : 0);
          },
          defaultTextHeight: function() {
            return textHeight(this.display);
          },
          defaultCharWidth: function() {
            return charWidth(this.display);
          },
          getViewport: function() {
            return { from: this.display.viewFrom, to: this.display.viewTo };
          },
          addWidget: function(pos, node, scroll, vert, horiz) {
            var display = this.display;
            pos = cursorCoords(this, clipPos(this.doc, pos));
            var top = pos.bottom, left = pos.left;
            node.style.position = "absolute";
            node.setAttribute("cm-ignore-events", "true");
            this.display.input.setUneditable(node);
            display.sizer.appendChild(node);
            if (vert == "over") {
              top = pos.top;
            } else if (vert == "above" || vert == "near") {
              var vspace = Math.max(display.wrapper.clientHeight, this.doc.height), hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
              if ((vert == "above" || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight) {
                top = pos.top - node.offsetHeight;
              } else if (pos.bottom + node.offsetHeight <= vspace) {
                top = pos.bottom;
              }
              if (left + node.offsetWidth > hspace) {
                left = hspace - node.offsetWidth;
              }
            }
            node.style.top = top + "px";
            node.style.left = node.style.right = "";
            if (horiz == "right") {
              left = display.sizer.clientWidth - node.offsetWidth;
              node.style.right = "0px";
            } else {
              if (horiz == "left") {
                left = 0;
              } else if (horiz == "middle") {
                left = (display.sizer.clientWidth - node.offsetWidth) / 2;
              }
              node.style.left = left + "px";
            }
            if (scroll) {
              scrollIntoView(this, { left, top, right: left + node.offsetWidth, bottom: top + node.offsetHeight });
            }
          },
          triggerOnKeyDown: methodOp(onKeyDown),
          triggerOnKeyPress: methodOp(onKeyPress),
          triggerOnKeyUp: onKeyUp,
          triggerOnMouseDown: methodOp(onMouseDown),
          execCommand: function(cmd) {
            if (commands.hasOwnProperty(cmd)) {
              return commands[cmd].call(null, this);
            }
          },
          triggerElectric: methodOp(function(text) {
            triggerElectric(this, text);
          }),
          findPosH: function(from, amount, unit, visually) {
            var dir = 1;
            if (amount < 0) {
              dir = -1;
              amount = -amount;
            }
            var cur = clipPos(this.doc, from);
            for (var i11 = 0; i11 < amount; ++i11) {
              cur = findPosH(this.doc, cur, dir, unit, visually);
              if (cur.hitSide) {
                break;
              }
            }
            return cur;
          },
          moveH: methodOp(function(dir, unit) {
            var this$1 = this;
            this.extendSelectionsBy(function(range2) {
              if (this$1.display.shift || this$1.doc.extend || range2.empty()) {
                return findPosH(this$1.doc, range2.head, dir, unit, this$1.options.rtlMoveVisually);
              } else {
                return dir < 0 ? range2.from() : range2.to();
              }
            }, sel_move);
          }),
          deleteH: methodOp(function(dir, unit) {
            var sel = this.doc.sel, doc = this.doc;
            if (sel.somethingSelected()) {
              doc.replaceSelection("", null, "+delete");
            } else {
              deleteNearSelection(this, function(range2) {
                var other = findPosH(doc, range2.head, dir, unit, false);
                return dir < 0 ? { from: other, to: range2.head } : { from: range2.head, to: other };
              });
            }
          }),
          findPosV: function(from, amount, unit, goalColumn) {
            var dir = 1, x2 = goalColumn;
            if (amount < 0) {
              dir = -1;
              amount = -amount;
            }
            var cur = clipPos(this.doc, from);
            for (var i11 = 0; i11 < amount; ++i11) {
              var coords = cursorCoords(this, cur, "div");
              if (x2 == null) {
                x2 = coords.left;
              } else {
                coords.left = x2;
              }
              cur = findPosV(this, coords, dir, unit);
              if (cur.hitSide) {
                break;
              }
            }
            return cur;
          },
          moveV: methodOp(function(dir, unit) {
            var this$1 = this;
            var doc = this.doc, goals = [];
            var collapse = !this.display.shift && !doc.extend && doc.sel.somethingSelected();
            doc.extendSelectionsBy(function(range2) {
              if (collapse) {
                return dir < 0 ? range2.from() : range2.to();
              }
              var headPos = cursorCoords(this$1, range2.head, "div");
              if (range2.goalColumn != null) {
                headPos.left = range2.goalColumn;
              }
              goals.push(headPos.left);
              var pos = findPosV(this$1, headPos, dir, unit);
              if (unit == "page" && range2 == doc.sel.primary()) {
                addToScrollTop(this$1, charCoords(this$1, pos, "div").top - headPos.top);
              }
              return pos;
            }, sel_move);
            if (goals.length) {
              for (var i11 = 0; i11 < doc.sel.ranges.length; i11++) {
                doc.sel.ranges[i11].goalColumn = goals[i11];
              }
            }
          }),
          findWordAt: function(pos) {
            var doc = this.doc, line = getLine(doc, pos.line).text;
            var start = pos.ch, end = pos.ch;
            if (line) {
              var helper = this.getHelper(pos, "wordChars");
              if ((pos.sticky == "before" || end == line.length) && start) {
                --start;
              } else {
                ++end;
              }
              var startChar = line.charAt(start);
              var check = isWordChar(startChar, helper) ? function(ch) {
                return isWordChar(ch, helper);
              } : /\s/.test(startChar) ? function(ch) {
                return /\s/.test(ch);
              } : function(ch) {
                return !/\s/.test(ch) && !isWordChar(ch);
              };
              while (start > 0 && check(line.charAt(start - 1))) {
                --start;
              }
              while (end < line.length && check(line.charAt(end))) {
                ++end;
              }
            }
            return new Range(Pos(pos.line, start), Pos(pos.line, end));
          },
          toggleOverwrite: function(value) {
            if (value != null && value == this.state.overwrite) {
              return;
            }
            if (this.state.overwrite = !this.state.overwrite) {
              addClass(this.display.cursorDiv, "CodeMirror-overwrite");
            } else {
              rmClass(this.display.cursorDiv, "CodeMirror-overwrite");
            }
            signal(this, "overwriteToggle", this, this.state.overwrite);
          },
          hasFocus: function() {
            return this.display.input.getField() == activeElt();
          },
          isReadOnly: function() {
            return !!(this.options.readOnly || this.doc.cantEdit);
          },
          scrollTo: methodOp(function(x2, y3) {
            scrollToCoords(this, x2, y3);
          }),
          getScrollInfo: function() {
            var scroller = this.display.scroller;
            return {
              left: scroller.scrollLeft,
              top: scroller.scrollTop,
              height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
              width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
              clientHeight: displayHeight(this),
              clientWidth: displayWidth(this)
            };
          },
          scrollIntoView: methodOp(function(range2, margin) {
            if (range2 == null) {
              range2 = { from: this.doc.sel.primary().head, to: null };
              if (margin == null) {
                margin = this.options.cursorScrollMargin;
              }
            } else if (typeof range2 == "number") {
              range2 = { from: Pos(range2, 0), to: null };
            } else if (range2.from == null) {
              range2 = { from: range2, to: null };
            }
            if (!range2.to) {
              range2.to = range2.from;
            }
            range2.margin = margin || 0;
            if (range2.from.line != null) {
              scrollToRange(this, range2);
            } else {
              scrollToCoordsRange(this, range2.from, range2.to, range2.margin);
            }
          }),
          setSize: methodOp(function(width, height) {
            var this$1 = this;
            var interpret = function(val) {
              return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
            };
            if (width != null) {
              this.display.wrapper.style.width = interpret(width);
            }
            if (height != null) {
              this.display.wrapper.style.height = interpret(height);
            }
            if (this.options.lineWrapping) {
              clearLineMeasurementCache(this);
            }
            var lineNo2 = this.display.viewFrom;
            this.doc.iter(lineNo2, this.display.viewTo, function(line) {
              if (line.widgets) {
                for (var i11 = 0; i11 < line.widgets.length; i11++) {
                  if (line.widgets[i11].noHScroll) {
                    regLineChange(this$1, lineNo2, "widget");
                    break;
                  }
                }
              }
              ++lineNo2;
            });
            this.curOp.forceUpdate = true;
            signal(this, "refresh", this);
          }),
          operation: function(f5) {
            return runInOp(this, f5);
          },
          startOperation: function() {
            return startOperation(this);
          },
          endOperation: function() {
            return endOperation(this);
          },
          refresh: methodOp(function() {
            var oldHeight = this.display.cachedTextHeight;
            regChange(this);
            this.curOp.forceUpdate = true;
            clearCaches(this);
            scrollToCoords(this, this.doc.scrollLeft, this.doc.scrollTop);
            updateGutterSpace(this.display);
            if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > 0.5 || this.options.lineWrapping) {
              estimateLineHeights(this);
            }
            signal(this, "refresh", this);
          }),
          swapDoc: methodOp(function(doc) {
            var old = this.doc;
            old.cm = null;
            if (this.state.selectingText) {
              this.state.selectingText();
            }
            attachDoc(this, doc);
            clearCaches(this);
            this.display.input.reset();
            scrollToCoords(this, doc.scrollLeft, doc.scrollTop);
            this.curOp.forceScroll = true;
            signalLater(this, "swapDoc", this, old);
            return old;
          }),
          phrase: function(phraseText) {
            var phrases = this.options.phrases;
            return phrases && Object.prototype.hasOwnProperty.call(phrases, phraseText) ? phrases[phraseText] : phraseText;
          },
          getInputField: function() {
            return this.display.input.getField();
          },
          getWrapperElement: function() {
            return this.display.wrapper;
          },
          getScrollerElement: function() {
            return this.display.scroller;
          },
          getGutterElement: function() {
            return this.display.gutters;
          }
        };
        eventMixin(CodeMirror4);
        CodeMirror4.registerHelper = function(type, name, value) {
          if (!helpers.hasOwnProperty(type)) {
            helpers[type] = CodeMirror4[type] = { _global: [] };
          }
          helpers[type][name] = value;
        };
        CodeMirror4.registerGlobalHelper = function(type, name, predicate, value) {
          CodeMirror4.registerHelper(type, name, value);
          helpers[type]._global.push({ pred: predicate, val: value });
        };
      }
      function findPosH(doc, pos, dir, unit, visually) {
        var oldPos = pos;
        var origDir = dir;
        var lineObj = getLine(doc, pos.line);
        var lineDir = visually && doc.direction == "rtl" ? -dir : dir;
        function findNextLine() {
          var l4 = pos.line + lineDir;
          if (l4 < doc.first || l4 >= doc.first + doc.size) {
            return false;
          }
          pos = new Pos(l4, pos.ch, pos.sticky);
          return lineObj = getLine(doc, l4);
        }
        function moveOnce(boundToLine) {
          var next;
          if (unit == "codepoint") {
            var ch = lineObj.text.charCodeAt(pos.ch + (dir > 0 ? 0 : -1));
            if (isNaN(ch)) {
              next = null;
            } else {
              var astral = dir > 0 ? ch >= 55296 && ch < 56320 : ch >= 56320 && ch < 57343;
              next = new Pos(pos.line, Math.max(0, Math.min(lineObj.text.length, pos.ch + dir * (astral ? 2 : 1))), -dir);
            }
          } else if (visually) {
            next = moveVisually(doc.cm, lineObj, pos, dir);
          } else {
            next = moveLogically(lineObj, pos, dir);
          }
          if (next == null) {
            if (!boundToLine && findNextLine()) {
              pos = endOfLine(visually, doc.cm, lineObj, pos.line, lineDir);
            } else {
              return false;
            }
          } else {
            pos = next;
          }
          return true;
        }
        if (unit == "char" || unit == "codepoint") {
          moveOnce();
        } else if (unit == "column") {
          moveOnce(true);
        } else if (unit == "word" || unit == "group") {
          var sawType = null, group = unit == "group";
          var helper = doc.cm && doc.cm.getHelper(pos, "wordChars");
          for (var first = true; ; first = false) {
            if (dir < 0 && !moveOnce(!first)) {
              break;
            }
            var cur = lineObj.text.charAt(pos.ch) || "\n";
            var type = isWordChar(cur, helper) ? "w" : group && cur == "\n" ? "n" : !group || /\s/.test(cur) ? null : "p";
            if (group && !first && !type) {
              type = "s";
            }
            if (sawType && sawType != type) {
              if (dir < 0) {
                dir = 1;
                moveOnce();
                pos.sticky = "after";
              }
              break;
            }
            if (type) {
              sawType = type;
            }
            if (dir > 0 && !moveOnce(!first)) {
              break;
            }
          }
        }
        var result = skipAtomic(doc, pos, oldPos, origDir, true);
        if (equalCursorPos(oldPos, result)) {
          result.hitSide = true;
        }
        return result;
      }
      function findPosV(cm, pos, dir, unit) {
        var doc = cm.doc, x2 = pos.left, y3;
        if (unit == "page") {
          var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
          var moveAmount = Math.max(pageSize - 0.5 * textHeight(cm.display), 3);
          y3 = (dir > 0 ? pos.bottom : pos.top) + dir * moveAmount;
        } else if (unit == "line") {
          y3 = dir > 0 ? pos.bottom + 3 : pos.top - 3;
        }
        var target;
        for (; ; ) {
          target = coordsChar(cm, x2, y3);
          if (!target.outside) {
            break;
          }
          if (dir < 0 ? y3 <= 0 : y3 >= doc.height) {
            target.hitSide = true;
            break;
          }
          y3 += dir * 5;
        }
        return target;
      }
      var ContentEditableInput = function(cm) {
        this.cm = cm;
        this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
        this.polling = new Delayed();
        this.composing = null;
        this.gracePeriod = false;
        this.readDOMTimeout = null;
      };
      ContentEditableInput.prototype.init = function(display) {
        var this$1 = this;
        var input = this, cm = input.cm;
        var div = input.div = display.lineDiv;
        div.contentEditable = true;
        disableBrowserMagic(div, cm.options.spellcheck, cm.options.autocorrect, cm.options.autocapitalize);
        function belongsToInput(e4) {
          for (var t2 = e4.target; t2; t2 = t2.parentNode) {
            if (t2 == div) {
              return true;
            }
            if (/\bCodeMirror-(?:line)?widget\b/.test(t2.className)) {
              break;
            }
          }
          return false;
        }
        on(div, "paste", function(e4) {
          if (!belongsToInput(e4) || signalDOMEvent(cm, e4) || handlePaste(e4, cm)) {
            return;
          }
          if (ie_version <= 11) {
            setTimeout(operation(cm, function() {
              return this$1.updateFromDOM();
            }), 20);
          }
        });
        on(div, "compositionstart", function(e4) {
          this$1.composing = { data: e4.data, done: false };
        });
        on(div, "compositionupdate", function(e4) {
          if (!this$1.composing) {
            this$1.composing = { data: e4.data, done: false };
          }
        });
        on(div, "compositionend", function(e4) {
          if (this$1.composing) {
            if (e4.data != this$1.composing.data) {
              this$1.readFromDOMSoon();
            }
            this$1.composing.done = true;
          }
        });
        on(div, "touchstart", function() {
          return input.forceCompositionEnd();
        });
        on(div, "input", function() {
          if (!this$1.composing) {
            this$1.readFromDOMSoon();
          }
        });
        function onCopyCut(e4) {
          if (!belongsToInput(e4) || signalDOMEvent(cm, e4)) {
            return;
          }
          if (cm.somethingSelected()) {
            setLastCopied({ lineWise: false, text: cm.getSelections() });
            if (e4.type == "cut") {
              cm.replaceSelection("", null, "cut");
            }
          } else if (!cm.options.lineWiseCopyCut) {
            return;
          } else {
            var ranges = copyableRanges(cm);
            setLastCopied({ lineWise: true, text: ranges.text });
            if (e4.type == "cut") {
              cm.operation(function() {
                cm.setSelections(ranges.ranges, 0, sel_dontScroll);
                cm.replaceSelection("", null, "cut");
              });
            }
          }
          if (e4.clipboardData) {
            e4.clipboardData.clearData();
            var content = lastCopied.text.join("\n");
            e4.clipboardData.setData("Text", content);
            if (e4.clipboardData.getData("Text") == content) {
              e4.preventDefault();
              return;
            }
          }
          var kludge = hiddenTextarea(), te = kludge.firstChild;
          cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
          te.value = lastCopied.text.join("\n");
          var hadFocus = activeElt();
          selectInput(te);
          setTimeout(function() {
            cm.display.lineSpace.removeChild(kludge);
            hadFocus.focus();
            if (hadFocus == div) {
              input.showPrimarySelection();
            }
          }, 50);
        }
        on(div, "copy", onCopyCut);
        on(div, "cut", onCopyCut);
      };
      ContentEditableInput.prototype.screenReaderLabelChanged = function(label) {
        if (label) {
          this.div.setAttribute("aria-label", label);
        } else {
          this.div.removeAttribute("aria-label");
        }
      };
      ContentEditableInput.prototype.prepareSelection = function() {
        var result = prepareSelection(this.cm, false);
        result.focus = activeElt() == this.div;
        return result;
      };
      ContentEditableInput.prototype.showSelection = function(info, takeFocus) {
        if (!info || !this.cm.display.view.length) {
          return;
        }
        if (info.focus || takeFocus) {
          this.showPrimarySelection();
        }
        this.showMultipleSelections(info);
      };
      ContentEditableInput.prototype.getSelection = function() {
        return this.cm.display.wrapper.ownerDocument.getSelection();
      };
      ContentEditableInput.prototype.showPrimarySelection = function() {
        var sel = this.getSelection(), cm = this.cm, prim = cm.doc.sel.primary();
        var from = prim.from(), to = prim.to();
        if (cm.display.viewTo == cm.display.viewFrom || from.line >= cm.display.viewTo || to.line < cm.display.viewFrom) {
          sel.removeAllRanges();
          return;
        }
        var curAnchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
        var curFocus = domToPos(cm, sel.focusNode, sel.focusOffset);
        if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad && cmp(minPos(curAnchor, curFocus), from) == 0 && cmp(maxPos(curAnchor, curFocus), to) == 0) {
          return;
        }
        var view = cm.display.view;
        var start = from.line >= cm.display.viewFrom && posToDOM(cm, from) || { node: view[0].measure.map[2], offset: 0 };
        var end = to.line < cm.display.viewTo && posToDOM(cm, to);
        if (!end) {
          var measure = view[view.length - 1].measure;
          var map2 = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
          end = { node: map2[map2.length - 1], offset: map2[map2.length - 2] - map2[map2.length - 3] };
        }
        if (!start || !end) {
          sel.removeAllRanges();
          return;
        }
        var old = sel.rangeCount && sel.getRangeAt(0), rng;
        try {
          rng = range(start.node, start.offset, end.offset, end.node);
        } catch (e4) {
        }
        if (rng) {
          if (!gecko && cm.state.focused) {
            sel.collapse(start.node, start.offset);
            if (!rng.collapsed) {
              sel.removeAllRanges();
              sel.addRange(rng);
            }
          } else {
            sel.removeAllRanges();
            sel.addRange(rng);
          }
          if (old && sel.anchorNode == null) {
            sel.addRange(old);
          } else if (gecko) {
            this.startGracePeriod();
          }
        }
        this.rememberSelection();
      };
      ContentEditableInput.prototype.startGracePeriod = function() {
        var this$1 = this;
        clearTimeout(this.gracePeriod);
        this.gracePeriod = setTimeout(function() {
          this$1.gracePeriod = false;
          if (this$1.selectionChanged()) {
            this$1.cm.operation(function() {
              return this$1.cm.curOp.selectionChanged = true;
            });
          }
        }, 20);
      };
      ContentEditableInput.prototype.showMultipleSelections = function(info) {
        removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
        removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
      };
      ContentEditableInput.prototype.rememberSelection = function() {
        var sel = this.getSelection();
        this.lastAnchorNode = sel.anchorNode;
        this.lastAnchorOffset = sel.anchorOffset;
        this.lastFocusNode = sel.focusNode;
        this.lastFocusOffset = sel.focusOffset;
      };
      ContentEditableInput.prototype.selectionInEditor = function() {
        var sel = this.getSelection();
        if (!sel.rangeCount) {
          return false;
        }
        var node = sel.getRangeAt(0).commonAncestorContainer;
        return contains(this.div, node);
      };
      ContentEditableInput.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor") {
          if (!this.selectionInEditor() || activeElt() != this.div) {
            this.showSelection(this.prepareSelection(), true);
          }
          this.div.focus();
        }
      };
      ContentEditableInput.prototype.blur = function() {
        this.div.blur();
      };
      ContentEditableInput.prototype.getField = function() {
        return this.div;
      };
      ContentEditableInput.prototype.supportsTouch = function() {
        return true;
      };
      ContentEditableInput.prototype.receivedFocus = function() {
        var this$1 = this;
        var input = this;
        if (this.selectionInEditor()) {
          setTimeout(function() {
            return this$1.pollSelection();
          }, 20);
        } else {
          runInOp(this.cm, function() {
            return input.cm.curOp.selectionChanged = true;
          });
        }
        function poll() {
          if (input.cm.state.focused) {
            input.pollSelection();
            input.polling.set(input.cm.options.pollInterval, poll);
          }
        }
        this.polling.set(this.cm.options.pollInterval, poll);
      };
      ContentEditableInput.prototype.selectionChanged = function() {
        var sel = this.getSelection();
        return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
      };
      ContentEditableInput.prototype.pollSelection = function() {
        if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) {
          return;
        }
        var sel = this.getSelection(), cm = this.cm;
        if (android && chrome && this.cm.display.gutterSpecs.length && isInGutter(sel.anchorNode)) {
          this.cm.triggerOnKeyDown({ type: "keydown", keyCode: 8, preventDefault: Math.abs });
          this.blur();
          this.focus();
          return;
        }
        if (this.composing) {
          return;
        }
        this.rememberSelection();
        var anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
        var head = domToPos(cm, sel.focusNode, sel.focusOffset);
        if (anchor && head) {
          runInOp(cm, function() {
            setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll);
            if (anchor.bad || head.bad) {
              cm.curOp.selectionChanged = true;
            }
          });
        }
      };
      ContentEditableInput.prototype.pollContent = function() {
        if (this.readDOMTimeout != null) {
          clearTimeout(this.readDOMTimeout);
          this.readDOMTimeout = null;
        }
        var cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
        var from = sel.from(), to = sel.to();
        if (from.ch == 0 && from.line > cm.firstLine()) {
          from = Pos(from.line - 1, getLine(cm.doc, from.line - 1).length);
        }
        if (to.ch == getLine(cm.doc, to.line).text.length && to.line < cm.lastLine()) {
          to = Pos(to.line + 1, 0);
        }
        if (from.line < display.viewFrom || to.line > display.viewTo - 1) {
          return false;
        }
        var fromIndex, fromLine, fromNode;
        if (from.line == display.viewFrom || (fromIndex = findViewIndex(cm, from.line)) == 0) {
          fromLine = lineNo(display.view[0].line);
          fromNode = display.view[0].node;
        } else {
          fromLine = lineNo(display.view[fromIndex].line);
          fromNode = display.view[fromIndex - 1].node.nextSibling;
        }
        var toIndex = findViewIndex(cm, to.line);
        var toLine, toNode;
        if (toIndex == display.view.length - 1) {
          toLine = display.viewTo - 1;
          toNode = display.lineDiv.lastChild;
        } else {
          toLine = lineNo(display.view[toIndex + 1].line) - 1;
          toNode = display.view[toIndex + 1].node.previousSibling;
        }
        if (!fromNode) {
          return false;
        }
        var newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
        var oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length));
        while (newText.length > 1 && oldText.length > 1) {
          if (lst(newText) == lst(oldText)) {
            newText.pop();
            oldText.pop();
            toLine--;
          } else if (newText[0] == oldText[0]) {
            newText.shift();
            oldText.shift();
            fromLine++;
          } else {
            break;
          }
        }
        var cutFront = 0, cutEnd = 0;
        var newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
        while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront)) {
          ++cutFront;
        }
        var newBot = lst(newText), oldBot = lst(oldText);
        var maxCutEnd = Math.min(newBot.length - (newText.length == 1 ? cutFront : 0), oldBot.length - (oldText.length == 1 ? cutFront : 0));
        while (cutEnd < maxCutEnd && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
          ++cutEnd;
        }
        if (newText.length == 1 && oldText.length == 1 && fromLine == from.line) {
          while (cutFront && cutFront > from.ch && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)) {
            cutFront--;
            cutEnd++;
          }
        }
        newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd).replace(/^\u200b+/, "");
        newText[0] = newText[0].slice(cutFront).replace(/\u200b+$/, "");
        var chFrom = Pos(fromLine, cutFront);
        var chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);
        if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) {
          replaceRange(cm.doc, newText, chFrom, chTo, "+input");
          return true;
        }
      };
      ContentEditableInput.prototype.ensurePolled = function() {
        this.forceCompositionEnd();
      };
      ContentEditableInput.prototype.reset = function() {
        this.forceCompositionEnd();
      };
      ContentEditableInput.prototype.forceCompositionEnd = function() {
        if (!this.composing) {
          return;
        }
        clearTimeout(this.readDOMTimeout);
        this.composing = null;
        this.updateFromDOM();
        this.div.blur();
        this.div.focus();
      };
      ContentEditableInput.prototype.readFromDOMSoon = function() {
        var this$1 = this;
        if (this.readDOMTimeout != null) {
          return;
        }
        this.readDOMTimeout = setTimeout(function() {
          this$1.readDOMTimeout = null;
          if (this$1.composing) {
            if (this$1.composing.done) {
              this$1.composing = null;
            } else {
              return;
            }
          }
          this$1.updateFromDOM();
        }, 80);
      };
      ContentEditableInput.prototype.updateFromDOM = function() {
        var this$1 = this;
        if (this.cm.isReadOnly() || !this.pollContent()) {
          runInOp(this.cm, function() {
            return regChange(this$1.cm);
          });
        }
      };
      ContentEditableInput.prototype.setUneditable = function(node) {
        node.contentEditable = "false";
      };
      ContentEditableInput.prototype.onKeyPress = function(e4) {
        if (e4.charCode == 0 || this.composing) {
          return;
        }
        e4.preventDefault();
        if (!this.cm.isReadOnly()) {
          operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(e4.charCode == null ? e4.keyCode : e4.charCode), 0);
        }
      };
      ContentEditableInput.prototype.readOnlyChanged = function(val) {
        this.div.contentEditable = String(val != "nocursor");
      };
      ContentEditableInput.prototype.onContextMenu = function() {
      };
      ContentEditableInput.prototype.resetPosition = function() {
      };
      ContentEditableInput.prototype.needsContentAttribute = true;
      function posToDOM(cm, pos) {
        var view = findViewForLine(cm, pos.line);
        if (!view || view.hidden) {
          return null;
        }
        var line = getLine(cm.doc, pos.line);
        var info = mapFromLineView(view, line, pos.line);
        var order = getOrder(line, cm.doc.direction), side = "left";
        if (order) {
          var partPos = getBidiPartAt(order, pos.ch);
          side = partPos % 2 ? "right" : "left";
        }
        var result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
        result.offset = result.collapse == "right" ? result.end : result.start;
        return result;
      }
      function isInGutter(node) {
        for (var scan = node; scan; scan = scan.parentNode) {
          if (/CodeMirror-gutter-wrapper/.test(scan.className)) {
            return true;
          }
        }
        return false;
      }
      function badPos(pos, bad) {
        if (bad) {
          pos.bad = true;
        }
        return pos;
      }
      function domTextBetween(cm, from, to, fromLine, toLine) {
        var text = "", closing = false, lineSep = cm.doc.lineSeparator(), extraLinebreak = false;
        function recognizeMarker(id) {
          return function(marker) {
            return marker.id == id;
          };
        }
        function close() {
          if (closing) {
            text += lineSep;
            if (extraLinebreak) {
              text += lineSep;
            }
            closing = extraLinebreak = false;
          }
        }
        function addText(str) {
          if (str) {
            close();
            text += str;
          }
        }
        function walk(node) {
          if (node.nodeType == 1) {
            var cmText = node.getAttribute("cm-text");
            if (cmText) {
              addText(cmText);
              return;
            }
            var markerID = node.getAttribute("cm-marker"), range2;
            if (markerID) {
              var found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
              if (found.length && (range2 = found[0].find(0))) {
                addText(getBetween(cm.doc, range2.from, range2.to).join(lineSep));
              }
              return;
            }
            if (node.getAttribute("contenteditable") == "false") {
              return;
            }
            var isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
            if (!/^br$/i.test(node.nodeName) && node.textContent.length == 0) {
              return;
            }
            if (isBlock) {
              close();
            }
            for (var i11 = 0; i11 < node.childNodes.length; i11++) {
              walk(node.childNodes[i11]);
            }
            if (/^(pre|p)$/i.test(node.nodeName)) {
              extraLinebreak = true;
            }
            if (isBlock) {
              closing = true;
            }
          } else if (node.nodeType == 3) {
            addText(node.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
          }
        }
        for (; ; ) {
          walk(from);
          if (from == to) {
            break;
          }
          from = from.nextSibling;
          extraLinebreak = false;
        }
        return text;
      }
      function domToPos(cm, node, offset) {
        var lineNode;
        if (node == cm.display.lineDiv) {
          lineNode = cm.display.lineDiv.childNodes[offset];
          if (!lineNode) {
            return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true);
          }
          node = null;
          offset = 0;
        } else {
          for (lineNode = node; ; lineNode = lineNode.parentNode) {
            if (!lineNode || lineNode == cm.display.lineDiv) {
              return null;
            }
            if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) {
              break;
            }
          }
        }
        for (var i11 = 0; i11 < cm.display.view.length; i11++) {
          var lineView = cm.display.view[i11];
          if (lineView.node == lineNode) {
            return locateNodeInLineView(lineView, node, offset);
          }
        }
      }
      function locateNodeInLineView(lineView, node, offset) {
        var wrapper = lineView.text.firstChild, bad = false;
        if (!node || !contains(wrapper, node)) {
          return badPos(Pos(lineNo(lineView.line), 0), true);
        }
        if (node == wrapper) {
          bad = true;
          node = wrapper.childNodes[offset];
          offset = 0;
          if (!node) {
            var line = lineView.rest ? lst(lineView.rest) : lineView.line;
            return badPos(Pos(lineNo(line), line.text.length), bad);
          }
        }
        var textNode = node.nodeType == 3 ? node : null, topNode = node;
        if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
          textNode = node.firstChild;
          if (offset) {
            offset = textNode.nodeValue.length;
          }
        }
        while (topNode.parentNode != wrapper) {
          topNode = topNode.parentNode;
        }
        var measure = lineView.measure, maps = measure.maps;
        function find(textNode2, topNode2, offset2) {
          for (var i11 = -1; i11 < (maps ? maps.length : 0); i11++) {
            var map2 = i11 < 0 ? measure.map : maps[i11];
            for (var j2 = 0; j2 < map2.length; j2 += 3) {
              var curNode = map2[j2 + 2];
              if (curNode == textNode2 || curNode == topNode2) {
                var line2 = lineNo(i11 < 0 ? lineView.line : lineView.rest[i11]);
                var ch = map2[j2] + offset2;
                if (offset2 < 0 || curNode != textNode2) {
                  ch = map2[j2 + (offset2 ? 1 : 0)];
                }
                return Pos(line2, ch);
              }
            }
          }
        }
        var found = find(textNode, topNode, offset);
        if (found) {
          return badPos(found, bad);
        }
        for (var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
          found = find(after, after.firstChild, 0);
          if (found) {
            return badPos(Pos(found.line, found.ch - dist), bad);
          } else {
            dist += after.textContent.length;
          }
        }
        for (var before = topNode.previousSibling, dist$1 = offset; before; before = before.previousSibling) {
          found = find(before, before.firstChild, -1);
          if (found) {
            return badPos(Pos(found.line, found.ch + dist$1), bad);
          } else {
            dist$1 += before.textContent.length;
          }
        }
      }
      var TextareaInput = function(cm) {
        this.cm = cm;
        this.prevInput = "";
        this.pollingFast = false;
        this.polling = new Delayed();
        this.hasSelection = false;
        this.composing = null;
      };
      TextareaInput.prototype.init = function(display) {
        var this$1 = this;
        var input = this, cm = this.cm;
        this.createField(display);
        var te = this.textarea;
        display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild);
        if (ios) {
          te.style.width = "0px";
        }
        on(te, "input", function() {
          if (ie && ie_version >= 9 && this$1.hasSelection) {
            this$1.hasSelection = null;
          }
          input.poll();
        });
        on(te, "paste", function(e4) {
          if (signalDOMEvent(cm, e4) || handlePaste(e4, cm)) {
            return;
          }
          cm.state.pasteIncoming = +new Date();
          input.fastPoll();
        });
        function prepareCopyCut(e4) {
          if (signalDOMEvent(cm, e4)) {
            return;
          }
          if (cm.somethingSelected()) {
            setLastCopied({ lineWise: false, text: cm.getSelections() });
          } else if (!cm.options.lineWiseCopyCut) {
            return;
          } else {
            var ranges = copyableRanges(cm);
            setLastCopied({ lineWise: true, text: ranges.text });
            if (e4.type == "cut") {
              cm.setSelections(ranges.ranges, null, sel_dontScroll);
            } else {
              input.prevInput = "";
              te.value = ranges.text.join("\n");
              selectInput(te);
            }
          }
          if (e4.type == "cut") {
            cm.state.cutIncoming = +new Date();
          }
        }
        on(te, "cut", prepareCopyCut);
        on(te, "copy", prepareCopyCut);
        on(display.scroller, "paste", function(e4) {
          if (eventInWidget(display, e4) || signalDOMEvent(cm, e4)) {
            return;
          }
          if (!te.dispatchEvent) {
            cm.state.pasteIncoming = +new Date();
            input.focus();
            return;
          }
          var event2 = new Event("paste");
          event2.clipboardData = e4.clipboardData;
          te.dispatchEvent(event2);
        });
        on(display.lineSpace, "selectstart", function(e4) {
          if (!eventInWidget(display, e4)) {
            e_preventDefault(e4);
          }
        });
        on(te, "compositionstart", function() {
          var start = cm.getCursor("from");
          if (input.composing) {
            input.composing.range.clear();
          }
          input.composing = {
            start,
            range: cm.markText(start, cm.getCursor("to"), { className: "CodeMirror-composing" })
          };
        });
        on(te, "compositionend", function() {
          if (input.composing) {
            input.poll();
            input.composing.range.clear();
            input.composing = null;
          }
        });
      };
      TextareaInput.prototype.createField = function(_display) {
        this.wrapper = hiddenTextarea();
        this.textarea = this.wrapper.firstChild;
      };
      TextareaInput.prototype.screenReaderLabelChanged = function(label) {
        if (label) {
          this.textarea.setAttribute("aria-label", label);
        } else {
          this.textarea.removeAttribute("aria-label");
        }
      };
      TextareaInput.prototype.prepareSelection = function() {
        var cm = this.cm, display = cm.display, doc = cm.doc;
        var result = prepareSelection(cm);
        if (cm.options.moveInputWithCursor) {
          var headPos = cursorCoords(cm, doc.sel.primary().head, "div");
          var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
          result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10, headPos.top + lineOff.top - wrapOff.top));
          result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10, headPos.left + lineOff.left - wrapOff.left));
        }
        return result;
      };
      TextareaInput.prototype.showSelection = function(drawn) {
        var cm = this.cm, display = cm.display;
        removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
        removeChildrenAndAdd(display.selectionDiv, drawn.selection);
        if (drawn.teTop != null) {
          this.wrapper.style.top = drawn.teTop + "px";
          this.wrapper.style.left = drawn.teLeft + "px";
        }
      };
      TextareaInput.prototype.reset = function(typing) {
        if (this.contextMenuPending || this.composing) {
          return;
        }
        var cm = this.cm;
        if (cm.somethingSelected()) {
          this.prevInput = "";
          var content = cm.getSelection();
          this.textarea.value = content;
          if (cm.state.focused) {
            selectInput(this.textarea);
          }
          if (ie && ie_version >= 9) {
            this.hasSelection = content;
          }
        } else if (!typing) {
          this.prevInput = this.textarea.value = "";
          if (ie && ie_version >= 9) {
            this.hasSelection = null;
          }
        }
      };
      TextareaInput.prototype.getField = function() {
        return this.textarea;
      };
      TextareaInput.prototype.supportsTouch = function() {
        return false;
      };
      TextareaInput.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt() != this.textarea)) {
          try {
            this.textarea.focus();
          } catch (e4) {
          }
        }
      };
      TextareaInput.prototype.blur = function() {
        this.textarea.blur();
      };
      TextareaInput.prototype.resetPosition = function() {
        this.wrapper.style.top = this.wrapper.style.left = 0;
      };
      TextareaInput.prototype.receivedFocus = function() {
        this.slowPoll();
      };
      TextareaInput.prototype.slowPoll = function() {
        var this$1 = this;
        if (this.pollingFast) {
          return;
        }
        this.polling.set(this.cm.options.pollInterval, function() {
          this$1.poll();
          if (this$1.cm.state.focused) {
            this$1.slowPoll();
          }
        });
      };
      TextareaInput.prototype.fastPoll = function() {
        var missed = false, input = this;
        input.pollingFast = true;
        function p4() {
          var changed = input.poll();
          if (!changed && !missed) {
            missed = true;
            input.polling.set(60, p4);
          } else {
            input.pollingFast = false;
            input.slowPoll();
          }
        }
        input.polling.set(20, p4);
      };
      TextareaInput.prototype.poll = function() {
        var this$1 = this;
        var cm = this.cm, input = this.textarea, prevInput = this.prevInput;
        if (this.contextMenuPending || !cm.state.focused || hasSelection(input) && !prevInput && !this.composing || cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq) {
          return false;
        }
        var text = input.value;
        if (text == prevInput && !cm.somethingSelected()) {
          return false;
        }
        if (ie && ie_version >= 9 && this.hasSelection === text || mac && /[\uf700-\uf7ff]/.test(text)) {
          cm.display.input.reset();
          return false;
        }
        if (cm.doc.sel == cm.display.selForContextMenu) {
          var first = text.charCodeAt(0);
          if (first == 8203 && !prevInput) {
            prevInput = "\u200B";
          }
          if (first == 8666) {
            this.reset();
            return this.cm.execCommand("undo");
          }
        }
        var same = 0, l4 = Math.min(prevInput.length, text.length);
        while (same < l4 && prevInput.charCodeAt(same) == text.charCodeAt(same)) {
          ++same;
        }
        runInOp(cm, function() {
          applyTextInput(cm, text.slice(same), prevInput.length - same, null, this$1.composing ? "*compose" : null);
          if (text.length > 1e3 || text.indexOf("\n") > -1) {
            input.value = this$1.prevInput = "";
          } else {
            this$1.prevInput = text;
          }
          if (this$1.composing) {
            this$1.composing.range.clear();
            this$1.composing.range = cm.markText(this$1.composing.start, cm.getCursor("to"), { className: "CodeMirror-composing" });
          }
        });
        return true;
      };
      TextareaInput.prototype.ensurePolled = function() {
        if (this.pollingFast && this.poll()) {
          this.pollingFast = false;
        }
      };
      TextareaInput.prototype.onKeyPress = function() {
        if (ie && ie_version >= 9) {
          this.hasSelection = null;
        }
        this.fastPoll();
      };
      TextareaInput.prototype.onContextMenu = function(e4) {
        var input = this, cm = input.cm, display = cm.display, te = input.textarea;
        if (input.contextMenuPending) {
          input.contextMenuPending();
        }
        var pos = posFromMouse(cm, e4), scrollPos = display.scroller.scrollTop;
        if (!pos || presto) {
          return;
        }
        var reset = cm.options.resetSelectionOnContextMenu;
        if (reset && cm.doc.sel.contains(pos) == -1) {
          operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);
        }
        var oldCSS = te.style.cssText, oldWrapperCSS = input.wrapper.style.cssText;
        var wrapperBox = input.wrapper.offsetParent.getBoundingClientRect();
        input.wrapper.style.cssText = "position: static";
        te.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e4.clientY - wrapperBox.top - 5) + "px; left: " + (e4.clientX - wrapperBox.left - 5) + "px;\n      z-index: 1000; background: " + (ie ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
        var oldScrollY;
        if (webkit) {
          oldScrollY = window.scrollY;
        }
        display.input.focus();
        if (webkit) {
          window.scrollTo(null, oldScrollY);
        }
        display.input.reset();
        if (!cm.somethingSelected()) {
          te.value = input.prevInput = " ";
        }
        input.contextMenuPending = rehide;
        display.selForContextMenu = cm.doc.sel;
        clearTimeout(display.detectingSelectAll);
        function prepareSelectAllHack() {
          if (te.selectionStart != null) {
            var selected = cm.somethingSelected();
            var extval = "\u200B" + (selected ? te.value : "");
            te.value = "\u21DA";
            te.value = extval;
            input.prevInput = selected ? "" : "\u200B";
            te.selectionStart = 1;
            te.selectionEnd = extval.length;
            display.selForContextMenu = cm.doc.sel;
          }
        }
        function rehide() {
          if (input.contextMenuPending != rehide) {
            return;
          }
          input.contextMenuPending = false;
          input.wrapper.style.cssText = oldWrapperCSS;
          te.style.cssText = oldCSS;
          if (ie && ie_version < 9) {
            display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);
          }
          if (te.selectionStart != null) {
            if (!ie || ie && ie_version < 9) {
              prepareSelectAllHack();
            }
            var i11 = 0, poll = function() {
              if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 && te.selectionEnd > 0 && input.prevInput == "\u200B") {
                operation(cm, selectAll)(cm);
              } else if (i11++ < 10) {
                display.detectingSelectAll = setTimeout(poll, 500);
              } else {
                display.selForContextMenu = null;
                display.input.reset();
              }
            };
            display.detectingSelectAll = setTimeout(poll, 200);
          }
        }
        if (ie && ie_version >= 9) {
          prepareSelectAllHack();
        }
        if (captureRightClick) {
          e_stop(e4);
          var mouseup = function() {
            off(window, "mouseup", mouseup);
            setTimeout(rehide, 20);
          };
          on(window, "mouseup", mouseup);
        } else {
          setTimeout(rehide, 50);
        }
      };
      TextareaInput.prototype.readOnlyChanged = function(val) {
        if (!val) {
          this.reset();
        }
        this.textarea.disabled = val == "nocursor";
        this.textarea.readOnly = !!val;
      };
      TextareaInput.prototype.setUneditable = function() {
      };
      TextareaInput.prototype.needsContentAttribute = false;
      function fromTextArea(textarea, options) {
        options = options ? copyObj(options) : {};
        options.value = textarea.value;
        if (!options.tabindex && textarea.tabIndex) {
          options.tabindex = textarea.tabIndex;
        }
        if (!options.placeholder && textarea.placeholder) {
          options.placeholder = textarea.placeholder;
        }
        if (options.autofocus == null) {
          var hasFocus = activeElt();
          options.autofocus = hasFocus == textarea || textarea.getAttribute("autofocus") != null && hasFocus == document.body;
        }
        function save() {
          textarea.value = cm.getValue();
        }
        var realSubmit;
        if (textarea.form) {
          on(textarea.form, "submit", save);
          if (!options.leaveSubmitMethodAlone) {
            var form = textarea.form;
            realSubmit = form.submit;
            try {
              var wrappedSubmit = form.submit = function() {
                save();
                form.submit = realSubmit;
                form.submit();
                form.submit = wrappedSubmit;
              };
            } catch (e4) {
            }
          }
        }
        options.finishInit = function(cm2) {
          cm2.save = save;
          cm2.getTextArea = function() {
            return textarea;
          };
          cm2.toTextArea = function() {
            cm2.toTextArea = isNaN;
            save();
            textarea.parentNode.removeChild(cm2.getWrapperElement());
            textarea.style.display = "";
            if (textarea.form) {
              off(textarea.form, "submit", save);
              if (!options.leaveSubmitMethodAlone && typeof textarea.form.submit == "function") {
                textarea.form.submit = realSubmit;
              }
            }
          };
        };
        textarea.style.display = "none";
        var cm = CodeMirror3(function(node) {
          return textarea.parentNode.insertBefore(node, textarea.nextSibling);
        }, options);
        return cm;
      }
      function addLegacyProps(CodeMirror4) {
        CodeMirror4.off = off;
        CodeMirror4.on = on;
        CodeMirror4.wheelEventPixels = wheelEventPixels;
        CodeMirror4.Doc = Doc;
        CodeMirror4.splitLines = splitLinesAuto;
        CodeMirror4.countColumn = countColumn;
        CodeMirror4.findColumn = findColumn;
        CodeMirror4.isWordChar = isWordCharBasic;
        CodeMirror4.Pass = Pass;
        CodeMirror4.signal = signal;
        CodeMirror4.Line = Line;
        CodeMirror4.changeEnd = changeEnd;
        CodeMirror4.scrollbarModel = scrollbarModel;
        CodeMirror4.Pos = Pos;
        CodeMirror4.cmpPos = cmp;
        CodeMirror4.modes = modes;
        CodeMirror4.mimeModes = mimeModes;
        CodeMirror4.resolveMode = resolveMode;
        CodeMirror4.getMode = getMode;
        CodeMirror4.modeExtensions = modeExtensions;
        CodeMirror4.extendMode = extendMode;
        CodeMirror4.copyState = copyState;
        CodeMirror4.startState = startState;
        CodeMirror4.innerMode = innerMode;
        CodeMirror4.commands = commands;
        CodeMirror4.keyMap = keyMap;
        CodeMirror4.keyName = keyName;
        CodeMirror4.isModifierKey = isModifierKey;
        CodeMirror4.lookupKey = lookupKey;
        CodeMirror4.normalizeKeyMap = normalizeKeyMap;
        CodeMirror4.StringStream = StringStream;
        CodeMirror4.SharedTextMarker = SharedTextMarker;
        CodeMirror4.TextMarker = TextMarker;
        CodeMirror4.LineWidget = LineWidget;
        CodeMirror4.e_preventDefault = e_preventDefault;
        CodeMirror4.e_stopPropagation = e_stopPropagation;
        CodeMirror4.e_stop = e_stop;
        CodeMirror4.addClass = addClass;
        CodeMirror4.contains = contains;
        CodeMirror4.rmClass = rmClass;
        CodeMirror4.keyNames = keyNames;
      }
      defineOptions(CodeMirror3);
      addEditorMethods(CodeMirror3);
      var dontDelegate = "iter insert remove copy getEditor constructor".split(" ");
      for (var prop in Doc.prototype) {
        if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0) {
          CodeMirror3.prototype[prop] = function(method) {
            return function() {
              return method.apply(this.doc, arguments);
            };
          }(Doc.prototype[prop]);
        }
      }
      eventMixin(Doc);
      CodeMirror3.inputStyles = { "textarea": TextareaInput, "contenteditable": ContentEditableInput };
      CodeMirror3.defineMode = function(name) {
        if (!CodeMirror3.defaults.mode && name != "null") {
          CodeMirror3.defaults.mode = name;
        }
        defineMode.apply(this, arguments);
      };
      CodeMirror3.defineMIME = defineMIME;
      CodeMirror3.defineMode("null", function() {
        return { token: function(stream) {
          return stream.skipToEnd();
        } };
      });
      CodeMirror3.defineMIME("text/plain", "null");
      CodeMirror3.defineExtension = function(name, func) {
        CodeMirror3.prototype[name] = func;
      };
      CodeMirror3.defineDocExtension = function(name, func) {
        Doc.prototype[name] = func;
      };
      CodeMirror3.fromTextArea = fromTextArea;
      addLegacyProps(CodeMirror3);
      CodeMirror3.version = "5.63.1";
      return CodeMirror3;
    });
  }
});

// node_modules/codemirror/mode/xml/xml.js
var require_xml = __commonJS({
  "node_modules/codemirror/mode/xml/xml.js"(exports, module) {
    (function(mod) {
      if (typeof exports == "object" && typeof module == "object")
        mod(require_codemirror());
      else if (typeof define == "function" && define.amd)
        define(["../../lib/codemirror"], mod);
      else
        mod(CodeMirror);
    })(function(CodeMirror3) {
      "use strict";
      var htmlConfig = {
        autoSelfClosers: {
          "area": true,
          "base": true,
          "br": true,
          "col": true,
          "command": true,
          "embed": true,
          "frame": true,
          "hr": true,
          "img": true,
          "input": true,
          "keygen": true,
          "link": true,
          "meta": true,
          "param": true,
          "source": true,
          "track": true,
          "wbr": true,
          "menuitem": true
        },
        implicitlyClosed: {
          "dd": true,
          "li": true,
          "optgroup": true,
          "option": true,
          "p": true,
          "rp": true,
          "rt": true,
          "tbody": true,
          "td": true,
          "tfoot": true,
          "th": true,
          "tr": true
        },
        contextGrabbers: {
          "dd": { "dd": true, "dt": true },
          "dt": { "dd": true, "dt": true },
          "li": { "li": true },
          "option": { "option": true, "optgroup": true },
          "optgroup": { "optgroup": true },
          "p": {
            "address": true,
            "article": true,
            "aside": true,
            "blockquote": true,
            "dir": true,
            "div": true,
            "dl": true,
            "fieldset": true,
            "footer": true,
            "form": true,
            "h1": true,
            "h2": true,
            "h3": true,
            "h4": true,
            "h5": true,
            "h6": true,
            "header": true,
            "hgroup": true,
            "hr": true,
            "menu": true,
            "nav": true,
            "ol": true,
            "p": true,
            "pre": true,
            "section": true,
            "table": true,
            "ul": true
          },
          "rp": { "rp": true, "rt": true },
          "rt": { "rp": true, "rt": true },
          "tbody": { "tbody": true, "tfoot": true },
          "td": { "td": true, "th": true },
          "tfoot": { "tbody": true },
          "th": { "td": true, "th": true },
          "thead": { "tbody": true, "tfoot": true },
          "tr": { "tr": true }
        },
        doNotIndent: { "pre": true },
        allowUnquoted: true,
        allowMissing: true,
        caseFold: true
      };
      var xmlConfig = {
        autoSelfClosers: {},
        implicitlyClosed: {},
        contextGrabbers: {},
        doNotIndent: {},
        allowUnquoted: false,
        allowMissing: false,
        allowMissingTagName: false,
        caseFold: false
      };
      CodeMirror3.defineMode("xml", function(editorConf, config_) {
        var indentUnit = editorConf.indentUnit;
        var config = {};
        var defaults = config_.htmlMode ? htmlConfig : xmlConfig;
        for (var prop in defaults)
          config[prop] = defaults[prop];
        for (var prop in config_)
          config[prop] = config_[prop];
        var type, setStyle;
        function inText(stream, state) {
          function chain(parser) {
            state.tokenize = parser;
            return parser(stream, state);
          }
          var ch = stream.next();
          if (ch == "<") {
            if (stream.eat("!")) {
              if (stream.eat("[")) {
                if (stream.match("CDATA["))
                  return chain(inBlock("atom", "]]>"));
                else
                  return null;
              } else if (stream.match("--")) {
                return chain(inBlock("comment", "-->"));
              } else if (stream.match("DOCTYPE", true, true)) {
                stream.eatWhile(/[\w\._\-]/);
                return chain(doctype(1));
              } else {
                return null;
              }
            } else if (stream.eat("?")) {
              stream.eatWhile(/[\w\._\-]/);
              state.tokenize = inBlock("meta", "?>");
              return "meta";
            } else {
              type = stream.eat("/") ? "closeTag" : "openTag";
              state.tokenize = inTag;
              return "tag bracket";
            }
          } else if (ch == "&") {
            var ok;
            if (stream.eat("#")) {
              if (stream.eat("x")) {
                ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
              } else {
                ok = stream.eatWhile(/[\d]/) && stream.eat(";");
              }
            } else {
              ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
            }
            return ok ? "atom" : "error";
          } else {
            stream.eatWhile(/[^&<]/);
            return null;
          }
        }
        inText.isInText = true;
        function inTag(stream, state) {
          var ch = stream.next();
          if (ch == ">" || ch == "/" && stream.eat(">")) {
            state.tokenize = inText;
            type = ch == ">" ? "endTag" : "selfcloseTag";
            return "tag bracket";
          } else if (ch == "=") {
            type = "equals";
            return null;
          } else if (ch == "<") {
            state.tokenize = inText;
            state.state = baseState;
            state.tagName = state.tagStart = null;
            var next = state.tokenize(stream, state);
            return next ? next + " tag error" : "tag error";
          } else if (/[\'\"]/.test(ch)) {
            state.tokenize = inAttribute(ch);
            state.stringStartCol = stream.column();
            return state.tokenize(stream, state);
          } else {
            stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
            return "word";
          }
        }
        function inAttribute(quote) {
          var closure = function(stream, state) {
            while (!stream.eol()) {
              if (stream.next() == quote) {
                state.tokenize = inTag;
                break;
              }
            }
            return "string";
          };
          closure.isInAttribute = true;
          return closure;
        }
        function inBlock(style, terminator) {
          return function(stream, state) {
            while (!stream.eol()) {
              if (stream.match(terminator)) {
                state.tokenize = inText;
                break;
              }
              stream.next();
            }
            return style;
          };
        }
        function doctype(depth) {
          return function(stream, state) {
            var ch;
            while ((ch = stream.next()) != null) {
              if (ch == "<") {
                state.tokenize = doctype(depth + 1);
                return state.tokenize(stream, state);
              } else if (ch == ">") {
                if (depth == 1) {
                  state.tokenize = inText;
                  break;
                } else {
                  state.tokenize = doctype(depth - 1);
                  return state.tokenize(stream, state);
                }
              }
            }
            return "meta";
          };
        }
        function lower(tagName) {
          return tagName && tagName.toLowerCase();
        }
        function Context(state, tagName, startOfLine) {
          this.prev = state.context;
          this.tagName = tagName || "";
          this.indent = state.indented;
          this.startOfLine = startOfLine;
          if (config.doNotIndent.hasOwnProperty(tagName) || state.context && state.context.noIndent)
            this.noIndent = true;
        }
        function popContext(state) {
          if (state.context)
            state.context = state.context.prev;
        }
        function maybePopContext(state, nextTagName) {
          var parentTagName;
          while (true) {
            if (!state.context) {
              return;
            }
            parentTagName = state.context.tagName;
            if (!config.contextGrabbers.hasOwnProperty(lower(parentTagName)) || !config.contextGrabbers[lower(parentTagName)].hasOwnProperty(lower(nextTagName))) {
              return;
            }
            popContext(state);
          }
        }
        function baseState(type2, stream, state) {
          if (type2 == "openTag") {
            state.tagStart = stream.column();
            return tagNameState;
          } else if (type2 == "closeTag") {
            return closeTagNameState;
          } else {
            return baseState;
          }
        }
        function tagNameState(type2, stream, state) {
          if (type2 == "word") {
            state.tagName = stream.current();
            setStyle = "tag";
            return attrState;
          } else if (config.allowMissingTagName && type2 == "endTag") {
            setStyle = "tag bracket";
            return attrState(type2, stream, state);
          } else {
            setStyle = "error";
            return tagNameState;
          }
        }
        function closeTagNameState(type2, stream, state) {
          if (type2 == "word") {
            var tagName = stream.current();
            if (state.context && state.context.tagName != tagName && config.implicitlyClosed.hasOwnProperty(lower(state.context.tagName)))
              popContext(state);
            if (state.context && state.context.tagName == tagName || config.matchClosing === false) {
              setStyle = "tag";
              return closeState;
            } else {
              setStyle = "tag error";
              return closeStateErr;
            }
          } else if (config.allowMissingTagName && type2 == "endTag") {
            setStyle = "tag bracket";
            return closeState(type2, stream, state);
          } else {
            setStyle = "error";
            return closeStateErr;
          }
        }
        function closeState(type2, _stream, state) {
          if (type2 != "endTag") {
            setStyle = "error";
            return closeState;
          }
          popContext(state);
          return baseState;
        }
        function closeStateErr(type2, stream, state) {
          setStyle = "error";
          return closeState(type2, stream, state);
        }
        function attrState(type2, _stream, state) {
          if (type2 == "word") {
            setStyle = "attribute";
            return attrEqState;
          } else if (type2 == "endTag" || type2 == "selfcloseTag") {
            var tagName = state.tagName, tagStart = state.tagStart;
            state.tagName = state.tagStart = null;
            if (type2 == "selfcloseTag" || config.autoSelfClosers.hasOwnProperty(lower(tagName))) {
              maybePopContext(state, tagName);
            } else {
              maybePopContext(state, tagName);
              state.context = new Context(state, tagName, tagStart == state.indented);
            }
            return baseState;
          }
          setStyle = "error";
          return attrState;
        }
        function attrEqState(type2, stream, state) {
          if (type2 == "equals")
            return attrValueState;
          if (!config.allowMissing)
            setStyle = "error";
          return attrState(type2, stream, state);
        }
        function attrValueState(type2, stream, state) {
          if (type2 == "string")
            return attrContinuedState;
          if (type2 == "word" && config.allowUnquoted) {
            setStyle = "string";
            return attrState;
          }
          setStyle = "error";
          return attrState(type2, stream, state);
        }
        function attrContinuedState(type2, stream, state) {
          if (type2 == "string")
            return attrContinuedState;
          return attrState(type2, stream, state);
        }
        return {
          startState: function(baseIndent) {
            var state = {
              tokenize: inText,
              state: baseState,
              indented: baseIndent || 0,
              tagName: null,
              tagStart: null,
              context: null
            };
            if (baseIndent != null)
              state.baseIndent = baseIndent;
            return state;
          },
          token: function(stream, state) {
            if (!state.tagName && stream.sol())
              state.indented = stream.indentation();
            if (stream.eatSpace())
              return null;
            type = null;
            var style = state.tokenize(stream, state);
            if ((style || type) && style != "comment") {
              setStyle = null;
              state.state = state.state(type || style, stream, state);
              if (setStyle)
                style = setStyle == "error" ? style + " error" : setStyle;
            }
            return style;
          },
          indent: function(state, textAfter, fullLine) {
            var context = state.context;
            if (state.tokenize.isInAttribute) {
              if (state.tagStart == state.indented)
                return state.stringStartCol + 1;
              else
                return state.indented + indentUnit;
            }
            if (context && context.noIndent)
              return CodeMirror3.Pass;
            if (state.tokenize != inTag && state.tokenize != inText)
              return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
            if (state.tagName) {
              if (config.multilineTagIndentPastTag !== false)
                return state.tagStart + state.tagName.length + 2;
              else
                return state.tagStart + indentUnit * (config.multilineTagIndentFactor || 1);
            }
            if (config.alignCDATA && /<!\[CDATA\[/.test(textAfter))
              return 0;
            var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
            if (tagAfter && tagAfter[1]) {
              while (context) {
                if (context.tagName == tagAfter[2]) {
                  context = context.prev;
                  break;
                } else if (config.implicitlyClosed.hasOwnProperty(lower(context.tagName))) {
                  context = context.prev;
                } else {
                  break;
                }
              }
            } else if (tagAfter) {
              while (context) {
                var grabbers = config.contextGrabbers[lower(context.tagName)];
                if (grabbers && grabbers.hasOwnProperty(lower(tagAfter[2])))
                  context = context.prev;
                else
                  break;
              }
            }
            while (context && context.prev && !context.startOfLine)
              context = context.prev;
            if (context)
              return context.indent + indentUnit;
            else
              return state.baseIndent || 0;
          },
          electricInput: /<\/[\s\w:]+>$/,
          blockCommentStart: "<!--",
          blockCommentEnd: "-->",
          configuration: config.htmlMode ? "html" : "xml",
          helperType: config.htmlMode ? "html" : "xml",
          skipAttribute: function(state) {
            if (state.state == attrValueState)
              state.state = attrState;
          },
          xmlCurrentTag: function(state) {
            return state.tagName ? { name: state.tagName, close: state.type == "closeTag" } : null;
          },
          xmlCurrentContext: function(state) {
            var context = [];
            for (var cx = state.context; cx; cx = cx.prev)
              context.push(cx.tagName);
            return context.reverse();
          }
        };
      });
      CodeMirror3.defineMIME("text/xml", "xml");
      CodeMirror3.defineMIME("application/xml", "xml");
      if (!CodeMirror3.mimeModes.hasOwnProperty("text/html"))
        CodeMirror3.defineMIME("text/html", { name: "xml", htmlMode: true });
    });
  }
});

// node_modules/codemirror/mode/meta.js
var require_meta = __commonJS({
  "node_modules/codemirror/mode/meta.js"(exports, module) {
    (function(mod) {
      if (typeof exports == "object" && typeof module == "object")
        mod(require_codemirror());
      else if (typeof define == "function" && define.amd)
        define(["../lib/codemirror"], mod);
      else
        mod(CodeMirror);
    })(function(CodeMirror3) {
      "use strict";
      CodeMirror3.modeInfo = [
        { name: "APL", mime: "text/apl", mode: "apl", ext: ["dyalog", "apl"] },
        { name: "PGP", mimes: ["application/pgp", "application/pgp-encrypted", "application/pgp-keys", "application/pgp-signature"], mode: "asciiarmor", ext: ["asc", "pgp", "sig"] },
        { name: "ASN.1", mime: "text/x-ttcn-asn", mode: "asn.1", ext: ["asn", "asn1"] },
        { name: "Asterisk", mime: "text/x-asterisk", mode: "asterisk", file: /^extensions\.conf$/i },
        { name: "Brainfuck", mime: "text/x-brainfuck", mode: "brainfuck", ext: ["b", "bf"] },
        { name: "C", mime: "text/x-csrc", mode: "clike", ext: ["c", "h", "ino"] },
        { name: "C++", mime: "text/x-c++src", mode: "clike", ext: ["cpp", "c++", "cc", "cxx", "hpp", "h++", "hh", "hxx"], alias: ["cpp"] },
        { name: "Cobol", mime: "text/x-cobol", mode: "cobol", ext: ["cob", "cpy", "cbl"] },
        { name: "C#", mime: "text/x-csharp", mode: "clike", ext: ["cs"], alias: ["csharp", "cs"] },
        { name: "Clojure", mime: "text/x-clojure", mode: "clojure", ext: ["clj", "cljc", "cljx"] },
        { name: "ClojureScript", mime: "text/x-clojurescript", mode: "clojure", ext: ["cljs"] },
        { name: "Closure Stylesheets (GSS)", mime: "text/x-gss", mode: "css", ext: ["gss"] },
        { name: "CMake", mime: "text/x-cmake", mode: "cmake", ext: ["cmake", "cmake.in"], file: /^CMakeLists\.txt$/ },
        { name: "CoffeeScript", mimes: ["application/vnd.coffeescript", "text/coffeescript", "text/x-coffeescript"], mode: "coffeescript", ext: ["coffee"], alias: ["coffee", "coffee-script"] },
        { name: "Common Lisp", mime: "text/x-common-lisp", mode: "commonlisp", ext: ["cl", "lisp", "el"], alias: ["lisp"] },
        { name: "Cypher", mime: "application/x-cypher-query", mode: "cypher", ext: ["cyp", "cypher"] },
        { name: "Cython", mime: "text/x-cython", mode: "python", ext: ["pyx", "pxd", "pxi"] },
        { name: "Crystal", mime: "text/x-crystal", mode: "crystal", ext: ["cr"] },
        { name: "CSS", mime: "text/css", mode: "css", ext: ["css"] },
        { name: "CQL", mime: "text/x-cassandra", mode: "sql", ext: ["cql"] },
        { name: "D", mime: "text/x-d", mode: "d", ext: ["d"] },
        { name: "Dart", mimes: ["application/dart", "text/x-dart"], mode: "dart", ext: ["dart"] },
        { name: "diff", mime: "text/x-diff", mode: "diff", ext: ["diff", "patch"] },
        { name: "Django", mime: "text/x-django", mode: "django" },
        { name: "Dockerfile", mime: "text/x-dockerfile", mode: "dockerfile", file: /^Dockerfile$/ },
        { name: "DTD", mime: "application/xml-dtd", mode: "dtd", ext: ["dtd"] },
        { name: "Dylan", mime: "text/x-dylan", mode: "dylan", ext: ["dylan", "dyl", "intr"] },
        { name: "EBNF", mime: "text/x-ebnf", mode: "ebnf" },
        { name: "ECL", mime: "text/x-ecl", mode: "ecl", ext: ["ecl"] },
        { name: "edn", mime: "application/edn", mode: "clojure", ext: ["edn"] },
        { name: "Eiffel", mime: "text/x-eiffel", mode: "eiffel", ext: ["e"] },
        { name: "Elm", mime: "text/x-elm", mode: "elm", ext: ["elm"] },
        { name: "Embedded JavaScript", mime: "application/x-ejs", mode: "htmlembedded", ext: ["ejs"] },
        { name: "Embedded Ruby", mime: "application/x-erb", mode: "htmlembedded", ext: ["erb"] },
        { name: "Erlang", mime: "text/x-erlang", mode: "erlang", ext: ["erl"] },
        { name: "Esper", mime: "text/x-esper", mode: "sql" },
        { name: "Factor", mime: "text/x-factor", mode: "factor", ext: ["factor"] },
        { name: "FCL", mime: "text/x-fcl", mode: "fcl" },
        { name: "Forth", mime: "text/x-forth", mode: "forth", ext: ["forth", "fth", "4th"] },
        { name: "Fortran", mime: "text/x-fortran", mode: "fortran", ext: ["f", "for", "f77", "f90", "f95"] },
        { name: "F#", mime: "text/x-fsharp", mode: "mllike", ext: ["fs"], alias: ["fsharp"] },
        { name: "Gas", mime: "text/x-gas", mode: "gas", ext: ["s"] },
        { name: "Gherkin", mime: "text/x-feature", mode: "gherkin", ext: ["feature"] },
        { name: "GitHub Flavored Markdown", mime: "text/x-gfm", mode: "gfm", file: /^(readme|contributing|history)\.md$/i },
        { name: "Go", mime: "text/x-go", mode: "go", ext: ["go"] },
        { name: "Groovy", mime: "text/x-groovy", mode: "groovy", ext: ["groovy", "gradle"], file: /^Jenkinsfile$/ },
        { name: "HAML", mime: "text/x-haml", mode: "haml", ext: ["haml"] },
        { name: "Haskell", mime: "text/x-haskell", mode: "haskell", ext: ["hs"] },
        { name: "Haskell (Literate)", mime: "text/x-literate-haskell", mode: "haskell-literate", ext: ["lhs"] },
        { name: "Haxe", mime: "text/x-haxe", mode: "haxe", ext: ["hx"] },
        { name: "HXML", mime: "text/x-hxml", mode: "haxe", ext: ["hxml"] },
        { name: "ASP.NET", mime: "application/x-aspx", mode: "htmlembedded", ext: ["aspx"], alias: ["asp", "aspx"] },
        { name: "HTML", mime: "text/html", mode: "htmlmixed", ext: ["html", "htm", "handlebars", "hbs"], alias: ["xhtml"] },
        { name: "HTTP", mime: "message/http", mode: "http" },
        { name: "IDL", mime: "text/x-idl", mode: "idl", ext: ["pro"] },
        { name: "Pug", mime: "text/x-pug", mode: "pug", ext: ["jade", "pug"], alias: ["jade"] },
        { name: "Java", mime: "text/x-java", mode: "clike", ext: ["java"] },
        { name: "Java Server Pages", mime: "application/x-jsp", mode: "htmlembedded", ext: ["jsp"], alias: ["jsp"] },
        {
          name: "JavaScript",
          mimes: ["text/javascript", "text/ecmascript", "application/javascript", "application/x-javascript", "application/ecmascript"],
          mode: "javascript",
          ext: ["js"],
          alias: ["ecmascript", "js", "node"]
        },
        { name: "JSON", mimes: ["application/json", "application/x-json"], mode: "javascript", ext: ["json", "map"], alias: ["json5"] },
        { name: "JSON-LD", mime: "application/ld+json", mode: "javascript", ext: ["jsonld"], alias: ["jsonld"] },
        { name: "JSX", mime: "text/jsx", mode: "jsx", ext: ["jsx"] },
        { name: "Jinja2", mime: "text/jinja2", mode: "jinja2", ext: ["j2", "jinja", "jinja2"] },
        { name: "Julia", mime: "text/x-julia", mode: "julia", ext: ["jl"], alias: ["jl"] },
        { name: "Kotlin", mime: "text/x-kotlin", mode: "clike", ext: ["kt"] },
        { name: "LESS", mime: "text/x-less", mode: "css", ext: ["less"] },
        { name: "LiveScript", mime: "text/x-livescript", mode: "livescript", ext: ["ls"], alias: ["ls"] },
        { name: "Lua", mime: "text/x-lua", mode: "lua", ext: ["lua"] },
        { name: "Markdown", mime: "text/x-markdown", mode: "markdown", ext: ["markdown", "md", "mkd"] },
        { name: "mIRC", mime: "text/mirc", mode: "mirc" },
        { name: "MariaDB SQL", mime: "text/x-mariadb", mode: "sql" },
        { name: "Mathematica", mime: "text/x-mathematica", mode: "mathematica", ext: ["m", "nb", "wl", "wls"] },
        { name: "Modelica", mime: "text/x-modelica", mode: "modelica", ext: ["mo"] },
        { name: "MUMPS", mime: "text/x-mumps", mode: "mumps", ext: ["mps"] },
        { name: "MS SQL", mime: "text/x-mssql", mode: "sql" },
        { name: "mbox", mime: "application/mbox", mode: "mbox", ext: ["mbox"] },
        { name: "MySQL", mime: "text/x-mysql", mode: "sql" },
        { name: "Nginx", mime: "text/x-nginx-conf", mode: "nginx", file: /nginx.*\.conf$/i },
        { name: "NSIS", mime: "text/x-nsis", mode: "nsis", ext: ["nsh", "nsi"] },
        {
          name: "NTriples",
          mimes: ["application/n-triples", "application/n-quads", "text/n-triples"],
          mode: "ntriples",
          ext: ["nt", "nq"]
        },
        { name: "Objective-C", mime: "text/x-objectivec", mode: "clike", ext: ["m"], alias: ["objective-c", "objc"] },
        { name: "Objective-C++", mime: "text/x-objectivec++", mode: "clike", ext: ["mm"], alias: ["objective-c++", "objc++"] },
        { name: "OCaml", mime: "text/x-ocaml", mode: "mllike", ext: ["ml", "mli", "mll", "mly"] },
        { name: "Octave", mime: "text/x-octave", mode: "octave", ext: ["m"] },
        { name: "Oz", mime: "text/x-oz", mode: "oz", ext: ["oz"] },
        { name: "Pascal", mime: "text/x-pascal", mode: "pascal", ext: ["p", "pas"] },
        { name: "PEG.js", mime: "null", mode: "pegjs", ext: ["jsonld"] },
        { name: "Perl", mime: "text/x-perl", mode: "perl", ext: ["pl", "pm"] },
        { name: "PHP", mimes: ["text/x-php", "application/x-httpd-php", "application/x-httpd-php-open"], mode: "php", ext: ["php", "php3", "php4", "php5", "php7", "phtml"] },
        { name: "Pig", mime: "text/x-pig", mode: "pig", ext: ["pig"] },
        { name: "Plain Text", mime: "text/plain", mode: "null", ext: ["txt", "text", "conf", "def", "list", "log"] },
        { name: "PLSQL", mime: "text/x-plsql", mode: "sql", ext: ["pls"] },
        { name: "PostgreSQL", mime: "text/x-pgsql", mode: "sql" },
        { name: "PowerShell", mime: "application/x-powershell", mode: "powershell", ext: ["ps1", "psd1", "psm1"] },
        { name: "Properties files", mime: "text/x-properties", mode: "properties", ext: ["properties", "ini", "in"], alias: ["ini", "properties"] },
        { name: "ProtoBuf", mime: "text/x-protobuf", mode: "protobuf", ext: ["proto"] },
        { name: "Python", mime: "text/x-python", mode: "python", ext: ["BUILD", "bzl", "py", "pyw"], file: /^(BUCK|BUILD)$/ },
        { name: "Puppet", mime: "text/x-puppet", mode: "puppet", ext: ["pp"] },
        { name: "Q", mime: "text/x-q", mode: "q", ext: ["q"] },
        { name: "R", mime: "text/x-rsrc", mode: "r", ext: ["r", "R"], alias: ["rscript"] },
        { name: "reStructuredText", mime: "text/x-rst", mode: "rst", ext: ["rst"], alias: ["rst"] },
        { name: "RPM Changes", mime: "text/x-rpm-changes", mode: "rpm" },
        { name: "RPM Spec", mime: "text/x-rpm-spec", mode: "rpm", ext: ["spec"] },
        { name: "Ruby", mime: "text/x-ruby", mode: "ruby", ext: ["rb"], alias: ["jruby", "macruby", "rake", "rb", "rbx"] },
        { name: "Rust", mime: "text/x-rustsrc", mode: "rust", ext: ["rs"] },
        { name: "SAS", mime: "text/x-sas", mode: "sas", ext: ["sas"] },
        { name: "Sass", mime: "text/x-sass", mode: "sass", ext: ["sass"] },
        { name: "Scala", mime: "text/x-scala", mode: "clike", ext: ["scala"] },
        { name: "Scheme", mime: "text/x-scheme", mode: "scheme", ext: ["scm", "ss"] },
        { name: "SCSS", mime: "text/x-scss", mode: "css", ext: ["scss"] },
        { name: "Shell", mimes: ["text/x-sh", "application/x-sh"], mode: "shell", ext: ["sh", "ksh", "bash"], alias: ["bash", "sh", "zsh"], file: /^PKGBUILD$/ },
        { name: "Sieve", mime: "application/sieve", mode: "sieve", ext: ["siv", "sieve"] },
        { name: "Slim", mimes: ["text/x-slim", "application/x-slim"], mode: "slim", ext: ["slim"] },
        { name: "Smalltalk", mime: "text/x-stsrc", mode: "smalltalk", ext: ["st"] },
        { name: "Smarty", mime: "text/x-smarty", mode: "smarty", ext: ["tpl"] },
        { name: "Solr", mime: "text/x-solr", mode: "solr" },
        { name: "SML", mime: "text/x-sml", mode: "mllike", ext: ["sml", "sig", "fun", "smackspec"] },
        { name: "Soy", mime: "text/x-soy", mode: "soy", ext: ["soy"], alias: ["closure template"] },
        { name: "SPARQL", mime: "application/sparql-query", mode: "sparql", ext: ["rq", "sparql"], alias: ["sparul"] },
        { name: "Spreadsheet", mime: "text/x-spreadsheet", mode: "spreadsheet", alias: ["excel", "formula"] },
        { name: "SQL", mime: "text/x-sql", mode: "sql", ext: ["sql"] },
        { name: "SQLite", mime: "text/x-sqlite", mode: "sql" },
        { name: "Squirrel", mime: "text/x-squirrel", mode: "clike", ext: ["nut"] },
        { name: "Stylus", mime: "text/x-styl", mode: "stylus", ext: ["styl"] },
        { name: "Swift", mime: "text/x-swift", mode: "swift", ext: ["swift"] },
        { name: "sTeX", mime: "text/x-stex", mode: "stex" },
        { name: "LaTeX", mime: "text/x-latex", mode: "stex", ext: ["text", "ltx", "tex"], alias: ["tex"] },
        { name: "SystemVerilog", mime: "text/x-systemverilog", mode: "verilog", ext: ["v", "sv", "svh"] },
        { name: "Tcl", mime: "text/x-tcl", mode: "tcl", ext: ["tcl"] },
        { name: "Textile", mime: "text/x-textile", mode: "textile", ext: ["textile"] },
        { name: "TiddlyWiki", mime: "text/x-tiddlywiki", mode: "tiddlywiki" },
        { name: "Tiki wiki", mime: "text/tiki", mode: "tiki" },
        { name: "TOML", mime: "text/x-toml", mode: "toml", ext: ["toml"] },
        { name: "Tornado", mime: "text/x-tornado", mode: "tornado" },
        { name: "troff", mime: "text/troff", mode: "troff", ext: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] },
        { name: "TTCN", mime: "text/x-ttcn", mode: "ttcn", ext: ["ttcn", "ttcn3", "ttcnpp"] },
        { name: "TTCN_CFG", mime: "text/x-ttcn-cfg", mode: "ttcn-cfg", ext: ["cfg"] },
        { name: "Turtle", mime: "text/turtle", mode: "turtle", ext: ["ttl"] },
        { name: "TypeScript", mime: "application/typescript", mode: "javascript", ext: ["ts"], alias: ["ts"] },
        { name: "TypeScript-JSX", mime: "text/typescript-jsx", mode: "jsx", ext: ["tsx"], alias: ["tsx"] },
        { name: "Twig", mime: "text/x-twig", mode: "twig" },
        { name: "Web IDL", mime: "text/x-webidl", mode: "webidl", ext: ["webidl"] },
        { name: "VB.NET", mime: "text/x-vb", mode: "vb", ext: ["vb"] },
        { name: "VBScript", mime: "text/vbscript", mode: "vbscript", ext: ["vbs"] },
        { name: "Velocity", mime: "text/velocity", mode: "velocity", ext: ["vtl"] },
        { name: "Verilog", mime: "text/x-verilog", mode: "verilog", ext: ["v"] },
        { name: "VHDL", mime: "text/x-vhdl", mode: "vhdl", ext: ["vhd", "vhdl"] },
        { name: "Vue.js Component", mimes: ["script/x-vue", "text/x-vue"], mode: "vue", ext: ["vue"] },
        { name: "XML", mimes: ["application/xml", "text/xml"], mode: "xml", ext: ["xml", "xsl", "xsd", "svg"], alias: ["rss", "wsdl", "xsd"] },
        { name: "XQuery", mime: "application/xquery", mode: "xquery", ext: ["xy", "xquery"] },
        { name: "Yacas", mime: "text/x-yacas", mode: "yacas", ext: ["ys"] },
        { name: "YAML", mimes: ["text/x-yaml", "text/yaml"], mode: "yaml", ext: ["yaml", "yml"], alias: ["yml"] },
        { name: "Z80", mime: "text/x-z80", mode: "z80", ext: ["z80"] },
        { name: "mscgen", mime: "text/x-mscgen", mode: "mscgen", ext: ["mscgen", "mscin", "msc"] },
        { name: "xu", mime: "text/x-xu", mode: "mscgen", ext: ["xu"] },
        { name: "msgenny", mime: "text/x-msgenny", mode: "mscgen", ext: ["msgenny"] },
        { name: "WebAssembly", mime: "text/webassembly", mode: "wast", ext: ["wat", "wast"] }
      ];
      for (var i10 = 0; i10 < CodeMirror3.modeInfo.length; i10++) {
        var info = CodeMirror3.modeInfo[i10];
        if (info.mimes)
          info.mime = info.mimes[0];
      }
      CodeMirror3.findModeByMIME = function(mime) {
        mime = mime.toLowerCase();
        for (var i11 = 0; i11 < CodeMirror3.modeInfo.length; i11++) {
          var info2 = CodeMirror3.modeInfo[i11];
          if (info2.mime == mime)
            return info2;
          if (info2.mimes) {
            for (var j2 = 0; j2 < info2.mimes.length; j2++)
              if (info2.mimes[j2] == mime)
                return info2;
          }
        }
        if (/\+xml$/.test(mime))
          return CodeMirror3.findModeByMIME("application/xml");
        if (/\+json$/.test(mime))
          return CodeMirror3.findModeByMIME("application/json");
      };
      CodeMirror3.findModeByExtension = function(ext) {
        ext = ext.toLowerCase();
        for (var i11 = 0; i11 < CodeMirror3.modeInfo.length; i11++) {
          var info2 = CodeMirror3.modeInfo[i11];
          if (info2.ext) {
            for (var j2 = 0; j2 < info2.ext.length; j2++)
              if (info2.ext[j2] == ext)
                return info2;
          }
        }
      };
      CodeMirror3.findModeByFileName = function(filename) {
        for (var i11 = 0; i11 < CodeMirror3.modeInfo.length; i11++) {
          var info2 = CodeMirror3.modeInfo[i11];
          if (info2.file && info2.file.test(filename))
            return info2;
        }
        var dot = filename.lastIndexOf(".");
        var ext = dot > -1 && filename.substring(dot + 1, filename.length);
        if (ext)
          return CodeMirror3.findModeByExtension(ext);
      };
      CodeMirror3.findModeByName = function(name) {
        name = name.toLowerCase();
        for (var i11 = 0; i11 < CodeMirror3.modeInfo.length; i11++) {
          var info2 = CodeMirror3.modeInfo[i11];
          if (info2.name.toLowerCase() == name)
            return info2;
          if (info2.alias) {
            for (var j2 = 0; j2 < info2.alias.length; j2++)
              if (info2.alias[j2].toLowerCase() == name)
                return info2;
          }
        }
      };
    });
  }
});

// node_modules/codemirror/mode/markdown/markdown.js
var require_markdown = __commonJS({
  "node_modules/codemirror/mode/markdown/markdown.js"(exports, module) {
    (function(mod) {
      if (typeof exports == "object" && typeof module == "object")
        mod(require_codemirror(), require_xml(), require_meta());
      else if (typeof define == "function" && define.amd)
        define(["../../lib/codemirror", "../xml/xml", "../meta"], mod);
      else
        mod(CodeMirror);
    })(function(CodeMirror3) {
      "use strict";
      CodeMirror3.defineMode("markdown", function(cmCfg, modeCfg) {
        var htmlMode = CodeMirror3.getMode(cmCfg, "text/html");
        var htmlModeMissing = htmlMode.name == "null";
        function getMode(name) {
          if (CodeMirror3.findModeByName) {
            var found = CodeMirror3.findModeByName(name);
            if (found)
              name = found.mime || found.mimes[0];
          }
          var mode2 = CodeMirror3.getMode(cmCfg, name);
          return mode2.name == "null" ? null : mode2;
        }
        if (modeCfg.highlightFormatting === void 0)
          modeCfg.highlightFormatting = false;
        if (modeCfg.maxBlockquoteDepth === void 0)
          modeCfg.maxBlockquoteDepth = 0;
        if (modeCfg.taskLists === void 0)
          modeCfg.taskLists = false;
        if (modeCfg.strikethrough === void 0)
          modeCfg.strikethrough = false;
        if (modeCfg.emoji === void 0)
          modeCfg.emoji = false;
        if (modeCfg.fencedCodeBlockHighlighting === void 0)
          modeCfg.fencedCodeBlockHighlighting = true;
        if (modeCfg.fencedCodeBlockDefaultMode === void 0)
          modeCfg.fencedCodeBlockDefaultMode = "text/plain";
        if (modeCfg.xml === void 0)
          modeCfg.xml = true;
        if (modeCfg.tokenTypeOverrides === void 0)
          modeCfg.tokenTypeOverrides = {};
        var tokenTypes = {
          header: "header",
          code: "comment",
          quote: "quote",
          list1: "variable-2",
          list2: "variable-3",
          list3: "keyword",
          hr: "hr",
          image: "image",
          imageAltText: "image-alt-text",
          imageMarker: "image-marker",
          formatting: "formatting",
          linkInline: "link",
          linkEmail: "link",
          linkText: "link",
          linkHref: "string",
          em: "em",
          strong: "strong",
          strikethrough: "strikethrough",
          emoji: "builtin"
        };
        for (var tokenType in tokenTypes) {
          if (tokenTypes.hasOwnProperty(tokenType) && modeCfg.tokenTypeOverrides[tokenType]) {
            tokenTypes[tokenType] = modeCfg.tokenTypeOverrides[tokenType];
          }
        }
        var hrRE = /^([*\-_])(?:\s*\1){2,}\s*$/, listRE = /^(?:[*\-+]|^[0-9]+([.)]))\s+/, taskListRE = /^\[(x| )\](?=\s)/i, atxHeaderRE = modeCfg.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/, setextHeaderRE = /^ {0,3}(?:\={1,}|-{2,})\s*$/, textRE = /^[^#!\[\]*_\\<>` "'(~:]+/, fencedCodeRE = /^(~~~+|```+)[ \t]*([\w\/+#-]*)[^\n`]*$/, linkDefRE = /^\s*\[[^\]]+?\]:.*$/, punctuation = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/, expandedTab = "    ";
        function switchInline(stream, state, f5) {
          state.f = state.inline = f5;
          return f5(stream, state);
        }
        function switchBlock(stream, state, f5) {
          state.f = state.block = f5;
          return f5(stream, state);
        }
        function lineIsEmpty(line) {
          return !line || !/\S/.test(line.string);
        }
        function blankLine(state) {
          state.linkTitle = false;
          state.linkHref = false;
          state.linkText = false;
          state.em = false;
          state.strong = false;
          state.strikethrough = false;
          state.quote = 0;
          state.indentedCode = false;
          if (state.f == htmlBlock) {
            var exit = htmlModeMissing;
            if (!exit) {
              var inner = CodeMirror3.innerMode(htmlMode, state.htmlState);
              exit = inner.mode.name == "xml" && inner.state.tagStart === null && (!inner.state.context && inner.state.tokenize.isInText);
            }
            if (exit) {
              state.f = inlineNormal;
              state.block = blockNormal;
              state.htmlState = null;
            }
          }
          state.trailingSpace = 0;
          state.trailingSpaceNewLine = false;
          state.prevLine = state.thisLine;
          state.thisLine = { stream: null };
          return null;
        }
        function blockNormal(stream, state) {
          var firstTokenOnLine = stream.column() === state.indentation;
          var prevLineLineIsEmpty = lineIsEmpty(state.prevLine.stream);
          var prevLineIsIndentedCode = state.indentedCode;
          var prevLineIsHr = state.prevLine.hr;
          var prevLineIsList = state.list !== false;
          var maxNonCodeIndentation = (state.listStack[state.listStack.length - 1] || 0) + 3;
          state.indentedCode = false;
          var lineIndentation = state.indentation;
          if (state.indentationDiff === null) {
            state.indentationDiff = state.indentation;
            if (prevLineIsList) {
              state.list = null;
              while (lineIndentation < state.listStack[state.listStack.length - 1]) {
                state.listStack.pop();
                if (state.listStack.length) {
                  state.indentation = state.listStack[state.listStack.length - 1];
                } else {
                  state.list = false;
                }
              }
              if (state.list !== false) {
                state.indentationDiff = lineIndentation - state.listStack[state.listStack.length - 1];
              }
            }
          }
          var allowsInlineContinuation = !prevLineLineIsEmpty && !prevLineIsHr && !state.prevLine.header && (!prevLineIsList || !prevLineIsIndentedCode) && !state.prevLine.fencedCodeEnd;
          var isHr = (state.list === false || prevLineIsHr || prevLineLineIsEmpty) && state.indentation <= maxNonCodeIndentation && stream.match(hrRE);
          var match = null;
          if (state.indentationDiff >= 4 && (prevLineIsIndentedCode || state.prevLine.fencedCodeEnd || state.prevLine.header || prevLineLineIsEmpty)) {
            stream.skipToEnd();
            state.indentedCode = true;
            return tokenTypes.code;
          } else if (stream.eatSpace()) {
            return null;
          } else if (firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(atxHeaderRE)) && match[1].length <= 6) {
            state.quote = 0;
            state.header = match[1].length;
            state.thisLine.header = true;
            if (modeCfg.highlightFormatting)
              state.formatting = "header";
            state.f = state.inline;
            return getType(state);
          } else if (state.indentation <= maxNonCodeIndentation && stream.eat(">")) {
            state.quote = firstTokenOnLine ? 1 : state.quote + 1;
            if (modeCfg.highlightFormatting)
              state.formatting = "quote";
            stream.eatSpace();
            return getType(state);
          } else if (!isHr && !state.setext && firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(listRE))) {
            var listType = match[1] ? "ol" : "ul";
            state.indentation = lineIndentation + stream.current().length;
            state.list = true;
            state.quote = 0;
            state.listStack.push(state.indentation);
            state.em = false;
            state.strong = false;
            state.code = false;
            state.strikethrough = false;
            if (modeCfg.taskLists && stream.match(taskListRE, false)) {
              state.taskList = true;
            }
            state.f = state.inline;
            if (modeCfg.highlightFormatting)
              state.formatting = ["list", "list-" + listType];
            return getType(state);
          } else if (firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(fencedCodeRE, true))) {
            state.quote = 0;
            state.fencedEndRE = new RegExp(match[1] + "+ *$");
            state.localMode = modeCfg.fencedCodeBlockHighlighting && getMode(match[2] || modeCfg.fencedCodeBlockDefaultMode);
            if (state.localMode)
              state.localState = CodeMirror3.startState(state.localMode);
            state.f = state.block = local;
            if (modeCfg.highlightFormatting)
              state.formatting = "code-block";
            state.code = -1;
            return getType(state);
          } else if (state.setext || (!allowsInlineContinuation || !prevLineIsList) && !state.quote && state.list === false && !state.code && !isHr && !linkDefRE.test(stream.string) && (match = stream.lookAhead(1)) && (match = match.match(setextHeaderRE))) {
            if (!state.setext) {
              state.header = match[0].charAt(0) == "=" ? 1 : 2;
              state.setext = state.header;
            } else {
              state.header = state.setext;
              state.setext = 0;
              stream.skipToEnd();
              if (modeCfg.highlightFormatting)
                state.formatting = "header";
            }
            state.thisLine.header = true;
            state.f = state.inline;
            return getType(state);
          } else if (isHr) {
            stream.skipToEnd();
            state.hr = true;
            state.thisLine.hr = true;
            return tokenTypes.hr;
          } else if (stream.peek() === "[") {
            return switchInline(stream, state, footnoteLink);
          }
          return switchInline(stream, state, state.inline);
        }
        function htmlBlock(stream, state) {
          var style = htmlMode.token(stream, state.htmlState);
          if (!htmlModeMissing) {
            var inner = CodeMirror3.innerMode(htmlMode, state.htmlState);
            if (inner.mode.name == "xml" && inner.state.tagStart === null && (!inner.state.context && inner.state.tokenize.isInText) || state.md_inside && stream.current().indexOf(">") > -1) {
              state.f = inlineNormal;
              state.block = blockNormal;
              state.htmlState = null;
            }
          }
          return style;
        }
        function local(stream, state) {
          var currListInd = state.listStack[state.listStack.length - 1] || 0;
          var hasExitedList = state.indentation < currListInd;
          var maxFencedEndInd = currListInd + 3;
          if (state.fencedEndRE && state.indentation <= maxFencedEndInd && (hasExitedList || stream.match(state.fencedEndRE))) {
            if (modeCfg.highlightFormatting)
              state.formatting = "code-block";
            var returnType;
            if (!hasExitedList)
              returnType = getType(state);
            state.localMode = state.localState = null;
            state.block = blockNormal;
            state.f = inlineNormal;
            state.fencedEndRE = null;
            state.code = 0;
            state.thisLine.fencedCodeEnd = true;
            if (hasExitedList)
              return switchBlock(stream, state, state.block);
            return returnType;
          } else if (state.localMode) {
            return state.localMode.token(stream, state.localState);
          } else {
            stream.skipToEnd();
            return tokenTypes.code;
          }
        }
        function getType(state) {
          var styles = [];
          if (state.formatting) {
            styles.push(tokenTypes.formatting);
            if (typeof state.formatting === "string")
              state.formatting = [state.formatting];
            for (var i10 = 0; i10 < state.formatting.length; i10++) {
              styles.push(tokenTypes.formatting + "-" + state.formatting[i10]);
              if (state.formatting[i10] === "header") {
                styles.push(tokenTypes.formatting + "-" + state.formatting[i10] + "-" + state.header);
              }
              if (state.formatting[i10] === "quote") {
                if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
                  styles.push(tokenTypes.formatting + "-" + state.formatting[i10] + "-" + state.quote);
                } else {
                  styles.push("error");
                }
              }
            }
          }
          if (state.taskOpen) {
            styles.push("meta");
            return styles.length ? styles.join(" ") : null;
          }
          if (state.taskClosed) {
            styles.push("property");
            return styles.length ? styles.join(" ") : null;
          }
          if (state.linkHref) {
            styles.push(tokenTypes.linkHref, "url");
          } else {
            if (state.strong) {
              styles.push(tokenTypes.strong);
            }
            if (state.em) {
              styles.push(tokenTypes.em);
            }
            if (state.strikethrough) {
              styles.push(tokenTypes.strikethrough);
            }
            if (state.emoji) {
              styles.push(tokenTypes.emoji);
            }
            if (state.linkText) {
              styles.push(tokenTypes.linkText);
            }
            if (state.code) {
              styles.push(tokenTypes.code);
            }
            if (state.image) {
              styles.push(tokenTypes.image);
            }
            if (state.imageAltText) {
              styles.push(tokenTypes.imageAltText, "link");
            }
            if (state.imageMarker) {
              styles.push(tokenTypes.imageMarker);
            }
          }
          if (state.header) {
            styles.push(tokenTypes.header, tokenTypes.header + "-" + state.header);
          }
          if (state.quote) {
            styles.push(tokenTypes.quote);
            if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
              styles.push(tokenTypes.quote + "-" + state.quote);
            } else {
              styles.push(tokenTypes.quote + "-" + modeCfg.maxBlockquoteDepth);
            }
          }
          if (state.list !== false) {
            var listMod = (state.listStack.length - 1) % 3;
            if (!listMod) {
              styles.push(tokenTypes.list1);
            } else if (listMod === 1) {
              styles.push(tokenTypes.list2);
            } else {
              styles.push(tokenTypes.list3);
            }
          }
          if (state.trailingSpaceNewLine) {
            styles.push("trailing-space-new-line");
          } else if (state.trailingSpace) {
            styles.push("trailing-space-" + (state.trailingSpace % 2 ? "a" : "b"));
          }
          return styles.length ? styles.join(" ") : null;
        }
        function handleText(stream, state) {
          if (stream.match(textRE, true)) {
            return getType(state);
          }
          return void 0;
        }
        function inlineNormal(stream, state) {
          var style = state.text(stream, state);
          if (typeof style !== "undefined")
            return style;
          if (state.list) {
            state.list = null;
            return getType(state);
          }
          if (state.taskList) {
            var taskOpen = stream.match(taskListRE, true)[1] === " ";
            if (taskOpen)
              state.taskOpen = true;
            else
              state.taskClosed = true;
            if (modeCfg.highlightFormatting)
              state.formatting = "task";
            state.taskList = false;
            return getType(state);
          }
          state.taskOpen = false;
          state.taskClosed = false;
          if (state.header && stream.match(/^#+$/, true)) {
            if (modeCfg.highlightFormatting)
              state.formatting = "header";
            return getType(state);
          }
          var ch = stream.next();
          if (state.linkTitle) {
            state.linkTitle = false;
            var matchCh = ch;
            if (ch === "(") {
              matchCh = ")";
            }
            matchCh = (matchCh + "").replace(/([.?*+^\[\]\\(){}|-])/g, "\\$1");
            var regex = "^\\s*(?:[^" + matchCh + "\\\\]+|\\\\\\\\|\\\\.)" + matchCh;
            if (stream.match(new RegExp(regex), true)) {
              return tokenTypes.linkHref;
            }
          }
          if (ch === "`") {
            var previousFormatting = state.formatting;
            if (modeCfg.highlightFormatting)
              state.formatting = "code";
            stream.eatWhile("`");
            var count = stream.current().length;
            if (state.code == 0 && (!state.quote || count == 1)) {
              state.code = count;
              return getType(state);
            } else if (count == state.code) {
              var t2 = getType(state);
              state.code = 0;
              return t2;
            } else {
              state.formatting = previousFormatting;
              return getType(state);
            }
          } else if (state.code) {
            return getType(state);
          }
          if (ch === "\\") {
            stream.next();
            if (modeCfg.highlightFormatting) {
              var type = getType(state);
              var formattingEscape = tokenTypes.formatting + "-escape";
              return type ? type + " " + formattingEscape : formattingEscape;
            }
          }
          if (ch === "!" && stream.match(/\[[^\]]*\] ?(?:\(|\[)/, false)) {
            state.imageMarker = true;
            state.image = true;
            if (modeCfg.highlightFormatting)
              state.formatting = "image";
            return getType(state);
          }
          if (ch === "[" && state.imageMarker && stream.match(/[^\]]*\](\(.*?\)| ?\[.*?\])/, false)) {
            state.imageMarker = false;
            state.imageAltText = true;
            if (modeCfg.highlightFormatting)
              state.formatting = "image";
            return getType(state);
          }
          if (ch === "]" && state.imageAltText) {
            if (modeCfg.highlightFormatting)
              state.formatting = "image";
            var type = getType(state);
            state.imageAltText = false;
            state.image = false;
            state.inline = state.f = linkHref;
            return type;
          }
          if (ch === "[" && !state.image) {
            if (state.linkText && stream.match(/^.*?\]/))
              return getType(state);
            state.linkText = true;
            if (modeCfg.highlightFormatting)
              state.formatting = "link";
            return getType(state);
          }
          if (ch === "]" && state.linkText) {
            if (modeCfg.highlightFormatting)
              state.formatting = "link";
            var type = getType(state);
            state.linkText = false;
            state.inline = state.f = stream.match(/\(.*?\)| ?\[.*?\]/, false) ? linkHref : inlineNormal;
            return type;
          }
          if (ch === "<" && stream.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, false)) {
            state.f = state.inline = linkInline;
            if (modeCfg.highlightFormatting)
              state.formatting = "link";
            var type = getType(state);
            if (type) {
              type += " ";
            } else {
              type = "";
            }
            return type + tokenTypes.linkInline;
          }
          if (ch === "<" && stream.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, false)) {
            state.f = state.inline = linkInline;
            if (modeCfg.highlightFormatting)
              state.formatting = "link";
            var type = getType(state);
            if (type) {
              type += " ";
            } else {
              type = "";
            }
            return type + tokenTypes.linkEmail;
          }
          if (modeCfg.xml && ch === "<" && stream.match(/^(!--|\?|!\[CDATA\[|[a-z][a-z0-9-]*(?:\s+[a-z_:.\-]+(?:\s*=\s*[^>]+)?)*\s*(?:>|$))/i, false)) {
            var end = stream.string.indexOf(">", stream.pos);
            if (end != -1) {
              var atts = stream.string.substring(stream.start, end);
              if (/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(atts))
                state.md_inside = true;
            }
            stream.backUp(1);
            state.htmlState = CodeMirror3.startState(htmlMode);
            return switchBlock(stream, state, htmlBlock);
          }
          if (modeCfg.xml && ch === "<" && stream.match(/^\/\w*?>/)) {
            state.md_inside = false;
            return "tag";
          } else if (ch === "*" || ch === "_") {
            var len = 1, before = stream.pos == 1 ? " " : stream.string.charAt(stream.pos - 2);
            while (len < 3 && stream.eat(ch))
              len++;
            var after = stream.peek() || " ";
            var leftFlanking = !/\s/.test(after) && (!punctuation.test(after) || /\s/.test(before) || punctuation.test(before));
            var rightFlanking = !/\s/.test(before) && (!punctuation.test(before) || /\s/.test(after) || punctuation.test(after));
            var setEm = null, setStrong = null;
            if (len % 2) {
              if (!state.em && leftFlanking && (ch === "*" || !rightFlanking || punctuation.test(before)))
                setEm = true;
              else if (state.em == ch && rightFlanking && (ch === "*" || !leftFlanking || punctuation.test(after)))
                setEm = false;
            }
            if (len > 1) {
              if (!state.strong && leftFlanking && (ch === "*" || !rightFlanking || punctuation.test(before)))
                setStrong = true;
              else if (state.strong == ch && rightFlanking && (ch === "*" || !leftFlanking || punctuation.test(after)))
                setStrong = false;
            }
            if (setStrong != null || setEm != null) {
              if (modeCfg.highlightFormatting)
                state.formatting = setEm == null ? "strong" : setStrong == null ? "em" : "strong em";
              if (setEm === true)
                state.em = ch;
              if (setStrong === true)
                state.strong = ch;
              var t2 = getType(state);
              if (setEm === false)
                state.em = false;
              if (setStrong === false)
                state.strong = false;
              return t2;
            }
          } else if (ch === " ") {
            if (stream.eat("*") || stream.eat("_")) {
              if (stream.peek() === " ") {
                return getType(state);
              } else {
                stream.backUp(1);
              }
            }
          }
          if (modeCfg.strikethrough) {
            if (ch === "~" && stream.eatWhile(ch)) {
              if (state.strikethrough) {
                if (modeCfg.highlightFormatting)
                  state.formatting = "strikethrough";
                var t2 = getType(state);
                state.strikethrough = false;
                return t2;
              } else if (stream.match(/^[^\s]/, false)) {
                state.strikethrough = true;
                if (modeCfg.highlightFormatting)
                  state.formatting = "strikethrough";
                return getType(state);
              }
            } else if (ch === " ") {
              if (stream.match("~~", true)) {
                if (stream.peek() === " ") {
                  return getType(state);
                } else {
                  stream.backUp(2);
                }
              }
            }
          }
          if (modeCfg.emoji && ch === ":" && stream.match(/^(?:[a-z_\d+][a-z_\d+-]*|\-[a-z_\d+][a-z_\d+-]*):/)) {
            state.emoji = true;
            if (modeCfg.highlightFormatting)
              state.formatting = "emoji";
            var retType = getType(state);
            state.emoji = false;
            return retType;
          }
          if (ch === " ") {
            if (stream.match(/^ +$/, false)) {
              state.trailingSpace++;
            } else if (state.trailingSpace) {
              state.trailingSpaceNewLine = true;
            }
          }
          return getType(state);
        }
        function linkInline(stream, state) {
          var ch = stream.next();
          if (ch === ">") {
            state.f = state.inline = inlineNormal;
            if (modeCfg.highlightFormatting)
              state.formatting = "link";
            var type = getType(state);
            if (type) {
              type += " ";
            } else {
              type = "";
            }
            return type + tokenTypes.linkInline;
          }
          stream.match(/^[^>]+/, true);
          return tokenTypes.linkInline;
        }
        function linkHref(stream, state) {
          if (stream.eatSpace()) {
            return null;
          }
          var ch = stream.next();
          if (ch === "(" || ch === "[") {
            state.f = state.inline = getLinkHrefInside(ch === "(" ? ")" : "]");
            if (modeCfg.highlightFormatting)
              state.formatting = "link-string";
            state.linkHref = true;
            return getType(state);
          }
          return "error";
        }
        var linkRE = {
          ")": /^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,
          "]": /^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\]]|\\.)*\])*?(?=\])/
        };
        function getLinkHrefInside(endChar) {
          return function(stream, state) {
            var ch = stream.next();
            if (ch === endChar) {
              state.f = state.inline = inlineNormal;
              if (modeCfg.highlightFormatting)
                state.formatting = "link-string";
              var returnState = getType(state);
              state.linkHref = false;
              return returnState;
            }
            stream.match(linkRE[endChar]);
            state.linkHref = true;
            return getType(state);
          };
        }
        function footnoteLink(stream, state) {
          if (stream.match(/^([^\]\\]|\\.)*\]:/, false)) {
            state.f = footnoteLinkInside;
            stream.next();
            if (modeCfg.highlightFormatting)
              state.formatting = "link";
            state.linkText = true;
            return getType(state);
          }
          return switchInline(stream, state, inlineNormal);
        }
        function footnoteLinkInside(stream, state) {
          if (stream.match("]:", true)) {
            state.f = state.inline = footnoteUrl;
            if (modeCfg.highlightFormatting)
              state.formatting = "link";
            var returnType = getType(state);
            state.linkText = false;
            return returnType;
          }
          stream.match(/^([^\]\\]|\\.)+/, true);
          return tokenTypes.linkText;
        }
        function footnoteUrl(stream, state) {
          if (stream.eatSpace()) {
            return null;
          }
          stream.match(/^[^\s]+/, true);
          if (stream.peek() === void 0) {
            state.linkTitle = true;
          } else {
            stream.match(/^(?:\s+(?:"(?:[^"\\]|\\.)+"|'(?:[^'\\]|\\.)+'|\((?:[^)\\]|\\.)+\)))?/, true);
          }
          state.f = state.inline = inlineNormal;
          return tokenTypes.linkHref + " url";
        }
        var mode = {
          startState: function() {
            return {
              f: blockNormal,
              prevLine: { stream: null },
              thisLine: { stream: null },
              block: blockNormal,
              htmlState: null,
              indentation: 0,
              inline: inlineNormal,
              text: handleText,
              formatting: false,
              linkText: false,
              linkHref: false,
              linkTitle: false,
              code: 0,
              em: false,
              strong: false,
              header: 0,
              setext: 0,
              hr: false,
              taskList: false,
              list: false,
              listStack: [],
              quote: 0,
              trailingSpace: 0,
              trailingSpaceNewLine: false,
              strikethrough: false,
              emoji: false,
              fencedEndRE: null
            };
          },
          copyState: function(s10) {
            return {
              f: s10.f,
              prevLine: s10.prevLine,
              thisLine: s10.thisLine,
              block: s10.block,
              htmlState: s10.htmlState && CodeMirror3.copyState(htmlMode, s10.htmlState),
              indentation: s10.indentation,
              localMode: s10.localMode,
              localState: s10.localMode ? CodeMirror3.copyState(s10.localMode, s10.localState) : null,
              inline: s10.inline,
              text: s10.text,
              formatting: false,
              linkText: s10.linkText,
              linkTitle: s10.linkTitle,
              linkHref: s10.linkHref,
              code: s10.code,
              em: s10.em,
              strong: s10.strong,
              strikethrough: s10.strikethrough,
              emoji: s10.emoji,
              header: s10.header,
              setext: s10.setext,
              hr: s10.hr,
              taskList: s10.taskList,
              list: s10.list,
              listStack: s10.listStack.slice(0),
              quote: s10.quote,
              indentedCode: s10.indentedCode,
              trailingSpace: s10.trailingSpace,
              trailingSpaceNewLine: s10.trailingSpaceNewLine,
              md_inside: s10.md_inside,
              fencedEndRE: s10.fencedEndRE
            };
          },
          token: function(stream, state) {
            state.formatting = false;
            if (stream != state.thisLine.stream) {
              state.header = 0;
              state.hr = false;
              if (stream.match(/^\s*$/, true)) {
                blankLine(state);
                return null;
              }
              state.prevLine = state.thisLine;
              state.thisLine = { stream };
              state.taskList = false;
              state.trailingSpace = 0;
              state.trailingSpaceNewLine = false;
              if (!state.localState) {
                state.f = state.block;
                if (state.f != htmlBlock) {
                  var indentation = stream.match(/^\s*/, true)[0].replace(/\t/g, expandedTab).length;
                  state.indentation = indentation;
                  state.indentationDiff = null;
                  if (indentation > 0)
                    return null;
                }
              }
            }
            return state.f(stream, state);
          },
          innerMode: function(state) {
            if (state.block == htmlBlock)
              return { state: state.htmlState, mode: htmlMode };
            if (state.localState)
              return { state: state.localState, mode: state.localMode };
            return { state, mode };
          },
          indent: function(state, textAfter, line) {
            if (state.block == htmlBlock && htmlMode.indent)
              return htmlMode.indent(state.htmlState, textAfter, line);
            if (state.localState && state.localMode.indent)
              return state.localMode.indent(state.localState, textAfter, line);
            return CodeMirror3.Pass;
          },
          blankLine,
          getType,
          blockCommentStart: "<!--",
          blockCommentEnd: "-->",
          closeBrackets: "()[]{}''\"\"``",
          fold: "markdown"
        };
        return mode;
      }, "xml");
      CodeMirror3.defineMIME("text/markdown", "markdown");
      CodeMirror3.defineMIME("text/x-markdown", "markdown");
    });
  }
});

// node_modules/codemirror/addon/mode/overlay.js
var require_overlay = __commonJS({
  "node_modules/codemirror/addon/mode/overlay.js"(exports, module) {
    (function(mod) {
      if (typeof exports == "object" && typeof module == "object")
        mod(require_codemirror());
      else if (typeof define == "function" && define.amd)
        define(["../../lib/codemirror"], mod);
      else
        mod(CodeMirror);
    })(function(CodeMirror3) {
      "use strict";
      CodeMirror3.overlayMode = function(base, overlay, combine) {
        return {
          startState: function() {
            return {
              base: CodeMirror3.startState(base),
              overlay: CodeMirror3.startState(overlay),
              basePos: 0,
              baseCur: null,
              overlayPos: 0,
              overlayCur: null,
              streamSeen: null
            };
          },
          copyState: function(state) {
            return {
              base: CodeMirror3.copyState(base, state.base),
              overlay: CodeMirror3.copyState(overlay, state.overlay),
              basePos: state.basePos,
              baseCur: null,
              overlayPos: state.overlayPos,
              overlayCur: null
            };
          },
          token: function(stream, state) {
            if (stream != state.streamSeen || Math.min(state.basePos, state.overlayPos) < stream.start) {
              state.streamSeen = stream;
              state.basePos = state.overlayPos = stream.start;
            }
            if (stream.start == state.basePos) {
              state.baseCur = base.token(stream, state.base);
              state.basePos = stream.pos;
            }
            if (stream.start == state.overlayPos) {
              stream.pos = stream.start;
              state.overlayCur = overlay.token(stream, state.overlay);
              state.overlayPos = stream.pos;
            }
            stream.pos = Math.min(state.basePos, state.overlayPos);
            if (state.overlayCur == null)
              return state.baseCur;
            else if (state.baseCur != null && state.overlay.combineTokens || combine && state.overlay.combineTokens == null)
              return state.baseCur + " " + state.overlayCur;
            else
              return state.overlayCur;
          },
          indent: base.indent && function(state, textAfter, line) {
            return base.indent(state.base, textAfter, line);
          },
          electricChars: base.electricChars,
          innerMode: function(state) {
            return { state: state.base, mode: base };
          },
          blankLine: function(state) {
            var baseToken, overlayToken;
            if (base.blankLine)
              baseToken = base.blankLine(state.base);
            if (overlay.blankLine)
              overlayToken = overlay.blankLine(state.overlay);
            return overlayToken == null ? baseToken : combine && baseToken != null ? baseToken + " " + overlayToken : overlayToken;
          }
        };
      };
    });
  }
});

// node_modules/codemirror/mode/gfm/gfm.js
var require_gfm = __commonJS({
  "node_modules/codemirror/mode/gfm/gfm.js"(exports, module) {
    (function(mod) {
      if (typeof exports == "object" && typeof module == "object")
        mod(require_codemirror(), require_markdown(), require_overlay());
      else if (typeof define == "function" && define.amd)
        define(["../../lib/codemirror", "../markdown/markdown", "../../addon/mode/overlay"], mod);
      else
        mod(CodeMirror);
    })(function(CodeMirror3) {
      "use strict";
      var urlRE = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i;
      CodeMirror3.defineMode("gfm", function(config, modeConfig) {
        var codeDepth = 0;
        function blankLine(state) {
          state.code = false;
          return null;
        }
        var gfmOverlay = {
          startState: function() {
            return {
              code: false,
              codeBlock: false,
              ateSpace: false
            };
          },
          copyState: function(s10) {
            return {
              code: s10.code,
              codeBlock: s10.codeBlock,
              ateSpace: s10.ateSpace
            };
          },
          token: function(stream, state) {
            state.combineTokens = null;
            if (state.codeBlock) {
              if (stream.match(/^```+/)) {
                state.codeBlock = false;
                return null;
              }
              stream.skipToEnd();
              return null;
            }
            if (stream.sol()) {
              state.code = false;
            }
            if (stream.sol() && stream.match(/^```+/)) {
              stream.skipToEnd();
              state.codeBlock = true;
              return null;
            }
            if (stream.peek() === "`") {
              stream.next();
              var before = stream.pos;
              stream.eatWhile("`");
              var difference = 1 + stream.pos - before;
              if (!state.code) {
                codeDepth = difference;
                state.code = true;
              } else {
                if (difference === codeDepth) {
                  state.code = false;
                }
              }
              return null;
            } else if (state.code) {
              stream.next();
              return null;
            }
            if (stream.eatSpace()) {
              state.ateSpace = true;
              return null;
            }
            if (stream.sol() || state.ateSpace) {
              state.ateSpace = false;
              if (modeConfig.gitHubSpice !== false) {
                if (stream.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+@)?(?=.{0,6}\d)(?:[a-f0-9]{7,40}\b)/)) {
                  state.combineTokens = true;
                  return "link";
                } else if (stream.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+)?#[0-9]+\b/)) {
                  state.combineTokens = true;
                  return "link";
                }
              }
            }
            if (stream.match(urlRE) && stream.string.slice(stream.start - 2, stream.start) != "](" && (stream.start == 0 || /\W/.test(stream.string.charAt(stream.start - 1)))) {
              state.combineTokens = true;
              return "link";
            }
            stream.next();
            return null;
          },
          blankLine
        };
        var markdownConfig = {
          taskLists: true,
          strikethrough: true,
          emoji: true
        };
        for (var attr in modeConfig) {
          markdownConfig[attr] = modeConfig[attr];
        }
        markdownConfig.name = "markdown";
        return CodeMirror3.overlayMode(CodeMirror3.getMode(config, markdownConfig), gfmOverlay);
      }, "markdown");
      CodeMirror3.defineMIME("text/x-gfm", "gfm");
    });
  }
});

// node_modules/@tauri-apps/api/tauri-3147d768.js
var t = function(n10, e4) {
  return (t = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t2, n11) {
    t2.__proto__ = n11;
  } || function(t2, n11) {
    for (var e5 in n11)
      Object.prototype.hasOwnProperty.call(n11, e5) && (t2[e5] = n11[e5]);
  })(n10, e4);
};
function n(n10, e4) {
  if (typeof e4 != "function" && e4 !== null)
    throw new TypeError("Class extends value " + String(e4) + " is not a constructor or null");
  function r7() {
    this.constructor = n10;
  }
  t(n10, e4), n10.prototype = e4 === null ? Object.create(e4) : (r7.prototype = e4.prototype, new r7());
}
var e = function() {
  return (e = Object.assign || function(t2) {
    for (var n10, e4 = 1, r7 = arguments.length; e4 < r7; e4++)
      for (var o12 in n10 = arguments[e4])
        Object.prototype.hasOwnProperty.call(n10, o12) && (t2[o12] = n10[o12]);
    return t2;
  }).apply(this, arguments);
};
function r(t2, n10, e4, r7) {
  return new (e4 || (e4 = Promise))(function(o12, a11) {
    function i10(t3) {
      try {
        u11(r7.next(t3));
      } catch (t4) {
        a11(t4);
      }
    }
    function c11(t3) {
      try {
        u11(r7.throw(t3));
      } catch (t4) {
        a11(t4);
      }
    }
    function u11(t3) {
      var n11;
      t3.done ? o12(t3.value) : (n11 = t3.value, n11 instanceof e4 ? n11 : new e4(function(t4) {
        t4(n11);
      })).then(i10, c11);
    }
    u11((r7 = r7.apply(t2, n10 || [])).next());
  });
}
function o(t2, n10) {
  var e4, r7, o12, a11, i10 = { label: 0, sent: function() {
    if (1 & o12[0])
      throw o12[1];
    return o12[1];
  }, trys: [], ops: [] };
  return a11 = { next: c11(0), throw: c11(1), return: c11(2) }, typeof Symbol == "function" && (a11[Symbol.iterator] = function() {
    return this;
  }), a11;
  function c11(a12) {
    return function(c12) {
      return function(a13) {
        if (e4)
          throw new TypeError("Generator is already executing.");
        for (; i10; )
          try {
            if (e4 = 1, r7 && (o12 = 2 & a13[0] ? r7.return : a13[0] ? r7.throw || ((o12 = r7.return) && o12.call(r7), 0) : r7.next) && !(o12 = o12.call(r7, a13[1])).done)
              return o12;
            switch (r7 = 0, o12 && (a13 = [2 & a13[0], o12.value]), a13[0]) {
              case 0:
              case 1:
                o12 = a13;
                break;
              case 4:
                return i10.label++, { value: a13[1], done: false };
              case 5:
                i10.label++, r7 = a13[1], a13 = [0];
                continue;
              case 7:
                a13 = i10.ops.pop(), i10.trys.pop();
                continue;
              default:
                if (!(o12 = i10.trys, (o12 = o12.length > 0 && o12[o12.length - 1]) || a13[0] !== 6 && a13[0] !== 2)) {
                  i10 = 0;
                  continue;
                }
                if (a13[0] === 3 && (!o12 || a13[1] > o12[0] && a13[1] < o12[3])) {
                  i10.label = a13[1];
                  break;
                }
                if (a13[0] === 6 && i10.label < o12[1]) {
                  i10.label = o12[1], o12 = a13;
                  break;
                }
                if (o12 && i10.label < o12[2]) {
                  i10.label = o12[2], i10.ops.push(a13);
                  break;
                }
                o12[2] && i10.ops.pop(), i10.trys.pop();
                continue;
            }
            a13 = n10.call(t2, i10);
          } catch (t3) {
            a13 = [6, t3], r7 = 0;
          } finally {
            e4 = o12 = 0;
          }
        if (5 & a13[0])
          throw a13[1];
        return { value: a13[0] ? a13[1] : void 0, done: true };
      }([a12, c12]);
    };
  }
}
function a(t2, n10) {
  n10 === void 0 && (n10 = false);
  var e4 = function() {
    var t3 = new Int8Array(1);
    window.crypto.getRandomValues(t3);
    var n11 = new Uint8Array(Math.max(16, Math.abs(t3[0])));
    return window.crypto.getRandomValues(n11), n11.join("");
  }();
  return Object.defineProperty(window, e4, { value: function(r7) {
    return n10 && Reflect.deleteProperty(window, e4), t2 == null ? void 0 : t2(r7);
  }, writable: false, configurable: true }), e4;
}
function i(t2, n10) {
  return n10 === void 0 && (n10 = {}), r(this, void 0, void 0, function() {
    return o(this, function(r7) {
      return [2, new Promise(function(r8, o12) {
        var i10 = a(function(t3) {
          r8(t3), Reflect.deleteProperty(window, c11);
        }, true), c11 = a(function(t3) {
          o12(t3), Reflect.deleteProperty(window, i10);
        }, true);
        window.rpc.notify(t2, e({ __invokeKey: __TAURI_INVOKE_KEY__, callback: i10, error: c11 }, n10));
      })];
    });
  });
}
function c(t2) {
  return navigator.userAgent.includes("Windows") ? "https://asset.localhost/" + t2 : "asset://" + t2;
}
var u = Object.freeze({ __proto__: null, transformCallback: a, invoke: i, convertFileSrc: c });

// node_modules/@tauri-apps/api/tauri-fe7c6694.js
function n2(n10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(i10) {
      return [2, i("tauri", n10)];
    });
  });
}

// node_modules/@tauri-apps/api/fs-bdf2e640.js
var r2;
function o2(r7, o12) {
  return o12 === void 0 && (o12 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Fs", message: { cmd: "readTextFile", path: r7, options: o12 } })];
    });
  });
}
function n3(r7, o12) {
  return o12 === void 0 && (o12 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Fs", message: { cmd: "readBinaryFile", path: r7, options: o12 } })];
    });
  });
}
function u2(r7, o12) {
  return o12 === void 0 && (o12 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return typeof o12 == "object" && Object.freeze(o12), typeof r7 == "object" && Object.freeze(r7), [2, n2({ __tauriModule: "Fs", message: { cmd: "writeFile", path: r7.path, contents: r7.contents, options: o12 } })];
    });
  });
}
!function(t2) {
  t2[t2.Audio = 1] = "Audio", t2[t2.Cache = 2] = "Cache", t2[t2.Config = 3] = "Config", t2[t2.Data = 4] = "Data", t2[t2.LocalData = 5] = "LocalData", t2[t2.Desktop = 6] = "Desktop", t2[t2.Document = 7] = "Document", t2[t2.Download = 8] = "Download", t2[t2.Executable = 9] = "Executable", t2[t2.Font = 10] = "Font", t2[t2.Home = 11] = "Home", t2[t2.Picture = 12] = "Picture", t2[t2.Public = 13] = "Public", t2[t2.Runtime = 14] = "Runtime", t2[t2.Template = 15] = "Template", t2[t2.Video = 16] = "Video", t2[t2.Resource = 17] = "Resource", t2[t2.App = 18] = "App", t2[t2.Current = 19] = "Current";
}(r2 || (r2 = {}));
function a2(t2) {
  var e4 = function(t3) {
    if (t3.length < 65536)
      return String.fromCharCode.apply(null, Array.from(t3));
    for (var e5 = "", i10 = t3.length, r7 = 0; r7 < i10; r7++) {
      var o12 = t3.subarray(65536 * r7, 65536 * (r7 + 1));
      e5 += String.fromCharCode.apply(null, Array.from(o12));
    }
    return e5;
  }(new Uint8Array(t2));
  return btoa(e4);
}
function s(r7, o12) {
  return o12 === void 0 && (o12 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return typeof o12 == "object" && Object.freeze(o12), typeof r7 == "object" && Object.freeze(r7), [2, n2({ __tauriModule: "Fs", message: { cmd: "writeBinaryFile", path: r7.path, contents: a2(r7.contents), options: o12 } })];
    });
  });
}
function c2(r7, o12) {
  return o12 === void 0 && (o12 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Fs", message: { cmd: "readDir", path: r7, options: o12 } })];
    });
  });
}
function d(r7, o12) {
  return o12 === void 0 && (o12 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Fs", message: { cmd: "createDir", path: r7, options: o12 } })];
    });
  });
}
function f(r7, o12) {
  return o12 === void 0 && (o12 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Fs", message: { cmd: "removeDir", path: r7, options: o12 } })];
    });
  });
}
function l(r7, o12, n10) {
  return n10 === void 0 && (n10 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Fs", message: { cmd: "copyFile", source: r7, destination: o12, options: n10 } })];
    });
  });
}
function m(r7, o12) {
  return o12 === void 0 && (o12 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Fs", message: { cmd: "removeFile", path: r7, options: o12 } })];
    });
  });
}
function p(r7, o12, n10) {
  return n10 === void 0 && (n10 = {}), r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Fs", message: { cmd: "renameFile", oldPath: r7, newPath: o12, options: n10 } })];
    });
  });
}
var h = Object.freeze({ __proto__: null, get BaseDirectory() {
  return r2;
}, get Dir() {
  return r2;
}, readTextFile: o2, readBinaryFile: n3, writeFile: u2, writeBinaryFile: s, readDir: c2, createDir: d, removeDir: f, copyFile: l, removeFile: m, renameFile: p });

// node_modules/@tauri-apps/api/http-46ccd227.js
var o3;
!function(t2) {
  t2[t2.JSON = 1] = "JSON", t2[t2.Text = 2] = "Text", t2[t2.Binary = 3] = "Binary";
}(o3 || (o3 = {}));
var i2 = function() {
  function t2(t3, e4) {
    this.type = t3, this.payload = e4;
  }
  return t2.form = function(e4) {
    return new t2("Form", e4);
  }, t2.json = function(e4) {
    return new t2("Json", e4);
  }, t2.text = function(e4) {
    return new t2("Text", e4);
  }, t2.bytes = function(e4) {
    return new t2("Bytes", e4);
  }, t2;
}();
var u3 = function(t2) {
  this.url = t2.url, this.status = t2.status, this.ok = this.status >= 200 && this.status < 300, this.headers = t2.headers, this.data = t2.data;
};
var s2 = function() {
  function i10(t2) {
    this.id = t2;
  }
  return i10.prototype.drop = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Http", message: { cmd: "dropClient", client: this.id } })];
      });
    });
  }, i10.prototype.request = function(n10) {
    return r(this, void 0, void 0, function() {
      var t2;
      return o(this, function(e4) {
        return (t2 = !n10.responseType || n10.responseType === o3.JSON) && (n10.responseType = o3.Text), [2, n2({ __tauriModule: "Http", message: { cmd: "httpRequest", client: this.id, options: n10 } }).then(function(e5) {
          var n11 = new u3(e5);
          if (t2) {
            try {
              n11.data = JSON.parse(n11.data);
            } catch (t3) {
              if (n11.ok)
                throw Error("Failed to parse response `" + n11.data + "` as JSON: " + t3 + ";\n              try setting the `responseType` option to `ResponseType.Text` or `ResponseType.Binary` if the API does not return a JSON response.");
            }
            return n11;
          }
          return n11;
        })];
      });
    });
  }, i10.prototype.get = function(r7, o12) {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, this.request(e({ method: "GET", url: r7 }, o12))];
      });
    });
  }, i10.prototype.post = function(r7, o12, i11) {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, this.request(e({ method: "POST", url: r7, body: o12 }, i11))];
      });
    });
  }, i10.prototype.put = function(r7, o12, i11) {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, this.request(e({ method: "PUT", url: r7, body: o12 }, i11))];
      });
    });
  }, i10.prototype.patch = function(r7, o12) {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, this.request(e({ method: "PATCH", url: r7 }, o12))];
      });
    });
  }, i10.prototype.delete = function(r7, o12) {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, this.request(e({ method: "DELETE", url: r7 }, o12))];
      });
    });
  }, i10;
}();
function a3(n10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Http", message: { cmd: "createClient", options: n10 } }).then(function(t3) {
        return new s2(t3);
      })];
    });
  });
}
var c3 = null;
function h2(r7, o12) {
  var i10;
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      switch (t2.label) {
        case 0:
          return c3 !== null ? [3, 2] : [4, a3()];
        case 1:
          c3 = t2.sent(), t2.label = 2;
        case 2:
          return [2, c3.request(e({ url: r7, method: (i10 = o12 == null ? void 0 : o12.method) !== null && i10 !== void 0 ? i10 : "GET" }, o12))];
      }
    });
  });
}
var d2 = Object.freeze({ __proto__: null, getClient: a3, fetch: h2, Body: i2, Client: s2, Response: u3, get ResponseType() {
  return o3;
} });

// node_modules/@tauri-apps/api/os-check-094ffe86.js
function n4() {
  return navigator.appVersion.includes("Win");
}

// node_modules/@tauri-apps/api/path-237dd15f.js
function o4() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.App } })];
    });
  });
}
function u4() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Audio } })];
    });
  });
}
function a4() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Cache } })];
    });
  });
}
function s3() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Config } })];
    });
  });
}
function c4() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Data } })];
    });
  });
}
function d3() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Desktop } })];
    });
  });
}
function h3() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Document } })];
    });
  });
}
function f2() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Download } })];
    });
  });
}
function v() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Executable } })];
    });
  });
}
function m2() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Font } })];
    });
  });
}
function l2() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Home } })];
    });
  });
}
function _() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.LocalData } })];
    });
  });
}
function P() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Picture } })];
    });
  });
}
function p2() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Public } })];
    });
  });
}
function g() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Resource } })];
    });
  });
}
function D() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Runtime } })];
    });
  });
}
function M() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Template } })];
    });
  });
}
function y() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Video } })];
    });
  });
}
function b() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolvePath", path: "", directory: r2.Current } })];
    });
  });
}
var j = n4() ? "\\" : "/";
var x = n4() ? ";" : ":";
function A() {
  for (var i10 = [], n10 = 0; n10 < arguments.length; n10++)
    i10[n10] = arguments[n10];
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "resolve", paths: i10 } })];
    });
  });
}
function k(i10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "normalize", path: i10 } })];
    });
  });
}
function z() {
  for (var i10 = [], n10 = 0; n10 < arguments.length; n10++)
    i10[n10] = arguments[n10];
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "join", paths: i10 } })];
    });
  });
}
function C(i10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "dirname", path: i10 } })];
    });
  });
}
function w(i10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "extname", path: i10 } })];
    });
  });
}
function B(i10, n10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "basename", path: i10, ext: n10 } })];
    });
  });
}
function R(i10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Path", message: { cmd: "isAbsolute", path: i10 } })];
    });
  });
}
var q = Object.freeze({ __proto__: null, appDir: o4, audioDir: u4, cacheDir: a4, configDir: s3, dataDir: c4, desktopDir: d3, documentDir: h3, downloadDir: f2, executableDir: v, fontDir: m2, homeDir: l2, localDataDir: _, pictureDir: P, publicDir: p2, resourceDir: g, runtimeDir: D, templateDir: M, videoDir: y, currentDir: b, get BaseDirectory() {
  return r2;
}, sep: j, delimiter: x, resolve: A, normalize: k, join: z, dirname: C, extname: w, basename: B, isAbsolute: R });

// node_modules/@tauri-apps/api/shell-9c83a2e9.js
function o5(t2, o12, s10, u11) {
  return r(this, void 0, void 0, function() {
    return o(this, function(n10) {
      return typeof s10 == "object" && Object.freeze(s10), [2, n2({ __tauriModule: "Shell", message: { cmd: "execute", program: o12, args: typeof s10 == "string" ? [s10] : s10, options: u11, onEventFn: a(t2) } })];
    });
  });
}
var s4 = function() {
  function t2() {
    this.eventListeners = Object.create(null);
  }
  return t2.prototype.addEventListener = function(t3, n10) {
    t3 in this.eventListeners ? this.eventListeners[t3].push(n10) : this.eventListeners[t3] = [n10];
  }, t2.prototype._emit = function(t3, n10) {
    if (t3 in this.eventListeners)
      for (var e4 = 0, i10 = this.eventListeners[t3]; e4 < i10.length; e4++) {
        (0, i10[e4])(n10);
      }
  }, t2.prototype.on = function(t3, n10) {
    return this.addEventListener(t3, n10), this;
  }, t2;
}();
var u5 = function() {
  function t2(t3) {
    this.pid = t3;
  }
  return t2.prototype.write = function(t3) {
    return r(this, void 0, void 0, function() {
      return o(this, function(n10) {
        return [2, n2({ __tauriModule: "Shell", message: { cmd: "stdinWrite", pid: this.pid, buffer: t3 } })];
      });
    });
  }, t2.prototype.kill = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t3) {
        return [2, n2({ __tauriModule: "Shell", message: { cmd: "killChild", pid: this.pid } })];
      });
    });
  }, t2;
}();
var a5 = function(i10) {
  function r7(t2, n10, e4) {
    n10 === void 0 && (n10 = []);
    var r8 = i10.call(this) || this;
    return r8.stdout = new s4(), r8.stderr = new s4(), r8.program = t2, r8.args = typeof n10 == "string" ? [n10] : n10, r8.options = e4 != null ? e4 : {}, r8;
  }
  return n(r7, i10), r7.sidecar = function(t2, n10, e4) {
    n10 === void 0 && (n10 = []);
    var i11 = new r7(t2, n10, e4);
    return i11.options.sidecar = true, i11;
  }, r7.prototype.spawn = function() {
    return r(this, void 0, void 0, function() {
      var t2 = this;
      return o(this, function(n10) {
        return [2, o5(function(n11) {
          switch (n11.event) {
            case "Error":
              t2._emit("error", n11.payload);
              break;
            case "Terminated":
              t2._emit("close", n11.payload);
              break;
            case "Stdout":
              t2.stdout._emit("data", n11.payload);
              break;
            case "Stderr":
              t2.stderr._emit("data", n11.payload);
          }
        }, this.program, this.args, this.options).then(function(t3) {
          return new u5(t3);
        })];
      });
    });
  }, r7.prototype.execute = function() {
    return r(this, void 0, void 0, function() {
      var t2 = this;
      return o(this, function(n10) {
        return [2, new Promise(function(n11, e4) {
          t2.on("error", e4);
          var i11 = [], r8 = [];
          t2.stdout.on("data", function(t3) {
            i11.push(t3);
          }), t2.stderr.on("data", function(t3) {
            r8.push(t3);
          }), t2.on("close", function(t3) {
            n11({ code: t3.code, signal: t3.signal, stdout: i11.join("\n"), stderr: r8.join("\n") });
          }), t2.spawn().catch(e4);
        })];
      });
    });
  }, r7;
}(s4);
function c5(t2, i10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(n10) {
      return [2, n2({ __tauriModule: "Shell", message: { cmd: "open", path: t2, with: i10 } })];
    });
  });
}
var d4 = Object.freeze({ __proto__: null, Command: a5, Child: u5, open: c5 });

// node_modules/@tauri-apps/api/event-92cbfbb1.js
function r3(i10, r7, u11) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      switch (t2.label) {
        case 0:
          return [4, n2({ __tauriModule: "Event", message: { cmd: "emit", event: i10, windowLabel: r7, payload: u11 } })];
        case 1:
          return t2.sent(), [2];
      }
    });
  });
}
function u6(i10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Event", message: { cmd: "unlisten", eventId: i10 } })];
    });
  });
}
function o6(r7, o12) {
  return r(this, void 0, void 0, function() {
    var s10 = this;
    return o(this, function(c11) {
      return [2, n2({ __tauriModule: "Event", message: { cmd: "listen", event: r7, handler: a(o12) } }).then(function(i10) {
        return function() {
          return r(s10, void 0, void 0, function() {
            return o(this, function(t2) {
              return [2, u6(i10)];
            });
          });
        };
      })];
    });
  });
}
function s5(i10, e4) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, o6(i10, function(t3) {
        e4(t3), u6(t3.id).catch(function() {
        });
      })];
    });
  });
}
function c6(i10, e4) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, r3(i10, void 0, e4)];
    });
  });
}
var a6 = Object.freeze({ __proto__: null, listen: o6, once: s5, emit: c6 });

// node_modules/@tauri-apps/api/window-526f78f2.js
var s6;
var d5 = function(t2, e4) {
  this.type = "Logical", this.width = t2, this.height = e4;
};
var l3 = function() {
  function t2(t3, e4) {
    this.type = "Physical", this.width = t3, this.height = e4;
  }
  return t2.prototype.toLogical = function(t3) {
    return new d5(this.width / t3, this.height / t3);
  }, t2;
}();
var c7 = function(t2, e4) {
  this.type = "Logical", this.x = t2, this.y = e4;
};
var h4 = function() {
  function t2(t3, e4) {
    this.type = "Physical", this.x = t3, this.y = e4;
  }
  return t2.prototype.toLogical = function(t3) {
    return new c7(this.x / t3, this.y / t3);
  }, t2;
}();
function m3() {
  return new v2(window.__TAURI__.__currentWindow.label, { skip: true });
}
function p3() {
  return window.__TAURI__.__windows.map(function(t2) {
    return new v2(t2.label, { skip: true });
  });
}
!function(t2) {
  t2[t2.Critical = 1] = "Critical", t2[t2.Informational = 2] = "Informational";
}(s6 || (s6 = {}));
var f3 = ["tauri://created", "tauri://error"];
var y2 = function() {
  function t2(t3) {
    this.label = t3, this.listeners = Object.create(null);
  }
  return t2.prototype.listen = function(t3, n10) {
    return r(this, void 0, void 0, function() {
      var e4 = this;
      return o(this, function(i10) {
        return this._handleTauriEvent(t3, n10) ? [2, Promise.resolve(function() {
          var i11 = e4.listeners[t3];
          i11.splice(i11.indexOf(n10), 1);
        })] : [2, o6(t3, n10)];
      });
    });
  }, t2.prototype.once = function(t3, n10) {
    return r(this, void 0, void 0, function() {
      var e4 = this;
      return o(this, function(i10) {
        return this._handleTauriEvent(t3, n10) ? [2, Promise.resolve(function() {
          var i11 = e4.listeners[t3];
          i11.splice(i11.indexOf(n10), 1);
        })] : [2, s5(t3, n10)];
      });
    });
  }, t2.prototype.emit = function(t3, n10) {
    return r(this, void 0, void 0, function() {
      var e4, o12;
      return o(this, function(i10) {
        if (f3.includes(t3)) {
          for (e4 = 0, o12 = this.listeners[t3] || []; e4 < o12.length; e4++)
            (0, o12[e4])({ event: t3, id: -1, payload: n10 });
          return [2, Promise.resolve()];
        }
        return [2, r3(t3, this.label, n10)];
      });
    });
  }, t2.prototype._handleTauriEvent = function(t3, e4) {
    return !!f3.includes(t3) && (t3 in this.listeners ? this.listeners[t3].push(e4) : this.listeners[t3] = [e4], true);
  }, t2;
}();
var g2 = function(n10) {
  function r7() {
    return n10 !== null && n10.apply(this, arguments) || this;
  }
  return n(r7, n10), r7.prototype.scaleFactor = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "scaleFactor" } } } })];
      });
    });
  }, r7.prototype.innerPosition = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "innerPosition" } } } })];
      });
    });
  }, r7.prototype.outerPosition = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "outerPosition" } } } })];
      });
    });
  }, r7.prototype.innerSize = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "innerSize" } } } })];
      });
    });
  }, r7.prototype.outerSize = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "outerSize" } } } })];
      });
    });
  }, r7.prototype.isFullscreen = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isFullscreen" } } } })];
      });
    });
  }, r7.prototype.isMaximized = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isMaximized" } } } })];
      });
    });
  }, r7.prototype.isDecorated = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isDecorated" } } } })];
      });
    });
  }, r7.prototype.isResizable = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isResizable" } } } })];
      });
    });
  }, r7.prototype.isVisible = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "isVisible" } } } })];
      });
    });
  }, r7.prototype.center = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "center" } } } })];
      });
    });
  }, r7.prototype.requestUserAttention = function(t2) {
    return r(this, void 0, void 0, function() {
      var e4;
      return o(this, function(i10) {
        return e4 = null, t2 && (e4 = t2 === s6.Critical ? { type: "Critical" } : { type: "Informational" }), [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "requestUserAttention", payload: e4 } } } })];
      });
    });
  }, r7.prototype.setResizable = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setResizable", payload: t2 } } } })];
      });
    });
  }, r7.prototype.setTitle = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setTitle", payload: t2 } } } })];
      });
    });
  }, r7.prototype.maximize = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "maximize" } } } })];
      });
    });
  }, r7.prototype.unmaximize = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "unmaximize" } } } })];
      });
    });
  }, r7.prototype.toggleMaximize = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "toggleMaximize" } } } })];
      });
    });
  }, r7.prototype.minimize = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "minimize" } } } })];
      });
    });
  }, r7.prototype.unminimize = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "unminimize" } } } })];
      });
    });
  }, r7.prototype.show = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "show" } } } })];
      });
    });
  }, r7.prototype.hide = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "hide" } } } })];
      });
    });
  }, r7.prototype.close = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "close" } } } })];
      });
    });
  }, r7.prototype.setDecorations = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setDecorations", payload: t2 } } } })];
      });
    });
  }, r7.prototype.setAlwaysOnTop = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setAlwaysOnTop", payload: t2 } } } })];
      });
    });
  }, r7.prototype.setSize = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        if (!t2 || t2.type !== "Logical" && t2.type !== "Physical")
          throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setSize", payload: { type: t2.type, data: { width: t2.width, height: t2.height } } } } } })];
      });
    });
  }, r7.prototype.setMinSize = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        if (t2 && t2.type !== "Logical" && t2.type !== "Physical")
          throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setMinSize", payload: t2 ? { type: t2.type, data: { width: t2.width, height: t2.height } } : null } } } })];
      });
    });
  }, r7.prototype.setMaxSize = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        if (t2 && t2.type !== "Logical" && t2.type !== "Physical")
          throw new Error("the `size` argument must be either a LogicalSize or a PhysicalSize instance");
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setMaxSize", payload: t2 ? { type: t2.type, data: { width: t2.width, height: t2.height } } : null } } } })];
      });
    });
  }, r7.prototype.setPosition = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        if (!t2 || t2.type !== "Logical" && t2.type !== "Physical")
          throw new Error("the `position` argument must be either a LogicalPosition or a PhysicalPosition instance");
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setPosition", payload: { type: t2.type, data: { x: t2.x, y: t2.y } } } } } })];
      });
    });
  }, r7.prototype.setFullscreen = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setFullscreen", payload: t2 } } } })];
      });
    });
  }, r7.prototype.setFocus = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setFocus" } } } })];
      });
    });
  }, r7.prototype.setIcon = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setIcon", payload: { icon: t2 } } } } })];
      });
    });
  }, r7.prototype.setSkipTaskbar = function(t2) {
    return r(this, void 0, void 0, function() {
      return o(this, function(e4) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "setSkipTaskbar", payload: t2 } } } })];
      });
    });
  }, r7.prototype.startDragging = function() {
    return r(this, void 0, void 0, function() {
      return o(this, function(t2) {
        return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { label: this.label, cmd: { type: "startDragging" } } } })];
      });
    });
  }, r7;
}(y2);
var v2 = function(r7) {
  function a11(t2, a12) {
    a12 === void 0 && (a12 = {});
    var u11 = r7.call(this, t2) || this;
    return (a12 == null ? void 0 : a12.skip) || n2({ __tauriModule: "Window", message: { cmd: "createWebview", data: { options: e({ label: t2 }, a12) } } }).then(function() {
      return r(u11, void 0, void 0, function() {
        return o(this, function(t3) {
          return [2, this.emit("tauri://created")];
        });
      });
    }).catch(function(t3) {
      return r(u11, void 0, void 0, function() {
        return o(this, function(e4) {
          return [2, this.emit("tauri://error", t3)];
        });
      });
    }), u11;
  }
  return n(a11, r7), a11.getByLabel = function(t2) {
    return p3().some(function(e4) {
      return e4.label === t2;
    }) ? new a11(t2, { skip: true }) : null;
  }, a11;
}(g2);
var b2 = new v2(null, { skip: true });
function _2() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { cmd: { type: "currentMonitor" } } } })];
    });
  });
}
function w2() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { cmd: { type: "primaryMonitor" } } } })];
    });
  });
}
function M2() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Window", message: { cmd: "manage", data: { cmd: { type: "availableMonitors" } } } })];
    });
  });
}
var W = Object.freeze({ __proto__: null, WebviewWindow: v2, WebviewWindowHandle: y2, WindowManager: g2, getCurrent: m3, getAll: p3, appWindow: b2, LogicalSize: d5, PhysicalSize: l3, LogicalPosition: c7, PhysicalPosition: h4, get UserAttentionType() {
  return s6;
}, currentMonitor: _2, primaryMonitor: w2, availableMonitors: M2 });

// node_modules/@tauri-apps/api/os-8fc9c855.js
var o7 = n4() ? "\r\n" : "\n";
function e2() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Os", message: { cmd: "platform" } })];
    });
  });
}
function u7() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Os", message: { cmd: "version" } })];
    });
  });
}
function s7() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Os", message: { cmd: "type" } })];
    });
  });
}
function a7() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Os", message: { cmd: "arch" } })];
    });
  });
}
function c8() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Os", message: { cmd: "tempdir" } })];
    });
  });
}
var f4 = Object.freeze({ __proto__: null, EOL: o7, platform: e2, version: u7, type: s7, arch: a7, tempdir: c8 });

// node_modules/@tauri-apps/api/app-36904f40.js
function i3() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "App", message: { cmd: "getAppVersion" } })];
    });
  });
}
function n5() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "App", message: { cmd: "getAppName" } })];
    });
  });
}
function o8() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "App", message: { cmd: "getTauriVersion" } })];
    });
  });
}
var u8 = Object.freeze({ __proto__: null, getName: n5, getVersion: i3, getTauriVersion: o8 });

// node_modules/@tauri-apps/api/cli-4e1201fc.js
function i4() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Cli", message: { cmd: "cliMatches" } })];
    });
  });
}
var a8 = Object.freeze({ __proto__: null, getMatches: i4 });

// node_modules/@tauri-apps/api/clipboard-b850e539.js
function i5(i10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Clipboard", message: { cmd: "writeText", data: i10 } })];
    });
  });
}
function o9() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "Clipboard", message: { cmd: "readText" } })];
    });
  });
}
var a9 = Object.freeze({ __proto__: null, writeText: i5, readText: o9 });

// node_modules/@tauri-apps/api/dialog-331a812c.js
function i6(i10) {
  return i10 === void 0 && (i10 = {}), r(this, void 0, void 0, function() {
    return o(this, function(o12) {
      return typeof i10 == "object" && Object.freeze(i10), [2, n2({ __tauriModule: "Dialog", message: { cmd: "openDialog", options: i10 } })];
    });
  });
}
function r4(i10) {
  return i10 === void 0 && (i10 = {}), r(this, void 0, void 0, function() {
    return o(this, function(o12) {
      return typeof i10 == "object" && Object.freeze(i10), [2, n2({ __tauriModule: "Dialog", message: { cmd: "saveDialog", options: i10 } })];
    });
  });
}
var n6 = Object.freeze({ __proto__: null, open: i6, save: r4 });

// node_modules/@tauri-apps/api/globalShortcut-4618f68b.js
function u9(u11, n10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "GlobalShortcut", message: { cmd: "register", shortcut: u11, handler: a(n10) } })];
    });
  });
}
function n7(u11, n10) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "GlobalShortcut", message: { cmd: "registerAll", shortcuts: u11, handler: a(n10) } })];
    });
  });
}
function o10(e4) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "GlobalShortcut", message: { cmd: "isRegistered", shortcut: e4 } })];
    });
  });
}
function s8(e4) {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "GlobalShortcut", message: { cmd: "unregister", shortcut: e4 } })];
    });
  });
}
function a10() {
  return r(this, void 0, void 0, function() {
    return o(this, function(t2) {
      return [2, n2({ __tauriModule: "GlobalShortcut", message: { cmd: "unregisterAll" } })];
    });
  });
}
var c9 = Object.freeze({ __proto__: null, register: u9, registerAll: n7, isRegistered: o10, unregister: s8, unregisterAll: a10 });

// node_modules/@tauri-apps/api/notification-61968704.js
function n8() {
  return r(this, void 0, void 0, function() {
    return o(this, function(i10) {
      return window.Notification.permission !== "default" ? [2, Promise.resolve(window.Notification.permission === "granted")] : [2, n2({ __tauriModule: "Notification", message: { cmd: "isNotificationPermissionGranted" } })];
    });
  });
}
function r5() {
  return r(this, void 0, void 0, function() {
    return o(this, function(i10) {
      return [2, window.Notification.requestPermission()];
    });
  });
}
function e3(i10) {
  typeof i10 == "string" ? new window.Notification(i10) : new window.Notification(i10.title, i10);
}
var s9 = Object.freeze({ __proto__: null, sendNotification: e3, requestPermission: r5, isPermissionGranted: n8 });

// node_modules/@tauri-apps/api/process-20c422b7.js
function i7(i10) {
  return i10 === void 0 && (i10 = 0), r(this, void 0, void 0, function() {
    return o(this, function(r7) {
      return [2, n2({ __tauriModule: "Process", message: { cmd: "exit", exitCode: i10 } })];
    });
  });
}
function o11() {
  return r(this, void 0, void 0, function() {
    return o(this, function(r7) {
      return [2, n2({ __tauriModule: "Process", message: { cmd: "relaunch" } })];
    });
  });
}
var n9 = Object.freeze({ __proto__: null, exit: i7, relaunch: o11 });

// node_modules/@tauri-apps/api/updater-f0fc0128.js
function i8() {
  return r(this, void 0, void 0, function() {
    function t2() {
      r7 && r7(), r7 = void 0;
    }
    var r7;
    return o(this, function(n10) {
      return [2, new Promise(function(n11, i10) {
        o6("tauri://update-status", function(o12) {
          var a11;
          (a11 = o12 == null ? void 0 : o12.payload).error ? (t2(), i10(a11.error)) : a11.status === "DONE" && (t2(), n11());
        }).then(function(t3) {
          r7 = t3;
        }).catch(function(n12) {
          throw t2(), n12;
        }), c6("tauri://update-install").catch(function(n12) {
          throw t2(), n12;
        });
      })];
    });
  });
}
function u10() {
  return r(this, void 0, void 0, function() {
    function t2() {
      i10 && i10(), i10 = void 0;
    }
    var i10;
    return o(this, function(n10) {
      return [2, new Promise(function(n11, u11) {
        s5("tauri://update-available", function(o12) {
          var a11;
          a11 = o12 == null ? void 0 : o12.payload, t2(), n11({ manifest: a11, shouldUpdate: true });
        }).catch(function(n12) {
          throw t2(), n12;
        }), o6("tauri://update-status", function(o12) {
          var a11;
          (a11 = o12 == null ? void 0 : o12.payload).error ? (t2(), u11(a11.error)) : a11.status === "UPTODATE" && (t2(), n11({ shouldUpdate: false }));
        }).then(function(t3) {
          i10 = t3;
        }).catch(function(n12) {
          throw t2(), n12;
        }), c6("tauri://update").catch(function(n12) {
          throw t2(), n12;
        });
      })];
    });
  });
}
var c10 = Object.freeze({ __proto__: null, installUpdate: i8, checkUpdate: u10 });

// node_modules/@tauri-apps/api/index.js
function r6(t2) {
  return (r6 = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t3) {
    return typeof t3;
  } : function(t3) {
    return t3 && typeof Symbol == "function" && t3.constructor === Symbol && t3 !== Symbol.prototype ? "symbol" : typeof t3;
  })(t2);
}
!function(t2) {
  var e4 = function(t3) {
    var e5, o12 = Object.prototype, n10 = o12.hasOwnProperty, i10 = typeof Symbol == "function" ? Symbol : {}, a11 = i10.iterator || "@@iterator", c11 = i10.asyncIterator || "@@asyncIterator", u11 = i10.toStringTag || "@@toStringTag";
    function f5(t4, r7, e6) {
      return Object.defineProperty(t4, r7, { value: e6, enumerable: true, configurable: true, writable: true }), t4[r7];
    }
    try {
      f5({}, "");
    } catch (t4) {
      f5 = function(t5, r7, e6) {
        return t5[r7] = e6;
      };
    }
    function s10(t4, r7, e6, o13) {
      var n11 = r7 && r7.prototype instanceof v3 ? r7 : v3, i11 = Object.create(n11.prototype), a12 = new G(o13 || []);
      return i11._invoke = function(t5, r8, e7) {
        var o14 = l4;
        return function(n12, i12) {
          if (o14 === y3)
            throw new Error("Generator is already running");
          if (o14 === d6) {
            if (n12 === "throw")
              throw i12;
            return T();
          }
          for (e7.method = n12, e7.arg = i12; ; ) {
            var a13 = e7.delegate;
            if (a13) {
              var c12 = S(a13, e7);
              if (c12) {
                if (c12 === m4)
                  continue;
                return c12;
              }
            }
            if (e7.method === "next")
              e7.sent = e7._sent = e7.arg;
            else if (e7.method === "throw") {
              if (o14 === l4)
                throw o14 = d6, e7.arg;
              e7.dispatchException(e7.arg);
            } else
              e7.method === "return" && e7.abrupt("return", e7.arg);
            o14 = y3;
            var u12 = h5(t5, r8, e7);
            if (u12.type === "normal") {
              if (o14 = e7.done ? d6 : p4, u12.arg === m4)
                continue;
              return { value: u12.arg, done: e7.done };
            }
            u12.type === "throw" && (o14 = d6, e7.method = "throw", e7.arg = u12.arg);
          }
        };
      }(t4, e6, a12), i11;
    }
    function h5(t4, r7, e6) {
      try {
        return { type: "normal", arg: t4.call(r7, e6) };
      } catch (t5) {
        return { type: "throw", arg: t5 };
      }
    }
    t3.wrap = s10;
    var l4 = "suspendedStart", p4 = "suspendedYield", y3 = "executing", d6 = "completed", m4 = {};
    function v3() {
    }
    function g3() {
    }
    function w3() {
    }
    var x2 = {};
    f5(x2, a11, function() {
      return this;
    });
    var b3 = Object.getPrototypeOf, j2 = b3 && b3(b3(N([])));
    j2 && j2 !== o12 && n10.call(j2, a11) && (x2 = j2);
    var L = w3.prototype = v3.prototype = Object.create(x2);
    function E(t4) {
      ["next", "throw", "return"].forEach(function(r7) {
        f5(t4, r7, function(t5) {
          return this._invoke(r7, t5);
        });
      });
    }
    function _3(t4, e6) {
      function o13(i12, a12, c12, u12) {
        var f6 = h5(t4[i12], t4, a12);
        if (f6.type !== "throw") {
          var s11 = f6.arg, l5 = s11.value;
          return l5 && r6(l5) === "object" && n10.call(l5, "__await") ? e6.resolve(l5.__await).then(function(t5) {
            o13("next", t5, c12, u12);
          }, function(t5) {
            o13("throw", t5, c12, u12);
          }) : e6.resolve(l5).then(function(t5) {
            s11.value = t5, c12(s11);
          }, function(t5) {
            return o13("throw", t5, c12, u12);
          });
        }
        u12(f6.arg);
      }
      var i11;
      this._invoke = function(t5, r7) {
        function n11() {
          return new e6(function(e7, n12) {
            o13(t5, r7, e7, n12);
          });
        }
        return i11 = i11 ? i11.then(n11, n11) : n11();
      };
    }
    function S(t4, r7) {
      var o13 = t4.iterator[r7.method];
      if (o13 === e5) {
        if (r7.delegate = null, r7.method === "throw") {
          if (t4.iterator.return && (r7.method = "return", r7.arg = e5, S(t4, r7), r7.method === "throw"))
            return m4;
          r7.method = "throw", r7.arg = new TypeError("The iterator does not provide a 'throw' method");
        }
        return m4;
      }
      var n11 = h5(o13, t4.iterator, r7.arg);
      if (n11.type === "throw")
        return r7.method = "throw", r7.arg = n11.arg, r7.delegate = null, m4;
      var i11 = n11.arg;
      return i11 ? i11.done ? (r7[t4.resultName] = i11.value, r7.next = t4.nextLoc, r7.method !== "return" && (r7.method = "next", r7.arg = e5), r7.delegate = null, m4) : i11 : (r7.method = "throw", r7.arg = new TypeError("iterator result is not an object"), r7.delegate = null, m4);
    }
    function O(t4) {
      var r7 = { tryLoc: t4[0] };
      1 in t4 && (r7.catchLoc = t4[1]), 2 in t4 && (r7.finallyLoc = t4[2], r7.afterLoc = t4[3]), this.tryEntries.push(r7);
    }
    function k2(t4) {
      var r7 = t4.completion || {};
      r7.type = "normal", delete r7.arg, t4.completion = r7;
    }
    function G(t4) {
      this.tryEntries = [{ tryLoc: "root" }], t4.forEach(O, this), this.reset(true);
    }
    function N(t4) {
      if (t4) {
        var r7 = t4[a11];
        if (r7)
          return r7.call(t4);
        if (typeof t4.next == "function")
          return t4;
        if (!isNaN(t4.length)) {
          var o13 = -1, i11 = function r8() {
            for (; ++o13 < t4.length; )
              if (n10.call(t4, o13))
                return r8.value = t4[o13], r8.done = false, r8;
            return r8.value = e5, r8.done = true, r8;
          };
          return i11.next = i11;
        }
      }
      return { next: T };
    }
    function T() {
      return { value: e5, done: true };
    }
    return g3.prototype = w3, f5(L, "constructor", w3), f5(w3, "constructor", g3), g3.displayName = f5(w3, u11, "GeneratorFunction"), t3.isGeneratorFunction = function(t4) {
      var r7 = typeof t4 == "function" && t4.constructor;
      return !!r7 && (r7 === g3 || (r7.displayName || r7.name) === "GeneratorFunction");
    }, t3.mark = function(t4) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t4, w3) : (t4.__proto__ = w3, f5(t4, u11, "GeneratorFunction")), t4.prototype = Object.create(L), t4;
    }, t3.awrap = function(t4) {
      return { __await: t4 };
    }, E(_3.prototype), f5(_3.prototype, c11, function() {
      return this;
    }), t3.AsyncIterator = _3, t3.async = function(r7, e6, o13, n11, i11) {
      i11 === void 0 && (i11 = Promise);
      var a12 = new _3(s10(r7, e6, o13, n11), i11);
      return t3.isGeneratorFunction(e6) ? a12 : a12.next().then(function(t4) {
        return t4.done ? t4.value : a12.next();
      });
    }, E(L), f5(L, u11, "Generator"), f5(L, a11, function() {
      return this;
    }), f5(L, "toString", function() {
      return "[object Generator]";
    }), t3.keys = function(t4) {
      var r7 = [];
      for (var e6 in t4)
        r7.push(e6);
      return r7.reverse(), function e7() {
        for (; r7.length; ) {
          var o13 = r7.pop();
          if (o13 in t4)
            return e7.value = o13, e7.done = false, e7;
        }
        return e7.done = true, e7;
      };
    }, t3.values = N, G.prototype = { constructor: G, reset: function(t4) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = e5, this.done = false, this.delegate = null, this.method = "next", this.arg = e5, this.tryEntries.forEach(k2), !t4)
        for (var r7 in this)
          r7.charAt(0) === "t" && n10.call(this, r7) && !isNaN(+r7.slice(1)) && (this[r7] = e5);
    }, stop: function() {
      this.done = true;
      var t4 = this.tryEntries[0].completion;
      if (t4.type === "throw")
        throw t4.arg;
      return this.rval;
    }, dispatchException: function(t4) {
      if (this.done)
        throw t4;
      var r7 = this;
      function o13(o14, n11) {
        return c12.type = "throw", c12.arg = t4, r7.next = o14, n11 && (r7.method = "next", r7.arg = e5), !!n11;
      }
      for (var i11 = this.tryEntries.length - 1; i11 >= 0; --i11) {
        var a12 = this.tryEntries[i11], c12 = a12.completion;
        if (a12.tryLoc === "root")
          return o13("end");
        if (a12.tryLoc <= this.prev) {
          var u12 = n10.call(a12, "catchLoc"), f6 = n10.call(a12, "finallyLoc");
          if (u12 && f6) {
            if (this.prev < a12.catchLoc)
              return o13(a12.catchLoc, true);
            if (this.prev < a12.finallyLoc)
              return o13(a12.finallyLoc);
          } else if (u12) {
            if (this.prev < a12.catchLoc)
              return o13(a12.catchLoc, true);
          } else {
            if (!f6)
              throw new Error("try statement without catch or finally");
            if (this.prev < a12.finallyLoc)
              return o13(a12.finallyLoc);
          }
        }
      }
    }, abrupt: function(t4, r7) {
      for (var e6 = this.tryEntries.length - 1; e6 >= 0; --e6) {
        var o13 = this.tryEntries[e6];
        if (o13.tryLoc <= this.prev && n10.call(o13, "finallyLoc") && this.prev < o13.finallyLoc) {
          var i11 = o13;
          break;
        }
      }
      i11 && (t4 === "break" || t4 === "continue") && i11.tryLoc <= r7 && r7 <= i11.finallyLoc && (i11 = null);
      var a12 = i11 ? i11.completion : {};
      return a12.type = t4, a12.arg = r7, i11 ? (this.method = "next", this.next = i11.finallyLoc, m4) : this.complete(a12);
    }, complete: function(t4, r7) {
      if (t4.type === "throw")
        throw t4.arg;
      return t4.type === "break" || t4.type === "continue" ? this.next = t4.arg : t4.type === "return" ? (this.rval = this.arg = t4.arg, this.method = "return", this.next = "end") : t4.type === "normal" && r7 && (this.next = r7), m4;
    }, finish: function(t4) {
      for (var r7 = this.tryEntries.length - 1; r7 >= 0; --r7) {
        var e6 = this.tryEntries[r7];
        if (e6.finallyLoc === t4)
          return this.complete(e6.completion, e6.afterLoc), k2(e6), m4;
      }
    }, catch: function(t4) {
      for (var r7 = this.tryEntries.length - 1; r7 >= 0; --r7) {
        var e6 = this.tryEntries[r7];
        if (e6.tryLoc === t4) {
          var o13 = e6.completion;
          if (o13.type === "throw") {
            var n11 = o13.arg;
            k2(e6);
          }
          return n11;
        }
      }
      throw new Error("illegal catch attempt");
    }, delegateYield: function(t4, r7, o13) {
      return this.delegate = { iterator: N(t4), resultName: r7, nextLoc: o13 }, this.method === "next" && (this.arg = e5), m4;
    } }, t3;
  }(t2.exports);
  try {
    regeneratorRuntime = e4;
  } catch (t3) {
    (typeof globalThis == "undefined" ? "undefined" : r6(globalThis)) === "object" ? globalThis.regeneratorRuntime = e4 : Function("r", "regeneratorRuntime = r")(e4);
  }
}({ exports: {} });
var i9 = i;

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
  let { contents, c: c11, misc, m: m4, style, s: s10, on, attrs, a: a11, raw } = args;
  contents = contents || c11 || "";
  contents = raw ? contents : escape(contents);
  elem.innerHTML = contents;
  Object.assign(elem, misc || m4);
  Object.assign(elem.style, style || s10);
  Object.entries(on || {}).forEach(([evt, listener]) => elem.addEventListener(evt, listener));
  Object.entries(attrs || a11 || {}).forEach(([attr, value]) => elem.setAttribute(attr, value));
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
  return string.replace(new RegExp("(^|[^\\\\]){{\\s*(" + Object.keys(data).join("|") + ")\\s*}}", "gi"), function(matched, p1, p22) {
    return `${p1 || ""}${data[p22]}`;
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
var import_codemirror = __toModule(require_codemirror());
var import_gfm = __toModule(require_gfm());

// static/src/prompt.ts
var fuzzySearch = (str, query) => {
  var string = str.toLowerCase();
  var compare = query.toLowerCase();
  var matches = 0;
  if (string.indexOf(compare) > -1)
    return true;
  for (var i10 = 0; i10 < compare.length; i10++) {
    string.indexOf(compare[i10]) > -1 ? matches += 1 : matches -= 1;
  }
  return query === "" ? 1 : matches / str.length;
};
var initialisePrompt = () => {
  const mask = campfire_default.insert(campfire_default.nu("div#mask"), { atEndOf: document.body });
  const prompt = campfire_default.insert(campfire_default.nu("div#prompt"), { atEndOf: mask });
  const promptWrapper = campfire_default.insert(campfire_default.nu("div#prompt-msg-wrapper"), { atEndOf: prompt });
  const msg = campfire_default.insert(campfire_default.nu("span#prompt-message"), { atEndOf: promptWrapper });
  const field = campfire_default.insert(campfire_default.nu("input#prompt-field", {
    a: { type: "text", autocomplete: "off" }
  }), { atEndOf: promptWrapper });
  const options = campfire_default.insert(campfire_default.nu("div#prompt-options"), { atEndOf: prompt });
  let currentChoices = [];
  let currIndex = -1;
  let allowNonOptions = true;
  let allowBlank = false;
  let appendChoice = (choice) => {
    options.append(campfire_default.nu(".prompt-option", {
      c: choice,
      a: { "data-choice": choice }
    }));
  };
  const hide = () => {
    mask.style.display = "none";
  };
  field.oninput = (e4) => {
    let value = field.value.trim();
    for (let choice of currentChoices) {
      const elt = document.querySelector(`div[data-choice=${choice}]`);
      if (fuzzySearch(choice, value) > 0.5) {
        if (elt === null)
          appendChoice(choice);
      } else {
        if (elt)
          elt.remove();
      }
    }
  };
  const completePromptFlow = (value) => {
    msg.innerHTML = "";
    field.value = "";
    options.innerHTML = "";
    allowNonOptions = true;
    allowBlank = false;
    currentCb(value);
    hide();
  };
  const setSelectedOption = (idx) => {
    options.querySelector(`.prompt-option.selected`)?.classList.remove("selected");
    options.querySelector(`.prompt-option:nth-child(${idx})`)?.classList.add("selected");
  };
  prompt.onkeydown = (e4) => {
    if (e4.key === "ArrowDown") {
      if (currIndex >= currentChoices.length)
        currIndex = currentChoices.length - 1;
      setSelectedOption(currIndex += 1);
    } else if (e4.key === "ArrowUp") {
      if (currIndex < 0)
        currIndex = 0;
      setSelectedOption(currIndex -= 1);
    } else if (e4.key === "Enter") {
      let value = field.value.trim();
      let selected = document.querySelector(".prompt-option.selected")?.getAttribute("data-choice");
      if (!allowBlank && !value && !selected)
        return;
      if (selected) {
        completePromptFlow(selected);
        return;
      }
      if (allowNonOptions || currentChoices.includes(value)) {
        completePromptFlow(value);
      }
    }
  };
  const cfg = new campfire_default.Store({});
  let currentCb = (str) => {
  };
  const setChoices = (choices) => {
    currentChoices = choices;
    options.innerHTML = "";
    choices.forEach(appendChoice);
  };
  cfg.on("update", (options2) => {
    console.log(options2);
    msg.innerHTML = options2.message || "";
    setChoices(options2.choices || []);
    currentCb = options2.callback || currentCb;
    console.log(allowBlank);
  });
  const show = (options2) => {
    cfg.update(options2);
    mask.style.display = "flex";
    field.focus();
  };
  return [show, hide];
};

// static/src/main.ts
window.addEventListener("DOMContentLoaded", async () => {
  const editorRoot = campfire_default.insert(campfire_default.nu("div#editor"), { atStartOf: document.querySelector("#app") });
  const editor = (0, import_codemirror.default)(editorRoot, {
    mode: "gfm",
    lineNumbers: true
  });
  const statusLine = campfire_default.insert(campfire_default.nu("div#statusline"), { atEndOf: editorRoot });
  try {
    const cfgDir = await i9("get_config_dir");
    campfire_default.extend(statusLine, { c: `config dir: ${cfgDir}` });
  } catch (e4) {
    campfire_default.extend(statusLine, { c: `Error fetching config dir: ${e4}` });
  }
  const [show, hide] = initialisePrompt();
});
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
//# sourceMappingURL=main.js.map
