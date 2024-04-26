import { Md5 } from 'ts-md5'
import { findScripts } from './script-finder'
import axios, { AxiosInstance } from 'axios'

export abstract class RouterInterface {
    abstract page(name: string, params?: any): Promise<string>
}

export interface HeaderInterface {
    Cookie: string | undefined
    Referer: string | undefined
}

export class RouterSession extends RouterInterface {
    host: string
    autoReauth: boolean
    authRetries: number
    timeout: number | undefined
    token: string | undefined
    cookie: any | undefined
    basicToken: string | undefined
    session: AxiosInstance | undefined
    headers: HeaderInterface | undefined
    readonly routerSettings = require('../assets/router-settings.json')

    constructor(autoReauth = true, authRetries = 3, timeout?: number) {
        super()
        this.host = this.routerSettings.ip
        this.autoReauth = autoReauth
        this.authRetries = Math.max(authRetries, 0)
        this.timeout = timeout

        const username = this.routerSettings.login
        const password = this.routerSettings.password

        const passwordHash = Md5.hashStr(password)
        const basicRaw = `${username}:${passwordHash}`
        this.basicToken = Buffer.from(basicRaw).toString('base64')
        this.cookie = `Authorization=Basic ${this.basicToken}`
    }

    async isSessionValid(): Promise<boolean> {
        const url = this.pageUrl("Index")
        const resp = await this.get(url)
        const reauth = await this.isReauthDoc(resp.data)
        return !reauth
    }

    async refreshToken(): Promise<void> {
        const attempts = this.authRetries + 1
        for (let retry = 0; retry < attempts; retry++) {
            const resp = await this.get(`${this.baseUrl()}/userRpm/LoginRpm.htm?Save=Save`)
            const match = new RegExp(`${this.host}/(\\w+)/`).exec(resp.data)
            if (match) {
                this.token = match[1]
                if (await this.isSessionValid()) {
                    return
                }
            }
        }

        throw new Error(`Failed to get auth token with specified username and password after ${attempts} attempts`)
    }

    baseUrl(): string {
        return `http://${this.host}`
    }

    pageUrl(name: string): string {
        return `${this.baseUrl()}/${this.token}/userRpm/${name}.htm`
    }

    async page(name: string, referer?: string): Promise<string> {
        let retry = false

        while (true) {
            const doc = await this.pageLoadAttempt(name, referer)
            //doc should be complete already
            if (!(await this.isReauthDoc(doc))) {
                return doc
            }

            if (retry || !this.autoReauth) {
                throw new Error(`Failed to load page ${name}. Firmware of the router may not support this feature`)
            }

            retry = true
            await this.refreshToken()
        }
    }

    async pageLoadAttempt(name: string, referer = this.pageUrl("MenuRpm")): Promise<string> {
        const url = this.pageUrl(name)
        // const referer = this.pageUrl("MenuRpm")

        const resp = await this.get(url, referer)
        if (resp.status !== 200) {
            throw new Error(`HTTP code ${resp.status}`)
        }

        return resp.data
    }

    async get(url: string, referer?: string): Promise<any> {
        try {
            const headers = {
                Cookie: this.cookie,
                Referer: referer
            }

            this.headers = headers
            return await axios.get(url, { headers: headers })
        } catch (e) {
            throw e
        }
    }

    REAUTH_SUBSTR = 'cookie="Authorization=;path=/"';

    async isReauthDoc(doc: string): Promise<boolean> {
        const scripts = findScripts(doc)
        const firstScript = scripts[0]
        return firstScript.includes(this.REAUTH_SUBSTR)
    }
}