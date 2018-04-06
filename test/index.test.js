const fs = require("fs-extra")
const util = require("util")
const path = require("path")
const process = require("process")
const mocha = require("mocha")
const { assert } = require("chai")
const md2html = require("../out")
const { initConfigure, getConfigure } = require("../out/configuration")

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

describe("index module", () => {
    it("Markdown to HTML (string)", async () => {
        let srcPath = `${__dirname}/sampleA.md`
        let resPath = `${__dirname}/result/test01/`
        let outPath = `${resPath}/sample.html`
        
        fs.emptyDirSync(resPath)
        let srcText = fs.readFileSync(srcPath).toString()
        let outHtml = await md2html.compileString(srcText, srcPath)
        fs.writeFileSync(outPath, outHtml)
        assert.isTrue(fs.existsSync(outPath), "compileString: mdテキストのコンパイルに失敗")
    })
    it("Markdown to HTML (file)", async () => {
        try {
            await md2html.compileFile("sampleB.html")
            assert.isFalse(true, ".mdファイル以外のコンパイルでエラーが発生しませんでした")
        }
        catch (e) { }
        try {
            await md2html.compileFile("notFound.md")
            assert.isFalse(true, "存在しないファイルのコンパイルでエラーが発生しませんでした")
        }
        catch (e) { }

        let resPath = `${__dirname}/result/test02/`
        let filePath = `${resPath}/sample.html`
        fs.emptyDirSync(resPath)
        await md2html.compileFile(`${__dirname}/sampleA.md`, filePath)
        assert.isTrue(fs.existsSync(filePath), "compileString: mdファイルのコンパイルに失敗")
    })
    it("Markdown to HTML (project)", async () => {
        try {
            md2html.compileProject()
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
        initConfigure()

        await md2html.compileProject()
        assert.isTrue(
            fs.existsSync(`${__dirname}/result/test03/out/sampleA.html`) &&
            fs.existsSync(`${__dirname}/result/test03/out/sampleB.html`), "compileString: mdプロジェクトのコンパイルに失敗")
    })
})