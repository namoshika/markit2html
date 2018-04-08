import path from "path"
import hljs from "highlight.js"
import markdownit, { MarkdownIt, Options } from "markdown-it"

const defaultStyles = ["../css/default.css", "../css/markdown.css", "../css/tomorrow.css"]
export interface ConvertOptions {
    fontFamily?: string,
    fontSize?: number,
    lineHeight?: number,
    styleFiles?: string[],
    scriptFiles?: string[]
}
export class Md2HtmlCompiler {
    constructor(option?: Options) {
        option = {
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
        }
        this._md = markdownit(option)
    }
    private _md: MarkdownIt
    convert(source: string, options?: ConvertOptions): string {
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
