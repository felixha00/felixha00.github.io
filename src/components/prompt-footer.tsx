"use client"

import { ArrowRight, Carrier, CornerDownLeft } from 'lucide-react';
import React, { use, useRef, useState } from 'react'
import { Button } from './ui/button';

type Props = {}

const PromptFooter = (props: Props) => {

    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [hint, setHint] = useState<string | null>(null);

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            const cmd = value;
            setValue("");
            setHint(null);
            // run(cmd);
        }
        if (e.key === "Tab") {
            if (hint) {
                e.preventDefault();
                setValue(hint);
            }
        }
    }

    return (

        <div className="bg-muted/50 backdrop-blur-lg rounded-sm flex grow items-center p-2 border text-sm gap-2 font-mono">
            <Prompt />
            <div className="relative flex-1">
                <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Type a command… (try: works)"
                    className="w-full bg-transparent outline-none placeholder:text-slate-500"
                />
                {hint && hint !== value && (
                    <span className="pointer-events-none absolute left-0 top-0 text-slate-500 select-none">
                        <span className="invisible">{value}</span>
                        <span className="opacity-60">{hint.slice(value.length)}</span>
                    </span>
                )}
            </div>
            <Button size="sm" className="gap-1" onClick={
                () => { } // run(value || "help")
            }>Run<CornerDownLeft className="w-4 h-4" /></Button>
        </div>
    )
}

export default PromptFooter


export function Prompt() {
    return (
        <div className="select-none font-mono text-xs md:text-sm">
            <span className="text-emerald-400">guest</span>
            <span className="text-slate-500">@</span>
            <span className="text-cyan-400">portfolio</span>
            <span className="text-slate-500">:</span>
            <span className="text-fuchsia-400">~</span>
            <span className="text-slate-500">$</span>
        </div>
    );
}