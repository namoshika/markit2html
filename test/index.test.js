const fs = require("fs-extra")
const m2h = require("../out")
const mocha = require("mocha")
const process = require("process")
const { assert } = require("chai")

const compiler = new m2h.Md2HtmlCompiler()
describe("markdown", () => {
    it("Markdown to HTML (string)", async () => {
        let srcPath = `${__dirname}/sampleA.md`
        let resPath = `${__dirname}/result/test01/`
        let outPath = `${resPath}/sample.html`
        
        fs.emptyDirSync(resPath)
        let srcText = fs.readFileSync(srcPath).toString()
        let outHtml = await compiler.compileString(srcText, srcPath)
        fs.writeFileSync(outPath, outHtml)
        assert.isTrue(fs.existsSync(outPath), "compileString: mdテキストのコンパイルに失敗")
    })
    it("Markdown to HTML (file)", async () => {
        try {
            await compiler.compileFile("sampleB.html")
            assert.isFalse(true, ".mdファイル以外のコンパイルでエラーが発生しませんでした")
        }
        catch (e) { }
        try {
            await compiler.compileFile("notFound.md")
            assert.isFalse(true, "存在しないファイルのコンパイルでエラーが発生しませんでした")
        }
        catch (e) { }

        let resPath = `${__dirname}/result/test02/`
        let filePath = `${resPath}/sample.html`
        fs.emptyDirSync(resPath)
        await compiler.compileFile(`${__dirname}/sampleA.md`, filePath)
        assert.isTrue(fs.existsSync(filePath), "compileString: mdファイルのコンパイルに失敗")
    })
    it("Markdown to HTML (project)", async function() {        
        try {
            await compiler.compileProject()
            assert.isFalse(true, "プロジェクト内ではないディレクトリのコンパイルでエラーが発生しませんでした")            
        }
        catch(e) {}
        
        let resPath = `${__dirname}/result/test03/`
        fs.emptyDirSync(resPath)
        fs.mkdirpSync(`${resPath}/src/`)
        fs.mkdirpSync(`${resPath}/out/`)
        fs.copyFileSync(`${__dirname}/sampleB.md`, `${resPath}/src/sampleA.md`)
        fs.copyFileSync(`${__dirname}/sampleB.md`, `${resPath}/src/sampleB.md`)
        process.chdir(`${__dirname}/result/test03`)
        
        await m2h.initConfig(".")
        await compiler.compileProject(".")
        
        assert.isTrue(
            fs.existsSync(`${__dirname}/result/test03/out/sampleA.html`) &&
            fs.existsSync(`${__dirname}/result/test03/out/sampleB.html`), "compileString: mdプロジェクトのコンパイルに失敗")
    })
})
describe("workspace", () => {
    it("構成ファイル読込み", async () => {
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
})