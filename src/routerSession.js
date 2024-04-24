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
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const typescript_optional_1 = require("typescript-optional");
class RouterInterface {
}
class RouterSession extends RouterInterface {
    constructor(host, username, password, autoReauth = true, authRetries = 3, timeout) {
        super();
        this.host = host;
        this.autoReauth = autoReauth;
        this.authRetries = Math.max(authRetries, 0);
        this.timeout = typescript_optional_1.Optional.ofNullable(timeout);
        const passwordHash = crypto_1.default.createHash('md5').update(password).digest('hex');
        const basicRaw = `${username}:${passwordHash}`;
        const basicToken = Buffer.from(basicRaw).toString('base64');
        this.session = axios_1.default.create({
            baseURL: `http://${this.host}`,
            timeout: this.timeout.orElse(0),
            headers: { 'Authorization': `Basic ${basicToken}` }
        });
        this.refreshToken();
    }
    isSessionValid() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.pageUrl("Index");
            const resp = yield this._get(url);
            const reauth = RouterSession._isReauthDoc(resp.data);
            return !reauth;
        });
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const attempts = this.authRetries + 1;
            for (let retry = 0; retry < attempts; retry++) {
                const resp = yield this._get(`/userRpm/LoginRpm.htm?Save=Save`);
                const match = resp.data.match(new RegExp(`${this.host}/(\\w+)/`));
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
    base_url() {
        return `http://${this.host}`;
    }
    pageUrl(name) {
        return `${this.base_url()}/${this.token}/userRpm/${name}.htm`;
    }
    page(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let retry = false;
            while (true) {
                const doc = yield this._pageLoadAttempt(name, params);
                if (!RouterSession._isReauthDoc(doc)) {
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
    _pageLoadAttempt(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.pageUrl(name);
            const referer = this.pageUrl("MenuRpm");
            const resp = yield this._get(url, { params: params, headers: { "Referer": referer } });
            if (resp.status !== 200) {
                throw new Error(`HTTP code ${resp.status}`);
            }
            return resp.data;
        });
    }
    _get(url, config) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.session.get(url, config);
            }
            catch (e) {
                throw e;
            }
        });
    }
    static _isReauthDoc(doc) {
        const firstScript = doc.split('<script>')[1].split('</script>')[0];
        return firstScript.includes(this.REAUTH_SUBSTR);
    }
}
RouterSession.REAUTH_SUBSTR = 'cookie="Authorization=;path=/"';
//# sourceMappingURL=routerSession.js.map