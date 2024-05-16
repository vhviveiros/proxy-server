import { RouterSession } from "./RouterSession"
import { GeneralStatus } from "./fetchers/GeneralStats"
import { WlanApList } from "./fetchers/WlanApList"

import express, { Response } from 'express'
import cors from 'cors'
import { WlanApConfig } from "./fetchers/WlanApConfig"
const app = express()
const PORT = 5001

app.use(cors())
app.listen(PORT, () => console.log(`server running on port ${PORT}`))

app.get('/router', (req: any, res: Response) => {
    try {
        const routerSession = new RouterSession(res, 'TP-LINK_72F6', 'TP-LINK_GUEST_72F6')
        // routerSession.refreshToken().then(() => {
        //     try {
        //         const generalStatus = new GeneralStatus().fetch(routerSession)
        //         const apList = new WlanApList().fetch(routerSession)

        //         Promise.all([generalStatus, apList]).then((responses) => {
        //             const targetSsid = "Jvicenteviveiros"
        //             const targetAp = responses[1].apList?.find(ap => ap.ssid === targetSsid)

        //             if (!targetAp) {
        //                 res.json({ "html": "Target AP not found", "headers": "" })
        //                 return
        //             }

        //             const isChannelValid = WlanApConfig.checkChannels(responses[0], targetAp)

        //             if (isChannelValid) {
        //                 res.json({ "html": "Channel is already correctly set", "headers": "" })
        //                 return
        //             }

        //             const wlan = new WlanApConfig()
        //             wlan.setApConf(routerSession, targetAp).then((r) => {
        //                 res.json({ "html": r.page, "headers": routerSession.headers })
        //                 return
        //             })

        //             // res.json({ "html": "ok", "headers": "routerSession.headers" })
        //         })
        //     } catch (e) {
        //         console.log(e)
        //         res.json({ "html": (e as Error).message, "headers": "" })
        //     }
        // })
    } catch (e) {
        console.log(e)
        res.json({ "html": (e as Error).message, "headers": "" })
    }
})