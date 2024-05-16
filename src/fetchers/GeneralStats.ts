import { RouterInterface } from '../RouterSession'
import { extractVars } from '../utils' // Assuming extractVars is in the same directory
import { Fetcher } from './fetcher'

enum RouterType {
    Wan = 1,
    With3G = 2,
    Apc = 4,
    Pure3G = 16
}

enum WlanType {
    Unknown = 0,
    B = 1,
    G = 2,
    N = 3,
    BgMixed = 4,
    GnMixed = 5,
    BgnMixed = 6,
    A = 7,
    NDupl = 8,
    AnMixed = 9
}

enum WlanChannelWidth {
    Unknown = 0,
    Mhz20 = 1,
    Auto = 2,
    Mhz40 = 3
}

enum WdsStatus {
    Init = 0,
    Scan = 1,
    Join = 2,
    Auth = 3,
    Assoc = 4,
    Run = 5,
    Disable = 6
}

enum WanLinkStatus {
    Unknown = 0,
    Disabled = 1,
    Timeout = 2,
    LinkDown = 3,
    LinkUp = 4
}

enum WanType {
    Unknown = 0,
    Dynamic = 1,
    Static = 2,
    Pppoe = 3,
    Dynamic1X = 4,
    Static1X = 5,
    Bigpond = 6,
    L2tp = 7,
    Pptp = 8
}

interface LanStatus {
    mac: string
    ip: string
    mask: string
}

interface WlanStatus {
    enabled: boolean
    name: string
    type: string
    channelManual: string | null
    channelAuto: string | null
    channelWidth: string
    mac: string
    ip: string
    wdsStatus: string
}

interface WanStatus {
    linkStatus: number
    mac: string
    ip: string
    type: number
    mask: string
    gateway: string
    dns: string
}

export class GeneralStatus extends Fetcher {
    referer: string = ''
    page: string = "StatusRpm.htm"

    wireless: boolean
    uptime: number
    firmware: string
    hardware: string
    deviceType: RouterType
    mode3G: boolean

    rxBytes: number
    txBytes: number
    rxPackets: number
    txPackets: number

    lan: LanStatus
    wlan: WlanStatus | null
    wan: WanStatus[]

    constructor(status?: any | undefined) {
        super()
        this.wireless = status?.wireless
        this.uptime = status?.uptime
        this.firmware = status?.firmware
        this.hardware = status?.hardware
        this.deviceType = status?.deviceType
        this.mode3G = status?.mode3G

        this.rxBytes = status?.rxBytes
        this.txBytes = status?.txBytes
        this.rxPackets = status?.rxPackets
        this.txPackets = status?.txPackets

        this.lan = status?.lan
        this.wlan = status?.wlan
        this.wan = status?.wan
    }


    async fetch(router: RouterInterface): Promise<GeneralStatus> {
        //doc receives the data from file "results.txt"
        const doc = await router.page(router.pageUrl(this.page))
        //Doc must have all the router info already
        const [general, lan, wlan, statist, wan] = Object.values(extractVars(doc, [
            "statusPara", "lanPara", "wlanPara", "statistList", "wanPara"
        ]))

        const status = {
            ...this.parseStatus(general!),
            ...this.parseStatist(statist!),
            "lan": this.parseLan(lan!),
            "wlan": this.parseWlan(wlan!, general!),
            "wan": this.parseWan(wan!, general!),
        }

        return new GeneralStatus(status)
    }

    parseStatus(status: any[]): { [key: string]: any } {
        return {
            "wireless": Boolean(status[0]),
            "uptime": status[4],
            "firmware": status[5],
            "hardware": status[6],
            "deviceType": RouterType[status[7]],
            "mode3G": Boolean(status[8]),
        }
    }

    parseStatist(statist: any[]): { [key: string]: number } {
        const statistParse = (value: string): number => parseInt(value.replace(",", ""))
        return {
            "rxBytes": statistParse(statist[0]),
            "txBytes": statistParse(statist[1]),
            "rxPackets": statistParse(statist[2]),
            "txPackets": statistParse(statist[3]),
        }
    }

    parseLan(lan: any[]): LanStatus {
        return {
            mac: lan[0],
            ip: lan[1],
            mask: lan[2],
        }
    }

    parseWlan(wlan: any[], general: any[]): WlanStatus | null {
        if (!general[0]) {
            return null
        }

        return {
            enabled: Boolean(wlan[0]),
            name: wlan[1],
            type: WlanType[wlan[3]],
            channelManual: wlan[2] === 15 ? null : wlan[2],
            channelWidth: WlanChannelWidth[wlan[6]],
            channelAuto: wlan[9],
            mac: wlan[4],
            ip: wlan[5],
            wdsStatus: WdsStatus[wlan[10]],
        }
    }

    parseWan(wan: any[], general: any[]): WanStatus[] {
        const wanCount = general[1]
        const wanParamsPerItem = general[2]
        if (wan.length !== wanCount * wanParamsPerItem || wanParamsPerItem < 12) {
            throw new Error("Assertion failed")
        }

        const result: WanStatus[] = []
        for (let i = 0; i < wanCount; i++) {
            const base = i * wanParamsPerItem
            const wanStatus: WanStatus = {
                linkStatus: Number(WanLinkStatus[wan[base]]),
                mac: wan[base + 1],
                ip: wan[base + 2],
                type: Number(WanType[wan[base + 3]]),
                mask: wan[base + 4],
                gateway: wan[base + 7],
                dns: wan[base + 11],
            }
            result.push(wanStatus)
        }

        return result
    }
}