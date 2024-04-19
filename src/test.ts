import { Md5 } from "ts-md5"

import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'

export class Test {
    constructor() {
        this.begin()
    }

    begin() {
        console.log("Test begin")
        const username = "vhviv"
        const password = "0912"
        const url = 'http://192.168.1.3/userRpm/LoginRpm.htm?Save=Save'

        const passwordHash = Md5.hashStr(password)
        const basicRaw = `${username}:${passwordHash}`
        const basicToken = Buffer.from(basicRaw).toString('base64')

        const cookies = `Authorization=Basic ${basicToken};`
        axios.get(url, { headers: { 'Cookie': cookies } }).then((response: any) => {
            console.log(response.data)
        })
    }
}