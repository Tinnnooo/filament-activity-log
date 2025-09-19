var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/diff/lib/diff/base.js
var require_base = __commonJS({
  "node_modules/diff/lib/diff/base.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = Diff2;
    function Diff2() {
    }
    Diff2.prototype = {
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      diff: function diff(oldString, newString) {
        var _options$timeout;
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var callback = options.callback;
        if (typeof options === "function") {
          callback = options;
          options = {};
        }
        this.options = options;
        var self = this;
        function done(value) {
          if (callback) {
            setTimeout(function() {
              callback(void 0, value);
            }, 0);
            return true;
          } else {
            return value;
          }
        }
        oldString = this.castInput(oldString);
        newString = this.castInput(newString);
        oldString = this.removeEmpty(this.tokenize(oldString));
        newString = this.removeEmpty(this.tokenize(newString));
        var newLen = newString.length, oldLen = oldString.length;
        var editLength = 1;
        var maxEditLength = newLen + oldLen;
        if (options.maxEditLength) {
          maxEditLength = Math.min(maxEditLength, options.maxEditLength);
        }
        var maxExecutionTime = (
          /*istanbul ignore start*/
          (_options$timeout = /*istanbul ignore end*/
          options.timeout) !== null && _options$timeout !== void 0 ? _options$timeout : Infinity
        );
        var abortAfterTimestamp = Date.now() + maxExecutionTime;
        var bestPath = [{
          oldPos: -1,
          lastComponent: void 0
        }];
        var newPos = this.extractCommon(bestPath[0], newString, oldString, 0);
        if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          return done([{
            value: this.join(newString),
            count: newString.length
          }]);
        }
        var minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
        function execEditLength() {
          for (var diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
            var basePath = (
              /*istanbul ignore start*/
              void 0
            );
            var removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
            if (removePath) {
              bestPath[diagonalPath - 1] = void 0;
            }
            var canAdd = false;
            if (addPath) {
              var addPathNewPos = addPath.oldPos - diagonalPath;
              canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
            }
            var canRemove = removePath && removePath.oldPos + 1 < oldLen;
            if (!canAdd && !canRemove) {
              bestPath[diagonalPath] = void 0;
              continue;
            }
            if (!canRemove || canAdd && removePath.oldPos + 1 < addPath.oldPos) {
              basePath = self.addToPath(addPath, true, void 0, 0);
            } else {
              basePath = self.addToPath(removePath, void 0, true, 1);
            }
            newPos = self.extractCommon(basePath, newString, oldString, diagonalPath);
            if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
              return done(buildValues(self, basePath.lastComponent, newString, oldString, self.useLongestToken));
            } else {
              bestPath[diagonalPath] = basePath;
              if (basePath.oldPos + 1 >= oldLen) {
                maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
              }
              if (newPos + 1 >= newLen) {
                minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
              }
            }
          }
          editLength++;
        }
        if (callback) {
          (function exec() {
            setTimeout(function() {
              if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
                return callback();
              }
              if (!execEditLength()) {
                exec();
              }
            }, 0);
          })();
        } else {
          while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
            var ret = execEditLength();
            if (ret) {
              return ret;
            }
          }
        }
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      addToPath: function addToPath(path, added, removed, oldPosInc) {
        var last = path.lastComponent;
        if (last && last.added === added && last.removed === removed) {
          return {
            oldPos: path.oldPos + oldPosInc,
            lastComponent: {
              count: last.count + 1,
              added,
              removed,
              previousComponent: last.previousComponent
            }
          };
        } else {
          return {
            oldPos: path.oldPos + oldPosInc,
            lastComponent: {
              count: 1,
              added,
              removed,
              previousComponent: last
            }
          };
        }
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
        var newLen = newString.length, oldLen = oldString.length, oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
        while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
          newPos++;
          oldPos++;
          commonCount++;
        }
        if (commonCount) {
          basePath.lastComponent = {
            count: commonCount,
            previousComponent: basePath.lastComponent
          };
        }
        basePath.oldPos = oldPos;
        return newPos;
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      equals: function equals(left, right) {
        if (this.options.comparator) {
          return this.options.comparator(left, right);
        } else {
          return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
        }
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      removeEmpty: function removeEmpty(array) {
        var ret = [];
        for (var i = 0; i < array.length; i++) {
          if (array[i]) {
            ret.push(array[i]);
          }
        }
        return ret;
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      castInput: function castInput(value) {
        return value;
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      tokenize: function tokenize(value) {
        return value.split("");
      },
      /*istanbul ignore start*/
      /*istanbul ignore end*/
      join: function join(chars) {
        return chars.join("");
      }
    };
    function buildValues(diff, lastComponent, newString, oldString, useLongestToken) {
      var components = [];
      var nextComponent;
      while (lastComponent) {
        components.push(lastComponent);
        nextComponent = lastComponent.previousComponent;
        delete lastComponent.previousComponent;
        lastComponent = nextComponent;
      }
      components.reverse();
      var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
      for (; componentPos < componentLen; componentPos++) {
        var component = components[componentPos];
        if (!component.removed) {
          if (!component.added && useLongestToken) {
            var value = newString.slice(newPos, newPos + component.count);
            value = value.map(function(value2, i) {
              var oldValue = oldString[oldPos + i];
              return oldValue.length > value2.length ? oldValue : value2;
            });
            component.value = diff.join(value);
          } else {
            component.value = diff.join(newString.slice(newPos, newPos + component.count));
          }
          newPos += component.count;
          if (!component.added) {
            oldPos += component.count;
          }
        } else {
          component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
          oldPos += component.count;
          if (componentPos && components[componentPos - 1].added) {
            var tmp = components[componentPos - 1];
            components[componentPos - 1] = components[componentPos];
            components[componentPos] = tmp;
          }
        }
      }
      var finalComponent = components[componentLen - 1];
      if (componentLen > 1 && typeof finalComponent.value === "string" && (finalComponent.added || finalComponent.removed) && diff.equals("", finalComponent.value)) {
        components[componentLen - 2].value += finalComponent.value;
        components.pop();
      }
      return components;
    }
  }
});

// node_modules/diff/lib/diff/character.js
var require_character = __commonJS({
  "node_modules/diff/lib/diff/character.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.diffChars = diffChars;
    exports.characterDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var characterDiff = new /*istanbul ignore start*/
    _base[
      /*istanbul ignore start*/
      "default"
      /*istanbul ignore end*/
    ]();
    exports.characterDiff = characterDiff;
    function diffChars(oldStr, newStr, options) {
      return characterDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/lib/util/params.js
var require_params = __commonJS({
  "node_modules/diff/lib/util/params.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.generateOptions = generateOptions;
    function generateOptions(options, defaults) {
      if (typeof options === "function") {
        defaults.callback = options;
      } else if (options) {
        for (var name in options) {
          if (options.hasOwnProperty(name)) {
            defaults[name] = options[name];
          }
        }
      }
      return defaults;
    }
  }
});

// node_modules/diff/lib/diff/word.js
var require_word = __commonJS({
  "node_modules/diff/lib/diff/word.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.diffWords = diffWords;
    exports.diffWordsWithSpace = diffWordsWithSpace;
    exports.wordDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    var _params = require_params();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
    var reWhitespace = /\S/;
    var wordDiff = new /*istanbul ignore start*/
    _base[
      /*istanbul ignore start*/
      "default"
      /*istanbul ignore end*/
    ]();
    exports.wordDiff = wordDiff;
    wordDiff.equals = function(left, right) {
      if (this.options.ignoreCase) {
        left = left.toLowerCase();
        right = right.toLowerCase();
      }
      return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
    };
    wordDiff.tokenize = function(value) {
      var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);
      for (var i = 0; i < tokens.length - 1; i++) {
        if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
          tokens[i] += tokens[i + 2];
          tokens.splice(i + 1, 2);
          i--;
        }
      }
      return tokens;
    };
    function diffWords(oldStr, newStr, options) {
      options = /*istanbul ignore start*/
      (0, /*istanbul ignore end*/
      /*istanbul ignore start*/
      _params.generateOptions)(options, {
        ignoreWhitespace: true
      });
      return wordDiff.diff(oldStr, newStr, options);
    }
    function diffWordsWithSpace(oldStr, newStr, options) {
      return wordDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/lib/diff/line.js
var require_line = __commonJS({
  "node_modules/diff/lib/diff/line.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.diffLines = diffLines;
    exports.diffTrimmedLines = diffTrimmedLines;
    exports.lineDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    var _params = require_params();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var lineDiff = new /*istanbul ignore start*/
    _base[
      /*istanbul ignore start*/
      "default"
      /*istanbul ignore end*/
    ]();
    exports.lineDiff = lineDiff;
    lineDiff.tokenize = function(value) {
      if (this.options.stripTrailingCr) {
        value = value.replace(/\r\n/g, "\n");
      }
      var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
      if (!linesAndNewlines[linesAndNewlines.length - 1]) {
        linesAndNewlines.pop();
      }
      for (var i = 0; i < linesAndNewlines.length; i++) {
        var line = linesAndNewlines[i];
        if (i % 2 && !this.options.newlineIsToken) {
          retLines[retLines.length - 1] += line;
        } else {
          if (this.options.ignoreWhitespace) {
            line = line.trim();
          }
          retLines.push(line);
        }
      }
      return retLines;
    };
    function diffLines(oldStr, newStr, callback) {
      return lineDiff.diff(oldStr, newStr, callback);
    }
    function diffTrimmedLines(oldStr, newStr, callback) {
      var options = (
        /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _params.generateOptions)(callback, {
          ignoreWhitespace: true
        })
      );
      return lineDiff.diff(oldStr, newStr, options);
    }
  }
});

// node_modules/diff/lib/diff/sentence.js
var require_sentence = __commonJS({
  "node_modules/diff/lib/diff/sentence.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.diffSentences = diffSentences;
    exports.sentenceDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var sentenceDiff = new /*istanbul ignore start*/
    _base[
      /*istanbul ignore start*/
      "default"
      /*istanbul ignore end*/
    ]();
    exports.sentenceDiff = sentenceDiff;
    sentenceDiff.tokenize = function(value) {
      return value.split(/(\S.+?[.!?])(?=\s+|$)/);
    };
    function diffSentences(oldStr, newStr, callback) {
      return sentenceDiff.diff(oldStr, newStr, callback);
    }
  }
});

// node_modules/diff/lib/diff/css.js
var require_css = __commonJS({
  "node_modules/diff/lib/diff/css.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.diffCss = diffCss;
    exports.cssDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var cssDiff = new /*istanbul ignore start*/
    _base[
      /*istanbul ignore start*/
      "default"
      /*istanbul ignore end*/
    ]();
    exports.cssDiff = cssDiff;
    cssDiff.tokenize = function(value) {
      return value.split(/([{}:;,]|\s+)/);
    };
    function diffCss(oldStr, newStr, callback) {
      return cssDiff.diff(oldStr, newStr, callback);
    }
  }
});

// node_modules/diff/lib/diff/json.js
var require_json = __commonJS({
  "node_modules/diff/lib/diff/json.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.diffJson = diffJson;
    exports.canonicalize = canonicalize;
    exports.jsonDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    var _line = require_line();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    var objectPrototypeToString = Object.prototype.toString;
    var jsonDiff = new /*istanbul ignore start*/
    _base[
      /*istanbul ignore start*/
      "default"
      /*istanbul ignore end*/
    ]();
    exports.jsonDiff = jsonDiff;
    jsonDiff.useLongestToken = true;
    jsonDiff.tokenize = /*istanbul ignore start*/
    _line.lineDiff.tokenize;
    jsonDiff.castInput = function(value) {
      var _this$options = (
        /*istanbul ignore end*/
        this.options
      ), undefinedReplacement = _this$options.undefinedReplacement, _this$options$stringi = _this$options.stringifyReplacer, stringifyReplacer = _this$options$stringi === void 0 ? function(k, v) {
        return (
          /*istanbul ignore end*/
          typeof v === "undefined" ? undefinedReplacement : v
        );
      } : _this$options$stringi;
      return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
    };
    jsonDiff.equals = function(left, right) {
      return (
        /*istanbul ignore start*/
        _base[
          /*istanbul ignore start*/
          "default"
          /*istanbul ignore end*/
        ].prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"))
      );
    };
    function diffJson(oldObj, newObj, options) {
      return jsonDiff.diff(oldObj, newObj, options);
    }
    function canonicalize(obj, stack, replacementStack, replacer, key) {
      stack = stack || [];
      replacementStack = replacementStack || [];
      if (replacer) {
        obj = replacer(key, obj);
      }
      var i;
      for (i = 0; i < stack.length; i += 1) {
        if (stack[i] === obj) {
          return replacementStack[i];
        }
      }
      var canonicalizedObj;
      if ("[object Array]" === objectPrototypeToString.call(obj)) {
        stack.push(obj);
        canonicalizedObj = new Array(obj.length);
        replacementStack.push(canonicalizedObj);
        for (i = 0; i < obj.length; i += 1) {
          canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
        }
        stack.pop();
        replacementStack.pop();
        return canonicalizedObj;
      }
      if (obj && obj.toJSON) {
        obj = obj.toJSON();
      }
      if (
        /*istanbul ignore start*/
        _typeof(
          /*istanbul ignore end*/
          obj
        ) === "object" && obj !== null
      ) {
        stack.push(obj);
        canonicalizedObj = {};
        replacementStack.push(canonicalizedObj);
        var sortedKeys = [], _key;
        for (_key in obj) {
          if (obj.hasOwnProperty(_key)) {
            sortedKeys.push(_key);
          }
        }
        sortedKeys.sort();
        for (i = 0; i < sortedKeys.length; i += 1) {
          _key = sortedKeys[i];
          canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
        }
        stack.pop();
        replacementStack.pop();
      } else {
        canonicalizedObj = obj;
      }
      return canonicalizedObj;
    }
  }
});

// node_modules/diff/lib/diff/array.js
var require_array = __commonJS({
  "node_modules/diff/lib/diff/array.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.diffArrays = diffArrays;
    exports.arrayDiff = void 0;
    var _base = _interopRequireDefault(require_base());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    var arrayDiff = new /*istanbul ignore start*/
    _base[
      /*istanbul ignore start*/
      "default"
      /*istanbul ignore end*/
    ]();
    exports.arrayDiff = arrayDiff;
    arrayDiff.tokenize = function(value) {
      return value.slice();
    };
    arrayDiff.join = arrayDiff.removeEmpty = function(value) {
      return value;
    };
    function diffArrays(oldArr, newArr, callback) {
      return arrayDiff.diff(oldArr, newArr, callback);
    }
  }
});

// node_modules/diff/lib/patch/parse.js
var require_parse = __commonJS({
  "node_modules/diff/lib/patch/parse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.parsePatch = parsePatch;
    function parsePatch(uniDiff) {
      var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      var diffstr = uniDiff.split(/\r\n|[\n\v\f\r\x85]/), delimiters = uniDiff.match(/\r\n|[\n\v\f\r\x85]/g) || [], list = [], i = 0;
      function parseIndex() {
        var index = {};
        list.push(index);
        while (i < diffstr.length) {
          var line = diffstr[i];
          if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
            break;
          }
          var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);
          if (header) {
            index.index = header[1];
          }
          i++;
        }
        parseFileHeader(index);
        parseFileHeader(index);
        index.hunks = [];
        while (i < diffstr.length) {
          var _line = diffstr[i];
          if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(_line)) {
            break;
          } else if (/^@@/.test(_line)) {
            index.hunks.push(parseHunk());
          } else if (_line && options.strict) {
            throw new Error("Unknown line " + (i + 1) + " " + JSON.stringify(_line));
          } else {
            i++;
          }
        }
      }
      function parseFileHeader(index) {
        var fileHeader = /^(---|\+\+\+)\s+(.*)$/.exec(diffstr[i]);
        if (fileHeader) {
          var keyPrefix = fileHeader[1] === "---" ? "old" : "new";
          var data = fileHeader[2].split("	", 2);
          var fileName = data[0].replace(/\\\\/g, "\\");
          if (/^".*"$/.test(fileName)) {
            fileName = fileName.substr(1, fileName.length - 2);
          }
          index[keyPrefix + "FileName"] = fileName;
          index[keyPrefix + "Header"] = (data[1] || "").trim();
          i++;
        }
      }
      function parseHunk() {
        var chunkHeaderIndex = i, chunkHeaderLine = diffstr[i++], chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
        var hunk = {
          oldStart: +chunkHeader[1],
          oldLines: typeof chunkHeader[2] === "undefined" ? 1 : +chunkHeader[2],
          newStart: +chunkHeader[3],
          newLines: typeof chunkHeader[4] === "undefined" ? 1 : +chunkHeader[4],
          lines: [],
          linedelimiters: []
        };
        if (hunk.oldLines === 0) {
          hunk.oldStart += 1;
        }
        if (hunk.newLines === 0) {
          hunk.newStart += 1;
        }
        var addCount = 0, removeCount = 0;
        for (; i < diffstr.length; i++) {
          if (diffstr[i].indexOf("--- ") === 0 && i + 2 < diffstr.length && diffstr[i + 1].indexOf("+++ ") === 0 && diffstr[i + 2].indexOf("@@") === 0) {
            break;
          }
          var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? " " : diffstr[i][0];
          if (operation === "+" || operation === "-" || operation === " " || operation === "\\") {
            hunk.lines.push(diffstr[i]);
            hunk.linedelimiters.push(delimiters[i] || "\n");
            if (operation === "+") {
              addCount++;
            } else if (operation === "-") {
              removeCount++;
            } else if (operation === " ") {
              addCount++;
              removeCount++;
            }
          } else {
            break;
          }
        }
        if (!addCount && hunk.newLines === 1) {
          hunk.newLines = 0;
        }
        if (!removeCount && hunk.oldLines === 1) {
          hunk.oldLines = 0;
        }
        if (options.strict) {
          if (addCount !== hunk.newLines) {
            throw new Error("Added line count did not match for hunk at line " + (chunkHeaderIndex + 1));
          }
          if (removeCount !== hunk.oldLines) {
            throw new Error("Removed line count did not match for hunk at line " + (chunkHeaderIndex + 1));
          }
        }
        return hunk;
      }
      while (i < diffstr.length) {
        parseIndex();
      }
      return list;
    }
  }
});

// node_modules/diff/lib/util/distance-iterator.js
var require_distance_iterator = __commonJS({
  "node_modules/diff/lib/util/distance-iterator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = _default;
    function _default(start, minLine, maxLine) {
      var wantForward = true, backwardExhausted = false, forwardExhausted = false, localOffset = 1;
      return function iterator() {
        if (wantForward && !forwardExhausted) {
          if (backwardExhausted) {
            localOffset++;
          } else {
            wantForward = false;
          }
          if (start + localOffset <= maxLine) {
            return localOffset;
          }
          forwardExhausted = true;
        }
        if (!backwardExhausted) {
          if (!forwardExhausted) {
            wantForward = true;
          }
          if (minLine <= start - localOffset) {
            return -localOffset++;
          }
          backwardExhausted = true;
          return iterator();
        }
      };
    }
  }
});

// node_modules/diff/lib/patch/apply.js
var require_apply = __commonJS({
  "node_modules/diff/lib/patch/apply.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.applyPatch = applyPatch;
    exports.applyPatches = applyPatches;
    var _parse = require_parse();
    var _distanceIterator = _interopRequireDefault(require_distance_iterator());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    function applyPatch(source, uniDiff) {
      var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (typeof uniDiff === "string") {
        uniDiff = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _parse.parsePatch)(uniDiff);
      }
      if (Array.isArray(uniDiff)) {
        if (uniDiff.length > 1) {
          throw new Error("applyPatch only works with a single input.");
        }
        uniDiff = uniDiff[0];
      }
      var lines = source.split(/\r\n|[\n\v\f\r\x85]/), delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || [], hunks = uniDiff.hunks, compareLine = options.compareLine || function(lineNumber, line2, operation2, patchContent) {
        return (
          /*istanbul ignore end*/
          line2 === patchContent
        );
      }, errorCount = 0, fuzzFactor = options.fuzzFactor || 0, minLine = 0, offset = 0, removeEOFNL, addEOFNL;
      function hunkFits(hunk2, toPos2) {
        for (var j2 = 0; j2 < hunk2.lines.length; j2++) {
          var line2 = hunk2.lines[j2], operation2 = line2.length > 0 ? line2[0] : " ", content2 = line2.length > 0 ? line2.substr(1) : line2;
          if (operation2 === " " || operation2 === "-") {
            if (!compareLine(toPos2 + 1, lines[toPos2], operation2, content2)) {
              errorCount++;
              if (errorCount > fuzzFactor) {
                return false;
              }
            }
            toPos2++;
          }
        }
        return true;
      }
      for (var i = 0; i < hunks.length; i++) {
        var hunk = hunks[i], maxLine = lines.length - hunk.oldLines, localOffset = 0, toPos = offset + hunk.oldStart - 1;
        var iterator = (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _distanceIterator[
            /*istanbul ignore start*/
            "default"
            /*istanbul ignore end*/
          ])(toPos, minLine, maxLine)
        );
        for (; localOffset !== void 0; localOffset = iterator()) {
          if (hunkFits(hunk, toPos + localOffset)) {
            hunk.offset = offset += localOffset;
            break;
          }
        }
        if (localOffset === void 0) {
          return false;
        }
        minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
      }
      var diffOffset = 0;
      for (var _i = 0; _i < hunks.length; _i++) {
        var _hunk = hunks[_i], _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1;
        diffOffset += _hunk.newLines - _hunk.oldLines;
        for (var j = 0; j < _hunk.lines.length; j++) {
          var line = _hunk.lines[j], operation = line.length > 0 ? line[0] : " ", content = line.length > 0 ? line.substr(1) : line, delimiter = _hunk.linedelimiters && _hunk.linedelimiters[j] || "\n";
          if (operation === " ") {
            _toPos++;
          } else if (operation === "-") {
            lines.splice(_toPos, 1);
            delimiters.splice(_toPos, 1);
          } else if (operation === "+") {
            lines.splice(_toPos, 0, content);
            delimiters.splice(_toPos, 0, delimiter);
            _toPos++;
          } else if (operation === "\\") {
            var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null;
            if (previousOperation === "+") {
              removeEOFNL = true;
            } else if (previousOperation === "-") {
              addEOFNL = true;
            }
          }
        }
      }
      if (removeEOFNL) {
        while (!lines[lines.length - 1]) {
          lines.pop();
          delimiters.pop();
        }
      } else if (addEOFNL) {
        lines.push("");
        delimiters.push("\n");
      }
      for (var _k = 0; _k < lines.length - 1; _k++) {
        lines[_k] = lines[_k] + delimiters[_k];
      }
      return lines.join("");
    }
    function applyPatches(uniDiff, options) {
      if (typeof uniDiff === "string") {
        uniDiff = /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _parse.parsePatch)(uniDiff);
      }
      var currentIndex = 0;
      function processIndex() {
        var index = uniDiff[currentIndex++];
        if (!index) {
          return options.complete();
        }
        options.loadFile(index, function(err, data) {
          if (err) {
            return options.complete(err);
          }
          var updatedContent = applyPatch(data, index, options);
          options.patched(index, updatedContent, function(err2) {
            if (err2) {
              return options.complete(err2);
            }
            processIndex();
          });
        });
      }
      processIndex();
    }
  }
});

