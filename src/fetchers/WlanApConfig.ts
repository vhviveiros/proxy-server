import { RouterInterface } from "../RouterSession"
import { Fetcher } from "./fetcher"
import { GeneralStatus } from "./GeneralStats"
import { WlanAp } from "./WlanApList"

export class WlanApConfig extends Fetcher {
    referer: string = 'popupSiteSurveyRpm'
    page: string = 'WlanNetworkRpm'
    apConfigUrl: string | undefined

    async fetch(router: RouterInterface): Promise<WlanApConfig> {
        const refFinal = '?select=true&wrr=true&sb=false&ssid1=TP-LINK_72F6&curRegion=101&channel=11&chanWidth=2&mode=5&rate=71&enssid2=false'
        if (!this.apConfigUrl) throw new Error("AP config URL not set")
        await router.page(this.apConfigUrl, router.pageUrl(this.referer) + refFinal)
        return this
    }

    static checkChannels(generalStatus: GeneralStatus, targetAp: WlanAp): boolean {
        const wlanChannel = generalStatus.wlan?.channelManual || generalStatus.wlan?.channelAuto
        targetAp.channel

        if (!wlanChannel)
            throw new Error("Could not find the current WLAN channel")

        return wlanChannel === targetAp.channel
    }

    private getConfPageUrl(router: RouterInterface, ap: WlanAp): string {
        const baseUrl = router.pageUrl(this.page)
        return `${baseUrl}?newBridgessid=${ap.ssid}&newBrdgeBssid=${ap.bssid}&ssid=&curRegion=101&channel=${ap.channel}&BrlChannel=${ap.channel}&chanWidth=2&mode=5&wrr=1&sb=0&select=1&rate=71&survey_sec=${ap.security}&popup=1`
    }

    async setApConf(router: RouterInterface, ap: WlanAp): Promise<WlanApConfig> {
        this.apConfigUrl = this.getConfPageUrl(router, ap)
        return this.fetch(router)
    }
}