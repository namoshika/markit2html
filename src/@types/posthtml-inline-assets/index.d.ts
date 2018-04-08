import { PostHTMLTree, Plugin } from "posthtml"
// export declare module posthtml-inline-assets

declare var PostHTMLInlineAssets: {
    (options?: PostHTMLInlineAssetsOption): Plugin
}
interface PostHTMLInlineAssetsOption {
    root?: string
    from?: string
    inline?: Transforms
}
interface Transforms {
    check(node: PostHTMLTree): boolean
    then(
        node: PostHTMLTree,
        data: { buffer: Buffer, originalPath: string, resolvedPath: string, mimeType: string }): void
}
export = PostHTMLInlineAssets