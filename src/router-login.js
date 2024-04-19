"use strict";
// import { AxiosResponse } from "axios"
// import { Page } from "./page"
// import { Router } from "./router"
// export class RouterLogin {
//     pageName: string = 'popupSiteSurveyRpm'
//     headers: any | undefined
//     constructor(private routerSettings: Router) { }
//     async login(username: string, password: string): Promise<AxiosResponse> {
//         const loginPage = new Page({ userName: username, pcPassword: password }, this.routerSettings.baseURL)
//         const response = await loginPage.loadPage(this.routerSettings.pageUrl(this.pageName))
//         return response
//     }
//     wlanTest(username: string, password: string): Promise<AxiosResponse> {
//         const page = new Page({ userName: username, pcPassword: password }, this.routerSettings.baseURL)
//         this.headers = page.headers
//         return page.loadPage(page.pageUrl("WzdStartRpm"))
//     }
// }
//# sourceMappingURL=router-login.js.map