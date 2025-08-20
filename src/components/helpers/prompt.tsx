"use client"

import { useAppContext } from "@/providers/app-provider";

export function Prompt({ userName = "guest" }: { userName?: string }) {
    const { ip } = useAppContext()
    return (
        <div className="select-none font-mono text-xs md:text-sm flex items-center">
            <div className="hidden md:block">
                <span className="text-ansi-green">{ip}</span>
                <span className="text-muted-foreground">@</span>
                <span className="text-ansi-cyan">portfolio</span>
                <span className="text-muted-foreground">:</span>
            </div>
            <span className="text-ansi-magenta">~</span>
            <span className="text-muted-foreground">$</span>
        </div>
    );
}

export default Prompt