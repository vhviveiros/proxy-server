import { RouterSession } from "./RouterSession"
import { GeneralStatus } from "./fetchers/GeneralStats"
import { WlanApList } from "./fetchers/WlanApList"
import { WlanApConfig } from "./fetchers/WlanApConfig"

const routerSession = new RouterSession('TP-LINK_72F6', 'TP-LINK_GUEST_72F6')
routerSession.refreshToken().then(() => {
    try {
        const generalStatus = new GeneralStatus().fetch(routerSession)
        const apList = new WlanApList().fetch(routerSession)

        Promise.all([generalStatus, apList]).then((responses) => {
            const targetSsid = "Jvicenteviveiros"
            const targetAp = responses[1].apList?.find(ap => ap.ssid === targetSsid)

            if (!targetAp)
                throw new Error("Error")

            console.log(`Checking channel for ${targetSsid}...`)
            console.log(`Target AP: ${JSON.stringify(targetAp)}`)
            const isChannelValid = WlanApConfig.checkChannels(responses[0], targetAp)
            console.log(`Channel is valid: ${isChannelValid}.`)
            if (isChannelValid)
                return
            console.log(`Expected channel: ${targetAp.channel} - Current channel: ${responses[0].wlan?.channelManual}`)
            console.log(`Setting into channel ${targetAp.channel}...`)
            const wlan = new WlanApConfig()
            wlan.setApConf(routerSession, targetAp)
        })
    } catch (e) {
        console.log(e)
    }
})