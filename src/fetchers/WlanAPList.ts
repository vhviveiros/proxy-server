import { RouterSession } from "../RouterSession"
import { extractVars } from "../utils"
import { Fetcher } from "./fetcher"

export interface WlanAp {
    bssid: string
    ssid: string
    signal: string
    channel: string
    security: string
}

export enum WlanAPSecurity {
    "NONE" = 0,
    "WEP" = 1,
    "WPA-PSK" = 2,
    "WPA2-PSK" = 3,
    "WPA" = 4,
    "WPA2" = 5,
    "WPA-PSK/WPA2-PSK" = 6,
    "WPA/WPA2" = 7
}

export class WlanApList extends Fetcher {
    readonly referer = 'WlanNetworkRpm'
    readonly page = 'popupSiteSurveyRpm'
    public apList: WlanAp[] | undefined


    async fetch(router: RouterSession): Promise<WlanApList> {
        console.log(`Fetching Wlan Ap List...`)
        const doc = await router.page(router.pageUrl(this.page), router.pageUrl(this.referer))
        const siteList = Object.values(extractVars(doc, ["siteList"]))
        this.apList = this.convertSiteList(siteList[0])
        console.log("...done.")
        console.log(`Wlan Ap List: ${JSON.stringify(this.apList)}`)
        return this
    }

    private convertSiteList(siteList: any[]): WlanAp[] {
        const wlanAPs: WlanAp[] = []
        for (let i = 0; i < siteList.length; i += 5) {
            const wlanAP: WlanAp = {
                bssid: siteList[i],
                ssid: siteList[i + 1],
                signal: siteList[i + 2],
                channel: siteList[i + 3],
                security: siteList[i + 4]
            }
            wlanAPs.push(wlanAP)
        }
        return wlanAPs
    }

}