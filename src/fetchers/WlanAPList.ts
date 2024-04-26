import { RouterSession } from "../RouterSession"
import { extractVars } from "../utils"
import { Fetcher } from "./fetcher"

enum securityType {
    WpaWpa2 = 3
}

interface WlanAP {
    bssid: string
    ssid: string
    signal: number
    channel: number
    security: number
}

export class WlanAPList extends Fetcher {
    readonly referer = 'WlanNetworkRpm'
    bssid?: string
    ssid?: string
    channel?: number

    constructor(wlanap?: WlanAP) {
        super()
        this.bssid = wlanap?.bssid
        this.ssid = wlanap?.ssid
        this.channel = wlanap?.channel
    }

    async fetch(router: RouterSession): Promise<WlanAPList> {
        const doc = await router.page("popupSiteSurveyRpm", router.pageUrl(this.referer))

        const [bssid, ssid, signal, channel, security] = Object.values(extractVars(doc, ["siteList"]))

        return new WlanAPList({ bssid, ssid, signal, channel, security })
    }
}