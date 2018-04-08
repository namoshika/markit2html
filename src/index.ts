import fs from "fs-extra"
import path from "path"
import util from "util"
import posthtml, { PostHTML, PostHTMLOption } from "posthtml"
import posthtmlInlineAssets from "posthtml-inline-assets"
import { Md2HtmlCompiler, ConvertOptions } from "./Md2HtmlCompiler"
import { initConfigure, getConfigure } from "./configuration"

const transM2H: Md2HtmlCompiler = new Md2HtmlCompiler()
export async function compileString(source: string, sourcePath: string, options?: ConvertOptions): Promise<string> {
    let postHtml: PostHTML = posthtml([posthtmlInlineAssets({ from: sourcePath })])
    let htm = transM2H.convert(source, options)
    let result = await postHtml.process(htm)
    htm = result.html
    return htm
}
export async function compileFile(srcPath: string, distPath: string, options?: ConvertOptions): Promise<void> {
    if(path.extname(srcPath) != ".md") {
        throw new Error("引数srcPathで指定するファイルの拡張子は.mdである必要があります")
    }

    try{ await fs.mkdirp(path.dirname(distPath)) } catch(e) { }
    let mdTxt = await fs.readFile(srcPath).then(buf => buf.toString())
    let p = compileString(mdTxt, srcPath, options).then(htTxt => fs.writeFile(distPath, htTxt))
    await p
}
export async function compileDir(dirPath: string, config: any): Promise<void> {
    // 変換を実行
    let srcDirPath = path.resolve(dirPath, config.src)
    let outDirPath = path.resolve(dirPath, config.out)
    let fsItems = [srcDirPath]
    let prms = <Promise<void>[]>[]
    while (fsItems.length > 0) {
        let item = fsItems.pop() as string
        let children = await fs.readdir(item)

        for (let child of children) {
            let childPathFromSrc = path.resolve(item, child)
            let childPathFromOut = path.resolve(outDirPath, path.relative(srcDirPath, childPathFromSrc))

            if (await fs.stat(childPathFromSrc).then(st => st.isDirectory())) {
                fsItems.push(childPathFromSrc)
            }
            else if (path.extname(childPathFromSrc) === ".md") {
                let htmlFile = childPathFromOut.substr(0, childPathFromOut.length - 3) + ".html"
                let p = compileFile(childPathFromSrc, htmlFile, config.options)
                prms.push(p)
            }
        }
    }
    return Promise.all(prms).then(x => { })
}
export function compileProject(fileName: string = "m2hconfig.json"): Promise<void> {
    let config = getConfigure<any>(fileName)
    if (config == null) {
        throw new Error("Not found m2hconfig.json.")
    }
    return compileDir(config.projectRoot, config.content)
}