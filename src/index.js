"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router");
const status_1 = require("./status");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 5001;
app.use((0, cors_1.default)());
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
app.get('/router', (req, res) => {
    try {
        const routerSession = new router_1.RouterSession();
        routerSession.refreshToken().then(() => {
            new status_1.GeneralStatus().fetch(routerSession).then((response) => {
                res.json({ "html": JSON.stringify(response), "headers": routerSession.headers });
            });
        });
    }
    catch (e) {
        console.log(e);
        res.json({ "html": e.message, "headers": "" });
    }
});
//# sourceMappingURL=index.js.map