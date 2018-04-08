// import posthtml, {PostHTMLTree, PostHTMLTreeRoot, Plugin, PluginAsync} from "posthtml";
// import fs from "fs";
// import path from "path";
// import util from "util"
// import PosthtmlCustomElements from "./PosthtmlSamplePlugin";

// const readFile = util.promisify(fs.readFile)

// let basedir = "./abc"
// const fix = (pth: string) => path.resolve(basedir, pth)
// const enc = (txt: string) => txt.replace(/"/g, "&#34;").replace(/>/g, "&gt;").replace(/</g, "&lt;");

// const html = `
//     <component>
//         <title>Super Title</title>
//         <text>Awesome Text</text>
//         <img />
//     </component>
// `
// function convertStyle(htmlPath: string, rootPath: string, inline: boolean): PluginAsync {

//     return async (tree: PostHTMLTreeRoot) => {
//         type LoadResult = { CssPath: string, CssText: string }
//         const cssLoads = <Promise<LoadResult>[]>{}
//         const cssNodes = <{ [href: string]: PostHTMLTree[]}>

//         // stylesheet参照を書き換える
//         // inline化有効時:
//         //   link[rel="stylesheet"]の検索と参照確保。cssファイルの取得処理を行う。
//         //   linkタグ書き換えは後で行う。
//         // inline化無効時:
//         //   インライン化しない場合には参照パスの相対参照化を行う
//         tree.match({ tag: "link", attrs: { rel: "stylesheet" } }, node => {
//             if(node.attrs === undefined) {
//                 return node
//             }
//             if(inline) {
//                 const basePath = path.basename(htmlPath)
//                 const cssPath = path.resolve(basePath, node.attrs.href)
//                 // CSS取得処理。処理中で初登場のCSSファイルのみ読込みを行う
//                 if(!(cssPath in cssNodes)) {
//                     cssNodes[cssPath] = []
//                     cssLoads.push(readFile(cssPath).then(buf =>
//                         <LoadResult>{ CssPath: cssPath, CssText: buf.toString() }))
//                 }
//                 cssNodes[cssPath].push(node)
//             }
//             else {
//                 const cssPath = convertPath(htmlPath, node.attrs.href, rootPath)
//                 node.attrs.rel = cssPath
//             }
//             return node
//         })
//         if(inline) {
//             // 読込んだCSSファイルをlinkタグ
//             const cssFiles = await Promise.all(cssLoads)
//             for(let item of cssFiles) {
//                 for(let ele of cssNodes[item.CssPath]) {
//                     if(ele.attrs === undefined) {
//                         continue
//                     }
//                     delete ele.attrs["href"]
//                     ele.tag = "style"
//                     ele.content = [item.CssText]
//                 }
//             }
//         }


//         tree.match({ tag: "link", attrs: { rel: "stylesheet" } }, node => {
//             if(node.attrs === undefined) {
//                 return node
//             }
//             if(inline) {
//                 const basePath = path.basename(htmlPath)
//                 const cssPath = path.resolve(basePath, node.attrs.href)
//                 const cssText = await readFile(cssPath)
//             }
//             else {
//                 const cssPath = convertPath(htmlPath, node.attrs.href, rootPath)
//             }

//             return node
//         })
//         return tree
//     }
// }
// function convertImage(path: string, rootPath: string, inline: boolean): string { return "" }
// function convertScript(path: string, rootPath: string, inline: boolean): string { return "" }

// function convertPath(fromPath: string, toPath: string, rootPath: string) {
//     if(fromPath.startsWith(rootPath)) {
//         const baseDir = path.dirname(fromPath)
//         const relativePath = path.relative(basedir, toPath)
//         return relativePath
//     }
//     else {
//         return toPath
//     }
// }

// const result = posthtml()
//     .use(PosthtmlCustomElements())
//     .use(imageInliner)
//     .process(html, {sync: false})
//     .then((x: {html:string}) => console.log(x.html))

// function imageInliner(tree: PostHTMLTreeRoot): PostHTMLTree {
//     tree.match({ tag: "link", attrs: { rel: "stylesheet" } }, node => {
//         node.attrs  = node.attrs || {}
//         let src = node.attrs.src
//         return node
//     })
//     return tree
// }

// var tr = trumpet();
// function convert(opts: any) {
//     if (!(opts.ignoreScripts)) {
//         tr.selectAll("script[src]", node => {
//             var file = fix(node.getAttribute("src"));
//             node.removeAttribute("src");
//             fs.createReadStream(file).pipe(node.createWriteStream());
//         });
//     }
//     if (!(opts.ignoreImages)) {
//         tr.selectAll("img[src]", node => inline64(node, "src"))
//     }
//     if (!(opts.ignoreLinks)) {
//         tr.selectAll("link[href]", node => {
//             var rel = (node.getAttribute("rel") || ").toLowerCase();
//             if (rel === "stylesheet") return;
//             inline64(node, "href");
//         })
//     }
//     if (!(opts.ignoreStyles)) {
//         tr.selectAll("link[href]", node => {
//             var rel = node.getAttribute("rel").toLowerCase();
//             if (rel !== "stylesheet") return;
//             var file = fix(node.getAttribute("href"));

//             var w = node.createWriteStream({ outer: true });
//             w.write("<style>");
//             var r = fs.createReadStream(file);
//             r.pipe(w, { end: false });
//             r.on("end", function () { w.end("</style>") });
//         });
//     }
//     return tr
// }
// function inline64(node, name) {
//     var href = node.getAttribute(name);
//     if (/^data:/.test(href)) return;
//     var file = fix(href);
//     var w = node.createWriteStream({ outer: true });
//     var attrs = node.getAttributes();
//     w.write("<" + node.name);
//     Object.keys(attrs).forEach(function (key) {
//         if (key === name) return;
//         w.write(" " + key + "="" + enc(attrs[key]) + """);
//     });
//     var ext = path.extname(file).replace(/^\./, ").toLowerCase();
//     var type = node.getAttribute("type")
//     if (!type) type = {
//         svg: "image/svg+xml",
//         png: "image/png",
//         jpg: "image/jpeg",
//         jpeg: "image/jpeg",
//         gif: "image/jpeg"
//     }[ext] || "image/png"
//     w.write(" " + name + "="data:" + type + ";base64,");
//     fs.createReadStream(file).pipe(through(write, end));

//     var bytes = 0, last = null;

//     function write(buf, enc, next) {
//         if (last) {
//             buf = Buffer.concat([last, buf]);
//             last = null;
//         }

//         var b;
//         if (buf.length % 3 === 0) {
//             b = buf;
//         }
//         else {
//             b = buf.slice(0, buf.length - buf.length % 3);
//             last = buf.slice(buf.length - buf.length % 3);
//         }
//         w.write(b.toString("base64"));

//         next();
//     }
//     function end() {
//         if (last) w.write(last.toString("base64"));
//         w.end("">");
//     }
// }
