const fs = require("fs-extra")
const path = require("path")
const process = require("process")
const mocha = require("mocha")
const { assert } = require("chai")
const { initConfigure, getConfigure } = require("../out/configuration")

let confName = "m2hconfig.json"

describe("configuration module", () => {
    it("構成ファイル読込み", () => {
        fs.emptyDirSync(`${__dirname}/result/test05/dirA/dirB/`)

        process.chdir(`${__dirname}/result/test05/dirA/`)
        initConfigure()
        assert.isTrue(fs.existsSync(confName), "initConfigure: m2hconfig.json生成に失敗")

        let conf = getConfigure()
        assert.isNotNull(conf, "getConfigure: m2hconfig.jsonの取得に失敗 (target: current)")
    
        process.chdir(`${__dirname}/result/test05/dirA/dirB/`)
        conf = getConfigure()
        assert.isNotNull(conf, "getConfigure: m2hconfig.jsonの取得に失敗 (target: parent)")
    
        process.chdir(`${__dirname}/result/test05/`)
        conf = getConfigure()
        assert.isNull(conf, "getConfigure: m2hconfig.jsonの取得に失敗。余計なものを取得してます")
    })
})