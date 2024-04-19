import { findScripts } from "./html"

interface JsVars {
    [key: string]: any[] | null
}

export async function extractVars(document: string, vars: string[]): Promise<JsVars> {
    let jsVars: JsVars = {}

    vars.forEach((variable) => {
        jsVars[variable] = null
    })

    const scripts = findScripts(document)

    scripts.forEach((script: any) => {
        for (let variable in jsVars) {
            if (jsVars[variable] === null) {
                jsVars[variable] = getVar(variable, script)
            }
        }
    })

    return jsVars
}

export function findVar(name: string, script: string): string | null {
    const match = script.match(new RegExp(`\\s+${name}\\s*=\\s*([^\\s]([\\s\\S]*?[^\\s])??)\\s*;`))
    return match ? match[1] : null
}

export function parseVar(varStr: string): any {
    let array = parseArray(varStr)
    if (array !== null) {
        return array
    }

    return parsePrimitive(varStr)
}

export function parsePrimitive(value: string): any {
    try {
        return JSON.parse(value)
    } catch (error) {
        return null
    }
}

export function parseArray(value: string, stripZeros = true): any[] | null {
    const match = value.match(/new\s+Array\(([\s\S]*)\)/)
    if (!match) {
        return null
    }

    const content = match[1]
    const valueWrapped = `[${content}]`
    const values = parsePrimitive(valueWrapped)

    if (stripZeros && values.slice(-2).every((v: any) => v === 0)) {
        return values.slice(0, -2)
    }

    return values
}

export function getVar(name: string, script: string): any {
    const varStr = findVar(name, script)
    if (!varStr) {
        return null
    }

    return parseVar(varStr)
}