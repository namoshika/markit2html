const fs = require("fs-extra")
const mocha = require("mocha")
const process = require("process")
const { assert } = require("chai")
const m2h = require("../out").default

describe("workspace", () => {
    it("Get workspace config", async () => {
        fs.emptyDirSync(`${__dirname}/result/test05/dirA/dirB/`)

        process.chdir(`${__dirname}/result/test05/dirA/`)
        await m2h.initConfig(".")
        assert.isTrue(fs.existsSync("m2hconfig.json"), "initConfig: m2hconfig.json生成に失敗")

        let conf = await m2h.getConfig(".")
        assert.isNotNull(conf, "getConfig: m2hconfig.jsonの取得に失敗 (target: current)")

        process.chdir(`${__dirname}/result/test05/dirA/dirB/`)
        conf = await m2h.getConfig(".")
        assert.isNotNull(conf, "getConfig: m2hconfig.jsonの取得に失敗 (target: parent)")

        process.chdir(`${__dirname}/result/test05/`)
        conf = await m2h.getConfig(".")
        assert.isNull(conf, "getConfig: m2hconfig.jsonの取得に失敗。余計なものを取得してます")
    })
    it("Compile workspace", async function () {
        try {
            await m2h.compile(".")
            assert.isFalse(true, "プロジェクト内ではないディレクトリのコンパイルでエラーが発生しませんでした")
        }
        catch (e) { }

        let resPath = `${__dirname}/result/test03/`
        fs.emptyDirSync(resPath)
        fs.mkdirpSync(`${resPath}/src/`)
        fs.mkdirpSync(`${resPath}/out/`)
        fs.copyFileSync(`${__dirname}/sampleB.md`, `${resPath}/src/sampleA.md`)
        fs.copyFileSync(`${__dirname}/sampleB.md`, `${resPath}/src/sampleB.md`)
        process.chdir(`${__dirname}/result/test03`)

        await m2h.initConfig(".", undefined, { plugins: "../../samplePlugin.js" })
        await m2h.compile(".")

        assert.isTrue(
            fs.existsSync(`${__dirname}/result/test03/out/sampleA.html`) &&
            fs.existsSync(`${__dirname}/result/test03/out/sampleB.html`), "compileString: mdプロジェクトのコンパイルに失敗")
    })
})