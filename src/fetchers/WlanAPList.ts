import { RouterSession } from "../RouterSession"
import { extractVars } from "../utils"
import { Fetcher } from "./fetcher"

interface WlanAP {
    bssid: string
    ssid: string
    signal: string
    channel: string
    security: string
}

enum WlanAPSecurity {
    "NONE" = 0,
    "WEP" = 1,
    "WPA-PSK" = 2,
    "WPA2-PSK" = 3,
    "WPA" = 4,
    "WPA2" = 5,
    "WPA-PSK/WPA2-PSK" = 6,
    "WPA/WPA2" = 7
}

export class WlanAPList extends Fetcher {
    readonly referer = 'WlanNetworkRpm'
    public apList: WlanAP[] | undefined


    async fetch(router: RouterSession): Promise<WlanAPList> {
        const doc = await router.page("popupSiteSurveyRpm", router.pageUrl(this.referer))
        const siteList = Object.values(extractVars(doc, ["siteList"]))
        this.apList = this.convertSiteList(siteList[0])
        return this
    }

    private convertSiteList(siteList: any[]): WlanAP[] {
        const wlanAPs: WlanAP[] = []
        for (let i = 0; i < siteList.length; i += 5) {
            const wlanAP: WlanAP = {
                bssid: siteList[i],
                ssid: siteList[i + 1],
                signal: siteList[i + 2],
                channel: siteList[i + 3],
                security: WlanAPSecurity[siteList[i + 4]]
            }
            wlanAPs.push(wlanAP)
        }
        return wlanAPs
    }

}