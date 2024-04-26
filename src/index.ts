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
            // new GeneralStatus().fetch(routerSession).then((response: GeneralStatus) => {
            //     res.json({ "html": JSON.stringify(response), "headers": routerSession.headers })
            // })
            new WlanAPList().fetch(routerSession).then((response: WlanAPList) => {
                res.json({ "html": JSON.stringify(response), "headers": routerSession.headers })
            })
        })
    } catch (e) {
        console.log(e)
        res.json({ "html": (e as Error).message, "headers": "" })
    }
})