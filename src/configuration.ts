import fs from "fs-extra"
import path from "path"
import process from "process"
import commander from "commander"
import findupSync from "findup-sync"

export function initConfigure(filename: string = "m2hconfig.json", config: any = {}) {
    let cnfPath = path.join(process.cwd(), filename)
    let cnfPath_base = path.join(__dirname, `../config/m2hconfig.base.json`)
    let cnf_base = JSON.parse(fs.readFileSync(cnfPath_base).toString())
    Object.assign(cnf_base, config)
    fs.writeFileSync(cnfPath, JSON.stringify(cnf_base, null, "    "))
}
export function getConfigure<TConfig>(filename: string = "m2hconfig.json"): { projectRoot: string, content: TConfig } | null {
    // コンフィグ検索
    let cnfPath = findupSync(filename)
    if (cnfPath == undefined) {
        return null
    }
    // コンフィグ読込み
    let prjRoot = path.dirname(cnfPath)
    let cnfPath_def = path.resolve(__dirname, `../config/m2hconfig.default.json`)
    let cnf_def = JSON.parse(fs.readFileSync(cnfPath_def).toString())
    let cnf = JSON.parse(fs.readFileSync(cnfPath).toString())
    cnf = Object.assign({}, cnf_def, cnf)

    return { projectRoot: prjRoot, content: cnf }
}
