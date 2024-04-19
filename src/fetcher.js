"use strict";
// Abstract class Fetcher
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fetcher = void 0;
class Fetcher {
    toDict() {
        return this.asdict(this);
    }
    asdict(obj) {
        if (obj instanceof Object) {
            const result = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    result[key] = typeof obj[key] === 'object' ? this.asdict(obj[key]) : obj[key];
                }
            }
            return result;
        }
        return obj;
    }
}
exports.Fetcher = Fetcher;
//# sourceMappingURL=fetcher.js.map