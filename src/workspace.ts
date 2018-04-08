import fs from "fs-extra"
import path from "path"
import process from "process"
import commander from "commander"
import findup from "find-up"

// 構成ファイル読込み (初期化用テンプレート、既定値)
let confBase = undefined as any
async function getBaseConf(): Promise<any> {
    return confBase = confBase || await fs.readJson(path.resolve(__dirname, "../config/m2hconfig.base.json"))
}
let confDef = undefined as any
async function getDefConf(): Promise<any> {
    return confDef = confDef || await fs.readJson(path.resolve(__dirname, "../config/m2hconfig.default.json"))
}

export interface ProjectConfig {
    projectRoot: string
    content: any
}
export async function initConfig(projDirPath: string, configName?: string, config?: any): Promise<void> {
    configName = configName || "m2hconfig.json"
    let configPath = path.join(projDirPath, configName)
    config = Object.assign({}, await getBaseConf(), config)
    await fs.writeFile(configPath, JSON.stringify(config, null, "    "))
}
export async function getConfig(projDirPath: string, configName?: string): Promise<ProjectConfig | null> {
    // コンフィグ検索
    configName = configName || "m2hconfig.json"
    let confPath = await findup(configName, { cwd: projDirPath })
    if (confPath == null) {
        return null
    }
    // コンフィグ読込み
    let prjRoot = path.dirname(confPath)
    let cnf = await fs.readJson(confPath)
    cnf = Object.assign({}, await getDefConf(), cnf)
    return <ProjectConfig>{ projectRoot: prjRoot, content: cnf }
}