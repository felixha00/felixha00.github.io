"use client"

import { useAppContext } from "@/providers/app-provider";

export function Prompt({ userName = "guest" }: { userName?: string }) {
    const { ip } = useAppContext()
    return (
        <div className="select-none font-mono text-xs md:text-sm flex items-center">
            <div className="hidden md:block">
                <span className="text-emerald-400">{ip}</span>
                <span className="text-muted-foreground">@</span>
                <span className="text-cyan-400">portfolio</span>
                <span className="text-muted-foreground">:</span>
            </div>
            <span className="text-fuchsia-400">~</span>
            <span className="text-muted-foreground">$</span>
        </div>
    );
}

export default Prompt