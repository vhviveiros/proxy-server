import axios from 'axios'
import { JSDOM } from 'jsdom'

export class ScriptFinder {
    scripts: string[]
    scriptInProgress: boolean
    currentScript: string

    constructor() {
        this.scripts = []
        this.scriptInProgress = false
        this.currentScript = ''
    }

    getScripts(): string[] {
        return this.scripts
    }

    close(): void {
        this.scripts = []
        this.scriptInProgress = false
        this.currentScript = ''
    }

    handleStartTag(tag: string): void {
        if (tag !== 'script') return

        this.scriptInProgress = true
        this.currentScript = ''
    }

    handleEndTag(tag: string): void {
        if (tag !== 'script') return

        this.scriptInProgress = false
        if (this.currentScript.trim()) {
            this.scripts.push(this.currentScript)
        }
        this.currentScript = ''
    }

    handleData(data: string): void {
        if (!this.scriptInProgress) return

        this.currentScript += data
    }
}

export async function findScripts(url: string): Promise<string[]> {
    const response = await axios.get(url)
    const dom = new JSDOM(response.data)
    const finder = new ScriptFinder()

    const { document } = dom.window
    const scripts = Array.from(document.getElementsByTagName('script'))

    scripts.forEach(script => {
        finder.handleStartTag('script')
        const textContent = (script as HTMLElement).textContent
        if (textContent !== null) {
            finder.handleData(textContent)
        }
        finder.handleEndTag('script')
    })

    return finder.getScripts()
}