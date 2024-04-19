"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const ts_md5_1 = require("ts-md5");
const axios_1 = __importDefault(require("axios"));
class Test {
    constructor() {
        this.begin();
    }
    begin() {
        console.log("Test begin");
        const username = "vhviv";
        const password = "0912";
        const url = 'http://192.168.1.3/userRpm/LoginRpm.htm?Save=Save';
        const passwordHash = ts_md5_1.Md5.hashStr(password);
        const basicRaw = `${username}:${passwordHash}`;
        const basicToken = Buffer.from(basicRaw).toString('base64');
        const cookies = `Authorization=Basic ${basicToken};`;
        axios_1.default.get(url, { headers: { 'Cookie': cookies } }).then((response) => {
            console.log(response.data);
        });
    }
}
exports.Test = Test;
//# sourceMappingURL=test.js.map