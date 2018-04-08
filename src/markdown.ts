
import fs from "fs-extra"
import path from "path"
import util from "util"
import hljs from "highlight.js"
import posthtml, { PostHTML, PostHTMLOption } from "posthtml"
import posthtmlInlineAssets from "posthtml-inline-assets"
import markdownit, { MarkdownIt, Options } from "markdown-it"
import { initConfig, getConfig } from "./workspace"

const mdExt = ".md"
const defaultStyles = ["../css/default.css", "../css/markdown.css", "../css/tomorrow.css"]

export interface ConvertOptions {
    fontFamily?: string,
    fontSize?: number,
    lineHeight?: number,
    styleFiles?: string[],
    scriptFiles?: string[]
}
export class Md2HtmlCompiler {
    public constructor(pluginLoader?: ((md: MarkdownIt) => MarkdownIt)) {
        let md = markdownit({
            html: true,
            xhtmlOut: true,
            linkify: true,
            highlight: (str: string, lang: string) => {
                if (lang && ['tsx', 'typescriptreact'].indexOf(lang.toLocaleLowerCase()) >= 0) {
                    lang = 'jsx';
                }
                if (lang && hljs.getLanguage(lang)) {
                    try { return '<pre class="hljs"><code><div>' + hljs.highlight(lang, str, true).value + '</div></code></pre>' }
                    catch { }
                }
                return '<pre class="hljs"><code><div>' + this._md.utils.escapeHtml(str) + '</div></code></pre>';
            }
        })
        if(pluginLoader != undefined) {
            md = pluginLoader(md)
        }
        this._md = md
    }
    public async compileString(source: string, sourcePath: string, options?: ConvertOptions): Promise<string> {
        let postHtml: PostHTML = posthtml([posthtmlInlineAssets({ from: sourcePath })])
        let htm = this._convert(source, options)
        let result = await postHtml.process(htm)
        htm = result.html
        return htm
    }
    public async compileFile(srcPath: string, distPath: string, options?: ConvertOptions): Promise<void> {
        if (path.extname(srcPath) != ".md") {
            throw new Error("引数srcPathで指定するファイルの拡張子は.mdである必要があります")
        }
    
        try { await fs.mkdirp(path.dirname(distPath)) } catch (e) { }
        fs.pathExists
        let mdTxt = await fs.readFile(srcPath, "utf8")
        let htTxt = await this.compileString(mdTxt, srcPath, options)
        let p = await fs.writeFile(distPath, htTxt)
        await p
    }
    public async compileDir(dirPath: string, config: any): Promise<void> {
        // 変換を実行
        let srcDirPath = path.resolve(dirPath, config.src)
        let outDirPath = path.resolve(dirPath, config.out)
        let fsItems = [srcDirPath]
        let mdFiles = <string[]>[]
        let prms = <Promise<void>[]>[]
        while (fsItems.length > 0) {
            let currentDir = fsItems.pop() as string
            let children = await fs.readdir(currentDir)
    
            // 処理対象列挙
            for (let child of children) {
                let srcPath = path.resolve(currentDir, child)
                let ext = path.extname(srcPath)
                if (await fs.stat(srcPath).then(st => st.isDirectory())) {
                    fsItems.push(srcPath)
                }
                else if (ext == mdExt) {
                    mdFiles.push(srcPath)
                }
            }
        }
        // 変換処理実行
        for (let srcPath of mdFiles) {
            let trgDirPath = path.resolve(outDirPath, path.relative(srcDirPath, path.dirname(srcPath)))
            let trgFileObj = path.parse(srcPath)
            let htmlFile = path.join(trgDirPath, `${trgFileObj.name}.html`)
            let p = this.compileFile(srcPath, htmlFile, config.options)
            prms.push(p)
        }
        await Promise.all(prms).then(x => { })
    }
    public async compileProject(projDirPath: string, configName?: string, options?: ConvertOptions): Promise<void> {
        let config = await getConfig(projDirPath, configName)
        if (config == null) {
            throw new Error("Not found m2hconfig.json.")
        }
        Object.assign(config.content, options)
        await this.compileDir(config.projectRoot, config.content)
    }

    private _md: MarkdownIt
    private _convert(source: string, options?: ConvertOptions): string {
        let opt = options || {}
        const mdRenderResult = this._md.render(source)
        const styles = opt.styleFiles || defaultStyles.map(x => path.resolve(__dirname, x))
        const scripts = opt.scriptFiles || []
        // 元ネタ: \Microsoft VS Code\resources\app\extensions\markdown\out\features\previewConfig.js
        // 元ネタ: \Microsoft VS Code\resources\app\extensions\markdown\out\features\previewContentProvider.js
        const styleEles = styles.map(x => `<link rel="stylesheet" type="text/css" href="${x}" />`)
        const scriptEles = scripts.map(x => `<script type="text/javascript" src="${x}" />`)
        const html =
            `<!DOCTYPE html>
            <html>
            <head>
                <meta http-equiv="Content-type" content="text/html;charset=UTF-8">
                <meta id="vscode-markdown-preview-data">
                ${styleEles.join("\n")}
                <style>
                    body {
                        ${opt.fontFamily ? `font-family: ${opt.fontFamily};` : ''}
                        ${opt.fontSize == undefined ? '' : `font-size: ${opt.fontSize}px;`}
                        ${opt.lineHeight == undefined ? '' : `line-height: ${opt.lineHeight};`}
                    }
                </style>
            </head>
            <body class="vscode-body scrollBeyondLastLine wordWrap showEditorSelection vscode-light">
                ${mdRenderResult}
                ${scriptEles.join("\n")}
            </body>
            </html>`
        return html
    }
}