// node_modules/diff/lib/patch/create.js
var require_create = __commonJS({
  "node_modules/diff/lib/patch/create.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.structuredPatch = structuredPatch;
    exports.formatPatch = formatPatch;
    exports.createTwoFilesPatch = createTwoFilesPatch;
    exports.createPatch = createPatch;
    var _line = require_line();
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
      if (!options) {
        options = {};
      }
      if (typeof options.context === "undefined") {
        options.context = 4;
      }
      var diff = (
        /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _line.diffLines)(oldStr, newStr, options)
      );
      if (!diff) {
        return;
      }
      diff.push({
        value: "",
        lines: []
      });
      function contextLines(lines) {
        return lines.map(function(entry) {
          return " " + entry;
        });
      }
      var hunks = [];
      var oldRangeStart = 0, newRangeStart = 0, curRange = [], oldLine = 1, newLine = 1;
      var _loop = function _loop2(i2) {
        var current = diff[i2], lines = current.lines || current.value.replace(/\n$/, "").split("\n");
        current.lines = lines;
        if (current.added || current.removed) {
          var _curRange;
          if (!oldRangeStart) {
            var prev = diff[i2 - 1];
            oldRangeStart = oldLine;
            newRangeStart = newLine;
            if (prev) {
              curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
              oldRangeStart -= curRange.length;
              newRangeStart -= curRange.length;
            }
          }
          (_curRange = /*istanbul ignore end*/
          curRange).push.apply(
            /*istanbul ignore start*/
            _curRange,
            /*istanbul ignore start*/
            _toConsumableArray(
              /*istanbul ignore end*/
              lines.map(function(entry) {
                return (current.added ? "+" : "-") + entry;
              })
            )
          );
          if (current.added) {
            newLine += lines.length;
          } else {
            oldLine += lines.length;
          }
        } else {
          if (oldRangeStart) {
            if (lines.length <= options.context * 2 && i2 < diff.length - 2) {
              var _curRange2;
              (_curRange2 = /*istanbul ignore end*/
              curRange).push.apply(
                /*istanbul ignore start*/
                _curRange2,
                /*istanbul ignore start*/
                _toConsumableArray(
                  /*istanbul ignore end*/
                  contextLines(lines)
                )
              );
            } else {
              var _curRange3;
              var contextSize = Math.min(lines.length, options.context);
              (_curRange3 = /*istanbul ignore end*/
              curRange).push.apply(
                /*istanbul ignore start*/
                _curRange3,
                /*istanbul ignore start*/
                _toConsumableArray(
                  /*istanbul ignore end*/
                  contextLines(lines.slice(0, contextSize))
                )
              );
              var hunk = {
                oldStart: oldRangeStart,
                oldLines: oldLine - oldRangeStart + contextSize,
                newStart: newRangeStart,
                newLines: newLine - newRangeStart + contextSize,
                lines: curRange
              };
              if (i2 >= diff.length - 2 && lines.length <= options.context) {
                var oldEOFNewline = /\n$/.test(oldStr);
                var newEOFNewline = /\n$/.test(newStr);
                var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;
                if (!oldEOFNewline && noNlBeforeAdds && oldStr.length > 0) {
                  curRange.splice(hunk.oldLines, 0, "\\ No newline at end of file");
                }
                if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {
                  curRange.push("\\ No newline at end of file");
                }
              }
              hunks.push(hunk);
              oldRangeStart = 0;
              newRangeStart = 0;
              curRange = [];
            }
          }
          oldLine += lines.length;
          newLine += lines.length;
        }
      };
      for (var i = 0; i < diff.length; i++) {
        _loop(
          /*istanbul ignore end*/
          i
        );
      }
      return {
        oldFileName,
        newFileName,
        oldHeader,
        newHeader,
        hunks
      };
    }
    function formatPatch(diff) {
      if (Array.isArray(diff)) {
        return diff.map(formatPatch).join("\n");
      }
      var ret = [];
      if (diff.oldFileName == diff.newFileName) {
        ret.push("Index: " + diff.oldFileName);
      }
      ret.push("===================================================================");
      ret.push("--- " + diff.oldFileName + (typeof diff.oldHeader === "undefined" ? "" : "	" + diff.oldHeader));
      ret.push("+++ " + diff.newFileName + (typeof diff.newHeader === "undefined" ? "" : "	" + diff.newHeader));
      for (var i = 0; i < diff.hunks.length; i++) {
        var hunk = diff.hunks[i];
        if (hunk.oldLines === 0) {
          hunk.oldStart -= 1;
        }
        if (hunk.newLines === 0) {
          hunk.newStart -= 1;
        }
        ret.push("@@ -" + hunk.oldStart + "," + hunk.oldLines + " +" + hunk.newStart + "," + hunk.newLines + " @@");
        ret.push.apply(ret, hunk.lines);
      }
      return ret.join("\n") + "\n";
    }
    function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
      return formatPatch(structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options));
    }
    function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
      return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
    }
  }
});

// node_modules/diff/lib/util/array.js
var require_array2 = __commonJS({
  "node_modules/diff/lib/util/array.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.arrayEqual = arrayEqual;
    exports.arrayStartsWith = arrayStartsWith;
    function arrayEqual(a, b) {
      if (a.length !== b.length) {
        return false;
      }
      return arrayStartsWith(a, b);
    }
    function arrayStartsWith(array, start) {
      if (start.length > array.length) {
        return false;
      }
      for (var i = 0; i < start.length; i++) {
        if (start[i] !== array[i]) {
          return false;
        }
      }
      return true;
    }
  }
});

// node_modules/diff/lib/patch/merge.js
var require_merge = __commonJS({
  "node_modules/diff/lib/patch/merge.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.calcLineCount = calcLineCount;
    exports.merge = merge;
    var _create = require_create();
    var _parse = require_parse();
    var _array = require_array2();
    function _toConsumableArray(arr) {
      return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _nonIterableSpread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _iterableToArray(iter) {
      if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }
    function _arrayWithoutHoles(arr) {
      if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    function calcLineCount(hunk) {
      var _calcOldNewLineCount = (
        /*istanbul ignore end*/
        calcOldNewLineCount(hunk.lines)
      ), oldLines = _calcOldNewLineCount.oldLines, newLines = _calcOldNewLineCount.newLines;
      if (oldLines !== void 0) {
        hunk.oldLines = oldLines;
      } else {
        delete hunk.oldLines;
      }
      if (newLines !== void 0) {
        hunk.newLines = newLines;
      } else {
        delete hunk.newLines;
      }
    }
    function merge(mine, theirs, base) {
      mine = loadPatch(mine, base);
      theirs = loadPatch(theirs, base);
      var ret = {};
      if (mine.index || theirs.index) {
        ret.index = mine.index || theirs.index;
      }
      if (mine.newFileName || theirs.newFileName) {
        if (!fileNameChanged(mine)) {
          ret.oldFileName = theirs.oldFileName || mine.oldFileName;
          ret.newFileName = theirs.newFileName || mine.newFileName;
          ret.oldHeader = theirs.oldHeader || mine.oldHeader;
          ret.newHeader = theirs.newHeader || mine.newHeader;
        } else if (!fileNameChanged(theirs)) {
          ret.oldFileName = mine.oldFileName;
          ret.newFileName = mine.newFileName;
          ret.oldHeader = mine.oldHeader;
          ret.newHeader = mine.newHeader;
        } else {
          ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
          ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
          ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
          ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
        }
      }
      ret.hunks = [];
      var mineIndex = 0, theirsIndex = 0, mineOffset = 0, theirsOffset = 0;
      while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
        var mineCurrent = mine.hunks[mineIndex] || {
          oldStart: Infinity
        }, theirsCurrent = theirs.hunks[theirsIndex] || {
          oldStart: Infinity
        };
        if (hunkBefore(mineCurrent, theirsCurrent)) {
          ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
          mineIndex++;
          theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
        } else if (hunkBefore(theirsCurrent, mineCurrent)) {
          ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
          theirsIndex++;
          mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
        } else {
          var mergedHunk = {
            oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
            oldLines: 0,
            newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
            newLines: 0,
            lines: []
          };
          mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
          theirsIndex++;
          mineIndex++;
          ret.hunks.push(mergedHunk);
        }
      }
      return ret;
    }
    function loadPatch(param, base) {
      if (typeof param === "string") {
        if (/^@@/m.test(param) || /^Index:/m.test(param)) {
          return (
            /*istanbul ignore start*/
            (0, /*istanbul ignore end*/
            /*istanbul ignore start*/
            _parse.parsePatch)(param)[0]
          );
        }
        if (!base) {
          throw new Error("Must provide a base reference or pass in a patch");
        }
        return (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _create.structuredPatch)(void 0, void 0, base, param)
        );
      }
      return param;
    }
    function fileNameChanged(patch) {
      return patch.newFileName && patch.newFileName !== patch.oldFileName;
    }
    function selectField(index, mine, theirs) {
      if (mine === theirs) {
        return mine;
      } else {
        index.conflict = true;
        return {
          mine,
          theirs
        };
      }
    }
    function hunkBefore(test, check) {
      return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
    }
    function cloneHunk(hunk, offset) {
      return {
        oldStart: hunk.oldStart,
        oldLines: hunk.oldLines,
        newStart: hunk.newStart + offset,
        newLines: hunk.newLines,
        lines: hunk.lines
      };
    }
    function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
      var mine = {
        offset: mineOffset,
        lines: mineLines,
        index: 0
      }, their = {
        offset: theirOffset,
        lines: theirLines,
        index: 0
      };
      insertLeading(hunk, mine, their);
      insertLeading(hunk, their, mine);
      while (mine.index < mine.lines.length && their.index < their.lines.length) {
        var mineCurrent = mine.lines[mine.index], theirCurrent = their.lines[their.index];
        if ((mineCurrent[0] === "-" || mineCurrent[0] === "+") && (theirCurrent[0] === "-" || theirCurrent[0] === "+")) {
          mutualChange(hunk, mine, their);
        } else if (mineCurrent[0] === "+" && theirCurrent[0] === " ") {
          var _hunk$lines;
          (_hunk$lines = /*istanbul ignore end*/
          hunk.lines).push.apply(
            /*istanbul ignore start*/
            _hunk$lines,
            /*istanbul ignore start*/
            _toConsumableArray(
              /*istanbul ignore end*/
              collectChange(mine)
            )
          );
        } else if (theirCurrent[0] === "+" && mineCurrent[0] === " ") {
          var _hunk$lines2;
          (_hunk$lines2 = /*istanbul ignore end*/
          hunk.lines).push.apply(
            /*istanbul ignore start*/
            _hunk$lines2,
            /*istanbul ignore start*/
            _toConsumableArray(
              /*istanbul ignore end*/
              collectChange(their)
            )
          );
        } else if (mineCurrent[0] === "-" && theirCurrent[0] === " ") {
          removal(hunk, mine, their);
        } else if (theirCurrent[0] === "-" && mineCurrent[0] === " ") {
          removal(hunk, their, mine, true);
        } else if (mineCurrent === theirCurrent) {
          hunk.lines.push(mineCurrent);
          mine.index++;
          their.index++;
        } else {
          conflict(hunk, collectChange(mine), collectChange(their));
        }
      }
      insertTrailing(hunk, mine);
      insertTrailing(hunk, their);
      calcLineCount(hunk);
    }
    function mutualChange(hunk, mine, their) {
      var myChanges = collectChange(mine), theirChanges = collectChange(their);
      if (allRemoves(myChanges) && allRemoves(theirChanges)) {
        if (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _array.arrayStartsWith)(myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)
        ) {
          var _hunk$lines3;
          (_hunk$lines3 = /*istanbul ignore end*/
          hunk.lines).push.apply(
            /*istanbul ignore start*/
            _hunk$lines3,
            /*istanbul ignore start*/
            _toConsumableArray(
              /*istanbul ignore end*/
              myChanges
            )
          );
          return;
        } else if (
          /*istanbul ignore start*/
          (0, /*istanbul ignore end*/
          /*istanbul ignore start*/
          _array.arrayStartsWith)(theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)
        ) {
          var _hunk$lines4;
          (_hunk$lines4 = /*istanbul ignore end*/
          hunk.lines).push.apply(
            /*istanbul ignore start*/
            _hunk$lines4,
            /*istanbul ignore start*/
            _toConsumableArray(
              /*istanbul ignore end*/
              theirChanges
            )
          );
          return;
        }
      } else if (
        /*istanbul ignore start*/
        (0, /*istanbul ignore end*/
        /*istanbul ignore start*/
        _array.arrayEqual)(myChanges, theirChanges)
      ) {
        var _hunk$lines5;
        (_hunk$lines5 = /*istanbul ignore end*/
        hunk.lines).push.apply(
          /*istanbul ignore start*/
          _hunk$lines5,
          /*istanbul ignore start*/
          _toConsumableArray(
            /*istanbul ignore end*/
            myChanges
          )
        );
        return;
      }
      conflict(hunk, myChanges, theirChanges);
    }
    function removal(hunk, mine, their, swap) {
      var myChanges = collectChange(mine), theirChanges = collectContext(their, myChanges);
      if (theirChanges.merged) {
        var _hunk$lines6;
        (_hunk$lines6 = /*istanbul ignore end*/
        hunk.lines).push.apply(
          /*istanbul ignore start*/
          _hunk$lines6,
          /*istanbul ignore start*/
          _toConsumableArray(
            /*istanbul ignore end*/
            theirChanges.merged
          )
        );
      } else {
        conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
      }
    }
    function conflict(hunk, mine, their) {
      hunk.conflict = true;
      hunk.lines.push({
        conflict: true,
        mine,
        theirs: their
      });
    }
    function insertLeading(hunk, insert, their) {
      while (insert.offset < their.offset && insert.index < insert.lines.length) {
        var line = insert.lines[insert.index++];
        hunk.lines.push(line);
        insert.offset++;
      }
    }
    function insertTrailing(hunk, insert) {
      while (insert.index < insert.lines.length) {
        var line = insert.lines[insert.index++];
        hunk.lines.push(line);
      }
    }
    function collectChange(state) {
      var ret = [], operation = state.lines[state.index][0];
      while (state.index < state.lines.length) {
        var line = state.lines[state.index];
        if (operation === "-" && line[0] === "+") {
          operation = "+";
        }
        if (operation === line[0]) {
          ret.push(line);
          state.index++;
        } else {
          break;
        }
      }
      return ret;
    }
    function collectContext(state, matchChanges) {
      var changes = [], merged = [], matchIndex = 0, contextChanges = false, conflicted = false;
      while (matchIndex < matchChanges.length && state.index < state.lines.length) {
        var change = state.lines[state.index], match = matchChanges[matchIndex];
        if (match[0] === "+") {
          break;
        }
        contextChanges = contextChanges || change[0] !== " ";
        merged.push(match);
        matchIndex++;
        if (change[0] === "+") {
          conflicted = true;
          while (change[0] === "+") {
            changes.push(change);
            change = state.lines[++state.index];
          }
        }
        if (match.substr(1) === change.substr(1)) {
          changes.push(change);
          state.index++;
        } else {
          conflicted = true;
        }
      }
      if ((matchChanges[matchIndex] || "")[0] === "+" && contextChanges) {
        conflicted = true;
      }
      if (conflicted) {
        return changes;
      }
      while (matchIndex < matchChanges.length) {
        merged.push(matchChanges[matchIndex++]);
      }
      return {
        merged,
        changes
      };
    }
    function allRemoves(changes) {
      return changes.reduce(function(prev, change) {
        return prev && change[0] === "-";
      }, true);
    }
    function skipRemoveSuperset(state, removeChanges, delta) {
      for (var i = 0; i < delta; i++) {
        var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);
        if (state.lines[state.index + i] !== " " + changeContent) {
          return false;
        }
      }
      state.index += delta;
      return true;
    }
    function calcOldNewLineCount(lines) {
      var oldLines = 0;
      var newLines = 0;
      lines.forEach(function(line) {
        if (typeof line !== "string") {
          var myCount = calcOldNewLineCount(line.mine);
          var theirCount = calcOldNewLineCount(line.theirs);
          if (oldLines !== void 0) {
            if (myCount.oldLines === theirCount.oldLines) {
              oldLines += myCount.oldLines;
            } else {
              oldLines = void 0;
            }
          }
          if (newLines !== void 0) {
            if (myCount.newLines === theirCount.newLines) {
              newLines += myCount.newLines;
            } else {
              newLines = void 0;
            }
          }
        } else {
          if (newLines !== void 0 && (line[0] === "+" || line[0] === " ")) {
            newLines++;
          }
          if (oldLines !== void 0 && (line[0] === "-" || line[0] === " ")) {
            oldLines++;
          }
        }
      });
      return {
        oldLines,
        newLines
      };
    }
  }
});

// node_modules/diff/lib/patch/reverse.js
var require_reverse = __commonJS({
  "node_modules/diff/lib/patch/reverse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.reversePatch = reversePatch;
    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter(function(sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
        keys.push.apply(keys, symbols);
      }
      return keys;
    }
    function _objectSpread(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
          ownKeys(Object(source), true).forEach(function(key) {
            _defineProperty(target, key, source[key]);
          });
        } else if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
          ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
        }
      }
      return target;
    }
    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function reversePatch(structuredPatch) {
      if (Array.isArray(structuredPatch)) {
        return structuredPatch.map(reversePatch).reverse();
      }
      return (
        /*istanbul ignore start*/
        _objectSpread(_objectSpread(
          {},
          /*istanbul ignore end*/
          structuredPatch
        ), {}, {
          oldFileName: structuredPatch.newFileName,
          oldHeader: structuredPatch.newHeader,
          newFileName: structuredPatch.oldFileName,
          newHeader: structuredPatch.oldHeader,
          hunks: structuredPatch.hunks.map(function(hunk) {
            return {
              oldLines: hunk.newLines,
              oldStart: hunk.newStart,
              newLines: hunk.oldLines,
              newStart: hunk.oldStart,
              linedelimiters: hunk.linedelimiters,
              lines: hunk.lines.map(function(l) {
                if (l.startsWith("-")) {
                  return (
                    /*istanbul ignore start*/
                    "+".concat(
                      /*istanbul ignore end*/
                      l.slice(1)
                    )
                  );
                }
                if (l.startsWith("+")) {
                  return (
                    /*istanbul ignore start*/
                    "-".concat(
                      /*istanbul ignore end*/
                      l.slice(1)
                    )
                  );
                }
                return l;
              })
            };
          })
        })
      );
    }
  }
});

// node_modules/diff/lib/convert/dmp.js
var require_dmp = __commonJS({
  "node_modules/diff/lib/convert/dmp.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.convertChangesToDMP = convertChangesToDMP;
    function convertChangesToDMP(changes) {
      var ret = [], change, operation;
      for (var i = 0; i < changes.length; i++) {
        change = changes[i];
        if (change.added) {
          operation = 1;
        } else if (change.removed) {
          operation = -1;
        } else {
          operation = 0;
        }
        ret.push([operation, change.value]);
      }
      return ret;
    }
  }
});

// node_modules/diff/lib/convert/xml.js
var require_xml = __commonJS({
  "node_modules/diff/lib/convert/xml.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.convertChangesToXML = convertChangesToXML;
    function convertChangesToXML(changes) {
      var ret = [];
      for (var i = 0; i < changes.length; i++) {
        var change = changes[i];
        if (change.added) {
          ret.push("<ins>");
        } else if (change.removed) {
          ret.push("<del>");
        }
        ret.push(escapeHTML(change.value));
        if (change.added) {
          ret.push("</ins>");
        } else if (change.removed) {
          ret.push("</del>");
        }
      }
      return ret.join("");
    }
    function escapeHTML(s) {
      var n = s;
      n = n.replace(/&/g, "&amp;");
      n = n.replace(/</g, "&lt;");
      n = n.replace(/>/g, "&gt;");
      n = n.replace(/"/g, "&quot;");
      return n;
    }
  }
});

// node_modules/diff/lib/index.js
var require_lib = __commonJS({
  "node_modules/diff/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "Diff", {
      enumerable: true,
      get: function get() {
        return _base["default"];
      }
    });
    Object.defineProperty(exports, "diffChars", {
      enumerable: true,
      get: function get() {
        return _character.diffChars;
      }
    });
    Object.defineProperty(exports, "diffWords", {
      enumerable: true,
      get: function get() {
        return _word.diffWords;
      }
    });
    Object.defineProperty(exports, "diffWordsWithSpace", {
      enumerable: true,
      get: function get() {
        return _word.diffWordsWithSpace;
      }
    });
    Object.defineProperty(exports, "diffLines", {
      enumerable: true,
      get: function get() {
        return _line.diffLines;
      }
    });
    Object.defineProperty(exports, "diffTrimmedLines", {
      enumerable: true,
      get: function get() {
        return _line.diffTrimmedLines;
      }
    });
    Object.defineProperty(exports, "diffSentences", {
      enumerable: true,
      get: function get() {
        return _sentence.diffSentences;
      }
    });
    Object.defineProperty(exports, "diffCss", {
      enumerable: true,
      get: function get() {
        return _css.diffCss;
      }
    });
    Object.defineProperty(exports, "diffJson", {
      enumerable: true,
      get: function get() {
        return _json.diffJson;
      }
    });
    Object.defineProperty(exports, "canonicalize", {
      enumerable: true,
      get: function get() {
        return _json.canonicalize;
      }
    });
    Object.defineProperty(exports, "diffArrays", {
      enumerable: true,
      get: function get() {
        return _array.diffArrays;
      }
    });
    Object.defineProperty(exports, "applyPatch", {
      enumerable: true,
      get: function get() {
        return _apply.applyPatch;
      }
    });
    Object.defineProperty(exports, "applyPatches", {
      enumerable: true,
      get: function get() {
        return _apply.applyPatches;
      }
    });
    Object.defineProperty(exports, "parsePatch", {
      enumerable: true,
      get: function get() {
        return _parse.parsePatch;
      }
    });
    Object.defineProperty(exports, "merge", {
      enumerable: true,
      get: function get() {
        return _merge.merge;
      }
    });
    Object.defineProperty(exports, "reversePatch", {
      enumerable: true,
      get: function get() {
        return _reverse.reversePatch;
      }
    });
    Object.defineProperty(exports, "structuredPatch", {
      enumerable: true,
      get: function get() {
        return _create.structuredPatch;
      }
    });
    Object.defineProperty(exports, "createTwoFilesPatch", {
      enumerable: true,
      get: function get() {
        return _create.createTwoFilesPatch;
      }
    });
    Object.defineProperty(exports, "createPatch", {
      enumerable: true,
      get: function get() {
        return _create.createPatch;
      }
    });
    Object.defineProperty(exports, "formatPatch", {
      enumerable: true,
      get: function get() {
        return _create.formatPatch;
      }
    });
    Object.defineProperty(exports, "convertChangesToDMP", {
      enumerable: true,
      get: function get() {
        return _dmp.convertChangesToDMP;
      }
    });
    Object.defineProperty(exports, "convertChangesToXML", {
      enumerable: true,
      get: function get() {
        return _xml.convertChangesToXML;
      }
    });
    var _base = _interopRequireDefault(require_base());
    var _character = require_character();
    var _word = require_word();
    var _line = require_line();
    var _sentence = require_sentence();
    var _css = require_css();
    var _json = require_json();
    var _array = require_array();
    var _apply = require_apply();
    var _parse = require_parse();
    var _merge = require_merge();
    var _reverse = require_reverse();
    var _create = require_create();
    var _dmp = require_dmp();
    var _xml = require_xml();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
  }
});

