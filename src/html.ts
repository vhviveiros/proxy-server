import { JSDOM } from 'jsdom'

export class ScriptFinder {
    scripts: string[]
    scriptInProgress: boolean
    currentScript: string

    constructor() {
        this.scripts = []
        this.scriptInProgress = false
        this.currentScript = ""
    }

    getScripts(): string[] {
        return this.scripts
    }

    close(): void {
        this.scripts = []
        this.scriptInProgress = false
    }

    handleStartTag(tag: string): void {
        if (tag !== "script") {
            return
        }

        this.scriptInProgress = true
        this.currentScript = ""
    }

    handleEndTag(tag: string): void {
        if (tag !== "script") {
            return
        }

        this.scriptInProgress = false
        if (this.currentScript.trim()) {
            this.scripts.push(this.currentScript)
        }
        this.currentScript = ""
    }

    handleData(data: string): void {
        if (!this.scriptInProgress) {
            return
        }

        this.currentScript += data
    }

    feed(data: string): void {
        const dom = new JSDOM(data)
        const scripts = dom.window.document.getElementsByTagName('script')
        for (let i = 0; i < scripts.length; i++) {
            this.handleStartTag('script')
            this.handleData(scripts[i].textContent || '')
            this.handleEndTag('script')
        }
    }
}

export function findScripts(data: string): string[] {
    const finder = new ScriptFinder()
    finder.feed(data)
    const scripts = finder.getScripts()
    return scripts
}