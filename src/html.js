"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findScripts = exports.ScriptFinder = void 0;
const jsdom_1 = require("jsdom");
class ScriptFinder {
    constructor() {
        this.scripts = [];
        this.scriptInProgress = false;
        this.currentScript = "";
    }
    getScripts() {
        return this.scripts;
    }
    close() {
        this.scripts = [];
        this.scriptInProgress = false;
    }
    handleStartTag(tag) {
        if (tag !== "script") {
            return;
        }
        this.scriptInProgress = true;
        this.currentScript = "";
    }
    handleEndTag(tag) {
        if (tag !== "script") {
            return;
        }
        this.scriptInProgress = false;
        if (this.currentScript.trim()) {
            this.scripts.push(this.currentScript);
        }
        this.currentScript = "";
    }
    handleData(data) {
        if (!this.scriptInProgress) {
            return;
        }
        this.currentScript += data;
    }
    feed(data) {
        const dom = new jsdom_1.JSDOM(data);
        const scripts = dom.window.document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            this.handleStartTag('script');
            this.handleData(scripts[i].textContent || '');
            this.handleEndTag('script');
        }
    }
}
exports.ScriptFinder = ScriptFinder;
function findScripts(data) {
    const finder = new ScriptFinder();
    finder.feed(data);
    const scripts = finder.getScripts();
    return scripts;
}
exports.findScripts = findScripts;
//# sourceMappingURL=html.js.map