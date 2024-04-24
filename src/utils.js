"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVar = exports.parseArray = exports.parsePrimitive = exports.parseVar = exports.findVar = exports.extractVars = void 0;
const html_1 = require("./html");
function extractVars(document, vars) {
    let jsVars = {};
    for (let v of vars) {
        jsVars[v] = null;
    }
    let scripts = (0, html_1.findScripts)(document);
    for (let script of scripts) {
        for (let v in jsVars) {
            if (jsVars[v] === null) {
                jsVars[v] = getVar(v, script);
            }
        }
    }
    return jsVars;
}
exports.extractVars = extractVars;
function findVar(name, script) {
    const match = script.match(new RegExp(`\\s+${name}\\s*=\\s*([^\\s]([\\s\\S]*?[^\\s])??)\\s*;`));
    return match ? match[1] : null;
}
exports.findVar = findVar;
function parseVar(varStr) {
    let array = parseArray(varStr);
    if (array !== null) {
        return array;
    }
    return parsePrimitive(varStr);
}
exports.parseVar = parseVar;
function parsePrimitive(value) {
    try {
        return JSON.parse(value);
    }
    catch (error) {
        return null;
    }
}
exports.parsePrimitive = parsePrimitive;
function parseArray(value, stripZeros = true) {
    const match = value.match(/new\s+Array\(([\s\S]*)\)/);
    if (!match) {
        return null;
    }
    const content = match[1];
    const valueWrapped = `[${content}]`;
    const values = parsePrimitive(valueWrapped);
    if (stripZeros && values.slice(-2).every((v) => v === 0)) {
        return values.slice(0, -2);
    }
    return values;
}
exports.parseArray = parseArray;
function getVar(name, script) {
    const varStr = findVar(name, script);
    if (!varStr) {
        return null;
    }
    return parseVar(varStr);
}
exports.getVar = getVar;
//# sourceMappingURL=utils.js.map