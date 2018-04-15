// export markdown.Plugins instance
module.exports = {
    setupMarkdownIt: (md) => md.use(require("markdown-it-emoji"))
}