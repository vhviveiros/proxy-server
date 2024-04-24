import { Md5 } from "ts-md5"

import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'

export class Test {
    constructor() {
        this.begin()
    }

    async begin() {
        console.log("Test begin")
        const username = "vhviv"
        const password = "0912"
        const url = 'http://192.168.1.3/JVKAIKQCNPCWJBLA/userRpm/StatusRpm.htm'

        const passwordHash = Md5.hashStr(password)
        const basicRaw = `${username}:${passwordHash}`
        const basicToken = Buffer.from(basicRaw).toString('base64')

        const cookies = "Authorization=Basic dmh2aXY6YWY0YTU3Nzk3YTg0Mjg0NzdmYTllYmQ0ZWE3Mzk3YmE="

        const headers = {
            "Cookie": cookies,
            "Referer": "http://192.168.1.3/JVKAIKQCNPCWJBLA/userRpm/MenuRpm.htm"
        }

        const resp = await axios.get(url, { headers: headers })
        console.log(resp.data)
    }
}

new Test()