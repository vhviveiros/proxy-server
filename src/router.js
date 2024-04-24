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
exports.RouterSession = exports.RouterInterface = void 0;
const ts_md5_1 = require("ts-md5");
const script_finder_1 = require("./script-finder");
const axios_1 = __importDefault(require("axios"));
class RouterInterface {
}
exports.RouterInterface = RouterInterface;
class RouterSession extends RouterInterface {
    constructor(autoReauth = true, authRetries = 3, timeout) {
        super();
        this.routerSettings = require('../assets/router-settings.json');
        this.count = 0;
        this.pageCount = 0;
        this.pageLoadCount = 0;
        this.getCount = 0;
        this.REAUTH_SUBSTR = 'cookie="Authorization=;path=/"';
        this.host = this.routerSettings.ip;
        this.autoReauth = autoReauth;
        this.authRetries = Math.max(authRetries, 0);
        this.timeout = timeout;
        const username = this.routerSettings.login;
        const password = this.routerSettings.password;
        const passwordHash = ts_md5_1.Md5.hashStr(password);
        const basicRaw = `${username}:${passwordHash}`;
        this.basicToken = Buffer.from(basicRaw).toString('base64');
        this.cookie = `Authorization=Basic ${this.basicToken}`;
    }
    isSessionValid() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.pageUrl("Index");
            const resp = yield this.get(url);
            const reauth = yield this.isReauthDoc(resp.data);
            return !reauth;
        });
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            this.count++;
            console.log(`Refreshing token for ${this.count} time...`);
            const attempts = this.authRetries + 1;
            for (let retry = 0; retry < attempts; retry++) {
                const resp = yield this.get(`${this.baseUrl()}/userRpm/LoginRpm.htm?Save=Save`);
                const match = new RegExp(`${this.host}/(\\w+)/`).exec(resp.data);
                if (match) {
                    this.token = match[1];
                    if (yield this.isSessionValid()) {
                        return;
                    }
                }
            }
            throw new Error(`Failed to get auth token with specified username and password after ${attempts} attempts`);
        });
    }
    baseUrl() {
        return `http://${this.host}`;
    }
    pageUrl(name) {
        return `${this.baseUrl()}/${this.token}/userRpm/${name}.htm`;
    }
    page(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pageCount++;
            console.log(`Paging page ${name} for ${this.pageCount} time...`);
            let retry = false;
            while (true) {
                const doc = yield this.pageLoadAttempt(name, params);
                //doc should be complete already
                if (!(yield this.isReauthDoc(doc))) {
                    return doc;
                }
                if (retry || !this.autoReauth) {
                    throw new Error(`Failed to load page ${name}. Firmware of the router may not support this feature`);
                }
                retry = true;
                yield this.refreshToken();
            }
        });
    }
    pageLoadAttempt(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pageLoadCount++;
            console.log(`Loading page ${name} for ${this.pageLoadCount} time...`);
            const url = this.pageUrl(name);
            const referer = this.pageUrl("MenuRpm");
            const resp = yield this.get(url, referer);
            if (resp.status !== 200) {
                throw new Error(`HTTP code ${resp.status}`);
            }
            return resp.data;
        });
    }
    get(url, referer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.getCount++;
            console.log(`Getting ${this.getCount} time...`);
            try {
                const headers = {
                    Cookie: this.cookie,
                    Referer: referer
                };
                this.headers = headers;
                const returnValue = yield axios_1.default.get(url, { headers: headers });
                console.log(returnValue.data);
                return returnValue;
            }
            catch (e) {
                throw e;
            }
        });
    }
    isReauthDoc(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const scripts = (0, script_finder_1.findScripts)(doc);
            const firstScript = scripts[0];
            return firstScript.includes(this.REAUTH_SUBSTR);
        });
    }
}
exports.RouterSession = RouterSession;
//# sourceMappingURL=router.js.map