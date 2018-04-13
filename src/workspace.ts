import fs from "fs-extra"
import path from "path"
import process from "process"
import commander from "commander"
import findup from "find-up"
import * as md from "./markdown"

// 構成ファイル読込み (初期化用テンプレート、既定値)
let confBase = undefined as any
async function getBaseConf(): Promise<any> {
    return confBase = confBase || await fs.readJson(path.resolve(__dirname, "../config/m2hconfig.base.json"))
}
let confDef = undefined as any
async function getDefConf(): Promise<any> {
    return confDef = confDef || await fs.readJson(path.resolve(__dirname, "../config/m2hconfig.default.json"))
}

export type GetConfigResult= { projectRoot: string, config: md.ConvertConfig }
export async function initConfig(projDirPath: string, configName?: string, config?: md.ConvertConfig): Promise<void> {
    configName = configName || "m2hconfig.json"
    let configPath = path.join(projDirPath, configName)
    config = Object.assign({}, await getBaseConf(), config)
    await fs.writeFile(configPath, JSON.stringify(config, null, "    "))
}
export async function getConfig(projDirPath: string, configName?: string): Promise<GetConfigResult | null> {
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
    return { projectRoot: prjRoot, config: cnf }
}
export async function compile(projDirPath: string, configName?: string): Promise<void> {
    let workspace = await getConfig(projDirPath, configName)
    if (workspace == null) {
        throw new Error("Not found m2hconfig.json.")
    }
    let mdIniter
    if(workspace.config.plugins != undefined) {
        let pluginPath = path.resolve(workspace.projectRoot, workspace.config.plugins)
        let plugin = <md.Plugins>require(pluginPath)
        mdIniter = plugin.setupMarkdownIt
    }
    let m2h = new md.Md2HtmlCompiler(mdIniter)
    await m2h.compileDir(workspace.projectRoot, workspace.config)
}
