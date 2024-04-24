"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findScripts = exports.ScriptFinder = void 0;
const htmlparser2_1 = require("htmlparser2");
class ScriptFinder {
    constructor() {
        this.scripts = [];
        this.scriptInProgress = false;
        this.currentScript = '';
    }
    close() {
        this.scripts = undefined;
        this.scriptInProgress = false;
        this.currentScript = undefined;
    }
    handleStartTag(tag) {
        if (tag !== 'script')
            return;
        this.scriptInProgress = true;
        this.currentScript = '';
    }
    handleEndTag(tag) {
        var _a, _b;
        if (tag !== 'script')
            return;
        this.scriptInProgress = false;
        if ((_a = this.currentScript) === null || _a === void 0 ? void 0 : _a.trim()) {
            (_b = this.scripts) === null || _b === void 0 ? void 0 : _b.push(this.currentScript);
        }
        this.currentScript = '';
    }
    handleData(data) {
        if (!this.scriptInProgress)
            return;
        this.currentScript += data;
    }
}
exports.ScriptFinder = ScriptFinder;
function findScripts(data) {
    var _a;
    const finder = new ScriptFinder();
    const parser = new htmlparser2_1.Parser({
        onopentag: (name) => finder.handleStartTag(name),
        ontext: (text) => finder.handleData(text),
        onclosetag: (name) => finder.handleEndTag(name),
    });
    parser.write(data);
    parser.end();
    return (_a = finder.scripts) !== null && _a !== void 0 ? _a : [];
}
exports.findScripts = findScripts;
//# sourceMappingURL=script-finder.js.map