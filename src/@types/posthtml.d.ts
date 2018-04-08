declare var posthtml: {
    (plugins?: posthtml.Plugin[]): posthtml.PostHTML
    new(plugins?: posthtml.Plugin[]): posthtml.PostHTML
    parser: any
    render: any
};
declare module posthtml {
    type Parser = (html: string) => PostHTMLTree
    type Render = (tree: PostHTMLTree) => string
    type Plugin = (tree: PostHTMLTreeRoot) => PostHTMLTree
    type PluginAsync = (tree: PostHTMLTreeRoot) => Promise<PostHTMLTree>
    interface PostHTML {
        version: string
        plugins: (Plugin | PluginAsync)[]
        use(plugin: (Plugin | PluginAsync)): PostHTML
        process(html: string, options?: PostHTMLOption): Promise<ProcessingResult>
    }
    interface PostHTMLOption {
        sync?: boolean
        parser?: Parser
        render?: Render
        skipParse?: boolean
    }
    interface ProcessingResult {
        html: string
        tree: PostHTMLTree
        message: any
    }
    interface PostHTMLTree {
        tag?: string
        attrs?: { [prop: string]: string }
        content?: PostHTMLTree | string[]
    }
    interface PostHTMLTreeRoot extends PostHTMLTree {
        walk(cb: (node: PostHTMLTree) => PostHTMLTree): PostHTMLTree
        match(expression: string | RegExp | PostHTMLTree | string[] | RegExp[] | PostHTMLTree[], cb: (node: PostHTMLTree) => PostHTMLTree): PostHTMLTree
    }
}
export = posthtml