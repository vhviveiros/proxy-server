import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { Md5 } from "ts-md5"

export class Page {
    session: AxiosInstance
    headers: any | undefined

    constructor(private credentials: any, private baseUrl: string) {
        this.headers = {
            'Authorization': `Basic%20dmh2aXY6YWY0YTU3Nzk3YTg0Mjg0NzdmYTllYmQ0ZWE3Mzk3YmE%3D`,
            'Content-Type': 'text/plain',
            'Host': '192.168.1.3',
            // 'Referer': this.pageUrl('MenuRpm')
            'Referer': "http://192.168.1.3/FBXKQYEAZUSVKIEA/userRpm/popupSiteSurveyRpm.htm?select=true&wrr=true&sb=false&ssid1=TP-LINK_72F6&curRegion=101&channel=1&chanWidth=2&mode=5&rate=71&enssid2=false"
        }

        this.session = axios.create({
            headers: this.headers
        })
    }

    private basicToken(): string {
        let passwordHash = Md5.hashStr(this.credentials.pcPassword)
        let basicRaw = `${this.credentials.userName}:${passwordHash}`
        let basicToken = Buffer.from(basicRaw).toString('base64')
        return basicToken
    }

    loadPage(url: string): Promise<AxiosResponse> {
        const params = new URLSearchParams()
        params.set('userName', this.credentials.userName)
        params.set('pcPassword', this.credentials.pcPassword)

        return this.session.get(url)
    }

    pageUrl(name: string): string {
        return `${this.baseUrl}/${this.basicToken()}/userRpm/${name}.htm`
    }
}