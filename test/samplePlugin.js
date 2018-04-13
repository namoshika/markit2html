const emoji = require("markdown-it-emoji")
module.exports = {
    setupMarkdownIt: (md) => md.use(emoji)
}