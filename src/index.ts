import { RouterSession } from "./router"
import { GeneralStatus } from "./status"
import { Test } from "./test"

const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 5001

app.use(cors())
app.listen(PORT, () => console.log(`server running on port ${PORT}`))

// app.get('/router', (req: any, res: any) => {
//     var routerSession = new RouterSession()
//     var routerLogin = new RouterLogin(routerSession)

//     routerLogin.wlanTest(routerSession.login, routerSession.password).then((response) => {
//         res.json({ "html": response.data, "headers": routerLogin.headers })
//     })
// })

app.get('/router', (req: any, res: any) => {
    try {
        const routerSession = new RouterSession()
        new GeneralStatus().fetch(routerSession).then((response) => {
            res.json({ "html": response, "headers": routerSession.cookie })
        })
    } catch (e) {
        console.log(e)
        res.json({ "html": (e as Error).message, "headers": "" })
    }
})