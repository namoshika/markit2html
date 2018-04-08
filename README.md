# markit2html
Convert Markdown to standalone HTML (VSCode Style).

# License
MIT license.  
Copyright (C) 2018 namoshika

# Usage
CLI Tool
```bash
markit2html --init
# m2hconfig.jsonが生成される

mkdir out
mkdir src
# srcに.mdファイルを配置

markit2html
# outに.htmlファイルが出力
```

Library
```js
const m2h = require("markit2html")
// m2hconfig.jsonが生成される。
// 生成されたフォルダがワークスペースとなる。
m2h.initConfig(".")

// m2hconfig.jsonを取得。
// srcフォルダ内のファイルを変換し、outフォルダへ出力する。(m2hconfig.jsonで設定可能)
let conf = m2h.getConfig(".")
let compiler = new m2h.Md2HtmlCompiler()
compiler.compileProject(".")

// .mdファイルの変換結果をファイルとして出力。
// compiler.compileFile("sample.md", "sample.html")

// .md文字列の変換結果を文字列として出力。
// compiler.compileString(srcText, srcPath).then(html => console.log(html))
```