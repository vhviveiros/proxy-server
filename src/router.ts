import { Md5 } from 'ts-md5'
import { findScripts } from './script-finder'
import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support'
import { CookieJar } from 'tough-cookie'

export abstract class RouterInterface {
    abstract page(name: string, params?: any): Promise<string>
}

export class RouterSession extends RouterInterface {
    host: string
    autoReauth: boolean
    authRetries: number
    timeout: number | undefined
    token: string | undefined
    cookie: any | undefined
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
        const basicToken = Buffer.from(basicRaw).toString('base64')

        this.cookie = `Authorization=Basic ${basicToken}`
        this.refreshToken()
    }

    async isSessionValid(): Promise<boolean> {
        const url = this.pageUrl("Index")
        const resp = await this.get(url)
        const reauth = this.isReauthDoc(resp.data)
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

    async page(name: string, params?: any): Promise<string> {
        let retry = false
        while (true) {
            const doc = await this.pageLoadAttempt(name, params)
            if (!this.isReauthDoc(doc)) {
                return doc
            }

            if (retry || !this.autoReauth) {
                throw new Error(`Failed to load page ${name}. Firmware of the router may not support this feature`)
            }

            retry = true
            await this.refreshToken()
        }
    }

    async pageLoadAttempt(name: string, params?: any): Promise<string> {
        const url = this.pageUrl(name)
        const referer = this.pageUrl("MenuRpm")

        const resp = await this.get(url, params, { 'Referer': referer })
        if (resp.status !== 200) {
            throw new Error(`HTTP code ${resp.status}`)
        }

        return resp.data
    }

    async get(url: string, params?: any, headers?: any): Promise<any> {
        try {
            params = `Cookie: ${this.cookie}`
            return await axios.get(url, { headers: params })
        } catch (e) {
            throw e
        }
    }

    REAUTH_SUBSTR = 'cookie="Authorization=;path=/"';

    async isReauthDoc(doc: string): Promise<boolean> {
        const scripts = await findScripts(doc)
        const firstScript = scripts[0]
        return firstScript.includes(this.REAUTH_SUBSTR)
    }
}