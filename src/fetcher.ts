// Abstract class Fetcher

import { RouterInterface } from "./router"
import { GeneralStatus } from "./status"

export abstract class Fetcher {
    abstract fetch(router: RouterInterface): Promise<GeneralStatus>

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
