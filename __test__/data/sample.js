import m2h, { markdown } from "../out"

// カレントディレクトリにm2hconfig.jsonが生成される。
// 生成されたフォルダがワークスペースとなる。
m2h.initConfig(".")

// ワークスペースからm2hconfig.jsonを取得。
// srcフォルダ内のファイルを変換し、outフォルダへ出力する (m2hconfig.jsonで設定可能)
m2h.compile(".")

// ライブラリ用途向けAPI
let conf = m2h.getConfig(".")
let compiler = new markdown.Md2HtmlCompiler()
compiler.compileFile("sample.md", "sample.html")
compiler.compileDir("./workspaceDir", conf)
compiler.compileString("# Markdown String", "~/basePath").then(html => console.log(html))