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
exports.Test = void 0;
const ts_md5_1 = require("ts-md5");
const axios_1 = __importDefault(require("axios"));
class Test {
    constructor() {
        this.begin();
    }
    begin() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Test begin");
            const username = "vhviv";
            const password = "0912";
            const url = 'http://192.168.1.3/JVKAIKQCNPCWJBLA/userRpm/StatusRpm.htm';
            const passwordHash = ts_md5_1.Md5.hashStr(password);
            const basicRaw = `${username}:${passwordHash}`;
            const basicToken = Buffer.from(basicRaw).toString('base64');
            const cookies = "Authorization=Basic dmh2aXY6YWY0YTU3Nzk3YTg0Mjg0NzdmYTllYmQ0ZWE3Mzk3YmE=";
            const headers = {
                "Cookie": cookies,
                "Referer": "http://192.168.1.3/JVKAIKQCNPCWJBLA/userRpm/MenuRpm.htm"
            };
            const resp = yield axios_1.default.get(url, { headers: headers });
            console.log(resp.data);
        });
    }
}
exports.Test = Test;
new Test();
//# sourceMappingURL=test.js.map