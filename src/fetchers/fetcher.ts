// Abstract class Fetcher

import { RouterInterface } from "../RouterSession"

export abstract class Fetcher {
    abstract fetch(router: RouterInterface): Promise<Fetcher>
    abstract readonly referer: string
    abstract readonly page: string

    public toDict(): { [key: string]: any } {
        return this.asdict(this)
    }

    asdict(obj: any): { [key: string]: any } {
        if (obj instanceof Object) {
            const result: { [key: string]: any } = {}
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    result[key] = typeof obj[key] === 'object' ? this.asdict(obj[key]) : obj[key]
                }
            }
            return result
        }

        return obj
    }
}
