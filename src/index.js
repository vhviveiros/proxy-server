"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const status_1 = require("./status");
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;
app.use(cors());
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
// app.get('/router', (req: any, res: any) => {
//     var routerSession = new RouterSession()
//     var routerLogin = new RouterLogin(routerSession)
//     routerLogin.wlanTest(routerSession.login, routerSession.password).then((response) => {
//         res.json({ "html": response.data, "headers": routerLogin.headers })
//     })
// })
app.get('/router', (req, res) => {
    try {
        const routerSession = new router_1.RouterSession();
        new status_1.GeneralStatus().fetch(routerSession).then((response) => {
            res.json({ "html": response, "headers": routerSession.cookie });
        });
    }
    catch (e) {
        console.log(e);
        res.json({ "html": e.message, "headers": "" });
    }
});
//# sourceMappingURL=index.js.map