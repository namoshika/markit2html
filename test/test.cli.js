const process = require("process")
const child_process = require("child_process")
const path = require("path")
const fs = require("fs-extra")
const mocha = require("mocha")
const { assert } = require("chai")

let workspaceDir = path.resolve(__dirname, "../")
describe("cli module", () => {
    before(() => {
        fs.emptyDirSync(`${__dirname}/result/test04`)
        fs.mkdirpSync(`${__dirname}/result/test04/src/`)
        fs.mkdirpSync(`${__dirname}/result/test04/out/`)
        fs.copyFileSync(`${__dirname}/sampleB.md`, `${__dirname}/result/test04/src/sampleA.md`)
        fs.copyFileSync(`${__dirname}/sampleB.md`, `${__dirname}/result/test04/src/sampleB.md`)
    })
    it("CLI init project", () => {
        process.chdir(`${__dirname}/result/test04/`)
        child_process.execFileSync(process.execPath, [`${workspaceDir}/out/bin/cli.js`, "--init"])
    })
    it("CLI build project", () => {
        process.chdir(`${__dirname}/result/test04/`)
        child_process.execFileSync(process.execPath, [`${workspaceDir}/out/bin/cli.js`])
        assert.isTrue(
            fs.existsSync(`${__dirname}/result/test04/out/sampleA.html`) &&
            fs.existsSync(`${__dirname}/result/test04/out/sampleB.html`), "compileString: mdプロジェクトのコンパイルに失敗")
    })
})