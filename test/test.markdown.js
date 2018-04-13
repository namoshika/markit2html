const emoji = require("markdown-it-emoji")
const fs = require("fs-extra")
const mocha = require("mocha")
const { assert } = require("chai")
const { markdown } = require("../out")

describe("markdown", () => {
    it("Markdown to HTML (string)", async () => {
        let compiler = new markdown.Md2HtmlCompiler()
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
        let compiler = new markdown.Md2HtmlCompiler(md => md.use(emoji))
        try {
            await compiler.compileFile("sampleB.html", "aaa")
            assert(false, ".mdファイル以外のコンパイルでエラーが発生しませんでした")
        }
        catch (e) { }
        try {
            await compiler.compileFile("notFound.md", "aaa")
            assert(false, "存在しないファイルのコンパイルでエラーが発生しませんでした")
        }
        catch (e) { }

        let resPath = `${__dirname}/result/test02/`
        let filePath = `${resPath}/sample.html`
        fs.emptyDirSync(resPath)
        await compiler.compileFile(`${__dirname}/sampleA.md`, filePath)
        assert.isTrue(fs.existsSync(filePath), "compileString: mdファイルのコンパイルに失敗")
    })
})