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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralStatus = void 0;
const utils_1 = require("./utils"); // Assuming extractVars is in the same directory
const fetcher_1 = require("./fetcher"); // Assuming Fetcher is in the same directory
var RouterType;
(function (RouterType) {
    RouterType[RouterType["Wan"] = 1] = "Wan";
    RouterType[RouterType["With3G"] = 2] = "With3G";
    RouterType[RouterType["Apc"] = 4] = "Apc";
    RouterType[RouterType["Pure3G"] = 16] = "Pure3G";
})(RouterType || (RouterType = {}));
var WlanType;
(function (WlanType) {
    WlanType[WlanType["Unknown"] = 0] = "Unknown";
    WlanType[WlanType["B"] = 1] = "B";
    WlanType[WlanType["G"] = 2] = "G";
    WlanType[WlanType["N"] = 3] = "N";
    WlanType[WlanType["BgMixed"] = 4] = "BgMixed";
    WlanType[WlanType["GnMixed"] = 5] = "GnMixed";
    WlanType[WlanType["BgnMixed"] = 6] = "BgnMixed";
    WlanType[WlanType["A"] = 7] = "A";
    WlanType[WlanType["NDupl"] = 8] = "NDupl";
    WlanType[WlanType["AnMixed"] = 9] = "AnMixed";
})(WlanType || (WlanType = {}));
var WlanChannelWidth;
(function (WlanChannelWidth) {
    WlanChannelWidth[WlanChannelWidth["Unknown"] = 0] = "Unknown";
    WlanChannelWidth[WlanChannelWidth["Mhz20"] = 1] = "Mhz20";
    WlanChannelWidth[WlanChannelWidth["Auto"] = 2] = "Auto";
    WlanChannelWidth[WlanChannelWidth["Mhz40"] = 3] = "Mhz40";
})(WlanChannelWidth || (WlanChannelWidth = {}));
var WdsStatus;
(function (WdsStatus) {
    WdsStatus[WdsStatus["Init"] = 0] = "Init";
    WdsStatus[WdsStatus["Scan"] = 1] = "Scan";
    WdsStatus[WdsStatus["Join"] = 2] = "Join";
    WdsStatus[WdsStatus["Auth"] = 3] = "Auth";
    WdsStatus[WdsStatus["Assoc"] = 4] = "Assoc";
    WdsStatus[WdsStatus["Run"] = 5] = "Run";
    WdsStatus[WdsStatus["Disable"] = 6] = "Disable";
})(WdsStatus || (WdsStatus = {}));
var WanLinkStatus;
(function (WanLinkStatus) {
    WanLinkStatus[WanLinkStatus["Unknown"] = 0] = "Unknown";
    WanLinkStatus[WanLinkStatus["Disabled"] = 1] = "Disabled";
    WanLinkStatus[WanLinkStatus["Timeout"] = 2] = "Timeout";
    WanLinkStatus[WanLinkStatus["LinkDown"] = 3] = "LinkDown";
    WanLinkStatus[WanLinkStatus["LinkUp"] = 4] = "LinkUp";
})(WanLinkStatus || (WanLinkStatus = {}));
var WanType;
(function (WanType) {
    WanType[WanType["Unknown"] = 0] = "Unknown";
    WanType[WanType["Dynamic"] = 1] = "Dynamic";
    WanType[WanType["Static"] = 2] = "Static";
    WanType[WanType["Pppoe"] = 3] = "Pppoe";
    WanType[WanType["Dynamic1X"] = 4] = "Dynamic1X";
    WanType[WanType["Static1X"] = 5] = "Static1X";
    WanType[WanType["Bigpond"] = 6] = "Bigpond";
    WanType[WanType["L2tp"] = 7] = "L2tp";
    WanType[WanType["Pptp"] = 8] = "Pptp";
})(WanType || (WanType = {}));
class GeneralStatus extends fetcher_1.Fetcher {
    constructor(status) {
        super();
        this.wireless = status === null || status === void 0 ? void 0 : status.wireless;
        this.uptime = status === null || status === void 0 ? void 0 : status.uptime;
        this.firmware = status === null || status === void 0 ? void 0 : status.firmware;
        this.hardware = status === null || status === void 0 ? void 0 : status.hardware;
        this.deviceType = status === null || status === void 0 ? void 0 : status.deviceType;
        this.mode3G = status === null || status === void 0 ? void 0 : status.mode3G;
        this.rxBytes = status === null || status === void 0 ? void 0 : status.rxBytes;
        this.txBytes = status === null || status === void 0 ? void 0 : status.txBytes;
        this.rxPackets = status === null || status === void 0 ? void 0 : status.rxPackets;
        this.txPackets = status === null || status === void 0 ? void 0 : status.txPackets;
        this.lan = status === null || status === void 0 ? void 0 : status.lan;
        this.wlan = status === null || status === void 0 ? void 0 : status.wlan;
        this.wan = status === null || status === void 0 ? void 0 : status.wan;
    }
    fetch(router) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield router.page("StatusRpm");
            const { general, lan, wlan, statist, wan } = yield (0, utils_1.extractVars)(doc, [
                "statusPara",
                "lanPara",
                "wlanPara",
                "statistList",
                "wanPara",
            ]);
            const status = Object.assign(Object.assign(Object.assign({}, this.parseStatus(general)), this.parseStatist(statist)), { "lan": this.parseLan(lan), "wlan": this.parseWlan(wlan, general), "wan": this.parseWan(wan, general) });
            const statusObj = new GeneralStatus(status);
            return statusObj;
        });
    }
    parseStatus(status) {
        return {
            "wireless": Boolean(status[0]),
            "uptime": status[4],
            "firmware": status[5],
            "hardware": status[6],
            "deviceType": RouterType[status[7]],
            "mode3G": Boolean(status[8]),
        };
    }
    parseStatist(statist) {
        const statistParse = (value) => parseInt(value.replace(",", ""));
        return {
            "rxBytes": statistParse(statist[0]),
            "txBytes": statistParse(statist[1]),
            "rxPackets": statistParse(statist[2]),
            "txPackets": statistParse(statist[3]),
        };
    }
    parseLan(lan) {
        return {
            mac: lan[0],
            ip: lan[1],
            mask: lan[2],
        };
    }
    parseWlan(wlan, general) {
        if (!general[0]) {
            return null;
        }
        return {
            enabled: Boolean(wlan[0]),
            name: wlan[1],
            type: Number(WlanType[wlan[3]]),
            channelManual: wlan[2] === 15 ? null : wlan[2],
            channelWidth: Number(WlanChannelWidth[wlan[6]]),
            channelAuto: wlan[9],
            mac: wlan[4],
            ip: wlan[5],
            wdsStatus: Number(WdsStatus[wlan[10]]),
        };
    }
    parseWan(wan, general) {
        const wanCount = general[1];
        const wanParamsPerItem = general[2];
        if (wan.length !== wanCount * wanParamsPerItem || wanParamsPerItem < 12) {
            throw new Error("Assertion failed");
        }
        const result = [];
        for (let i = 0; i < wanCount; i++) {
            const base = i * wanParamsPerItem;
            const wanStatus = {
                linkStatus: Number(WanLinkStatus[wan[base]]),
                mac: wan[base + 1],
                ip: wan[base + 2],
                type: Number(WanType[wan[base + 3]]),
                mask: wan[base + 4],
                gateway: wan[base + 7],
                dns: wan[base + 11],
            };
            result.push(wanStatus);
        }
        return result;
    }
}
exports.GeneralStatus = GeneralStatus;
//# sourceMappingURL=status.js.map