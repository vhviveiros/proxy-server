"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findScripts = exports.ScriptFinder = void 0;
const axios_1 = __importDefault(require("axios"));
const jsdom_1 = require("jsdom");
class ScriptFinder {
    constructor() {
        this.scripts = [];
        this.scriptInProgress = false;
        this.currentScript = '';
    }
    getScripts() {
        return this.scripts;
    }
    close() {
        this.scripts = [];
        this.scriptInProgress = false;
        this.currentScript = '';
    }
    handleStartTag(tag) {
        if (tag !== 'script')
            return;
        this.scriptInProgress = true;
        this.currentScript = '';
    }
    handleEndTag(tag) {
        if (tag !== 'script')
            return;
        this.scriptInProgress = false;
        if (this.currentScript.trim()) {
            this.scripts.push(this.currentScript);
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
function findScripts(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(url);
        const dom = new jsdom_1.JSDOM(response.data);
        const finder = new ScriptFinder();
        const { document } = dom.window;
        const scripts = Array.from(document.getElementsByTagName('script'));
        scripts.forEach(script => {
            finder.handleStartTag('script');
            const textContent = script.textContent;
            if (textContent !== null) {
                finder.handleData(textContent);
            }
            finder.handleEndTag('script');
        });
        return finder.getScripts();
    });
}
exports.findScripts = findScripts;
//# sourceMappingURL=script-finder.js.map