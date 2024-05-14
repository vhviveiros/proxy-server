import { RouterSession } from "./RouterSession"
import { GeneralStatus } from "./fetchers/GeneralStats"

import express from 'express'
import cors from 'cors'
import { WlanAPList } from "./fetchers/WlanAPList"
const app = express()
const PORT = 5001

app.use(cors())
app.listen(PORT, () => console.log(`server running on port ${PORT}`))

app.get('/router', (req: any, res: any) => {
    try {
        const routerSession = new RouterSession()
        routerSession.refreshToken().then(() => {
            const generalStatus = new GeneralStatus().fetch(routerSession)
            const apList = new WlanAPList().fetch(routerSession)

            Promise.all([generalStatus, apList]).then((responses) => {
                // const wlanChannel = responses[0].wlan?.channelManual || responses[0].wlan?.channelAuto
                // const wlanChannelTarget = responses[1].channel
                const isTheRightChannel = checkChannels(responses[0], responses[1], "Jvicenteviveiros")
                res.json({ "html": JSON.stringify(responses), "headers": routerSession.headers, "isTheRightChannel": isTheRightChannel })
            })
        })
    } catch (e) {
        console.log(e)
        res.json({ "html": (e as Error).message, "headers": "" })
    }
})

function checkChannels(generalStatus: GeneralStatus, wlanAPList: WlanAPList, ssid: string = "SSID") {
    const wlanChannel = generalStatus.wlan?.channelManual || generalStatus.wlan?.channelAuto
    const wlanChannelTarget = wlanAPList.apList?.find(ap => ap.ssid === ssid)?.channel

    if (!wlanChannel)
        throw new Error("Could not find the current WLAN channel")

    if (!wlanChannelTarget)
        throw new Error("Could not find the target WLAN channel")

    return wlanChannel === wlanChannelTarget
}