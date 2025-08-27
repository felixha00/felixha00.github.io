import Link, { LinkProps } from "next/link"
import { ReactNode } from "react"
import { ExternalLink } from "lucide-react"

interface ExtendedLinkProps extends LinkProps {
    children: ReactNode
    className?: string
    target?: string
}

export function ExtendedLink({
    children,
    target,
    className,
    ...props
}: ExtendedLinkProps) {
    const isExternal = target === "_blank"

    return (
        <Link
            {...props}
            target={target}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={className}
        >
            <span className="inline-flex items-center gap-1">
                {children}
                {isExternal && <ExternalLink className="w-4 h-4" />}
            </span>
        </Link>
    )
}