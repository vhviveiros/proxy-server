import { RouterInterface } from "../RouterSession"
import { Fetcher } from "./fetcher"
import { GeneralStatus } from "./GeneralStats"
import { WlanAp } from "./WlanApList"

export class WlanApConfig extends Fetcher {
    readonly routerSettings = require('../../assets/router-settings.json')
    referer: string = 'WlanNetworkRpm'
    page: string = 'WlanNetworkRpm'

    async fetch(router: RouterInterface): Promise<WlanApConfig> {
        await router.page(this.page, this.referer)
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
        const pass = encodeURIComponent(this.routerSettings.keystr)
        return `${baseUrl}?ssid1=${router.ssid}&ssid2=${router.guestSsid}&ssid3=${router.ssid}_3&ssid4=${router.ssid}_4&channel=${ap.channel}&rate=71&ap=1&wdsbrl=2&brlssid=${ap.ssid}&brlbssid=${ap.bssid}&Save=Save`
    }

    private getConfPageReferer(router: RouterInterface, ap: WlanAp): string {
        const baseReferer = router.pageUrl(this.referer)
        return `${baseReferer}?newBridgessid=${router.ssid}&newBrdgeBssid=${ap.bssid}&channel=${ap.channel}&BrlChannel=${ap.channel}&survey_sec=${ap.security}&popup=1`
    }

    async setApConf(router: RouterInterface, ap: WlanAp): Promise<WlanApConfig> {
        this.page = this.getConfPageUrl(router, ap)
        this.referer = this.getConfPageReferer(router, ap)
        return this.fetch(router)
    }
}