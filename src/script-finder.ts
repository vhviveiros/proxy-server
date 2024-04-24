import { Parser } from "htmlparser2"
export class ScriptFinder {
    scripts: undefined | string[] = []
    scriptInProgress: boolean = false
    currentScript: string | undefined = ''

    close() {
        this.scripts = undefined
        this.scriptInProgress = false
        this.currentScript = undefined
    }

    handleStartTag(tag: string): void {
        if (tag !== 'script') return

        this.scriptInProgress = true
        this.currentScript = ''
    }

    handleEndTag(tag: string): void {
        if (tag !== 'script') return

        this.scriptInProgress = false
        if (this.currentScript?.trim()) {
            this.scripts?.push(this.currentScript)
        }
        this.currentScript = ''
    }

    handleData(data: string): void {
        if (!this.scriptInProgress) return
        this.currentScript += data
    }
}

export function findScripts(data: string): string[] {
    const finder = new ScriptFinder()
    const parser = new Parser({
        onopentag: (name: string) => finder.handleStartTag(name),
        ontext: (text: string) => finder.handleData(text),
        onclosetag: (name: string) => finder.handleEndTag(name),
    })
    parser.write(data)
    parser.end()
    return finder.scripts ?? []
}