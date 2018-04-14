import process from "process"
import child_process from "child_process"
import path from "path"
import fs from "fs-extra"

let workspaceDir = path.resolve(__dirname, "../")
describe("cli module", () => {
    beforeAll(() => {
        fs.emptyDirSync(`${__dirname}/result/test05`)
        fs.mkdirpSync(`${__dirname}/result/test05/src/`)
        fs.mkdirpSync(`${__dirname}/result/test05/out/`)
        fs.copyFileSync(`${__dirname}/data/sampleB.md`, `${__dirname}/result/test05/src/sampleA.md`)
        fs.copyFileSync(`${__dirname}/data/sampleB.md`, `${__dirname}/result/test05/src/sampleB.md`)
    })
    test("CLI init project", () => {
        process.chdir(`${__dirname}/result/test05/`)
        child_process.execFileSync(process.execPath, [`${workspaceDir}/out/bin/cli.js`, "--init"])
        expect(fs.existsSync(`${__dirname}/result/test05/m2hconfig.json`)).toBe(true)
    })
    test("CLI build project", () => {
        process.chdir(`${__dirname}/result/test05/`)
        child_process.execFileSync(process.execPath, [`${workspaceDir}/out/bin/cli.js`])
        expect(fs.existsSync(`${__dirname}/result/test05/out/sampleA.html`)).toBe(true)
        expect(fs.existsSync(`${__dirname}/result/test05/out/sampleB.html`)).toBe(true)
    })
})