import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {
    code: (props: any) => (
        <code
            className="rounded border bg-muted px-1 py-0.5 font-mono text-xs"
            {...props}
        />
    ),
}

export function useMDXComponents(): MDXComponents {
    return components
}