#!/usr/bin/env node

import fs from "fs"
import path from "path"
import process from "process"
import commander from "commander"
import findupSync from "findup-sync"
import { compileDir, compileProject } from "../"
import { initConfigure, getConfigure } from "../configuration"
if (module.parent) {
    throw new Error("cli関数の呼び出しに失敗。この関数はモジュールからではなく、直接呼び出す必要があります。")
}

// コンフィグ生成・読込み
commander.option('--init').parse(process.argv);
if (commander.init) {
    initConfigure("m2hconfig.json")
    process.exit()
}
try {
    compileProject()
}
catch(e) {
    console.error(e)
    process.exit(99)
}