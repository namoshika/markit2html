import fs from "fs-extra"
import m2h, { markdown } from "../"

describe("markdown", () => {
    test("Markdown to HTML (string)", async () => {
        let compiler = new markdown.Md2HtmlCompiler()
        let srcPath = `${__dirname}/data/sampleA.md`
        let resPath = `${__dirname}/result/test01/`
        let outPath = `${resPath}/sample.html`

        // 初期化
        fs.emptyDirSync(resPath)
        let srcText = await fs.readFile(srcPath, { encoding: "utf8" })

        // 文字列がhtmlに変換されていること
        let outHtml = await compiler.compileString(srcText, srcPath)
        expect(outHtml).toEqual(expect.any(String))

        // 処理結果はファイルとして書き出す
        fs.writeFileSync(outPath, outHtml)
    })
    test("Markdown to HTML (file)", async () => {
        let compiler = new markdown.Md2HtmlCompiler(md => md.use(require("markdown-it-emoji")))

        // 存在しないファイル、未対応形式でエラーになること
        await expect(compiler.compileFile("sampleB.html", "aaa")).rejects.toThrow()
        await expect(compiler.compileFile("notFound.md", "aaa")).rejects.toThrow()

        // 初期化
        let resPath = `${__dirname}/result/test02`
        let filePath = `${resPath}/sample.html`
        fs.emptyDirSync(resPath)

        // 生成結果が保存されていること
        await expect(compiler.compileFile(`${__dirname}/data/sampleA.md`, filePath)).resolves.toBeUndefined()
        expect(fs.existsSync(filePath)).toBeTruthy()
    })
})