#!/usr/bin/env node

import fs from "fs-extra"
import path from "path"
import process from "process"
import commander from "commander"
import * as m2h from "../"
if (module.parent) {
    throw new Error("cli関数の呼び出しに失敗。この関数はモジュールからではなく、直接呼び出す必要があります。")
}

// コンフィグ生成・読込み
let pkgConf = fs.readJsonSync(`${__dirname}/../../package.json`)
commander
    .version(pkgConf.version, "-v, --version")
    .option("--init", "Initializes a markdown project and creates a m2hconfig.json file.")
    .option("--out <dirpath>", "Redirect output structure to the directory.")
    .option("--src <dirpath>", "Specifies the src directory of input files.")
    .parse(process.argv)

try {
    if (commander.init) {
        m2h.initConfig(".")
    }
    else {
        let compiler = new m2h.Md2HtmlCompiler()
        let opt = <any>{}
        if (commander.src != undefined) {
            opt.src = commander.src
        }
        if (commander.out != undefined) {
            opt.out = commander.out
        }
        compiler.compileProject(".", undefined, opt)
    }
}
catch (e) {
    console.error(e)
    process.exit(99)
}