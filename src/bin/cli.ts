#!/usr/bin/env node

import fs from "fs-extra"
import path from "path"
import process from "process"
import commander from "commander"
import m2h from "../"

// コンフィグ生成・読込み
let pkgConf = fs.readJsonSync(`${__dirname}/../../package.json`)
commander
    .version(pkgConf.version, "-v, --version")
    .option("--init", "Initializes a markdown project and creates a m2hconfig.json file.")
    .parse(process.argv)

try {
    if (commander.init) {
        m2h.initConfig(".")
    }
    else {
        m2h.compile(".")
    }
}
catch (e) {
    console.error(e)
    process.exit(99)
}