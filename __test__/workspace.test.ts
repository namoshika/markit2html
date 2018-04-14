import fs from "fs-extra"
import process from "process"
import m2h from "../out"

describe("workspace", () => {
    test("Get workspace config", async () => {
        fs.emptyDirSync(`${__dirname}/result/test03/dirA/dirB/`)

        process.chdir(`${__dirname}/result/test03/dirA/`)
        await expect(m2h.initConfig(".")).resolves.toBeUndefined()
        expect(fs.existsSync("m2hconfig.json")).toBeTruthy()

        await expect(m2h.getConfig(".")).resolves.toBeDefined()

        process.chdir(`${__dirname}/result/test03/dirA/dirB/`)
        await expect(m2h.getConfig(".")).resolves.toBeDefined()

        process.chdir(`${__dirname}/result/test03/`)
        await expect(m2h.getConfig(".")).resolves.toBeNull()
    })
    test("Compile workspace", async function () {
        await expect(m2h.compile(".")).rejects.toThrow()

        let resPath = `${__dirname}/result/test04/`
        fs.emptyDirSync(resPath)
        fs.mkdirpSync(`${resPath}/src/`)
        fs.mkdirpSync(`${resPath}/out/`)
        fs.copyFileSync(`${__dirname}/data/sampleB.md`, `${resPath}/src/sampleA.md`)
        fs.copyFileSync(`${__dirname}/data/sampleB.md`, `${resPath}/src/sampleB.md`)
        
        process.chdir(`${__dirname}/result/test04`)
        await expect(m2h.initConfig(".", undefined, { plugins: "../../data/samplePlugin.js" })).resolves.toBeUndefined()
        await expect(m2h.compile(".")).resolves.toBeUndefined()
        expect(fs.existsSync(`${__dirname}/result/test04/out/sampleA.html`)).toBeTruthy()
        expect(fs.existsSync(`${__dirname}/result/test04/out/sampleB.html`)).toBeTruthy()
    })
})