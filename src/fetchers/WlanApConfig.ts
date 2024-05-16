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
        return `${baseUrl}?ssid1=${router.ssid}&ssid2=${router.guestSsid}&ssid3=${router.ssid}_3&ssid4=${router.ssid}_4&region=101&band=0&mode=5&chanWidth=2&channel=${ap.channel}&rate=71&ap=1&wdsbrl=2&brlssid=${ap.ssid}&brlbssid=${ap.bssid}&addrType=1&keytype=4&wepindex=1&authtype=1&keytext=${pass}&Save=Save`
    }

    private getConfPageReferer(router: RouterInterface, ap: WlanAp): string {
        const baseReferer = router.pageUrl(this.referer)
        return `${baseReferer}?newBridgessid=${router.ssid}&newBrdgeBssid=${ap.bssid}&ssid=&curRegion=101&channel=${ap.channel}&BrlChannel=${ap.channel}&chanWidth=2&mode=5&wrr=1&sb=0&select=1&rate=71&survey_sec=${ap.security}&popup=1`
    }

    async setApConf(router: RouterInterface, ap: WlanAp): Promise<WlanApConfig> {
        this.page = this.getConfPageUrl(router, ap)
        this.referer = this.getConfPageReferer(router, ap)
        return this.fetch(router)
    }
}

'http://192.168.1.3/FMMDPSSCGXQOAXBA/userRpm/WlanNetworkRpm.htm?ssid1=TP-LINK_72F6&ssid2=TP-LINK_GUEST_72F6&ssid3=TP-LINK_72F6_3&ssid4=TP-LINK_72F6_4&region=101&band=0&mode=5&chanWidth=2&channel=11&rate=71&ap=1&wdsbrl=2&brlssid=Jvicenteviveiros&brlbssid=2A-80-80-26-B7-26&addrType=1&keytype=4&wepindex=1&authtype=1&keytext=jvjlvhls%40&Save=Save'

'http://192.168.1.3/SLWXJIIBTSZCMSKB/userRpm/WlanNetworkRpm.htm?ssid1=TP-LINK_72F6&ssid2=TP-LINK_GUEST_72F6&ssid3=TP-LINK_72F6_3&ssid4=TP-LINK_72F6_4&region=101&band=0&mode=5&chanWidth=2&channel=6&rate=71&ap=1&wdsbrl=2&brlssid=Jvicenteviveiros&brlbssid=2A-80-80-26-B7-26&addrType=1&keytype=4&wepindex=1&authtype=1&keytext=jvjlvhls%40&Save=Save'

"http://192.168.1.3/FMMDPSSCGXQOAXBA/userRpm/WlanNetworkRpm.htm"