// resources/js/index.js
var Diff = require_lib();
var getStringsDifference = (str1, str2, method = "diffLines", options = {}) => {
  const result = Diff[method](str1, str2, options);
  return result.map((part) => {
    const color = part.added ? "green" : part.removed ? "red" : "grey";
    return `<span style="color: ${color}">${part.value}</span>`;
  }).join("");
};
window.getStringsDifference = getStringsDifference;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL2RpZmYvc3JjL2RpZmYvYmFzZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGlmZi9zcmMvZGlmZi9jaGFyYWN0ZXIuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RpZmYvc3JjL3V0aWwvcGFyYW1zLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kaWZmL3NyYy9kaWZmL3dvcmQuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RpZmYvc3JjL2RpZmYvbGluZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGlmZi9zcmMvZGlmZi9zZW50ZW5jZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGlmZi9zcmMvZGlmZi9jc3MuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RpZmYvc3JjL2RpZmYvanNvbi5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGlmZi9zcmMvZGlmZi9hcnJheS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGlmZi9zcmMvcGF0Y2gvcGFyc2UuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RpZmYvc3JjL3V0aWwvZGlzdGFuY2UtaXRlcmF0b3IuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RpZmYvc3JjL3BhdGNoL2FwcGx5LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kaWZmL3NyYy9wYXRjaC9jcmVhdGUuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RpZmYvc3JjL3V0aWwvYXJyYXkuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RpZmYvc3JjL3BhdGNoL21lcmdlLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kaWZmL3NyYy9wYXRjaC9yZXZlcnNlLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9kaWZmL3NyYy9jb252ZXJ0L2RtcC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvZGlmZi9zcmMvY29udmVydC94bWwuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2RpZmYvc3JjL2luZGV4LmpzIiwgIi4uL2pzL2luZGV4LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEaWZmKCkge31cblxuRGlmZi5wcm90b3R5cGUgPSB7XG4gIGRpZmYob2xkU3RyaW5nLCBuZXdTdHJpbmcsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2s7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBsZXQgc2VsZiA9IHRoaXM7XG5cbiAgICBmdW5jdGlvbiBkb25lKHZhbHVlKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2sodW5kZWZpbmVkLCB2YWx1ZSk7IH0sIDApO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBbGxvdyBzdWJjbGFzc2VzIHRvIG1hc3NhZ2UgdGhlIGlucHV0IHByaW9yIHRvIHJ1bm5pbmdcbiAgICBvbGRTdHJpbmcgPSB0aGlzLmNhc3RJbnB1dChvbGRTdHJpbmcpO1xuICAgIG5ld1N0cmluZyA9IHRoaXMuY2FzdElucHV0KG5ld1N0cmluZyk7XG5cbiAgICBvbGRTdHJpbmcgPSB0aGlzLnJlbW92ZUVtcHR5KHRoaXMudG9rZW5pemUob2xkU3RyaW5nKSk7XG4gICAgbmV3U3RyaW5nID0gdGhpcy5yZW1vdmVFbXB0eSh0aGlzLnRva2VuaXplKG5ld1N0cmluZykpO1xuXG4gICAgbGV0IG5ld0xlbiA9IG5ld1N0cmluZy5sZW5ndGgsIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGg7XG4gICAgbGV0IGVkaXRMZW5ndGggPSAxO1xuICAgIGxldCBtYXhFZGl0TGVuZ3RoID0gbmV3TGVuICsgb2xkTGVuO1xuICAgIGlmKG9wdGlvbnMubWF4RWRpdExlbmd0aCkge1xuICAgICAgbWF4RWRpdExlbmd0aCA9IE1hdGgubWluKG1heEVkaXRMZW5ndGgsIG9wdGlvbnMubWF4RWRpdExlbmd0aCk7XG4gICAgfVxuICAgIGNvbnN0IG1heEV4ZWN1dGlvblRpbWUgPSBvcHRpb25zLnRpbWVvdXQgPz8gSW5maW5pdHk7XG4gICAgY29uc3QgYWJvcnRBZnRlclRpbWVzdGFtcCA9IERhdGUubm93KCkgKyBtYXhFeGVjdXRpb25UaW1lO1xuXG4gICAgbGV0IGJlc3RQYXRoID0gW3sgb2xkUG9zOiAtMSwgbGFzdENvbXBvbmVudDogdW5kZWZpbmVkIH1dO1xuXG4gICAgLy8gU2VlZCBlZGl0TGVuZ3RoID0gMCwgaS5lLiB0aGUgY29udGVudCBzdGFydHMgd2l0aCB0aGUgc2FtZSB2YWx1ZXNcbiAgICBsZXQgbmV3UG9zID0gdGhpcy5leHRyYWN0Q29tbW9uKGJlc3RQYXRoWzBdLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgMCk7XG4gICAgaWYgKGJlc3RQYXRoWzBdLm9sZFBvcyArIDEgPj0gb2xkTGVuICYmIG5ld1BvcyArIDEgPj0gbmV3TGVuKSB7XG4gICAgICAvLyBJZGVudGl0eSBwZXIgdGhlIGVxdWFsaXR5IGFuZCB0b2tlbml6ZXJcbiAgICAgIHJldHVybiBkb25lKFt7dmFsdWU6IHRoaXMuam9pbihuZXdTdHJpbmcpLCBjb3VudDogbmV3U3RyaW5nLmxlbmd0aH1dKTtcbiAgICB9XG5cbiAgICAvLyBPbmNlIHdlIGhpdCB0aGUgcmlnaHQgZWRnZSBvZiB0aGUgZWRpdCBncmFwaCBvbiBzb21lIGRpYWdvbmFsIGssIHdlIGNhblxuICAgIC8vIGRlZmluaXRlbHkgcmVhY2ggdGhlIGVuZCBvZiB0aGUgZWRpdCBncmFwaCBpbiBubyBtb3JlIHRoYW4gayBlZGl0cywgc29cbiAgICAvLyB0aGVyZSdzIG5vIHBvaW50IGluIGNvbnNpZGVyaW5nIGFueSBtb3ZlcyB0byBkaWFnb25hbCBrKzEgYW55IG1vcmUgKGZyb21cbiAgICAvLyB3aGljaCB3ZSdyZSBndWFyYW50ZWVkIHRvIG5lZWQgYXQgbGVhc3QgaysxIG1vcmUgZWRpdHMpLlxuICAgIC8vIFNpbWlsYXJseSwgb25jZSB3ZSd2ZSByZWFjaGVkIHRoZSBib3R0b20gb2YgdGhlIGVkaXQgZ3JhcGgsIHRoZXJlJ3Mgbm9cbiAgICAvLyBwb2ludCBjb25zaWRlcmluZyBtb3ZlcyB0byBsb3dlciBkaWFnb25hbHMuXG4gICAgLy8gV2UgcmVjb3JkIHRoaXMgZmFjdCBieSBzZXR0aW5nIG1pbkRpYWdvbmFsVG9Db25zaWRlciBhbmRcbiAgICAvLyBtYXhEaWFnb25hbFRvQ29uc2lkZXIgdG8gc29tZSBmaW5pdGUgdmFsdWUgb25jZSB3ZSd2ZSBoaXQgdGhlIGVkZ2Ugb2ZcbiAgICAvLyB0aGUgZWRpdCBncmFwaC5cbiAgICAvLyBUaGlzIG9wdGltaXphdGlvbiBpcyBub3QgZmFpdGhmdWwgdG8gdGhlIG9yaWdpbmFsIGFsZ29yaXRobSBwcmVzZW50ZWQgaW5cbiAgICAvLyBNeWVycydzIHBhcGVyLCB3aGljaCBpbnN0ZWFkIHBvaW50bGVzc2x5IGV4dGVuZHMgRC1wYXRocyBvZmYgdGhlIGVuZCBvZlxuICAgIC8vIHRoZSBlZGl0IGdyYXBoIC0gc2VlIHBhZ2UgNyBvZiBNeWVycydzIHBhcGVyIHdoaWNoIG5vdGVzIHRoaXMgcG9pbnRcbiAgICAvLyBleHBsaWNpdGx5IGFuZCBpbGx1c3RyYXRlcyBpdCB3aXRoIGEgZGlhZ3JhbS4gVGhpcyBoYXMgbWFqb3IgcGVyZm9ybWFuY2VcbiAgICAvLyBpbXBsaWNhdGlvbnMgZm9yIHNvbWUgY29tbW9uIHNjZW5hcmlvcy4gRm9yIGluc3RhbmNlLCB0byBjb21wdXRlIGEgZGlmZlxuICAgIC8vIHdoZXJlIHRoZSBuZXcgdGV4dCBzaW1wbHkgYXBwZW5kcyBkIGNoYXJhY3RlcnMgb24gdGhlIGVuZCBvZiB0aGVcbiAgICAvLyBvcmlnaW5hbCB0ZXh0IG9mIGxlbmd0aCBuLCB0aGUgdHJ1ZSBNeWVycyBhbGdvcml0aG0gd2lsbCB0YWtlIE8obitkXjIpXG4gICAgLy8gdGltZSB3aGlsZSB0aGlzIG9wdGltaXphdGlvbiBuZWVkcyBvbmx5IE8obitkKSB0aW1lLlxuICAgIGxldCBtaW5EaWFnb25hbFRvQ29uc2lkZXIgPSAtSW5maW5pdHksIG1heERpYWdvbmFsVG9Db25zaWRlciA9IEluZmluaXR5O1xuXG4gICAgLy8gTWFpbiB3b3JrZXIgbWV0aG9kLiBjaGVja3MgYWxsIHBlcm11dGF0aW9ucyBvZiBhIGdpdmVuIGVkaXQgbGVuZ3RoIGZvciBhY2NlcHRhbmNlLlxuICAgIGZ1bmN0aW9uIGV4ZWNFZGl0TGVuZ3RoKCkge1xuICAgICAgZm9yIChcbiAgICAgICAgbGV0IGRpYWdvbmFsUGF0aCA9IE1hdGgubWF4KG1pbkRpYWdvbmFsVG9Db25zaWRlciwgLWVkaXRMZW5ndGgpO1xuICAgICAgICBkaWFnb25hbFBhdGggPD0gTWF0aC5taW4obWF4RGlhZ29uYWxUb0NvbnNpZGVyLCBlZGl0TGVuZ3RoKTtcbiAgICAgICAgZGlhZ29uYWxQYXRoICs9IDJcbiAgICAgICkge1xuICAgICAgICBsZXQgYmFzZVBhdGg7XG4gICAgICAgIGxldCByZW1vdmVQYXRoID0gYmVzdFBhdGhbZGlhZ29uYWxQYXRoIC0gMV0sXG4gICAgICAgICAgICBhZGRQYXRoID0gYmVzdFBhdGhbZGlhZ29uYWxQYXRoICsgMV07XG4gICAgICAgIGlmIChyZW1vdmVQYXRoKSB7XG4gICAgICAgICAgLy8gTm8gb25lIGVsc2UgaXMgZ29pbmcgdG8gYXR0ZW1wdCB0byB1c2UgdGhpcyB2YWx1ZSwgY2xlYXIgaXRcbiAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGggLSAxXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjYW5BZGQgPSBmYWxzZTtcbiAgICAgICAgaWYgKGFkZFBhdGgpIHtcbiAgICAgICAgICAvLyB3aGF0IG5ld1BvcyB3aWxsIGJlIGFmdGVyIHdlIGRvIGFuIGluc2VydGlvbjpcbiAgICAgICAgICBjb25zdCBhZGRQYXRoTmV3UG9zID0gYWRkUGF0aC5vbGRQb3MgLSBkaWFnb25hbFBhdGg7XG4gICAgICAgICAgY2FuQWRkID0gYWRkUGF0aCAmJiAwIDw9IGFkZFBhdGhOZXdQb3MgJiYgYWRkUGF0aE5ld1BvcyA8IG5ld0xlbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjYW5SZW1vdmUgPSByZW1vdmVQYXRoICYmIHJlbW92ZVBhdGgub2xkUG9zICsgMSA8IG9sZExlbjtcbiAgICAgICAgaWYgKCFjYW5BZGQgJiYgIWNhblJlbW92ZSkge1xuICAgICAgICAgIC8vIElmIHRoaXMgcGF0aCBpcyBhIHRlcm1pbmFsIHRoZW4gcHJ1bmVcbiAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGhdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VsZWN0IHRoZSBkaWFnb25hbCB0aGF0IHdlIHdhbnQgdG8gYnJhbmNoIGZyb20uIFdlIHNlbGVjdCB0aGUgcHJpb3JcbiAgICAgICAgLy8gcGF0aCB3aG9zZSBwb3NpdGlvbiBpbiB0aGUgb2xkIHN0cmluZyBpcyB0aGUgZmFydGhlc3QgZnJvbSB0aGUgb3JpZ2luXG4gICAgICAgIC8vIGFuZCBkb2VzIG5vdCBwYXNzIHRoZSBib3VuZHMgb2YgdGhlIGRpZmYgZ3JhcGhcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoZSBgKyAxYCBoZXJlIHRvIG1ha2UgYmVoYXZpb3IgbWF0Y2ggTXllcnMgYWxnb3JpdGhtXG4gICAgICAgIC8vICAgICAgIGFuZCBwcmVmZXIgdG8gb3JkZXIgcmVtb3ZhbHMgYmVmb3JlIGluc2VydGlvbnMuXG4gICAgICAgIGlmICghY2FuUmVtb3ZlIHx8IChjYW5BZGQgJiYgcmVtb3ZlUGF0aC5vbGRQb3MgKyAxIDwgYWRkUGF0aC5vbGRQb3MpKSB7XG4gICAgICAgICAgYmFzZVBhdGggPSBzZWxmLmFkZFRvUGF0aChhZGRQYXRoLCB0cnVlLCB1bmRlZmluZWQsIDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhc2VQYXRoID0gc2VsZi5hZGRUb1BhdGgocmVtb3ZlUGF0aCwgdW5kZWZpbmVkLCB0cnVlLCAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5ld1BvcyA9IHNlbGYuZXh0cmFjdENvbW1vbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCk7XG5cbiAgICAgICAgaWYgKGJhc2VQYXRoLm9sZFBvcyArIDEgPj0gb2xkTGVuICYmIG5ld1BvcyArIDEgPj0gbmV3TGVuKSB7XG4gICAgICAgICAgLy8gSWYgd2UgaGF2ZSBoaXQgdGhlIGVuZCBvZiBib3RoIHN0cmluZ3MsIHRoZW4gd2UgYXJlIGRvbmVcbiAgICAgICAgICByZXR1cm4gZG9uZShidWlsZFZhbHVlcyhzZWxmLCBiYXNlUGF0aC5sYXN0Q29tcG9uZW50LCBuZXdTdHJpbmcsIG9sZFN0cmluZywgc2VsZi51c2VMb25nZXN0VG9rZW4pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGhdID0gYmFzZVBhdGg7XG4gICAgICAgICAgaWYgKGJhc2VQYXRoLm9sZFBvcyArIDEgPj0gb2xkTGVuKSB7XG4gICAgICAgICAgICBtYXhEaWFnb25hbFRvQ29uc2lkZXIgPSBNYXRoLm1pbihtYXhEaWFnb25hbFRvQ29uc2lkZXIsIGRpYWdvbmFsUGF0aCAtIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAobmV3UG9zICsgMSA+PSBuZXdMZW4pIHtcbiAgICAgICAgICAgIG1pbkRpYWdvbmFsVG9Db25zaWRlciA9IE1hdGgubWF4KG1pbkRpYWdvbmFsVG9Db25zaWRlciwgZGlhZ29uYWxQYXRoICsgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVkaXRMZW5ndGgrKztcbiAgICB9XG5cbiAgICAvLyBQZXJmb3JtcyB0aGUgbGVuZ3RoIG9mIGVkaXQgaXRlcmF0aW9uLiBJcyBhIGJpdCBmdWdseSBhcyB0aGlzIGhhcyB0byBzdXBwb3J0IHRoZVxuICAgIC8vIHN5bmMgYW5kIGFzeW5jIG1vZGUgd2hpY2ggaXMgbmV2ZXIgZnVuLiBMb29wcyBvdmVyIGV4ZWNFZGl0TGVuZ3RoIHVudGlsIGEgdmFsdWVcbiAgICAvLyBpcyBwcm9kdWNlZCwgb3IgdW50aWwgdGhlIGVkaXQgbGVuZ3RoIGV4Y2VlZHMgb3B0aW9ucy5tYXhFZGl0TGVuZ3RoIChpZiBnaXZlbiksXG4gICAgLy8gaW4gd2hpY2ggY2FzZSBpdCB3aWxsIHJldHVybiB1bmRlZmluZWQuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAoZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoZWRpdExlbmd0aCA+IG1heEVkaXRMZW5ndGggfHwgRGF0ZS5ub3coKSA+IGFib3J0QWZ0ZXJUaW1lc3RhbXApIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZXhlY0VkaXRMZW5ndGgoKSkge1xuICAgICAgICAgICAgZXhlYygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9KCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAoZWRpdExlbmd0aCA8PSBtYXhFZGl0TGVuZ3RoICYmIERhdGUubm93KCkgPD0gYWJvcnRBZnRlclRpbWVzdGFtcCkge1xuICAgICAgICBsZXQgcmV0ID0gZXhlY0VkaXRMZW5ndGgoKTtcbiAgICAgICAgaWYgKHJldCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgYWRkVG9QYXRoKHBhdGgsIGFkZGVkLCByZW1vdmVkLCBvbGRQb3NJbmMpIHtcbiAgICBsZXQgbGFzdCA9IHBhdGgubGFzdENvbXBvbmVudDtcbiAgICBpZiAobGFzdCAmJiBsYXN0LmFkZGVkID09PSBhZGRlZCAmJiBsYXN0LnJlbW92ZWQgPT09IHJlbW92ZWQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG9sZFBvczogcGF0aC5vbGRQb3MgKyBvbGRQb3NJbmMsXG4gICAgICAgIGxhc3RDb21wb25lbnQ6IHtjb3VudDogbGFzdC5jb3VudCArIDEsIGFkZGVkOiBhZGRlZCwgcmVtb3ZlZDogcmVtb3ZlZCwgcHJldmlvdXNDb21wb25lbnQ6IGxhc3QucHJldmlvdXNDb21wb25lbnQgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb2xkUG9zOiBwYXRoLm9sZFBvcyArIG9sZFBvc0luYyxcbiAgICAgICAgbGFzdENvbXBvbmVudDoge2NvdW50OiAxLCBhZGRlZDogYWRkZWQsIHJlbW92ZWQ6IHJlbW92ZWQsIHByZXZpb3VzQ29tcG9uZW50OiBsYXN0IH1cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBleHRyYWN0Q29tbW9uKGJhc2VQYXRoLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgZGlhZ29uYWxQYXRoKSB7XG4gICAgbGV0IG5ld0xlbiA9IG5ld1N0cmluZy5sZW5ndGgsXG4gICAgICAgIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGgsXG4gICAgICAgIG9sZFBvcyA9IGJhc2VQYXRoLm9sZFBvcyxcbiAgICAgICAgbmV3UG9zID0gb2xkUG9zIC0gZGlhZ29uYWxQYXRoLFxuXG4gICAgICAgIGNvbW1vbkNvdW50ID0gMDtcbiAgICB3aGlsZSAobmV3UG9zICsgMSA8IG5ld0xlbiAmJiBvbGRQb3MgKyAxIDwgb2xkTGVuICYmIHRoaXMuZXF1YWxzKG5ld1N0cmluZ1tuZXdQb3MgKyAxXSwgb2xkU3RyaW5nW29sZFBvcyArIDFdKSkge1xuICAgICAgbmV3UG9zKys7XG4gICAgICBvbGRQb3MrKztcbiAgICAgIGNvbW1vbkNvdW50Kys7XG4gICAgfVxuXG4gICAgaWYgKGNvbW1vbkNvdW50KSB7XG4gICAgICBiYXNlUGF0aC5sYXN0Q29tcG9uZW50ID0ge2NvdW50OiBjb21tb25Db3VudCwgcHJldmlvdXNDb21wb25lbnQ6IGJhc2VQYXRoLmxhc3RDb21wb25lbnR9O1xuICAgIH1cblxuICAgIGJhc2VQYXRoLm9sZFBvcyA9IG9sZFBvcztcbiAgICByZXR1cm4gbmV3UG9zO1xuICB9LFxuXG4gIGVxdWFscyhsZWZ0LCByaWdodCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wYXJhdG9yKGxlZnQsIHJpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0XG4gICAgICAgIHx8ICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSAmJiBsZWZ0LnRvTG93ZXJDYXNlKCkgPT09IHJpZ2h0LnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlRW1wdHkoYXJyYXkpIHtcbiAgICBsZXQgcmV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFycmF5W2ldKSB7XG4gICAgICAgIHJldC5wdXNoKGFycmF5W2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgY2FzdElucHV0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICB0b2tlbml6ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCgnJyk7XG4gIH0sXG4gIGpvaW4oY2hhcnMpIHtcbiAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGJ1aWxkVmFsdWVzKGRpZmYsIGxhc3RDb21wb25lbnQsIG5ld1N0cmluZywgb2xkU3RyaW5nLCB1c2VMb25nZXN0VG9rZW4pIHtcbiAgLy8gRmlyc3Qgd2UgY29udmVydCBvdXIgbGlua2VkIGxpc3Qgb2YgY29tcG9uZW50cyBpbiByZXZlcnNlIG9yZGVyIHRvIGFuXG4gIC8vIGFycmF5IGluIHRoZSByaWdodCBvcmRlcjpcbiAgY29uc3QgY29tcG9uZW50cyA9IFtdO1xuICBsZXQgbmV4dENvbXBvbmVudDtcbiAgd2hpbGUgKGxhc3RDb21wb25lbnQpIHtcbiAgICBjb21wb25lbnRzLnB1c2gobGFzdENvbXBvbmVudCk7XG4gICAgbmV4dENvbXBvbmVudCA9IGxhc3RDb21wb25lbnQucHJldmlvdXNDb21wb25lbnQ7XG4gICAgZGVsZXRlIGxhc3RDb21wb25lbnQucHJldmlvdXNDb21wb25lbnQ7XG4gICAgbGFzdENvbXBvbmVudCA9IG5leHRDb21wb25lbnQ7XG4gIH1cbiAgY29tcG9uZW50cy5yZXZlcnNlKCk7XG5cbiAgbGV0IGNvbXBvbmVudFBvcyA9IDAsXG4gICAgICBjb21wb25lbnRMZW4gPSBjb21wb25lbnRzLmxlbmd0aCxcbiAgICAgIG5ld1BvcyA9IDAsXG4gICAgICBvbGRQb3MgPSAwO1xuXG4gIGZvciAoOyBjb21wb25lbnRQb3MgPCBjb21wb25lbnRMZW47IGNvbXBvbmVudFBvcysrKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICBpZiAoIWNvbXBvbmVudC5yZW1vdmVkKSB7XG4gICAgICBpZiAoIWNvbXBvbmVudC5hZGRlZCAmJiB1c2VMb25nZXN0VG9rZW4pIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KTtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoZnVuY3Rpb24odmFsdWUsIGkpIHtcbiAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBvbGRTdHJpbmdbb2xkUG9zICsgaV07XG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlLmxlbmd0aCA+IHZhbHVlLmxlbmd0aCA/IG9sZFZhbHVlIDogdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbih2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb25lbnQudmFsdWUgPSBkaWZmLmpvaW4obmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KSk7XG4gICAgICB9XG4gICAgICBuZXdQb3MgKz0gY29tcG9uZW50LmNvdW50O1xuXG4gICAgICAvLyBDb21tb24gY2FzZVxuICAgICAgaWYgKCFjb21wb25lbnQuYWRkZWQpIHtcbiAgICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKG9sZFN0cmluZy5zbGljZShvbGRQb3MsIG9sZFBvcyArIGNvbXBvbmVudC5jb3VudCkpO1xuICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcblxuICAgICAgLy8gUmV2ZXJzZSBhZGQgYW5kIHJlbW92ZSBzbyByZW1vdmVzIGFyZSBvdXRwdXQgZmlyc3QgdG8gbWF0Y2ggY29tbW9uIGNvbnZlbnRpb25cbiAgICAgIC8vIFRoZSBkaWZmaW5nIGFsZ29yaXRobSBpcyB0aWVkIHRvIGFkZCB0aGVuIHJlbW92ZSBvdXRwdXQgYW5kIHRoaXMgaXMgdGhlIHNpbXBsZXN0XG4gICAgICAvLyByb3V0ZSB0byBnZXQgdGhlIGRlc2lyZWQgb3V0cHV0IHdpdGggbWluaW1hbCBvdmVyaGVhZC5cbiAgICAgIGlmIChjb21wb25lbnRQb3MgJiYgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXS5hZGRlZCkge1xuICAgICAgICBsZXQgdG1wID0gY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXSA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3NdID0gdG1wO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFNwZWNpYWwgY2FzZSBoYW5kbGUgZm9yIHdoZW4gb25lIHRlcm1pbmFsIGlzIGlnbm9yZWQgKGkuZS4gd2hpdGVzcGFjZSkuXG4gIC8vIEZvciB0aGlzIGNhc2Ugd2UgbWVyZ2UgdGhlIHRlcm1pbmFsIGludG8gdGhlIHByaW9yIHN0cmluZyBhbmQgZHJvcCB0aGUgY2hhbmdlLlxuICAvLyBUaGlzIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBzdHJpbmcgbW9kZS5cbiAgbGV0IGZpbmFsQ29tcG9uZW50ID0gY29tcG9uZW50c1tjb21wb25lbnRMZW4gLSAxXTtcbiAgaWYgKGNvbXBvbmVudExlbiA+IDFcbiAgICAgICYmIHR5cGVvZiBmaW5hbENvbXBvbmVudC52YWx1ZSA9PT0gJ3N0cmluZydcbiAgICAgICYmIChmaW5hbENvbXBvbmVudC5hZGRlZCB8fCBmaW5hbENvbXBvbmVudC5yZW1vdmVkKVxuICAgICAgJiYgZGlmZi5lcXVhbHMoJycsIGZpbmFsQ29tcG9uZW50LnZhbHVlKSkge1xuICAgIGNvbXBvbmVudHNbY29tcG9uZW50TGVuIC0gMl0udmFsdWUgKz0gZmluYWxDb21wb25lbnQudmFsdWU7XG4gICAgY29tcG9uZW50cy5wb3AoKTtcbiAgfVxuXG4gIHJldHVybiBjb21wb25lbnRzO1xufVxuIiwgImltcG9ydCBEaWZmIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBjb25zdCBjaGFyYWN0ZXJEaWZmID0gbmV3IERpZmYoKTtcbmV4cG9ydCBmdW5jdGlvbiBkaWZmQ2hhcnMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpIHsgcmV0dXJuIGNoYXJhY3RlckRpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7IH1cbiIsICJleHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGRlZmF1bHRzLmNhbGxiYWNrID0gb3B0aW9ucztcbiAgfSBlbHNlIGlmIChvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgbmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgZGVmYXVsdHNbbmFtZV0gPSBvcHRpb25zW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGVmYXVsdHM7XG59XG4iLCAiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7Z2VuZXJhdGVPcHRpb25zfSBmcm9tICcuLi91dGlsL3BhcmFtcyc7XG5cbi8vIEJhc2VkIG9uIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xhdGluX3NjcmlwdF9pbl9Vbmljb2RlXG4vL1xuLy8gUmFuZ2VzIGFuZCBleGNlcHRpb25zOlxuLy8gTGF0aW4tMSBTdXBwbGVtZW50LCAwMDgw4oCTMDBGRlxuLy8gIC0gVSswMEQ3ICDDlyBNdWx0aXBsaWNhdGlvbiBzaWduXG4vLyAgLSBVKzAwRjcgIMO3IERpdmlzaW9uIHNpZ25cbi8vIExhdGluIEV4dGVuZGVkLUEsIDAxMDDigJMwMTdGXG4vLyBMYXRpbiBFeHRlbmRlZC1CLCAwMTgw4oCTMDI0RlxuLy8gSVBBIEV4dGVuc2lvbnMsIDAyNTDigJMwMkFGXG4vLyBTcGFjaW5nIE1vZGlmaWVyIExldHRlcnMsIDAyQjDigJMwMkZGXG4vLyAgLSBVKzAyQzcgIMuHICYjNzExOyAgQ2Fyb25cbi8vICAtIFUrMDJEOCAgy5ggJiM3Mjg7ICBCcmV2ZVxuLy8gIC0gVSswMkQ5ICDLmSAmIzcyOTsgIERvdCBBYm92ZVxuLy8gIC0gVSswMkRBICDLmiAmIzczMDsgIFJpbmcgQWJvdmVcbi8vICAtIFUrMDJEQiAgy5sgJiM3MzE7ICBPZ29uZWtcbi8vICAtIFUrMDJEQyAgy5wgJiM3MzI7ICBTbWFsbCBUaWxkZVxuLy8gIC0gVSswMkREICDLnSAmIzczMzsgIERvdWJsZSBBY3V0ZSBBY2NlbnRcbi8vIExhdGluIEV4dGVuZGVkIEFkZGl0aW9uYWwsIDFFMDDigJMxRUZGXG5jb25zdCBleHRlbmRlZFdvcmRDaGFycyA9IC9eW2EtekEtWlxcdXtDMH0tXFx1e0ZGfVxcdXtEOH0tXFx1e0Y2fVxcdXtGOH0tXFx1ezJDNn1cXHV7MkM4fS1cXHV7MkQ3fVxcdXsyREV9LVxcdXsyRkZ9XFx1ezFFMDB9LVxcdXsxRUZGfV0rJC91O1xuXG5jb25zdCByZVdoaXRlc3BhY2UgPSAvXFxTLztcblxuZXhwb3J0IGNvbnN0IHdvcmREaWZmID0gbmV3IERpZmYoKTtcbndvcmREaWZmLmVxdWFscyA9IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSkge1xuICAgIGxlZnQgPSBsZWZ0LnRvTG93ZXJDYXNlKCk7XG4gICAgcmlnaHQgPSByaWdodC50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIHJldHVybiBsZWZ0ID09PSByaWdodCB8fCAodGhpcy5vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgJiYgIXJlV2hpdGVzcGFjZS50ZXN0KGxlZnQpICYmICFyZVdoaXRlc3BhY2UudGVzdChyaWdodCkpO1xufTtcbndvcmREaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gQWxsIHdoaXRlc3BhY2Ugc3ltYm9scyBleGNlcHQgbmV3bGluZSBncm91cCBpbnRvIG9uZSB0b2tlbiwgZWFjaCBuZXdsaW5lIC0gaW4gc2VwYXJhdGUgdG9rZW5cbiAgbGV0IHRva2VucyA9IHZhbHVlLnNwbGl0KC8oW15cXFNcXHJcXG5dK3xbKClbXFxde30nXCJcXHJcXG5dfFxcYikvKTtcblxuICAvLyBKb2luIHRoZSBib3VuZGFyeSBzcGxpdHMgdGhhdCB3ZSBkbyBub3QgY29uc2lkZXIgdG8gYmUgYm91bmRhcmllcy4gVGhpcyBpcyBwcmltYXJpbHkgdGhlIGV4dGVuZGVkIExhdGluIGNoYXJhY3RlciBzZXQuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIC8vIElmIHdlIGhhdmUgYW4gZW1wdHkgc3RyaW5nIGluIHRoZSBuZXh0IGZpZWxkIGFuZCB3ZSBoYXZlIG9ubHkgd29yZCBjaGFycyBiZWZvcmUgYW5kIGFmdGVyLCBtZXJnZVxuICAgIGlmICghdG9rZW5zW2kgKyAxXSAmJiB0b2tlbnNbaSArIDJdXG4gICAgICAgICAgJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaV0pXG4gICAgICAgICAgJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaSArIDJdKSkge1xuICAgICAgdG9rZW5zW2ldICs9IHRva2Vuc1tpICsgMl07XG4gICAgICB0b2tlbnMuc3BsaWNlKGkgKyAxLCAyKTtcbiAgICAgIGktLTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG9rZW5zO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZXb3JkcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIHtpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gIHJldHVybiB3b3JkRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZXb3Jkc1dpdGhTcGFjZShvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICByZXR1cm4gd29yZERpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG4iLCAiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7Z2VuZXJhdGVPcHRpb25zfSBmcm9tICcuLi91dGlsL3BhcmFtcyc7XG5cbmV4cG9ydCBjb25zdCBsaW5lRGlmZiA9IG5ldyBEaWZmKCk7XG5saW5lRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGlmKHRoaXMub3B0aW9ucy5zdHJpcFRyYWlsaW5nQ3IpIHtcbiAgICAvLyByZW1vdmUgb25lIFxcciBiZWZvcmUgXFxuIHRvIG1hdGNoIEdOVSBkaWZmJ3MgLS1zdHJpcC10cmFpbGluZy1jciBiZWhhdmlvclxuICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgfVxuXG4gIGxldCByZXRMaW5lcyA9IFtdLFxuICAgICAgbGluZXNBbmROZXdsaW5lcyA9IHZhbHVlLnNwbGl0KC8oXFxufFxcclxcbikvKTtcblxuICAvLyBJZ25vcmUgdGhlIGZpbmFsIGVtcHR5IHRva2VuIHRoYXQgb2NjdXJzIGlmIHRoZSBzdHJpbmcgZW5kcyB3aXRoIGEgbmV3IGxpbmVcbiAgaWYgKCFsaW5lc0FuZE5ld2xpbmVzW2xpbmVzQW5kTmV3bGluZXMubGVuZ3RoIC0gMV0pIHtcbiAgICBsaW5lc0FuZE5ld2xpbmVzLnBvcCgpO1xuICB9XG5cbiAgLy8gTWVyZ2UgdGhlIGNvbnRlbnQgYW5kIGxpbmUgc2VwYXJhdG9ycyBpbnRvIHNpbmdsZSB0b2tlbnNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lc0FuZE5ld2xpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGxpbmUgPSBsaW5lc0FuZE5ld2xpbmVzW2ldO1xuXG4gICAgaWYgKGkgJSAyICYmICF0aGlzLm9wdGlvbnMubmV3bGluZUlzVG9rZW4pIHtcbiAgICAgIHJldExpbmVzW3JldExpbmVzLmxlbmd0aCAtIDFdICs9IGxpbmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSkge1xuICAgICAgICBsaW5lID0gbGluZS50cmltKCk7XG4gICAgICB9XG4gICAgICByZXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXRMaW5lcztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7IHJldHVybiBsaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7IH1cbmV4cG9ydCBmdW5jdGlvbiBkaWZmVHJpbW1lZExpbmVzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICBsZXQgb3B0aW9ucyA9IGdlbmVyYXRlT3B0aW9ucyhjYWxsYmFjaywge2lnbm9yZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuIiwgImltcG9ydCBEaWZmIGZyb20gJy4vYmFzZSc7XG5cblxuZXhwb3J0IGNvbnN0IHNlbnRlbmNlRGlmZiA9IG5ldyBEaWZmKCk7XG5zZW50ZW5jZURpZmYudG9rZW5pemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc3BsaXQoLyhcXFMuKz9bLiE/XSkoPz1cXHMrfCQpLyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZlNlbnRlbmNlcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHsgcmV0dXJuIHNlbnRlbmNlRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7IH1cbiIsICJpbXBvcnQgRGlmZiBmcm9tICcuL2Jhc2UnO1xuXG5leHBvcnQgY29uc3QgY3NzRGlmZiA9IG5ldyBEaWZmKCk7XG5jc3NEaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnNwbGl0KC8oW3t9OjssXXxcXHMrKS8pO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZDc3Mob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7IHJldHVybiBjc3NEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTsgfVxuIiwgImltcG9ydCBEaWZmIGZyb20gJy4vYmFzZSc7XG5pbXBvcnQge2xpbmVEaWZmfSBmcm9tICcuL2xpbmUnO1xuXG5jb25zdCBvYmplY3RQcm90b3R5cGVUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG5cblxuZXhwb3J0IGNvbnN0IGpzb25EaWZmID0gbmV3IERpZmYoKTtcbi8vIERpc2NyaW1pbmF0ZSBiZXR3ZWVuIHR3byBsaW5lcyBvZiBwcmV0dHktcHJpbnRlZCwgc2VyaWFsaXplZCBKU09OIHdoZXJlIG9uZSBvZiB0aGVtIGhhcyBhXG4vLyBkYW5nbGluZyBjb21tYSBhbmQgdGhlIG90aGVyIGRvZXNuJ3QuIFR1cm5zIG91dCBpbmNsdWRpbmcgdGhlIGRhbmdsaW5nIGNvbW1hIHlpZWxkcyB0aGUgbmljZXN0IG91dHB1dDpcbmpzb25EaWZmLnVzZUxvbmdlc3RUb2tlbiA9IHRydWU7XG5cbmpzb25EaWZmLnRva2VuaXplID0gbGluZURpZmYudG9rZW5pemU7XG5qc29uRGlmZi5jYXN0SW5wdXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICBjb25zdCB7dW5kZWZpbmVkUmVwbGFjZW1lbnQsIHN0cmluZ2lmeVJlcGxhY2VyID0gKGssIHYpID0+IHR5cGVvZiB2ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZFJlcGxhY2VtZW50IDogdn0gPSB0aGlzLm9wdGlvbnM7XG5cbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgPyB2YWx1ZSA6IEpTT04uc3RyaW5naWZ5KGNhbm9uaWNhbGl6ZSh2YWx1ZSwgbnVsbCwgbnVsbCwgc3RyaW5naWZ5UmVwbGFjZXIpLCBzdHJpbmdpZnlSZXBsYWNlciwgJyAgJyk7XG59O1xuanNvbkRpZmYuZXF1YWxzID0gZnVuY3Rpb24obGVmdCwgcmlnaHQpIHtcbiAgcmV0dXJuIERpZmYucHJvdG90eXBlLmVxdWFscy5jYWxsKGpzb25EaWZmLCBsZWZ0LnJlcGxhY2UoLywoW1xcclxcbl0pL2csICckMScpLCByaWdodC5yZXBsYWNlKC8sKFtcXHJcXG5dKS9nLCAnJDEnKSk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZkpzb24ob2xkT2JqLCBuZXdPYmosIG9wdGlvbnMpIHsgcmV0dXJuIGpzb25EaWZmLmRpZmYob2xkT2JqLCBuZXdPYmosIG9wdGlvbnMpOyB9XG5cbi8vIFRoaXMgZnVuY3Rpb24gaGFuZGxlcyB0aGUgcHJlc2VuY2Ugb2YgY2lyY3VsYXIgcmVmZXJlbmNlcyBieSBiYWlsaW5nIG91dCB3aGVuIGVuY291bnRlcmluZyBhblxuLy8gb2JqZWN0IHRoYXQgaXMgYWxyZWFkeSBvbiB0aGUgXCJzdGFja1wiIG9mIGl0ZW1zIGJlaW5nIHByb2Nlc3NlZC4gQWNjZXB0cyBhbiBvcHRpb25hbCByZXBsYWNlclxuZXhwb3J0IGZ1bmN0aW9uIGNhbm9uaWNhbGl6ZShvYmosIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KSB7XG4gIHN0YWNrID0gc3RhY2sgfHwgW107XG4gIHJlcGxhY2VtZW50U3RhY2sgPSByZXBsYWNlbWVudFN0YWNrIHx8IFtdO1xuXG4gIGlmIChyZXBsYWNlcikge1xuICAgIG9iaiA9IHJlcGxhY2VyKGtleSwgb2JqKTtcbiAgfVxuXG4gIGxldCBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChzdGFja1tpXSA9PT0gb2JqKSB7XG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRTdGFja1tpXTtcbiAgICB9XG4gIH1cblxuICBsZXQgY2Fub25pY2FsaXplZE9iajtcblxuICBpZiAoJ1tvYmplY3QgQXJyYXldJyA9PT0gb2JqZWN0UHJvdG90eXBlVG9TdHJpbmcuY2FsbChvYmopKSB7XG4gICAgc3RhY2sucHVzaChvYmopO1xuICAgIGNhbm9uaWNhbGl6ZWRPYmogPSBuZXcgQXJyYXkob2JqLmxlbmd0aCk7XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuICAgIGZvciAoaSA9IDA7IGkgPCBvYmoubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNhbm9uaWNhbGl6ZWRPYmpbaV0gPSBjYW5vbmljYWxpemUob2JqW2ldLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIGtleSk7XG4gICAgfVxuICAgIHN0YWNrLnBvcCgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucG9wKCk7XG4gICAgcmV0dXJuIGNhbm9uaWNhbGl6ZWRPYmo7XG4gIH1cblxuICBpZiAob2JqICYmIG9iai50b0pTT04pIHtcbiAgICBvYmogPSBvYmoudG9KU09OKCk7XG4gIH1cblxuICBpZiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgb2JqICE9PSBudWxsKSB7XG4gICAgc3RhY2sucHVzaChvYmopO1xuICAgIGNhbm9uaWNhbGl6ZWRPYmogPSB7fTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnB1c2goY2Fub25pY2FsaXplZE9iaik7XG4gICAgbGV0IHNvcnRlZEtleXMgPSBbXSxcbiAgICAgICAga2V5O1xuICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBzb3J0ZWRLZXlzLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgc29ydGVkS2V5cy5zb3J0KCk7XG4gICAgZm9yIChpID0gMDsgaSA8IHNvcnRlZEtleXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGtleSA9IHNvcnRlZEtleXNbaV07XG4gICAgICBjYW5vbmljYWxpemVkT2JqW2tleV0gPSBjYW5vbmljYWxpemUob2JqW2tleV0sIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KTtcbiAgICB9XG4gICAgc3RhY2sucG9wKCk7XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBjYW5vbmljYWxpemVkT2JqID0gb2JqO1xuICB9XG4gIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xufVxuIiwgImltcG9ydCBEaWZmIGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBjb25zdCBhcnJheURpZmYgPSBuZXcgRGlmZigpO1xuYXJyYXlEaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnNsaWNlKCk7XG59O1xuYXJyYXlEaWZmLmpvaW4gPSBhcnJheURpZmYucmVtb3ZlRW1wdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZkFycmF5cyhvbGRBcnIsIG5ld0FyciwgY2FsbGJhY2spIHsgcmV0dXJuIGFycmF5RGlmZi5kaWZmKG9sZEFyciwgbmV3QXJyLCBjYWxsYmFjayk7IH1cbiIsICJleHBvcnQgZnVuY3Rpb24gcGFyc2VQYXRjaCh1bmlEaWZmLCBvcHRpb25zID0ge30pIHtcbiAgbGV0IGRpZmZzdHIgPSB1bmlEaWZmLnNwbGl0KC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS8pLFxuICAgICAgZGVsaW1pdGVycyA9IHVuaURpZmYubWF0Y2goL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdL2cpIHx8IFtdLFxuICAgICAgbGlzdCA9IFtdLFxuICAgICAgaSA9IDA7XG5cbiAgZnVuY3Rpb24gcGFyc2VJbmRleCgpIHtcbiAgICBsZXQgaW5kZXggPSB7fTtcbiAgICBsaXN0LnB1c2goaW5kZXgpO1xuXG4gICAgLy8gUGFyc2UgZGlmZiBtZXRhZGF0YVxuICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgIGxldCBsaW5lID0gZGlmZnN0cltpXTtcblxuICAgICAgLy8gRmlsZSBoZWFkZXIgZm91bmQsIGVuZCBwYXJzaW5nIGRpZmYgbWV0YWRhdGFcbiAgICAgIGlmICgoL14oXFwtXFwtXFwtfFxcK1xcK1xcK3xAQClcXHMvKS50ZXN0KGxpbmUpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBEaWZmIGluZGV4XG4gICAgICBsZXQgaGVhZGVyID0gKC9eKD86SW5kZXg6fGRpZmYoPzogLXIgXFx3KykrKVxccysoLis/KVxccyokLykuZXhlYyhsaW5lKTtcbiAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgaW5kZXguaW5kZXggPSBoZWFkZXJbMV07XG4gICAgICB9XG5cbiAgICAgIGkrKztcbiAgICB9XG5cbiAgICAvLyBQYXJzZSBmaWxlIGhlYWRlcnMgaWYgdGhleSBhcmUgZGVmaW5lZC4gVW5pZmllZCBkaWZmIHJlcXVpcmVzIHRoZW0sIGJ1dFxuICAgIC8vIHRoZXJlJ3Mgbm8gdGVjaG5pY2FsIGlzc3VlcyB0byBoYXZlIGFuIGlzb2xhdGVkIGh1bmsgd2l0aG91dCBmaWxlIGhlYWRlclxuICAgIHBhcnNlRmlsZUhlYWRlcihpbmRleCk7XG4gICAgcGFyc2VGaWxlSGVhZGVyKGluZGV4KTtcblxuICAgIC8vIFBhcnNlIGh1bmtzXG4gICAgaW5kZXguaHVua3MgPSBbXTtcblxuICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgIGxldCBsaW5lID0gZGlmZnN0cltpXTtcblxuICAgICAgaWYgKCgvXihJbmRleDp8ZGlmZnxcXC1cXC1cXC18XFwrXFwrXFwrKVxccy8pLnRlc3QobGluZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKCgvXkBALykudGVzdChsaW5lKSkge1xuICAgICAgICBpbmRleC5odW5rcy5wdXNoKHBhcnNlSHVuaygpKTtcbiAgICAgIH0gZWxzZSBpZiAobGluZSAmJiBvcHRpb25zLnN0cmljdCkge1xuICAgICAgICAvLyBJZ25vcmUgdW5leHBlY3RlZCBjb250ZW50IHVubGVzcyBpbiBzdHJpY3QgbW9kZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGluZSAnICsgKGkgKyAxKSArICcgJyArIEpTT04uc3RyaW5naWZ5KGxpbmUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBQYXJzZXMgdGhlIC0tLSBhbmQgKysrIGhlYWRlcnMsIGlmIG5vbmUgYXJlIGZvdW5kLCBubyBsaW5lc1xuICAvLyBhcmUgY29uc3VtZWQuXG4gIGZ1bmN0aW9uIHBhcnNlRmlsZUhlYWRlcihpbmRleCkge1xuICAgIGNvbnN0IGZpbGVIZWFkZXIgPSAoL14oLS0tfFxcK1xcK1xcKylcXHMrKC4qKSQvKS5leGVjKGRpZmZzdHJbaV0pO1xuICAgIGlmIChmaWxlSGVhZGVyKSB7XG4gICAgICBsZXQga2V5UHJlZml4ID0gZmlsZUhlYWRlclsxXSA9PT0gJy0tLScgPyAnb2xkJyA6ICduZXcnO1xuICAgICAgY29uc3QgZGF0YSA9IGZpbGVIZWFkZXJbMl0uc3BsaXQoJ1xcdCcsIDIpO1xuICAgICAgbGV0IGZpbGVOYW1lID0gZGF0YVswXS5yZXBsYWNlKC9cXFxcXFxcXC9nLCAnXFxcXCcpO1xuICAgICAgaWYgKCgvXlwiLipcIiQvKS50ZXN0KGZpbGVOYW1lKSkge1xuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cigxLCBmaWxlTmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIH1cbiAgICAgIGluZGV4W2tleVByZWZpeCArICdGaWxlTmFtZSddID0gZmlsZU5hbWU7XG4gICAgICBpbmRleFtrZXlQcmVmaXggKyAnSGVhZGVyJ10gPSAoZGF0YVsxXSB8fCAnJykudHJpbSgpO1xuXG4gICAgICBpKys7XG4gICAgfVxuICB9XG5cbiAgLy8gUGFyc2VzIGEgaHVua1xuICAvLyBUaGlzIGFzc3VtZXMgdGhhdCB3ZSBhcmUgYXQgdGhlIHN0YXJ0IG9mIGEgaHVuay5cbiAgZnVuY3Rpb24gcGFyc2VIdW5rKCkge1xuICAgIGxldCBjaHVua0hlYWRlckluZGV4ID0gaSxcbiAgICAgICAgY2h1bmtIZWFkZXJMaW5lID0gZGlmZnN0cltpKytdLFxuICAgICAgICBjaHVua0hlYWRlciA9IGNodW5rSGVhZGVyTGluZS5zcGxpdCgvQEAgLShcXGQrKSg/OiwoXFxkKykpPyBcXCsoXFxkKykoPzosKFxcZCspKT8gQEAvKTtcblxuICAgIGxldCBodW5rID0ge1xuICAgICAgb2xkU3RhcnQ6ICtjaHVua0hlYWRlclsxXSxcbiAgICAgIG9sZExpbmVzOiB0eXBlb2YgY2h1bmtIZWFkZXJbMl0gPT09ICd1bmRlZmluZWQnID8gMSA6ICtjaHVua0hlYWRlclsyXSxcbiAgICAgIG5ld1N0YXJ0OiArY2h1bmtIZWFkZXJbM10sXG4gICAgICBuZXdMaW5lczogdHlwZW9mIGNodW5rSGVhZGVyWzRdID09PSAndW5kZWZpbmVkJyA/IDEgOiArY2h1bmtIZWFkZXJbNF0sXG4gICAgICBsaW5lczogW10sXG4gICAgICBsaW5lZGVsaW1pdGVyczogW11cbiAgICB9O1xuXG4gICAgLy8gVW5pZmllZCBEaWZmIEZvcm1hdCBxdWlyazogSWYgdGhlIGNodW5rIHNpemUgaXMgMCxcbiAgICAvLyB0aGUgZmlyc3QgbnVtYmVyIGlzIG9uZSBsb3dlciB0aGFuIG9uZSB3b3VsZCBleHBlY3QuXG4gICAgLy8gaHR0cHM6Ly93d3cuYXJ0aW1hLmNvbS93ZWJsb2dzL3ZpZXdwb3N0LmpzcD90aHJlYWQ9MTY0MjkzXG4gICAgaWYgKGh1bmsub2xkTGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsub2xkU3RhcnQgKz0gMTtcbiAgICB9XG4gICAgaWYgKGh1bmsubmV3TGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsubmV3U3RhcnQgKz0gMTtcbiAgICB9XG5cbiAgICBsZXQgYWRkQ291bnQgPSAwLFxuICAgICAgICByZW1vdmVDb3VudCA9IDA7XG4gICAgZm9yICg7IGkgPCBkaWZmc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBMaW5lcyBzdGFydGluZyB3aXRoICctLS0nIGNvdWxkIGJlIG1pc3Rha2VuIGZvciB0aGUgXCJyZW1vdmUgbGluZVwiIG9wZXJhdGlvblxuICAgICAgLy8gQnV0IHRoZXkgY291bGQgYmUgdGhlIGhlYWRlciBmb3IgdGhlIG5leHQgZmlsZS4gVGhlcmVmb3JlIHBydW5lIHN1Y2ggY2FzZXMgb3V0LlxuICAgICAgaWYgKGRpZmZzdHJbaV0uaW5kZXhPZignLS0tICcpID09PSAwXG4gICAgICAgICAgICAmJiAoaSArIDIgPCBkaWZmc3RyLmxlbmd0aClcbiAgICAgICAgICAgICYmIGRpZmZzdHJbaSArIDFdLmluZGV4T2YoJysrKyAnKSA9PT0gMFxuICAgICAgICAgICAgJiYgZGlmZnN0cltpICsgMl0uaW5kZXhPZignQEAnKSA9PT0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGV0IG9wZXJhdGlvbiA9IChkaWZmc3RyW2ldLmxlbmd0aCA9PSAwICYmIGkgIT0gKGRpZmZzdHIubGVuZ3RoIC0gMSkpID8gJyAnIDogZGlmZnN0cltpXVswXTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJysnIHx8IG9wZXJhdGlvbiA9PT0gJy0nIHx8IG9wZXJhdGlvbiA9PT0gJyAnIHx8IG9wZXJhdGlvbiA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIGh1bmsubGluZXMucHVzaChkaWZmc3RyW2ldKTtcbiAgICAgICAgaHVuay5saW5lZGVsaW1pdGVycy5wdXNoKGRlbGltaXRlcnNbaV0gfHwgJ1xcbicpO1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICAgIGFkZENvdW50Kys7XG4gICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgICByZW1vdmVDb3VudCsrO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJyAnKSB7XG4gICAgICAgICAgYWRkQ291bnQrKztcbiAgICAgICAgICByZW1vdmVDb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgdGhlIGVtcHR5IGJsb2NrIGNvdW50IGNhc2VcbiAgICBpZiAoIWFkZENvdW50ICYmIGh1bmsubmV3TGluZXMgPT09IDEpIHtcbiAgICAgIGh1bmsubmV3TGluZXMgPSAwO1xuICAgIH1cbiAgICBpZiAoIXJlbW92ZUNvdW50ICYmIGh1bmsub2xkTGluZXMgPT09IDEpIHtcbiAgICAgIGh1bmsub2xkTGluZXMgPSAwO1xuICAgIH1cblxuICAgIC8vIFBlcmZvcm0gb3B0aW9uYWwgc2FuaXR5IGNoZWNraW5nXG4gICAgaWYgKG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICBpZiAoYWRkQ291bnQgIT09IGh1bmsubmV3TGluZXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBZGRlZCBsaW5lIGNvdW50IGRpZCBub3QgbWF0Y2ggZm9yIGh1bmsgYXQgbGluZSAnICsgKGNodW5rSGVhZGVySW5kZXggKyAxKSk7XG4gICAgICB9XG4gICAgICBpZiAocmVtb3ZlQ291bnQgIT09IGh1bmsub2xkTGluZXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZW1vdmVkIGxpbmUgY291bnQgZGlkIG5vdCBtYXRjaCBmb3IgaHVuayBhdCBsaW5lICcgKyAoY2h1bmtIZWFkZXJJbmRleCArIDEpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaHVuaztcbiAgfVxuXG4gIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICBwYXJzZUluZGV4KCk7XG4gIH1cblxuICByZXR1cm4gbGlzdDtcbn1cbiIsICIvLyBJdGVyYXRvciB0aGF0IHRyYXZlcnNlcyBpbiB0aGUgcmFuZ2Ugb2YgW21pbiwgbWF4XSwgc3RlcHBpbmdcbi8vIGJ5IGRpc3RhbmNlIGZyb20gYSBnaXZlbiBzdGFydCBwb3NpdGlvbi4gSS5lLiBmb3IgWzAsIDRdLCB3aXRoXG4vLyBzdGFydCBvZiAyLCB0aGlzIHdpbGwgaXRlcmF0ZSAyLCAzLCAxLCA0LCAwLlxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oc3RhcnQsIG1pbkxpbmUsIG1heExpbmUpIHtcbiAgbGV0IHdhbnRGb3J3YXJkID0gdHJ1ZSxcbiAgICAgIGJhY2t3YXJkRXhoYXVzdGVkID0gZmFsc2UsXG4gICAgICBmb3J3YXJkRXhoYXVzdGVkID0gZmFsc2UsXG4gICAgICBsb2NhbE9mZnNldCA9IDE7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGl0ZXJhdG9yKCkge1xuICAgIGlmICh3YW50Rm9yd2FyZCAmJiAhZm9yd2FyZEV4aGF1c3RlZCkge1xuICAgICAgaWYgKGJhY2t3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIGxvY2FsT2Zmc2V0Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3YW50Rm9yd2FyZCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpZiB0cnlpbmcgdG8gZml0IGJleW9uZCB0ZXh0IGxlbmd0aCwgYW5kIGlmIG5vdCwgY2hlY2sgaXQgZml0c1xuICAgICAgLy8gYWZ0ZXIgb2Zmc2V0IGxvY2F0aW9uIChvciBkZXNpcmVkIGxvY2F0aW9uIG9uIGZpcnN0IGl0ZXJhdGlvbilcbiAgICAgIGlmIChzdGFydCArIGxvY2FsT2Zmc2V0IDw9IG1heExpbmUpIHtcbiAgICAgICAgcmV0dXJuIGxvY2FsT2Zmc2V0O1xuICAgICAgfVxuXG4gICAgICBmb3J3YXJkRXhoYXVzdGVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWJhY2t3YXJkRXhoYXVzdGVkKSB7XG4gICAgICBpZiAoIWZvcndhcmRFeGhhdXN0ZWQpIHtcbiAgICAgICAgd2FudEZvcndhcmQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBpZiB0cnlpbmcgdG8gZml0IGJlZm9yZSB0ZXh0IGJlZ2lubmluZywgYW5kIGlmIG5vdCwgY2hlY2sgaXQgZml0c1xuICAgICAgLy8gYmVmb3JlIG9mZnNldCBsb2NhdGlvblxuICAgICAgaWYgKG1pbkxpbmUgPD0gc3RhcnQgLSBsb2NhbE9mZnNldCkge1xuICAgICAgICByZXR1cm4gLWxvY2FsT2Zmc2V0Kys7XG4gICAgICB9XG5cbiAgICAgIGJhY2t3YXJkRXhoYXVzdGVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBpdGVyYXRvcigpO1xuICAgIH1cblxuICAgIC8vIFdlIHRyaWVkIHRvIGZpdCBodW5rIGJlZm9yZSB0ZXh0IGJlZ2lubmluZyBhbmQgYmV5b25kIHRleHQgbGVuZ3RoLCB0aGVuXG4gICAgLy8gaHVuayBjYW4ndCBmaXQgb24gdGhlIHRleHQuIFJldHVybiB1bmRlZmluZWRcbiAgfTtcbn1cbiIsICJpbXBvcnQge3BhcnNlUGF0Y2h9IGZyb20gJy4vcGFyc2UnO1xuaW1wb3J0IGRpc3RhbmNlSXRlcmF0b3IgZnJvbSAnLi4vdXRpbC9kaXN0YW5jZS1pdGVyYXRvcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBhdGNoKHNvdXJjZSwgdW5pRGlmZiwgb3B0aW9ucyA9IHt9KSB7XG4gIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KHVuaURpZmYpKSB7XG4gICAgaWYgKHVuaURpZmYubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhcHBseVBhdGNoIG9ubHkgd29ya3Mgd2l0aCBhIHNpbmdsZSBpbnB1dC4nKTtcbiAgICB9XG5cbiAgICB1bmlEaWZmID0gdW5pRGlmZlswXTtcbiAgfVxuXG4gIC8vIEFwcGx5IHRoZSBkaWZmIHRvIHRoZSBpbnB1dFxuICBsZXQgbGluZXMgPSBzb3VyY2Uuc3BsaXQoL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdLyksXG4gICAgICBkZWxpbWl0ZXJzID0gc291cmNlLm1hdGNoKC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS9nKSB8fCBbXSxcbiAgICAgIGh1bmtzID0gdW5pRGlmZi5odW5rcyxcblxuICAgICAgY29tcGFyZUxpbmUgPSBvcHRpb25zLmNvbXBhcmVMaW5lIHx8ICgobGluZU51bWJlciwgbGluZSwgb3BlcmF0aW9uLCBwYXRjaENvbnRlbnQpID0+IGxpbmUgPT09IHBhdGNoQ29udGVudCksXG4gICAgICBlcnJvckNvdW50ID0gMCxcbiAgICAgIGZ1enpGYWN0b3IgPSBvcHRpb25zLmZ1enpGYWN0b3IgfHwgMCxcbiAgICAgIG1pbkxpbmUgPSAwLFxuICAgICAgb2Zmc2V0ID0gMCxcblxuICAgICAgcmVtb3ZlRU9GTkwsXG4gICAgICBhZGRFT0ZOTDtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSBodW5rIGV4YWN0bHkgZml0cyBvbiB0aGUgcHJvdmlkZWQgbG9jYXRpb25cbiAgICovXG4gIGZ1bmN0aW9uIGh1bmtGaXRzKGh1bmssIHRvUG9zKSB7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBodW5rLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBsZXQgbGluZSA9IGh1bmsubGluZXNbal0sXG4gICAgICAgICAgb3BlcmF0aW9uID0gKGxpbmUubGVuZ3RoID4gMCA/IGxpbmVbMF0gOiAnICcpLFxuICAgICAgICAgIGNvbnRlbnQgPSAobGluZS5sZW5ndGggPiAwID8gbGluZS5zdWJzdHIoMSkgOiBsaW5lKTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJyAnIHx8IG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgIC8vIENvbnRleHQgc2FuaXR5IGNoZWNrXG4gICAgICAgIGlmICghY29tcGFyZUxpbmUodG9Qb3MgKyAxLCBsaW5lc1t0b1Bvc10sIG9wZXJhdGlvbiwgY29udGVudCkpIHtcbiAgICAgICAgICBlcnJvckNvdW50Kys7XG5cbiAgICAgICAgICBpZiAoZXJyb3JDb3VudCA+IGZ1enpGYWN0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdG9Qb3MrKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIFNlYXJjaCBiZXN0IGZpdCBvZmZzZXRzIGZvciBlYWNoIGh1bmsgYmFzZWQgb24gdGhlIHByZXZpb3VzIG9uZXNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBodW5rcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBodW5rID0gaHVua3NbaV0sXG4gICAgICAgIG1heExpbmUgPSBsaW5lcy5sZW5ndGggLSBodW5rLm9sZExpbmVzLFxuICAgICAgICBsb2NhbE9mZnNldCA9IDAsXG4gICAgICAgIHRvUG9zID0gb2Zmc2V0ICsgaHVuay5vbGRTdGFydCAtIDE7XG5cbiAgICBsZXQgaXRlcmF0b3IgPSBkaXN0YW5jZUl0ZXJhdG9yKHRvUG9zLCBtaW5MaW5lLCBtYXhMaW5lKTtcblxuICAgIGZvciAoOyBsb2NhbE9mZnNldCAhPT0gdW5kZWZpbmVkOyBsb2NhbE9mZnNldCA9IGl0ZXJhdG9yKCkpIHtcbiAgICAgIGlmIChodW5rRml0cyhodW5rLCB0b1BvcyArIGxvY2FsT2Zmc2V0KSkge1xuICAgICAgICBodW5rLm9mZnNldCA9IG9mZnNldCArPSBsb2NhbE9mZnNldDtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGxvY2FsT2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBTZXQgbG93ZXIgdGV4dCBsaW1pdCB0byBlbmQgb2YgdGhlIGN1cnJlbnQgaHVuaywgc28gbmV4dCBvbmVzIGRvbid0IHRyeVxuICAgIC8vIHRvIGZpdCBvdmVyIGFscmVhZHkgcGF0Y2hlZCB0ZXh0XG4gICAgbWluTGluZSA9IGh1bmsub2Zmc2V0ICsgaHVuay5vbGRTdGFydCArIGh1bmsub2xkTGluZXM7XG4gIH1cblxuICAvLyBBcHBseSBwYXRjaCBodW5rc1xuICBsZXQgZGlmZk9mZnNldCA9IDA7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgaHVuayA9IGh1bmtzW2ldLFxuICAgICAgICB0b1BvcyA9IGh1bmsub2xkU3RhcnQgKyBodW5rLm9mZnNldCArIGRpZmZPZmZzZXQgLSAxO1xuICAgIGRpZmZPZmZzZXQgKz0gaHVuay5uZXdMaW5lcyAtIGh1bmsub2xkTGluZXM7XG5cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGh1bmsubGluZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGxldCBsaW5lID0gaHVuay5saW5lc1tqXSxcbiAgICAgICAgICBvcGVyYXRpb24gPSAobGluZS5sZW5ndGggPiAwID8gbGluZVswXSA6ICcgJyksXG4gICAgICAgICAgY29udGVudCA9IChsaW5lLmxlbmd0aCA+IDAgPyBsaW5lLnN1YnN0cigxKSA6IGxpbmUpLFxuICAgICAgICAgIGRlbGltaXRlciA9IGh1bmsubGluZWRlbGltaXRlcnMgJiYgaHVuay5saW5lZGVsaW1pdGVyc1tqXSB8fCAnXFxuJztcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJyAnKSB7XG4gICAgICAgIHRvUG9zKys7XG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgIGxpbmVzLnNwbGljZSh0b1BvcywgMSk7XG4gICAgICAgIGRlbGltaXRlcnMuc3BsaWNlKHRvUG9zLCAxKTtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgIGxpbmVzLnNwbGljZSh0b1BvcywgMCwgY29udGVudCk7XG4gICAgICAgIGRlbGltaXRlcnMuc3BsaWNlKHRvUG9zLCAwLCBkZWxpbWl0ZXIpO1xuICAgICAgICB0b1BvcysrO1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICdcXFxcJykge1xuICAgICAgICBsZXQgcHJldmlvdXNPcGVyYXRpb24gPSBodW5rLmxpbmVzW2ogLSAxXSA/IGh1bmsubGluZXNbaiAtIDFdWzBdIDogbnVsbDtcbiAgICAgICAgaWYgKHByZXZpb3VzT3BlcmF0aW9uID09PSAnKycpIHtcbiAgICAgICAgICByZW1vdmVFT0ZOTCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocHJldmlvdXNPcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAgIGFkZEVPRk5MID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEhhbmRsZSBFT0ZOTCBpbnNlcnRpb24vcmVtb3ZhbFxuICBpZiAocmVtb3ZlRU9GTkwpIHtcbiAgICB3aGlsZSAoIWxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICBsaW5lcy5wb3AoKTtcbiAgICAgIGRlbGltaXRlcnMucG9wKCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGFkZEVPRk5MKSB7XG4gICAgbGluZXMucHVzaCgnJyk7XG4gICAgZGVsaW1pdGVycy5wdXNoKCdcXG4nKTtcbiAgfVxuICBmb3IgKGxldCBfayA9IDA7IF9rIDwgbGluZXMubGVuZ3RoIC0gMTsgX2srKykge1xuICAgIGxpbmVzW19rXSA9IGxpbmVzW19rXSArIGRlbGltaXRlcnNbX2tdO1xuICB9XG4gIHJldHVybiBsaW5lcy5qb2luKCcnKTtcbn1cblxuLy8gV3JhcHBlciB0aGF0IHN1cHBvcnRzIG11bHRpcGxlIGZpbGUgcGF0Y2hlcyB2aWEgY2FsbGJhY2tzLlxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UGF0Y2hlcyh1bmlEaWZmLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgfVxuXG4gIGxldCBjdXJyZW50SW5kZXggPSAwO1xuICBmdW5jdGlvbiBwcm9jZXNzSW5kZXgoKSB7XG4gICAgbGV0IGluZGV4ID0gdW5pRGlmZltjdXJyZW50SW5kZXgrK107XG4gICAgaWYgKCFpbmRleCkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBvcHRpb25zLmxvYWRGaWxlKGluZGV4LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoZXJyKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHVwZGF0ZWRDb250ZW50ID0gYXBwbHlQYXRjaChkYXRhLCBpbmRleCwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLnBhdGNoZWQoaW5kZXgsIHVwZGF0ZWRDb250ZW50LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9jZXNzSW5kZXgoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHByb2Nlc3NJbmRleCgpO1xufVxuIiwgImltcG9ydCB7ZGlmZkxpbmVzfSBmcm9tICcuLi9kaWZmL2xpbmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAodHlwZW9mIG9wdGlvbnMuY29udGV4dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zLmNvbnRleHQgPSA0O1xuICB9XG5cbiAgY29uc3QgZGlmZiA9IGRpZmZMaW5lcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG4gIGlmKCFkaWZmKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZGlmZi5wdXNoKHt2YWx1ZTogJycsIGxpbmVzOiBbXX0pOyAvLyBBcHBlbmQgYW4gZW1wdHkgdmFsdWUgdG8gbWFrZSBjbGVhbnVwIGVhc2llclxuXG4gIGZ1bmN0aW9uIGNvbnRleHRMaW5lcyhsaW5lcykge1xuICAgIHJldHVybiBsaW5lcy5tYXAoZnVuY3Rpb24oZW50cnkpIHsgcmV0dXJuICcgJyArIGVudHJ5OyB9KTtcbiAgfVxuXG4gIGxldCBodW5rcyA9IFtdO1xuICBsZXQgb2xkUmFuZ2VTdGFydCA9IDAsIG5ld1JhbmdlU3RhcnQgPSAwLCBjdXJSYW5nZSA9IFtdLFxuICAgICAgb2xkTGluZSA9IDEsIG5ld0xpbmUgPSAxO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmYubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjdXJyZW50ID0gZGlmZltpXSxcbiAgICAgICAgICBsaW5lcyA9IGN1cnJlbnQubGluZXMgfHwgY3VycmVudC52YWx1ZS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKTtcbiAgICBjdXJyZW50LmxpbmVzID0gbGluZXM7XG5cbiAgICBpZiAoY3VycmVudC5hZGRlZCB8fCBjdXJyZW50LnJlbW92ZWQpIHtcbiAgICAgIC8vIElmIHdlIGhhdmUgcHJldmlvdXMgY29udGV4dCwgc3RhcnQgd2l0aCB0aGF0XG4gICAgICBpZiAoIW9sZFJhbmdlU3RhcnQpIHtcbiAgICAgICAgY29uc3QgcHJldiA9IGRpZmZbaSAtIDFdO1xuICAgICAgICBvbGRSYW5nZVN0YXJ0ID0gb2xkTGluZTtcbiAgICAgICAgbmV3UmFuZ2VTdGFydCA9IG5ld0xpbmU7XG5cbiAgICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgICBjdXJSYW5nZSA9IG9wdGlvbnMuY29udGV4dCA+IDAgPyBjb250ZXh0TGluZXMocHJldi5saW5lcy5zbGljZSgtb3B0aW9ucy5jb250ZXh0KSkgOiBbXTtcbiAgICAgICAgICBvbGRSYW5nZVN0YXJ0IC09IGN1clJhbmdlLmxlbmd0aDtcbiAgICAgICAgICBuZXdSYW5nZVN0YXJ0IC09IGN1clJhbmdlLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBPdXRwdXQgb3VyIGNoYW5nZXNcbiAgICAgIGN1clJhbmdlLnB1c2goLi4uIGxpbmVzLm1hcChmdW5jdGlvbihlbnRyeSkge1xuICAgICAgICByZXR1cm4gKGN1cnJlbnQuYWRkZWQgPyAnKycgOiAnLScpICsgZW50cnk7XG4gICAgICB9KSk7XG5cbiAgICAgIC8vIFRyYWNrIHRoZSB1cGRhdGVkIGZpbGUgcG9zaXRpb25cbiAgICAgIGlmIChjdXJyZW50LmFkZGVkKSB7XG4gICAgICAgIG5ld0xpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2xkTGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElkZW50aWNhbCBjb250ZXh0IGxpbmVzLiBUcmFjayBsaW5lIGNoYW5nZXNcbiAgICAgIGlmIChvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgIC8vIENsb3NlIG91dCBhbnkgY2hhbmdlcyB0aGF0IGhhdmUgYmVlbiBvdXRwdXQgKG9yIGpvaW4gb3ZlcmxhcHBpbmcpXG4gICAgICAgIGlmIChsaW5lcy5sZW5ndGggPD0gb3B0aW9ucy5jb250ZXh0ICogMiAmJiBpIDwgZGlmZi5sZW5ndGggLSAyKSB7XG4gICAgICAgICAgLy8gT3ZlcmxhcHBpbmdcbiAgICAgICAgICBjdXJSYW5nZS5wdXNoKC4uLiBjb250ZXh0TGluZXMobGluZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBlbmQgdGhlIHJhbmdlIGFuZCBvdXRwdXRcbiAgICAgICAgICBsZXQgY29udGV4dFNpemUgPSBNYXRoLm1pbihsaW5lcy5sZW5ndGgsIG9wdGlvbnMuY29udGV4dCk7XG4gICAgICAgICAgY3VyUmFuZ2UucHVzaCguLi4gY29udGV4dExpbmVzKGxpbmVzLnNsaWNlKDAsIGNvbnRleHRTaXplKSkpO1xuXG4gICAgICAgICAgbGV0IGh1bmsgPSB7XG4gICAgICAgICAgICBvbGRTdGFydDogb2xkUmFuZ2VTdGFydCxcbiAgICAgICAgICAgIG9sZExpbmVzOiAob2xkTGluZSAtIG9sZFJhbmdlU3RhcnQgKyBjb250ZXh0U2l6ZSksXG4gICAgICAgICAgICBuZXdTdGFydDogbmV3UmFuZ2VTdGFydCxcbiAgICAgICAgICAgIG5ld0xpbmVzOiAobmV3TGluZSAtIG5ld1JhbmdlU3RhcnQgKyBjb250ZXh0U2l6ZSksXG4gICAgICAgICAgICBsaW5lczogY3VyUmFuZ2VcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChpID49IGRpZmYubGVuZ3RoIC0gMiAmJiBsaW5lcy5sZW5ndGggPD0gb3B0aW9ucy5jb250ZXh0KSB7XG4gICAgICAgICAgICAvLyBFT0YgaXMgaW5zaWRlIHRoaXMgaHVua1xuICAgICAgICAgICAgbGV0IG9sZEVPRk5ld2xpbmUgPSAoKC9cXG4kLykudGVzdChvbGRTdHIpKTtcbiAgICAgICAgICAgIGxldCBuZXdFT0ZOZXdsaW5lID0gKCgvXFxuJC8pLnRlc3QobmV3U3RyKSk7XG4gICAgICAgICAgICBsZXQgbm9ObEJlZm9yZUFkZHMgPSBsaW5lcy5sZW5ndGggPT0gMCAmJiBjdXJSYW5nZS5sZW5ndGggPiBodW5rLm9sZExpbmVzO1xuICAgICAgICAgICAgaWYgKCFvbGRFT0ZOZXdsaW5lICYmIG5vTmxCZWZvcmVBZGRzICYmIG9sZFN0ci5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZTogb2xkIGhhcyBubyBlb2wgYW5kIG5vIHRyYWlsaW5nIGNvbnRleHQ7IG5vLW5sIGNhbiBlbmQgdXAgYmVmb3JlIGFkZHNcbiAgICAgICAgICAgICAgLy8gaG93ZXZlciwgaWYgdGhlIG9sZCBmaWxlIGlzIGVtcHR5LCBkbyBub3Qgb3V0cHV0IHRoZSBuby1ubCBsaW5lXG4gICAgICAgICAgICAgIGN1clJhbmdlLnNwbGljZShodW5rLm9sZExpbmVzLCAwLCAnXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKCFvbGRFT0ZOZXdsaW5lICYmICFub05sQmVmb3JlQWRkcykgfHwgIW5ld0VPRk5ld2xpbmUpIHtcbiAgICAgICAgICAgICAgY3VyUmFuZ2UucHVzaCgnXFxcXCBObyBuZXdsaW5lIGF0IGVuZCBvZiBmaWxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGh1bmtzLnB1c2goaHVuayk7XG5cbiAgICAgICAgICBvbGRSYW5nZVN0YXJ0ID0gMDtcbiAgICAgICAgICBuZXdSYW5nZVN0YXJ0ID0gMDtcbiAgICAgICAgICBjdXJSYW5nZSA9IFtdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBvbGRMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIG5ld0xpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb2xkRmlsZU5hbWU6IG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZTogbmV3RmlsZU5hbWUsXG4gICAgb2xkSGVhZGVyOiBvbGRIZWFkZXIsIG5ld0hlYWRlcjogbmV3SGVhZGVyLFxuICAgIGh1bmtzOiBodW5rc1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0UGF0Y2goZGlmZikge1xuICBpZiAoQXJyYXkuaXNBcnJheShkaWZmKSkge1xuICAgIHJldHVybiBkaWZmLm1hcChmb3JtYXRQYXRjaCkuam9pbignXFxuJyk7XG4gIH1cblxuICBjb25zdCByZXQgPSBbXTtcbiAgaWYgKGRpZmYub2xkRmlsZU5hbWUgPT0gZGlmZi5uZXdGaWxlTmFtZSkge1xuICAgIHJldC5wdXNoKCdJbmRleDogJyArIGRpZmYub2xkRmlsZU5hbWUpO1xuICB9XG4gIHJldC5wdXNoKCc9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Jyk7XG4gIHJldC5wdXNoKCctLS0gJyArIGRpZmYub2xkRmlsZU5hbWUgKyAodHlwZW9mIGRpZmYub2xkSGVhZGVyID09PSAndW5kZWZpbmVkJyA/ICcnIDogJ1xcdCcgKyBkaWZmLm9sZEhlYWRlcikpO1xuICByZXQucHVzaCgnKysrICcgKyBkaWZmLm5ld0ZpbGVOYW1lICsgKHR5cGVvZiBkaWZmLm5ld0hlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgZGlmZi5uZXdIZWFkZXIpKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpZmYuaHVua3MubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBodW5rID0gZGlmZi5odW5rc1tpXTtcbiAgICAvLyBVbmlmaWVkIERpZmYgRm9ybWF0IHF1aXJrOiBJZiB0aGUgY2h1bmsgc2l6ZSBpcyAwLFxuICAgIC8vIHRoZSBmaXJzdCBudW1iZXIgaXMgb25lIGxvd2VyIHRoYW4gb25lIHdvdWxkIGV4cGVjdC5cbiAgICAvLyBodHRwczovL3d3dy5hcnRpbWEuY29tL3dlYmxvZ3Mvdmlld3Bvc3QuanNwP3RocmVhZD0xNjQyOTNcbiAgICBpZiAoaHVuay5vbGRMaW5lcyA9PT0gMCkge1xuICAgICAgaHVuay5vbGRTdGFydCAtPSAxO1xuICAgIH1cbiAgICBpZiAoaHVuay5uZXdMaW5lcyA9PT0gMCkge1xuICAgICAgaHVuay5uZXdTdGFydCAtPSAxO1xuICAgIH1cbiAgICByZXQucHVzaChcbiAgICAgICdAQCAtJyArIGh1bmsub2xkU3RhcnQgKyAnLCcgKyBodW5rLm9sZExpbmVzXG4gICAgICArICcgKycgKyBodW5rLm5ld1N0YXJ0ICsgJywnICsgaHVuay5uZXdMaW5lc1xuICAgICAgKyAnIEBAJ1xuICAgICk7XG4gICAgcmV0LnB1c2guYXBwbHkocmV0LCBodW5rLmxpbmVzKTtcbiAgfVxuXG4gIHJldHVybiByZXQuam9pbignXFxuJykgKyAnXFxuJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVR3b0ZpbGVzUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGZvcm1hdFBhdGNoKHN0cnVjdHVyZWRQYXRjaChvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUGF0Y2goZmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICByZXR1cm4gY3JlYXRlVHdvRmlsZXNQYXRjaChmaWxlTmFtZSwgZmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucyk7XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIGFycmF5RXF1YWwoYSwgYikge1xuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5U3RhcnRzV2l0aChhLCBiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFycmF5U3RhcnRzV2l0aChhcnJheSwgc3RhcnQpIHtcbiAgaWYgKHN0YXJ0Lmxlbmd0aCA+IGFycmF5Lmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RhcnQubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3RhcnRbaV0gIT09IGFycmF5W2ldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG4iLCAiaW1wb3J0IHtzdHJ1Y3R1cmVkUGF0Y2h9IGZyb20gJy4vY3JlYXRlJztcbmltcG9ydCB7cGFyc2VQYXRjaH0gZnJvbSAnLi9wYXJzZSc7XG5cbmltcG9ydCB7YXJyYXlFcXVhbCwgYXJyYXlTdGFydHNXaXRofSBmcm9tICcuLi91dGlsL2FycmF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNMaW5lQ291bnQoaHVuaykge1xuICBjb25zdCB7b2xkTGluZXMsIG5ld0xpbmVzfSA9IGNhbGNPbGROZXdMaW5lQ291bnQoaHVuay5saW5lcyk7XG5cbiAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBodW5rLm9sZExpbmVzID0gb2xkTGluZXM7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGh1bmsub2xkTGluZXM7XG4gIH1cblxuICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGh1bmsubmV3TGluZXMgPSBuZXdMaW5lcztcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgaHVuay5uZXdMaW5lcztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2UobWluZSwgdGhlaXJzLCBiYXNlKSB7XG4gIG1pbmUgPSBsb2FkUGF0Y2gobWluZSwgYmFzZSk7XG4gIHRoZWlycyA9IGxvYWRQYXRjaCh0aGVpcnMsIGJhc2UpO1xuXG4gIGxldCByZXQgPSB7fTtcblxuICAvLyBGb3IgaW5kZXggd2UganVzdCBsZXQgaXQgcGFzcyB0aHJvdWdoIGFzIGl0IGRvZXNuJ3QgaGF2ZSBhbnkgbmVjZXNzYXJ5IG1lYW5pbmcuXG4gIC8vIExlYXZpbmcgc2FuaXR5IGNoZWNrcyBvbiB0aGlzIHRvIHRoZSBBUEkgY29uc3VtZXIgdGhhdCBtYXkga25vdyBtb3JlIGFib3V0IHRoZVxuICAvLyBtZWFuaW5nIGluIHRoZWlyIG93biBjb250ZXh0LlxuICBpZiAobWluZS5pbmRleCB8fCB0aGVpcnMuaW5kZXgpIHtcbiAgICByZXQuaW5kZXggPSBtaW5lLmluZGV4IHx8IHRoZWlycy5pbmRleDtcbiAgfVxuXG4gIGlmIChtaW5lLm5ld0ZpbGVOYW1lIHx8IHRoZWlycy5uZXdGaWxlTmFtZSkge1xuICAgIGlmICghZmlsZU5hbWVDaGFuZ2VkKG1pbmUpKSB7XG4gICAgICAvLyBObyBoZWFkZXIgb3Igbm8gY2hhbmdlIGluIG91cnMsIHVzZSB0aGVpcnMgKGFuZCBvdXJzIGlmIHRoZWlycyBkb2VzIG5vdCBleGlzdClcbiAgICAgIHJldC5vbGRGaWxlTmFtZSA9IHRoZWlycy5vbGRGaWxlTmFtZSB8fCBtaW5lLm9sZEZpbGVOYW1lO1xuICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gdGhlaXJzLm5ld0ZpbGVOYW1lIHx8IG1pbmUubmV3RmlsZU5hbWU7XG4gICAgICByZXQub2xkSGVhZGVyID0gdGhlaXJzLm9sZEhlYWRlciB8fCBtaW5lLm9sZEhlYWRlcjtcbiAgICAgIHJldC5uZXdIZWFkZXIgPSB0aGVpcnMubmV3SGVhZGVyIHx8IG1pbmUubmV3SGVhZGVyO1xuICAgIH0gZWxzZSBpZiAoIWZpbGVOYW1lQ2hhbmdlZCh0aGVpcnMpKSB7XG4gICAgICAvLyBObyBoZWFkZXIgb3Igbm8gY2hhbmdlIGluIHRoZWlycywgdXNlIG91cnNcbiAgICAgIHJldC5vbGRGaWxlTmFtZSA9IG1pbmUub2xkRmlsZU5hbWU7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSBtaW5lLm5ld0ZpbGVOYW1lO1xuICAgICAgcmV0Lm9sZEhlYWRlciA9IG1pbmUub2xkSGVhZGVyO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IG1pbmUubmV3SGVhZGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCb3RoIGNoYW5nZWQuLi4gZmlndXJlIGl0IG91dFxuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm9sZEZpbGVOYW1lLCB0aGVpcnMub2xkRmlsZU5hbWUpO1xuICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm5ld0ZpbGVOYW1lLCB0aGVpcnMubmV3RmlsZU5hbWUpO1xuICAgICAgcmV0Lm9sZEhlYWRlciA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5vbGRIZWFkZXIsIHRoZWlycy5vbGRIZWFkZXIpO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5uZXdIZWFkZXIsIHRoZWlycy5uZXdIZWFkZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJldC5odW5rcyA9IFtdO1xuXG4gIGxldCBtaW5lSW5kZXggPSAwLFxuICAgICAgdGhlaXJzSW5kZXggPSAwLFxuICAgICAgbWluZU9mZnNldCA9IDAsXG4gICAgICB0aGVpcnNPZmZzZXQgPSAwO1xuXG4gIHdoaWxlIChtaW5lSW5kZXggPCBtaW5lLmh1bmtzLmxlbmd0aCB8fCB0aGVpcnNJbmRleCA8IHRoZWlycy5odW5rcy5sZW5ndGgpIHtcbiAgICBsZXQgbWluZUN1cnJlbnQgPSBtaW5lLmh1bmtzW21pbmVJbmRleF0gfHwge29sZFN0YXJ0OiBJbmZpbml0eX0sXG4gICAgICAgIHRoZWlyc0N1cnJlbnQgPSB0aGVpcnMuaHVua3NbdGhlaXJzSW5kZXhdIHx8IHtvbGRTdGFydDogSW5maW5pdHl9O1xuXG4gICAgaWYgKGh1bmtCZWZvcmUobWluZUN1cnJlbnQsIHRoZWlyc0N1cnJlbnQpKSB7XG4gICAgICAvLyBUaGlzIHBhdGNoIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbnkgb2YgdGhlIG90aGVycywgeWF5LlxuICAgICAgcmV0Lmh1bmtzLnB1c2goY2xvbmVIdW5rKG1pbmVDdXJyZW50LCBtaW5lT2Zmc2V0KSk7XG4gICAgICBtaW5lSW5kZXgrKztcbiAgICAgIHRoZWlyc09mZnNldCArPSBtaW5lQ3VycmVudC5uZXdMaW5lcyAtIG1pbmVDdXJyZW50Lm9sZExpbmVzO1xuICAgIH0gZWxzZSBpZiAoaHVua0JlZm9yZSh0aGVpcnNDdXJyZW50LCBtaW5lQ3VycmVudCkpIHtcbiAgICAgIC8vIFRoaXMgcGF0Y2ggZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFueSBvZiB0aGUgb3RoZXJzLCB5YXkuXG4gICAgICByZXQuaHVua3MucHVzaChjbG9uZUh1bmsodGhlaXJzQ3VycmVudCwgdGhlaXJzT2Zmc2V0KSk7XG4gICAgICB0aGVpcnNJbmRleCsrO1xuICAgICAgbWluZU9mZnNldCArPSB0aGVpcnNDdXJyZW50Lm5ld0xpbmVzIC0gdGhlaXJzQ3VycmVudC5vbGRMaW5lcztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3ZlcmxhcCwgbWVyZ2UgYXMgYmVzdCB3ZSBjYW5cbiAgICAgIGxldCBtZXJnZWRIdW5rID0ge1xuICAgICAgICBvbGRTdGFydDogTWF0aC5taW4obWluZUN1cnJlbnQub2xkU3RhcnQsIHRoZWlyc0N1cnJlbnQub2xkU3RhcnQpLFxuICAgICAgICBvbGRMaW5lczogMCxcbiAgICAgICAgbmV3U3RhcnQ6IE1hdGgubWluKG1pbmVDdXJyZW50Lm5ld1N0YXJ0ICsgbWluZU9mZnNldCwgdGhlaXJzQ3VycmVudC5vbGRTdGFydCArIHRoZWlyc09mZnNldCksXG4gICAgICAgIG5ld0xpbmVzOiAwLFxuICAgICAgICBsaW5lczogW11cbiAgICAgIH07XG4gICAgICBtZXJnZUxpbmVzKG1lcmdlZEh1bmssIG1pbmVDdXJyZW50Lm9sZFN0YXJ0LCBtaW5lQ3VycmVudC5saW5lcywgdGhlaXJzQ3VycmVudC5vbGRTdGFydCwgdGhlaXJzQ3VycmVudC5saW5lcyk7XG4gICAgICB0aGVpcnNJbmRleCsrO1xuICAgICAgbWluZUluZGV4Kys7XG5cbiAgICAgIHJldC5odW5rcy5wdXNoKG1lcmdlZEh1bmspO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGxvYWRQYXRjaChwYXJhbSwgYmFzZSkge1xuICBpZiAodHlwZW9mIHBhcmFtID09PSAnc3RyaW5nJykge1xuICAgIGlmICgoL15AQC9tKS50ZXN0KHBhcmFtKSB8fCAoKC9eSW5kZXg6L20pLnRlc3QocGFyYW0pKSkge1xuICAgICAgcmV0dXJuIHBhcnNlUGF0Y2gocGFyYW0pWzBdO1xuICAgIH1cblxuICAgIGlmICghYmFzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgYSBiYXNlIHJlZmVyZW5jZSBvciBwYXNzIGluIGEgcGF0Y2gnKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cnVjdHVyZWRQYXRjaCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgYmFzZSwgcGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcmFtO1xufVxuXG5mdW5jdGlvbiBmaWxlTmFtZUNoYW5nZWQocGF0Y2gpIHtcbiAgcmV0dXJuIHBhdGNoLm5ld0ZpbGVOYW1lICYmIHBhdGNoLm5ld0ZpbGVOYW1lICE9PSBwYXRjaC5vbGRGaWxlTmFtZTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0RmllbGQoaW5kZXgsIG1pbmUsIHRoZWlycykge1xuICBpZiAobWluZSA9PT0gdGhlaXJzKSB7XG4gICAgcmV0dXJuIG1pbmU7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXguY29uZmxpY3QgPSB0cnVlO1xuICAgIHJldHVybiB7bWluZSwgdGhlaXJzfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBodW5rQmVmb3JlKHRlc3QsIGNoZWNrKSB7XG4gIHJldHVybiB0ZXN0Lm9sZFN0YXJ0IDwgY2hlY2sub2xkU3RhcnRcbiAgICAmJiAodGVzdC5vbGRTdGFydCArIHRlc3Qub2xkTGluZXMpIDwgY2hlY2sub2xkU3RhcnQ7XG59XG5cbmZ1bmN0aW9uIGNsb25lSHVuayhodW5rLCBvZmZzZXQpIHtcbiAgcmV0dXJuIHtcbiAgICBvbGRTdGFydDogaHVuay5vbGRTdGFydCwgb2xkTGluZXM6IGh1bmsub2xkTGluZXMsXG4gICAgbmV3U3RhcnQ6IGh1bmsubmV3U3RhcnQgKyBvZmZzZXQsIG5ld0xpbmVzOiBodW5rLm5ld0xpbmVzLFxuICAgIGxpbmVzOiBodW5rLmxpbmVzXG4gIH07XG59XG5cbmZ1bmN0aW9uIG1lcmdlTGluZXMoaHVuaywgbWluZU9mZnNldCwgbWluZUxpbmVzLCB0aGVpck9mZnNldCwgdGhlaXJMaW5lcykge1xuICAvLyBUaGlzIHdpbGwgZ2VuZXJhbGx5IHJlc3VsdCBpbiBhIGNvbmZsaWN0ZWQgaHVuaywgYnV0IHRoZXJlIGFyZSBjYXNlcyB3aGVyZSB0aGUgY29udGV4dFxuICAvLyBpcyB0aGUgb25seSBvdmVybGFwIHdoZXJlIHdlIGNhbiBzdWNjZXNzZnVsbHkgbWVyZ2UgdGhlIGNvbnRlbnQgaGVyZS5cbiAgbGV0IG1pbmUgPSB7b2Zmc2V0OiBtaW5lT2Zmc2V0LCBsaW5lczogbWluZUxpbmVzLCBpbmRleDogMH0sXG4gICAgICB0aGVpciA9IHtvZmZzZXQ6IHRoZWlyT2Zmc2V0LCBsaW5lczogdGhlaXJMaW5lcywgaW5kZXg6IDB9O1xuXG4gIC8vIEhhbmRsZSBhbnkgbGVhZGluZyBjb250ZW50XG4gIGluc2VydExlYWRpbmcoaHVuaywgbWluZSwgdGhlaXIpO1xuICBpbnNlcnRMZWFkaW5nKGh1bmssIHRoZWlyLCBtaW5lKTtcblxuICAvLyBOb3cgaW4gdGhlIG92ZXJsYXAgY29udGVudC4gU2NhbiB0aHJvdWdoIGFuZCBzZWxlY3QgdGhlIGJlc3QgY2hhbmdlcyBmcm9tIGVhY2guXG4gIHdoaWxlIChtaW5lLmluZGV4IDwgbWluZS5saW5lcy5sZW5ndGggJiYgdGhlaXIuaW5kZXggPCB0aGVpci5saW5lcy5sZW5ndGgpIHtcbiAgICBsZXQgbWluZUN1cnJlbnQgPSBtaW5lLmxpbmVzW21pbmUuaW5kZXhdLFxuICAgICAgICB0aGVpckN1cnJlbnQgPSB0aGVpci5saW5lc1t0aGVpci5pbmRleF07XG5cbiAgICBpZiAoKG1pbmVDdXJyZW50WzBdID09PSAnLScgfHwgbWluZUN1cnJlbnRbMF0gPT09ICcrJylcbiAgICAgICAgJiYgKHRoZWlyQ3VycmVudFswXSA9PT0gJy0nIHx8IHRoZWlyQ3VycmVudFswXSA9PT0gJysnKSkge1xuICAgICAgLy8gQm90aCBtb2RpZmllZCAuLi5cbiAgICAgIG11dHVhbENoYW5nZShodW5rLCBtaW5lLCB0aGVpcik7XG4gICAgfSBlbHNlIGlmIChtaW5lQ3VycmVudFswXSA9PT0gJysnICYmIHRoZWlyQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAvLyBNaW5lIGluc2VydGVkXG4gICAgICBodW5rLmxpbmVzLnB1c2goLi4uIGNvbGxlY3RDaGFuZ2UobWluZSkpO1xuICAgIH0gZWxzZSBpZiAodGhlaXJDdXJyZW50WzBdID09PSAnKycgJiYgbWluZUN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgLy8gVGhlaXJzIGluc2VydGVkXG4gICAgICBodW5rLmxpbmVzLnB1c2goLi4uIGNvbGxlY3RDaGFuZ2UodGhlaXIpKTtcbiAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50WzBdID09PSAnLScgJiYgdGhlaXJDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIC8vIE1pbmUgcmVtb3ZlZCBvciBlZGl0ZWRcbiAgICAgIHJlbW92YWwoaHVuaywgbWluZSwgdGhlaXIpO1xuICAgIH0gZWxzZSBpZiAodGhlaXJDdXJyZW50WzBdID09PSAnLScgJiYgbWluZUN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgLy8gVGhlaXIgcmVtb3ZlZCBvciBlZGl0ZWRcbiAgICAgIHJlbW92YWwoaHVuaywgdGhlaXIsIG1pbmUsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnQgPT09IHRoZWlyQ3VycmVudCkge1xuICAgICAgLy8gQ29udGV4dCBpZGVudGl0eVxuICAgICAgaHVuay5saW5lcy5wdXNoKG1pbmVDdXJyZW50KTtcbiAgICAgIG1pbmUuaW5kZXgrKztcbiAgICAgIHRoZWlyLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENvbnRleHQgbWlzbWF0Y2hcbiAgICAgIGNvbmZsaWN0KGh1bmssIGNvbGxlY3RDaGFuZ2UobWluZSksIGNvbGxlY3RDaGFuZ2UodGhlaXIpKTtcbiAgICB9XG4gIH1cblxuICAvLyBOb3cgcHVzaCBhbnl0aGluZyB0aGF0IG1heSBiZSByZW1haW5pbmdcbiAgaW5zZXJ0VHJhaWxpbmcoaHVuaywgbWluZSk7XG4gIGluc2VydFRyYWlsaW5nKGh1bmssIHRoZWlyKTtcblxuICBjYWxjTGluZUNvdW50KGh1bmspO1xufVxuXG5mdW5jdGlvbiBtdXR1YWxDaGFuZ2UoaHVuaywgbWluZSwgdGhlaXIpIHtcbiAgbGV0IG15Q2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UobWluZSksXG4gICAgICB0aGVpckNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKHRoZWlyKTtcblxuICBpZiAoYWxsUmVtb3ZlcyhteUNoYW5nZXMpICYmIGFsbFJlbW92ZXModGhlaXJDaGFuZ2VzKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgcmVtb3ZlIGNoYW5nZXMgdGhhdCBhcmUgc3VwZXJzZXRzIG9mIG9uZSBhbm90aGVyXG4gICAgaWYgKGFycmF5U3RhcnRzV2l0aChteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcylcbiAgICAgICAgJiYgc2tpcFJlbW92ZVN1cGVyc2V0KHRoZWlyLCBteUNoYW5nZXMsIG15Q2hhbmdlcy5sZW5ndGggLSB0aGVpckNoYW5nZXMubGVuZ3RoKSkge1xuICAgICAgaHVuay5saW5lcy5wdXNoKC4uLiBteUNoYW5nZXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoYXJyYXlTdGFydHNXaXRoKHRoZWlyQ2hhbmdlcywgbXlDaGFuZ2VzKVxuICAgICAgICAmJiBza2lwUmVtb3ZlU3VwZXJzZXQobWluZSwgdGhlaXJDaGFuZ2VzLCB0aGVpckNoYW5nZXMubGVuZ3RoIC0gbXlDaGFuZ2VzLmxlbmd0aCkpIHtcbiAgICAgIGh1bmsubGluZXMucHVzaCguLi4gdGhlaXJDaGFuZ2VzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYXJyYXlFcXVhbChteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcykpIHtcbiAgICBodW5rLmxpbmVzLnB1c2goLi4uIG15Q2hhbmdlcyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uZmxpY3QoaHVuaywgbXlDaGFuZ2VzLCB0aGVpckNoYW5nZXMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmFsKGh1bmssIG1pbmUsIHRoZWlyLCBzd2FwKSB7XG4gIGxldCBteUNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKG1pbmUpLFxuICAgICAgdGhlaXJDaGFuZ2VzID0gY29sbGVjdENvbnRleHQodGhlaXIsIG15Q2hhbmdlcyk7XG4gIGlmICh0aGVpckNoYW5nZXMubWVyZ2VkKSB7XG4gICAgaHVuay5saW5lcy5wdXNoKC4uLiB0aGVpckNoYW5nZXMubWVyZ2VkKTtcbiAgfSBlbHNlIHtcbiAgICBjb25mbGljdChodW5rLCBzd2FwID8gdGhlaXJDaGFuZ2VzIDogbXlDaGFuZ2VzLCBzd2FwID8gbXlDaGFuZ2VzIDogdGhlaXJDaGFuZ2VzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb25mbGljdChodW5rLCBtaW5lLCB0aGVpcikge1xuICBodW5rLmNvbmZsaWN0ID0gdHJ1ZTtcbiAgaHVuay5saW5lcy5wdXNoKHtcbiAgICBjb25mbGljdDogdHJ1ZSxcbiAgICBtaW5lOiBtaW5lLFxuICAgIHRoZWlyczogdGhlaXJcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluc2VydExlYWRpbmcoaHVuaywgaW5zZXJ0LCB0aGVpcikge1xuICB3aGlsZSAoaW5zZXJ0Lm9mZnNldCA8IHRoZWlyLm9mZnNldCAmJiBpbnNlcnQuaW5kZXggPCBpbnNlcnQubGluZXMubGVuZ3RoKSB7XG4gICAgbGV0IGxpbmUgPSBpbnNlcnQubGluZXNbaW5zZXJ0LmluZGV4KytdO1xuICAgIGh1bmsubGluZXMucHVzaChsaW5lKTtcbiAgICBpbnNlcnQub2Zmc2V0Kys7XG4gIH1cbn1cbmZ1bmN0aW9uIGluc2VydFRyYWlsaW5nKGh1bmssIGluc2VydCkge1xuICB3aGlsZSAoaW5zZXJ0LmluZGV4IDwgaW5zZXJ0LmxpbmVzLmxlbmd0aCkge1xuICAgIGxldCBsaW5lID0gaW5zZXJ0LmxpbmVzW2luc2VydC5pbmRleCsrXTtcbiAgICBodW5rLmxpbmVzLnB1c2gobGluZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29sbGVjdENoYW5nZShzdGF0ZSkge1xuICBsZXQgcmV0ID0gW10sXG4gICAgICBvcGVyYXRpb24gPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF1bMF07XG4gIHdoaWxlIChzdGF0ZS5pbmRleCA8IHN0YXRlLmxpbmVzLmxlbmd0aCkge1xuICAgIGxldCBsaW5lID0gc3RhdGUubGluZXNbc3RhdGUuaW5kZXhdO1xuXG4gICAgLy8gR3JvdXAgYWRkaXRpb25zIHRoYXQgYXJlIGltbWVkaWF0ZWx5IGFmdGVyIHN1YnRyYWN0aW9ucyBhbmQgdHJlYXQgdGhlbSBhcyBvbmUgXCJhdG9taWNcIiBtb2RpZnkgY2hhbmdlLlxuICAgIGlmIChvcGVyYXRpb24gPT09ICctJyAmJiBsaW5lWzBdID09PSAnKycpIHtcbiAgICAgIG9wZXJhdGlvbiA9ICcrJztcbiAgICB9XG5cbiAgICBpZiAob3BlcmF0aW9uID09PSBsaW5lWzBdKSB7XG4gICAgICByZXQucHVzaChsaW5lKTtcbiAgICAgIHN0YXRlLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5mdW5jdGlvbiBjb2xsZWN0Q29udGV4dChzdGF0ZSwgbWF0Y2hDaGFuZ2VzKSB7XG4gIGxldCBjaGFuZ2VzID0gW10sXG4gICAgICBtZXJnZWQgPSBbXSxcbiAgICAgIG1hdGNoSW5kZXggPSAwLFxuICAgICAgY29udGV4dENoYW5nZXMgPSBmYWxzZSxcbiAgICAgIGNvbmZsaWN0ZWQgPSBmYWxzZTtcbiAgd2hpbGUgKG1hdGNoSW5kZXggPCBtYXRjaENoYW5nZXMubGVuZ3RoXG4gICAgICAgICYmIHN0YXRlLmluZGV4IDwgc3RhdGUubGluZXMubGVuZ3RoKSB7XG4gICAgbGV0IGNoYW5nZSA9IHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4XSxcbiAgICAgICAgbWF0Y2ggPSBtYXRjaENoYW5nZXNbbWF0Y2hJbmRleF07XG5cbiAgICAvLyBPbmNlIHdlJ3ZlIGhpdCBvdXIgYWRkLCB0aGVuIHdlIGFyZSBkb25lXG4gICAgaWYgKG1hdGNoWzBdID09PSAnKycpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnRleHRDaGFuZ2VzID0gY29udGV4dENoYW5nZXMgfHwgY2hhbmdlWzBdICE9PSAnICc7XG5cbiAgICBtZXJnZWQucHVzaChtYXRjaCk7XG4gICAgbWF0Y2hJbmRleCsrO1xuXG4gICAgLy8gQ29uc3VtZSBhbnkgYWRkaXRpb25zIGluIHRoZSBvdGhlciBibG9jayBhcyBhIGNvbmZsaWN0IHRvIGF0dGVtcHRcbiAgICAvLyB0byBwdWxsIGluIHRoZSByZW1haW5pbmcgY29udGV4dCBhZnRlciB0aGlzXG4gICAgaWYgKGNoYW5nZVswXSA9PT0gJysnKSB7XG4gICAgICBjb25mbGljdGVkID0gdHJ1ZTtcblxuICAgICAgd2hpbGUgKGNoYW5nZVswXSA9PT0gJysnKSB7XG4gICAgICAgIGNoYW5nZXMucHVzaChjaGFuZ2UpO1xuICAgICAgICBjaGFuZ2UgPSBzdGF0ZS5saW5lc1srK3N0YXRlLmluZGV4XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWF0Y2guc3Vic3RyKDEpID09PSBjaGFuZ2Uuc3Vic3RyKDEpKSB7XG4gICAgICBjaGFuZ2VzLnB1c2goY2hhbmdlKTtcbiAgICAgIHN0YXRlLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICgobWF0Y2hDaGFuZ2VzW21hdGNoSW5kZXhdIHx8ICcnKVswXSA9PT0gJysnXG4gICAgICAmJiBjb250ZXh0Q2hhbmdlcykge1xuICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKGNvbmZsaWN0ZWQpIHtcbiAgICByZXR1cm4gY2hhbmdlcztcbiAgfVxuXG4gIHdoaWxlIChtYXRjaEluZGV4IDwgbWF0Y2hDaGFuZ2VzLmxlbmd0aCkge1xuICAgIG1lcmdlZC5wdXNoKG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4KytdKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbWVyZ2VkLFxuICAgIGNoYW5nZXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWxsUmVtb3ZlcyhjaGFuZ2VzKSB7XG4gIHJldHVybiBjaGFuZ2VzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjaGFuZ2UpIHtcbiAgICByZXR1cm4gcHJldiAmJiBjaGFuZ2VbMF0gPT09ICctJztcbiAgfSwgdHJ1ZSk7XG59XG5mdW5jdGlvbiBza2lwUmVtb3ZlU3VwZXJzZXQoc3RhdGUsIHJlbW92ZUNoYW5nZXMsIGRlbHRhKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGVsdGE7IGkrKykge1xuICAgIGxldCBjaGFuZ2VDb250ZW50ID0gcmVtb3ZlQ2hhbmdlc1tyZW1vdmVDaGFuZ2VzLmxlbmd0aCAtIGRlbHRhICsgaV0uc3Vic3RyKDEpO1xuICAgIGlmIChzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleCArIGldICE9PSAnICcgKyBjaGFuZ2VDb250ZW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUuaW5kZXggKz0gZGVsdGE7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmVzKSB7XG4gIGxldCBvbGRMaW5lcyA9IDA7XG4gIGxldCBuZXdMaW5lcyA9IDA7XG5cbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgaWYgKHR5cGVvZiBsaW5lICE9PSAnc3RyaW5nJykge1xuICAgICAgbGV0IG15Q291bnQgPSBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmUubWluZSk7XG4gICAgICBsZXQgdGhlaXJDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQobGluZS50aGVpcnMpO1xuXG4gICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobXlDb3VudC5vbGRMaW5lcyA9PT0gdGhlaXJDb3VudC5vbGRMaW5lcykge1xuICAgICAgICAgIG9sZExpbmVzICs9IG15Q291bnQub2xkTGluZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2xkTGluZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG15Q291bnQubmV3TGluZXMgPT09IHRoZWlyQ291bnQubmV3TGluZXMpIHtcbiAgICAgICAgICBuZXdMaW5lcyArPSBteUNvdW50Lm5ld0xpbmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0xpbmVzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkICYmIChsaW5lWzBdID09PSAnKycgfHwgbGluZVswXSA9PT0gJyAnKSkge1xuICAgICAgICBuZXdMaW5lcysrO1xuICAgICAgfVxuICAgICAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQgJiYgKGxpbmVbMF0gPT09ICctJyB8fCBsaW5lWzBdID09PSAnICcpKSB7XG4gICAgICAgIG9sZExpbmVzKys7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge29sZExpbmVzLCBuZXdMaW5lc307XG59XG4iLCAiZXhwb3J0IGZ1bmN0aW9uIHJldmVyc2VQYXRjaChzdHJ1Y3R1cmVkUGF0Y2gpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoc3RydWN0dXJlZFBhdGNoKSkge1xuICAgIHJldHVybiBzdHJ1Y3R1cmVkUGF0Y2gubWFwKHJldmVyc2VQYXRjaCkucmV2ZXJzZSgpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdHJ1Y3R1cmVkUGF0Y2gsXG4gICAgb2xkRmlsZU5hbWU6IHN0cnVjdHVyZWRQYXRjaC5uZXdGaWxlTmFtZSxcbiAgICBvbGRIZWFkZXI6IHN0cnVjdHVyZWRQYXRjaC5uZXdIZWFkZXIsXG4gICAgbmV3RmlsZU5hbWU6IHN0cnVjdHVyZWRQYXRjaC5vbGRGaWxlTmFtZSxcbiAgICBuZXdIZWFkZXI6IHN0cnVjdHVyZWRQYXRjaC5vbGRIZWFkZXIsXG4gICAgaHVua3M6IHN0cnVjdHVyZWRQYXRjaC5odW5rcy5tYXAoaHVuayA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBvbGRMaW5lczogaHVuay5uZXdMaW5lcyxcbiAgICAgICAgb2xkU3RhcnQ6IGh1bmsubmV3U3RhcnQsXG4gICAgICAgIG5ld0xpbmVzOiBodW5rLm9sZExpbmVzLFxuICAgICAgICBuZXdTdGFydDogaHVuay5vbGRTdGFydCxcbiAgICAgICAgbGluZWRlbGltaXRlcnM6IGh1bmsubGluZWRlbGltaXRlcnMsXG4gICAgICAgIGxpbmVzOiBodW5rLmxpbmVzLm1hcChsID0+IHtcbiAgICAgICAgICBpZiAobC5zdGFydHNXaXRoKCctJykpIHsgcmV0dXJuIGArJHtsLnNsaWNlKDEpfWA7IH1cbiAgICAgICAgICBpZiAobC5zdGFydHNXaXRoKCcrJykpIHsgcmV0dXJuIGAtJHtsLnNsaWNlKDEpfWA7IH1cbiAgICAgICAgICByZXR1cm4gbDtcbiAgICAgICAgfSlcbiAgICAgIH07XG4gICAgfSlcbiAgfTtcbn1cbiIsICIvLyBTZWU6IGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9nb29nbGUtZGlmZi1tYXRjaC1wYXRjaC93aWtpL0FQSVxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRDaGFuZ2VzVG9ETVAoY2hhbmdlcykge1xuICBsZXQgcmV0ID0gW10sXG4gICAgICBjaGFuZ2UsXG4gICAgICBvcGVyYXRpb247XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgIGNoYW5nZSA9IGNoYW5nZXNbaV07XG4gICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgb3BlcmF0aW9uID0gMTtcbiAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICBvcGVyYXRpb24gPSAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3BlcmF0aW9uID0gMDtcbiAgICB9XG5cbiAgICByZXQucHVzaChbb3BlcmF0aW9uLCBjaGFuZ2UudmFsdWVdKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuIiwgImV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0Q2hhbmdlc1RvWE1MKGNoYW5nZXMpIHtcbiAgbGV0IHJldCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgY2hhbmdlID0gY2hhbmdlc1tpXTtcbiAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICByZXQucHVzaCgnPGlucz4nKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICByZXQucHVzaCgnPGRlbD4nKTtcbiAgICB9XG5cbiAgICByZXQucHVzaChlc2NhcGVIVE1MKGNoYW5nZS52YWx1ZSkpO1xuXG4gICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgcmV0LnB1c2goJzwvaW5zPicpO1xuICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgIHJldC5wdXNoKCc8L2RlbD4nKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldC5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gZXNjYXBlSFRNTChzKSB7XG4gIGxldCBuID0gcztcbiAgbiA9IG4ucmVwbGFjZSgvJi9nLCAnJmFtcDsnKTtcbiAgbiA9IG4ucmVwbGFjZSgvPC9nLCAnJmx0OycpO1xuICBuID0gbi5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XG4gIG4gPSBuLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcblxuICByZXR1cm4gbjtcbn1cbiIsICIvKiBTZWUgTElDRU5TRSBmaWxlIGZvciB0ZXJtcyBvZiB1c2UgKi9cblxuLypcbiAqIFRleHQgZGlmZiBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBUaGlzIGxpYnJhcnkgc3VwcG9ydHMgdGhlIGZvbGxvd2luZyBBUElzOlxuICogRGlmZi5kaWZmQ2hhcnM6IENoYXJhY3RlciBieSBjaGFyYWN0ZXIgZGlmZlxuICogRGlmZi5kaWZmV29yZHM6IFdvcmQgKGFzIGRlZmluZWQgYnkgXFxiIHJlZ2V4KSBkaWZmIHdoaWNoIGlnbm9yZXMgd2hpdGVzcGFjZVxuICogRGlmZi5kaWZmTGluZXM6IExpbmUgYmFzZWQgZGlmZlxuICpcbiAqIERpZmYuZGlmZkNzczogRGlmZiB0YXJnZXRlZCBhdCBDU1MgY29udGVudFxuICpcbiAqIFRoZXNlIG1ldGhvZHMgYXJlIGJhc2VkIG9uIHRoZSBpbXBsZW1lbnRhdGlvbiBwcm9wb3NlZCBpblxuICogXCJBbiBPKE5EKSBEaWZmZXJlbmNlIEFsZ29yaXRobSBhbmQgaXRzIFZhcmlhdGlvbnNcIiAoTXllcnMsIDE5ODYpLlxuICogaHR0cDovL2NpdGVzZWVyeC5pc3QucHN1LmVkdS92aWV3ZG9jL3N1bW1hcnk/ZG9pPTEwLjEuMS40LjY5MjdcbiAqL1xuaW1wb3J0IERpZmYgZnJvbSAnLi9kaWZmL2Jhc2UnO1xuaW1wb3J0IHtkaWZmQ2hhcnN9IGZyb20gJy4vZGlmZi9jaGFyYWN0ZXInO1xuaW1wb3J0IHtkaWZmV29yZHMsIGRpZmZXb3Jkc1dpdGhTcGFjZX0gZnJvbSAnLi9kaWZmL3dvcmQnO1xuaW1wb3J0IHtkaWZmTGluZXMsIGRpZmZUcmltbWVkTGluZXN9IGZyb20gJy4vZGlmZi9saW5lJztcbmltcG9ydCB7ZGlmZlNlbnRlbmNlc30gZnJvbSAnLi9kaWZmL3NlbnRlbmNlJztcblxuaW1wb3J0IHtkaWZmQ3NzfSBmcm9tICcuL2RpZmYvY3NzJztcbmltcG9ydCB7ZGlmZkpzb24sIGNhbm9uaWNhbGl6ZX0gZnJvbSAnLi9kaWZmL2pzb24nO1xuXG5pbXBvcnQge2RpZmZBcnJheXN9IGZyb20gJy4vZGlmZi9hcnJheSc7XG5cbmltcG9ydCB7YXBwbHlQYXRjaCwgYXBwbHlQYXRjaGVzfSBmcm9tICcuL3BhdGNoL2FwcGx5JztcbmltcG9ydCB7cGFyc2VQYXRjaH0gZnJvbSAnLi9wYXRjaC9wYXJzZSc7XG5pbXBvcnQge21lcmdlfSBmcm9tICcuL3BhdGNoL21lcmdlJztcbmltcG9ydCB7cmV2ZXJzZVBhdGNofSBmcm9tICcuL3BhdGNoL3JldmVyc2UnO1xuaW1wb3J0IHtzdHJ1Y3R1cmVkUGF0Y2gsIGNyZWF0ZVR3b0ZpbGVzUGF0Y2gsIGNyZWF0ZVBhdGNoLCBmb3JtYXRQYXRjaH0gZnJvbSAnLi9wYXRjaC9jcmVhdGUnO1xuXG5pbXBvcnQge2NvbnZlcnRDaGFuZ2VzVG9ETVB9IGZyb20gJy4vY29udmVydC9kbXAnO1xuaW1wb3J0IHtjb252ZXJ0Q2hhbmdlc1RvWE1MfSBmcm9tICcuL2NvbnZlcnQveG1sJztcblxuZXhwb3J0IHtcbiAgRGlmZixcblxuICBkaWZmQ2hhcnMsXG4gIGRpZmZXb3JkcyxcbiAgZGlmZldvcmRzV2l0aFNwYWNlLFxuICBkaWZmTGluZXMsXG4gIGRpZmZUcmltbWVkTGluZXMsXG4gIGRpZmZTZW50ZW5jZXMsXG5cbiAgZGlmZkNzcyxcbiAgZGlmZkpzb24sXG5cbiAgZGlmZkFycmF5cyxcblxuICBzdHJ1Y3R1cmVkUGF0Y2gsXG4gIGNyZWF0ZVR3b0ZpbGVzUGF0Y2gsXG4gIGNyZWF0ZVBhdGNoLFxuICBmb3JtYXRQYXRjaCxcbiAgYXBwbHlQYXRjaCxcbiAgYXBwbHlQYXRjaGVzLFxuICBwYXJzZVBhdGNoLFxuICBtZXJnZSxcbiAgcmV2ZXJzZVBhdGNoLFxuICBjb252ZXJ0Q2hhbmdlc1RvRE1QLFxuICBjb252ZXJ0Q2hhbmdlc1RvWE1MLFxuICBjYW5vbmljYWxpemVcbn07XG4iLCAiLy8gaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvZGlmZlxuY29uc3QgRGlmZiA9IHJlcXVpcmUoJ2RpZmYnKTtcblxuY29uc3QgZ2V0U3RyaW5nc0RpZmZlcmVuY2UgPSAoc3RyMSwgc3RyMiwgbWV0aG9kID0gJ2RpZmZMaW5lcycsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBEaWZmW21ldGhvZF0oc3RyMSwgc3RyMiwgb3B0aW9ucyk7XG5cbiAgcmV0dXJuIHJlc3VsdFxuICAgIC5tYXAoKHBhcnQpID0+IHtcbiAgICAgIGNvbnN0IGNvbG9yID0gcGFydC5hZGRlZCA/ICdncmVlbicgOiBwYXJ0LnJlbW92ZWQgPyAncmVkJyA6ICdncmV5JztcbiAgICAgIHJldHVybiBgPHNwYW4gc3R5bGU9XCJjb2xvcjogJHtjb2xvcn1cIj4ke3BhcnQudmFsdWV9PC9zcGFuPmA7XG4gICAgfSlcbiAgICAuam9pbignJyk7XG59O1xuXG53aW5kb3cuZ2V0U3RyaW5nc0RpZmZlcmVuY2UgPSBnZXRTdHJpbmdzRGlmZmVyZW5jZTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7QUFBZSxhQUFTQSxRQUFPO0lBQUU7QUFFakNBLElBQUFBLE1BQUtDLFlBQVk7OztNQUNmQyxNQURlLFNBQUEsS0FDVkMsV0FBV0MsV0FBeUI7QUFBQSxZQUFBO0FBQUEsWUFBZEMsVUFBYyxVQUFBLFNBQUEsS0FBQSxVQUFBLENBQUEsTUFBQSxTQUFBLFVBQUEsQ0FBQSxJQUFKLENBQUE7QUFDbkMsWUFBSUMsV0FBV0QsUUFBUUM7QUFDdkIsWUFBSSxPQUFPRCxZQUFZLFlBQVk7QUFDakNDLHFCQUFXRDtBQUNYQSxvQkFBVSxDQUFBO1FBQ1g7QUFDRCxhQUFLQSxVQUFVQTtBQUVmLFlBQUlFLE9BQU87QUFFWCxpQkFBU0MsS0FBS0MsT0FBTztBQUNuQixjQUFJSCxVQUFVO0FBQ1pJLHVCQUFXLFdBQVc7QUFBRUosdUJBQVNLLFFBQVdGLEtBQVo7WUFBcUIsR0FBRSxDQUE3QztBQUNWLG1CQUFPO1VBQ1IsT0FBTTtBQUNMLG1CQUFPQTtVQUNSO1FBQ0Y7QUFHRE4sb0JBQVksS0FBS1MsVUFBVVQsU0FBZjtBQUNa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QUlBLEVBQUVDLFFBQVEsTUFBTSxNQUFoQjtBQUNKRCxVQUFJQSxFQUFFQyxRQUFRLE1BQU0sTUFBaEI7QUFDSkQsVUFBSUEsRUFBRUMsUUFBUSxNQUFNLFFBQWhCO0FBRUosYUFBT0Q7SUFDUjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiRCxRQUFBLFFBQUEsdUJBQUEsY0FBQTtBQUNBLFFBQUEsYUFBQTtBQUNBLFFBQUEsUUFBQTtBQUNBLFFBQUEsUUFBQTtBQUNBLFFBQUEsWUFBQTtBQUVBLFFBQUEsT0FBQTtBQUNBLFFBQUEsUUFBQTtBQUVBLFFBQUEsU0FBQTtBQUVBLFFBQUEsU0FBQTtBQUNBLFFBQUEsU0FBQTtBQUNBLFFBQUEsU0FBQTtBQUNBLFFBQUEsV0FBQTtBQUNBLFFBQUEsVUFBQTtBQUVBLFFBQUEsT0FBQTtBQUNBLFFBQUEsT0FBQTs7Ozs7Ozs7QUNqQ0EsSUFBTSxPQUFPO0FBRWIsSUFBTSx1QkFBdUIsQ0FBQyxNQUFNLE1BQU0sU0FBUyxhQUFhLFVBQVUsQ0FBQyxNQUFNO0FBQy9FLFFBQU0sU0FBUyxLQUFLLE1BQU0sRUFBRSxNQUFNLE1BQU0sT0FBTztBQUUvQyxTQUFPLE9BQ0osSUFBSSxDQUFDLFNBQVM7QUFDYixVQUFNLFFBQVEsS0FBSyxRQUFRLFVBQVUsS0FBSyxVQUFVLFFBQVE7QUFDNUQsV0FBTyx1QkFBdUIsS0FBSyxLQUFLLEtBQUssS0FBSztBQUFBLEVBQ3BELENBQUMsRUFDQSxLQUFLLEVBQUU7QUFDWjtBQUVBLE9BQU8sdUJBQXVCOyIsCiAgIm5hbWVzIjogWyJEaWZmIiwgInByb3RvdHlwZSIsICJkaWZmIiwgIm9sZFN0cmluZyIsICJuZXdTdHJpbmciLCAib3B0aW9ucyIsICJjYWxsYmFjayIsICJzZWxmIiwgImRvbmUiLCAidmFsdWUiLCAic2V0VGltZW91dCIsICJ1bmRlZmluZWQiLCAiY2FzdElucHV0IiwgInJlbW92ZUVtcHR5IiwgInRva2VuaXplIiwgIm5ld0xlbiIsICJsZW5ndGgiLCAib2xkTGVuIiwgImVkaXRMZW5ndGgiLCAibWF4RWRpdExlbmd0aCIsICJNYXRoIiwgIm1pbiIsICJtYXhFeGVjdXRpb25UaW1lIiwgInRpbWVvdXQiLCAiSW5maW5pdHkiLCAiYWJvcnRBZnRlclRpbWVzdGFtcCIsICJEYXRlIiwgIm5vdyIsICJiZXN0UGF0aCIsICJvbGRQb3MiLCAibGFzdENvbXBvbmVudCIsICJuZXdQb3MiLCAiZXh0cmFjdENvbW1vbiIsICJqb2luIiwgImNvdW50IiwgIm1pbkRpYWdvbmFsVG9Db25zaWRlciIsICJtYXhEaWFnb25hbFRvQ29uc2lkZXIiLCAiZXhlY0VkaXRMZW5ndGgiLCAiZGlhZ29uYWxQYXRoIiwgIm1heCIsICJiYXNlUGF0aCIsICJyZW1vdmVQYXRoIiwgImFkZFBhdGgiLCAiY2FuQWRkIiwgImFkZFBhdGhOZXdQb3MiLCAiY2FuUmVtb3ZlIiwgImFkZFRvUGF0aCIsICJidWlsZFZhbHVlcyIsICJ1c2VMb25nZXN0VG9rZW4iLCAiZXhlYyIsICJyZXQiLCAicGF0aCIsICJhZGRlZCIsICJyZW1vdmVkIiwgIm9sZFBvc0luYyIsICJsYXN0IiwgInByZXZpb3VzQ29tcG9uZW50IiwgImNvbW1vbkNvdW50IiwgImVxdWFscyIsICJsZWZ0IiwgInJpZ2h0IiwgImNvbXBhcmF0b3IiLCAiaWdub3JlQ2FzZSIsICJ0b0xvd2VyQ2FzZSIsICJhcnJheSIsICJpIiwgInB1c2giLCAic3BsaXQiLCAiY2hhcnMiLCAiY29tcG9uZW50cyIsICJuZXh0Q29tcG9uZW50IiwgInJldmVyc2UiLCAiY29tcG9uZW50UG9zIiwgImNvbXBvbmVudExlbiIsICJjb21wb25lbnQiLCAic2xpY2UiLCAibWFwIiwgIm9sZFZhbHVlIiwgInRtcCIsICJmaW5hbENvbXBvbmVudCIsICJwb3AiLCAiY2hhcmFjdGVyRGlmZiIsICJEaWZmIiwgImRpZmZDaGFycyIsICJvbGRTdHIiLCAibmV3U3RyIiwgIm9wdGlvbnMiLCAiZGlmZiIsICJnZW5lcmF0ZU9wdGlvbnMiLCAib3B0aW9ucyIsICJkZWZhdWx0cyIsICJjYWxsYmFjayIsICJuYW1lIiwgImhhc093blByb3BlcnR5IiwgImV4dGVuZGVkV29yZENoYXJzIiwgInJlV2hpdGVzcGFjZSIsICJ3b3JkRGlmZiIsICJEaWZmIiwgImVxdWFscyIsICJsZWZ0IiwgInJpZ2h0IiwgIm9wdGlvbnMiLCAiaWdub3JlQ2FzZSIsICJ0b0xvd2VyQ2FzZSIsICJpZ25vcmVXaGl0ZXNwYWNlIiwgInRlc3QiLCAidG9rZW5pemUiLCAidmFsdWUiLCAidG9rZW5zIiwgInNwbGl0IiwgImkiLCAibGVuZ3RoIiwgInNwbGljZSIsICJkaWZmV29yZHMiLCAib2xkU3RyIiwgIm5ld1N0ciIsICJnZW5lcmF0ZU9wdGlvbnMiLCAiZGlmZiIsICJkaWZmV29yZHNXaXRoU3BhY2UiLCAibGluZURpZmYiLCAiRGlmZiIsICJ0b2tlbml6ZSIsICJ2YWx1ZSIsICJvcHRpb25zIiwgInN0cmlwVHJhaWxpbmdDciIsICJyZXBsYWNlIiwgInJldExpbmVzIiwgImxpbmVzQW5kTmV3bGluZXMiLCAic3BsaXQiLCAibGVuZ3RoIiwgInBvcCIsICJpIiwgImxpbmUiLCAibmV3bGluZUlzVG9rZW4iLCAiaWdub3JlV2hpdGVzcGFjZSIsICJ0cmltIiwgInB1c2giLCAiZGlmZkxpbmVzIiwgIm9sZFN0ciIsICJuZXdTdHIiLCAiY2FsbGJhY2siLCAiZGlmZiIsICJkaWZmVHJpbW1lZExpbmVzIiwgImdlbmVyYXRlT3B0aW9ucyIsICJzZW50ZW5jZURpZmYiLCAiRGlmZiIsICJ0b2tlbml6ZSIsICJ2YWx1ZSIsICJzcGxpdCIsICJkaWZmU2VudGVuY2VzIiwgIm9sZFN0ciIsICJuZXdTdHIiLCAiY2FsbGJhY2siLCAiZGlmZiIsICJjc3NEaWZmIiwgIkRpZmYiLCAidG9rZW5pemUiLCAidmFsdWUiLCAic3BsaXQiLCAiZGlmZkNzcyIsICJvbGRTdHIiLCAibmV3U3RyIiwgImNhbGxiYWNrIiwgImRpZmYiLCAib2JqZWN0UHJvdG90eXBlVG9TdHJpbmciLCAiT2JqZWN0IiwgInByb3RvdHlwZSIsICJ0b1N0cmluZyIsICJqc29uRGlmZiIsICJEaWZmIiwgInVzZUxvbmdlc3RUb2tlbiIsICJ0b2tlbml6ZSIsICJsaW5lRGlmZiIsICJjYXN0SW5wdXQiLCAidmFsdWUiLCAib3B0aW9ucyIsICJ1bmRlZmluZWRSZXBsYWNlbWVudCIsICJzdHJpbmdpZnlSZXBsYWNlciIsICJrIiwgInYiLCAiSlNPTiIsICJzdHJpbmdpZnkiLCAiY2Fub25pY2FsaXplIiwgImVxdWFscyIsICJsZWZ0IiwgInJpZ2h0IiwgImNhbGwiLCAicmVwbGFjZSIsICJkaWZmSnNvbiIsICJvbGRPYmoiLCAibmV3T2JqIiwgImRpZmYiLCAib2JqIiwgInN0YWNrIiwgInJlcGxhY2VtZW50U3RhY2siLCAicmVwbGFjZXIiLCAia2V5IiwgImkiLCAibGVuZ3RoIiwgImNhbm9uaWNhbGl6ZWRPYmoiLCAicHVzaCIsICJBcnJheSIsICJwb3AiLCAidG9KU09OIiwgInNvcnRlZEtleXMiLCAiaGFzT3duUHJvcGVydHkiLCAic29ydCIsICJhcnJheURpZmYiLCAiRGlmZiIsICJ0b2tlbml6ZSIsICJ2YWx1ZSIsICJzbGljZSIsICJqb2luIiwgInJlbW92ZUVtcHR5IiwgImRpZmZBcnJheXMiLCAib2xkQXJyIiwgIm5ld0FyciIsICJjYWxsYmFjayIsICJkaWZmIiwgInBhcnNlUGF0Y2giLCAidW5pRGlmZiIsICJvcHRpb25zIiwgImRpZmZzdHIiLCAic3BsaXQiLCAiZGVsaW1pdGVycyIsICJtYXRjaCIsICJsaXN0IiwgImkiLCAicGFyc2VJbmRleCIsICJpbmRleCIsICJwdXNoIiwgImxlbmd0aCIsICJsaW5lIiwgInRlc3QiLCAiaGVhZGVyIiwgImV4ZWMiLCAicGFyc2VGaWxlSGVhZGVyIiwgImh1bmtzIiwgInBhcnNlSHVuayIsICJzdHJpY3QiLCAiRXJyb3IiLCAiSlNPTiIsICJzdHJpbmdpZnkiLCAiZmlsZUhlYWRlciIsICJrZXlQcmVmaXgiLCAiZGF0YSIsICJmaWxlTmFtZSIsICJyZXBsYWNlIiwgInN1YnN0ciIsICJ0cmltIiwgImNodW5rSGVhZGVySW5kZXgiLCAiY2h1bmtIZWFkZXJMaW5lIiwgImNodW5rSGVhZGVyIiwgImh1bmsiLCAib2xkU3RhcnQiLCAib2xkTGluZXMiLCAibmV3U3RhcnQiLCAibmV3TGluZXMiLCAibGluZXMiLCAibGluZWRlbGltaXRlcnMiLCAiYWRkQ291bnQiLCAicmVtb3ZlQ291bnQiLCAiaW5kZXhPZiIsICJvcGVyYXRpb24iLCAic3RhcnQiLCAibWluTGluZSIsICJtYXhMaW5lIiwgIndhbnRGb3J3YXJkIiwgImJhY2t3YXJkRXhoYXVzdGVkIiwgImZvcndhcmRFeGhhdXN0ZWQiLCAibG9jYWxPZmZzZXQiLCAiaXRlcmF0b3IiLCAiYXBwbHlQYXRjaCIsICJzb3VyY2UiLCAidW5pRGlmZiIsICJvcHRpb25zIiwgInBhcnNlUGF0Y2giLCAiQXJyYXkiLCAiaXNBcnJheSIsICJsZW5ndGgiLCAiRXJyb3IiLCAibGluZXMiLCAic3BsaXQiLCAiZGVsaW1pdGVycyIsICJtYXRjaCIsICJodW5rcyIsICJjb21wYXJlTGluZSIsICJsaW5lTnVtYmVyIiwgImxpbmUiLCAib3BlcmF0aW9uIiwgInBhdGNoQ29udGVudCIsICJlcnJvckNvdW50IiwgImZ1enpGYWN0b3IiLCAibWluTGluZSIsICJvZmZzZXQiLCAicmVtb3ZlRU9GTkwiLCAiYWRkRU9GTkwiLCAiaHVua0ZpdHMiLCAiaHVuayIsICJ0b1BvcyIsICJqIiwgImNvbnRlbnQiLCAic3Vic3RyIiwgImkiLCAibWF4TGluZSIsICJvbGRMaW5lcyIsICJsb2NhbE9mZnNldCIsICJvbGRTdGFydCIsICJpdGVyYXRvciIsICJkaXN0YW5jZUl0ZXJhdG9yIiwgInVuZGVmaW5lZCIsICJkaWZmT2Zmc2V0IiwgIm5ld0xpbmVzIiwgImRlbGltaXRlciIsICJsaW5lZGVsaW1pdGVycyIsICJzcGxpY2UiLCAicHJldmlvdXNPcGVyYXRpb24iLCAicG9wIiwgInB1c2giLCAiX2siLCAiam9pbiIsICJhcHBseVBhdGNoZXMiLCAiY3VycmVudEluZGV4IiwgInByb2Nlc3NJbmRleCIsICJpbmRleCIsICJjb21wbGV0ZSIsICJsb2FkRmlsZSIsICJlcnIiLCAiZGF0YSIsICJ1cGRhdGVkQ29udGVudCIsICJwYXRjaGVkIiwgInN0cnVjdHVyZWRQYXRjaCIsICJvbGRGaWxlTmFtZSIsICJuZXdGaWxlTmFtZSIsICJvbGRTdHIiLCAibmV3U3RyIiwgIm9sZEhlYWRlciIsICJuZXdIZWFkZXIiLCAib3B0aW9ucyIsICJjb250ZXh0IiwgImRpZmYiLCAiZGlmZkxpbmVzIiwgInB1c2giLCAidmFsdWUiLCAibGluZXMiLCAiY29udGV4dExpbmVzIiwgIm1hcCIsICJlbnRyeSIsICJodW5rcyIsICJvbGRSYW5nZVN0YXJ0IiwgIm5ld1JhbmdlU3RhcnQiLCAiY3VyUmFuZ2UiLCAib2xkTGluZSIsICJuZXdMaW5lIiwgIl9sb29wIiwgImkiLCAiY3VycmVudCIsICJyZXBsYWNlIiwgInNwbGl0IiwgImFkZGVkIiwgInJlbW92ZWQiLCAicHJldiIsICJzbGljZSIsICJsZW5ndGgiLCAiY29udGV4dFNpemUiLCAiTWF0aCIsICJtaW4iLCAiaHVuayIsICJvbGRTdGFydCIsICJvbGRMaW5lcyIsICJuZXdTdGFydCIsICJuZXdMaW5lcyIsICJvbGRFT0ZOZXdsaW5lIiwgInRlc3QiLCAibmV3RU9GTmV3bGluZSIsICJub05sQmVmb3JlQWRkcyIsICJzcGxpY2UiLCAiZm9ybWF0UGF0Y2giLCAiQXJyYXkiLCAiaXNBcnJheSIsICJqb2luIiwgInJldCIsICJhcHBseSIsICJjcmVhdGVUd29GaWxlc1BhdGNoIiwgImNyZWF0ZVBhdGNoIiwgImZpbGVOYW1lIiwgImFycmF5RXF1YWwiLCAiYSIsICJiIiwgImxlbmd0aCIsICJhcnJheVN0YXJ0c1dpdGgiLCAiYXJyYXkiLCAic3RhcnQiLCAiaSIsICJjYWxjTGluZUNvdW50IiwgImh1bmsiLCAiY2FsY09sZE5ld0xpbmVDb3VudCIsICJsaW5lcyIsICJvbGRMaW5lcyIsICJuZXdMaW5lcyIsICJ1bmRlZmluZWQiLCAibWVyZ2UiLCAibWluZSIsICJ0aGVpcnMiLCAiYmFzZSIsICJsb2FkUGF0Y2giLCAicmV0IiwgImluZGV4IiwgIm5ld0ZpbGVOYW1lIiwgImZpbGVOYW1lQ2hhbmdlZCIsICJvbGRGaWxlTmFtZSIsICJvbGRIZWFkZXIiLCAibmV3SGVhZGVyIiwgInNlbGVjdEZpZWxkIiwgImh1bmtzIiwgIm1pbmVJbmRleCIsICJ0aGVpcnNJbmRleCIsICJtaW5lT2Zmc2V0IiwgInRoZWlyc09mZnNldCIsICJsZW5ndGgiLCAibWluZUN1cnJlbnQiLCAib2xkU3RhcnQiLCAiSW5maW5pdHkiLCAidGhlaXJzQ3VycmVudCIsICJodW5rQmVmb3JlIiwgInB1c2giLCAiY2xvbmVIdW5rIiwgIm1lcmdlZEh1bmsiLCAiTWF0aCIsICJtaW4iLCAibmV3U3RhcnQiLCAibWVyZ2VMaW5lcyIsICJwYXJhbSIsICJ0ZXN0IiwgInBhcnNlUGF0Y2giLCAiRXJyb3IiLCAic3RydWN0dXJlZFBhdGNoIiwgInBhdGNoIiwgImNvbmZsaWN0IiwgImNoZWNrIiwgIm9mZnNldCIsICJtaW5lTGluZXMiLCAidGhlaXJPZmZzZXQiLCAidGhlaXJMaW5lcyIsICJ0aGVpciIsICJpbnNlcnRMZWFkaW5nIiwgInRoZWlyQ3VycmVudCIsICJtdXR1YWxDaGFuZ2UiLCAiY29sbGVjdENoYW5nZSIsICJyZW1vdmFsIiwgImluc2VydFRyYWlsaW5nIiwgIm15Q2hhbmdlcyIsICJ0aGVpckNoYW5nZXMiLCAiYWxsUmVtb3ZlcyIsICJhcnJheVN0YXJ0c1dpdGgiLCAic2tpcFJlbW92ZVN1cGVyc2V0IiwgImFycmF5RXF1YWwiLCAic3dhcCIsICJjb2xsZWN0Q29udGV4dCIsICJtZXJnZWQiLCAiaW5zZXJ0IiwgImxpbmUiLCAic3RhdGUiLCAib3BlcmF0aW9uIiwgIm1hdGNoQ2hhbmdlcyIsICJjaGFuZ2VzIiwgIm1hdGNoSW5kZXgiLCAiY29udGV4dENoYW5nZXMiLCAiY29uZmxpY3RlZCIsICJjaGFuZ2UiLCAibWF0Y2giLCAic3Vic3RyIiwgInJlZHVjZSIsICJwcmV2IiwgInJlbW92ZUNoYW5nZXMiLCAiZGVsdGEiLCAiaSIsICJjaGFuZ2VDb250ZW50IiwgImZvckVhY2giLCAibXlDb3VudCIsICJ0aGVpckNvdW50IiwgInJldmVyc2VQYXRjaCIsICJzdHJ1Y3R1cmVkUGF0Y2giLCAiQXJyYXkiLCAiaXNBcnJheSIsICJtYXAiLCAicmV2ZXJzZSIsICJvbGRGaWxlTmFtZSIsICJuZXdGaWxlTmFtZSIsICJvbGRIZWFkZXIiLCAibmV3SGVhZGVyIiwgImh1bmtzIiwgImh1bmsiLCAib2xkTGluZXMiLCAibmV3TGluZXMiLCAib2xkU3RhcnQiLCAibmV3U3RhcnQiLCAibGluZWRlbGltaXRlcnMiLCAibGluZXMiLCAibCIsICJzdGFydHNXaXRoIiwgInNsaWNlIiwgImNvbnZlcnRDaGFuZ2VzVG9ETVAiLCAiY2hhbmdlcyIsICJyZXQiLCAiY2hhbmdlIiwgIm9wZXJhdGlvbiIsICJpIiwgImxlbmd0aCIsICJhZGRlZCIsICJyZW1vdmVkIiwgInB1c2giLCAidmFsdWUiLCAiY29udmVydENoYW5nZXNUb1hNTCIsICJjaGFuZ2VzIiwgInJldCIsICJpIiwgImxlbmd0aCIsICJjaGFuZ2UiLCAiYWRkZWQiLCAicHVzaCIsICJyZW1vdmVkIiwgImVzY2FwZUhUTUwiLCAidmFsdWUiLCAiam9pbiIsICJzIiwgIm4iLCAicmVwbGFjZSJdCn0K
