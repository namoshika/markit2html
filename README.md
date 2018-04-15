# markit2html
Convert Markdown to standalone HTML (VSCode Style).

## License
MIT license.  
Copyright (C) 2018 namoshika

## Usage
use on CLI
```bash
markit2html --init
# m2hconfig.jsonが生成される

mkdir out
mkdir src
# srcに.mdファイルを配置

markit2html
# outに.htmlファイルが出力
```

use on JS
```js
import m2h from "markit2html"

// カレントディレクトリにm2hconfig.jsonが生成される。
// 生成されたフォルダがワークスペースとなる。
m2h.initConfig(".")

// ワークスペースからm2hconfig.jsonを取得。
// srcフォルダ内のファイルを変換し、outフォルダへ出力する (m2hconfig.jsonで設定可能)
m2h.compile(".")
```
inner API
```js
// ライブラリ用途向けAPI
import { markdown } from "markit2html"
let compiler = new markdown.Md2HtmlCompiler()

// HTMLテキストとして取得
let mdStr = await compiler.compileString("# Markdown String", "~/basePath")
// HTMLファイルとして書き出し
await compiler.compileFile("sample.md", "sample.html")
// ディレクトリ配下のMDファイルを書き出し
let conf = m2h.getConfig(".")
await compiler.compileDir("./workspaceDir", conf)
```