"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const axios_1 = __importDefault(require("axios"));
const ts_md5_1 = require("ts-md5");
class Page {
    constructor(credentials, baseUrl) {
        this.credentials = credentials;
        this.baseUrl = baseUrl;
        this.headers = {
            'Authorization': `Basic%20dmh2aXY6YWY0YTU3Nzk3YTg0Mjg0NzdmYTllYmQ0ZWE3Mzk3YmE%3D`,
            'Content-Type': 'text/plain',
            'Host': '192.168.1.3',
            // 'Referer': this.pageUrl('MenuRpm')
            'Referer': "http://192.168.1.3/FBXKQYEAZUSVKIEA/userRpm/popupSiteSurveyRpm.htm?select=true&wrr=true&sb=false&ssid1=TP-LINK_72F6&curRegion=101&channel=1&chanWidth=2&mode=5&rate=71&enssid2=false"
        };
        this.session = axios_1.default.create({
            headers: this.headers
        });
        console.log(this.session.defaults.headers);
    }
    basicToken() {
        let passwordHash = ts_md5_1.Md5.hashStr(this.credentials.pcPassword);
        let basicRaw = `${this.credentials.userName}:${passwordHash}`;
        let basicToken = Buffer.from(basicRaw).toString('base64');
        return "FBXKQYEAZUSVKIEA";
    }
    loadPage(url) {
        const params = new URLSearchParams();
        params.set('userName', this.credentials.userName);
        params.set('pcPassword', this.credentials.pcPassword);
        return this.session.get(url);
    }
    pageUrl(name) {
        const url = `${this.baseUrl}/${this.basicToken()}/userRpm/${name}.htm`;
        console.log(url);
        return url;
    }
}
exports.Page = Page;
//# sourceMappingURL=page.js.map