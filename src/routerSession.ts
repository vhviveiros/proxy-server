import axios from 'axios'
import crypto from 'crypto'
import { Optional } from 'typescript-optional'

abstract class RouterInterface {
    abstract page(name: string, params?: Map<string, string>): Promise<string>
}

class RouterSession extends RouterInterface {
    private host: string
    private autoReauth: boolean
    private authRetries: number
    private timeout: Optional<number>
    private session: any
    private token!: string

    constructor(host: string, username: string, password: string, autoReauth: boolean = true, authRetries: number = 3, timeout?: number) {
        super()
        this.host = host
        this.autoReauth = autoReauth
        this.authRetries = Math.max(authRetries, 0)
        this.timeout = Optional.ofNullable(timeout)

        const passwordHash = crypto.createHash('md5').update(password).digest('hex')
        const basicRaw = `${username}:${passwordHash}`
        const basicToken = Buffer.from(basicRaw).toString('base64')

        this.session = axios.create({
            baseURL: `http://${this.host}`,
            timeout: this.timeout.orElse(0),
            headers: { 'Authorization': `Basic ${basicToken}` }
        })

        this.refreshToken()
    }

    async isSessionValid(): Promise<boolean> {
        const url = this.pageUrl("Index")
        const resp = await this._get(url)
        const reauth = RouterSession._isReauthDoc(resp.data)
        return !reauth
    }

    async refreshToken() {
        const attempts = this.authRetries + 1
        for (let retry = 0; retry < attempts; retry++) {
            const resp = await this._get(`/userRpm/LoginRpm.htm?Save=Save`)

            const match = resp.data.match(new RegExp(`${this.host}/(\\w+)/`))
            if (match) {
                this.token = match[1]
                if (await this.isSessionValid()) {
                    return
                }
            }
        }

        throw new Error(`Failed to get auth token with specified username and password after ${attempts} attempts`)
    }

    base_url(): string {
        return `http://${this.host}`
    }

    pageUrl(name: string): string {
        return `${this.base_url()}/${this.token}/userRpm/${name}.htm`
    }

    async page(name: string, params?: Map<string, string>): Promise<string> {
        let retry = false
        while (true) {
            const doc = await this._pageLoadAttempt(name, params)
            if (!RouterSession._isReauthDoc(doc)) {
                return doc
            }

            if (retry || !this.autoReauth) {
                throw new Error(`Failed to load page ${name}. Firmware of the router may not support this feature`)
            }

            retry = true
            await this.refreshToken()
        }
    }

    async _pageLoadAttempt(name: string, params?: Map<string, string>): Promise<string> {
        const url = this.pageUrl(name)
        const referer = this.pageUrl("MenuRpm")

        const resp = await this._get(url, { params: params, headers: { "Referer": referer } })
        if (resp.status !== 200) {
            throw new Error(`HTTP code ${resp.status}`)
        }

        return resp.data
    }

    async _get(url: string, config?: any): Promise<any> {
        try {
            return await this.session.get(url, config)
        } catch (e) {
            throw e
        }
    }

    static REAUTH_SUBSTR = 'cookie="Authorization=;path=/"';

    static _isReauthDoc(doc: string): boolean {
        const firstScript = doc.split('<script>')[1].split('</script>')[0]
        return firstScript.includes(this.REAUTH_SUBSTR)
    }
}