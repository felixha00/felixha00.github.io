"use client"

import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Kbd, KbdKey } from "./ui/shadcn-io/kbd";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { History, Keyboard } from "lucide-react";
import { useNavigator } from "@/contexts/client-navigator-context";

const ALL_COMMANDS = [
    { cmd: "help", desc: "Show available commands" },
    { cmd: "clear", desc: "Clear the terminal output" },
    { cmd: "works", desc: "Open the Works page" },
    { cmd: "works experience", desc: "Go to Experience section" },
    { cmd: "works software", desc: "Go to Software Projects" },
    { cmd: "works hardware", desc: "Go to Hardware Projects" },
    { cmd: "works design", desc: "Go to Graphic Design" },
    { cmd: "works content", desc: "Go to Content Creation" },
    { cmd: "theme light", desc: "Switch to light theme" },
    { cmd: "theme dark", desc: "Switch to dark theme" },
];

type Props = {
    runCommand?: (cmd: string) => void;
    onClear?: () => void;
};

const PromptFooter = ({ runCommand, onClear }: Props) => {
    const [value, setValue] = useState("");
    const [hint, setHint] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { userAgent, platform, isMobile } = useNavigator();

    useEffect(() => {
        if (!value) {
            setHint(null);
            return;
        }
        const match = ALL_COMMANDS.find(c => c.cmd.startsWith(value));
        setHint(match ? match.cmd : null);
    }, [value]);

    function executeCommand(cmd: string) {
        const trimmed = cmd.trim() || "help";
        if (trimmed === "clear") {
            onClear?.();
        } else {
            runCommand?.(trimmed);
        }
        setHistory(prev => [...prev, trimmed]);
        setHistoryIndex(-1);
        setOpen(false);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            executeCommand(value);
            setValue("");
            setHint(null);
        }
        if (e.key === "Tab") {
            if (hint) {
                e.preventDefault();
                setValue(hint);
            }
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (history.length === 0) return;
            const newIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            setValue(history[newIndex]);
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (history.length === 0) return;
            const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : -1;
            setHistoryIndex(newIndex);
            setValue(newIndex === -1 ? "" : history[newIndex]);
        }
        if (e.ctrlKey && e.key.toLowerCase() === "l") {
            e.preventDefault();
            onClear?.();
        }
        setOpen(value.length > 0);
    }

    return (
        <div className="bg-muted/50 backdrop-blur-lg rounded-sm flex-col grow items-center p-2 border text-sm gap-2 font-mono">
            <div className="flex items-center gap-2">
                <Prompt userName={platform || "guest"} />
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                            setOpen(e.target.value.length > 0);
                        }}
                        onKeyDown={onKeyDown}
                        placeholder="Type a command… (try: works)"
                        className="w-full bg-transparent outline-none placeholder:text-muted-foreground text-left"
                    />

                    {hint && hint !== value && (
                        <span className="pointer-events-none absolute left-0 top-0 text-slate-500 select-none">
                            <span className="invisible">{value}</span>
                            <span className="opacity-60">{hint.slice(value.length)}</span>
                        </span>
                    )}
                </div>
                <Button
                    variant={"ghost"}
                    size="sm"
                    className="gap-2"
                    onClick={() => executeCommand(value)}
                >
                    Run<Kbd className=""><KbdKey>⤶</KbdKey></Kbd>
                </Button>
            </div>
            {!isMobile && (
                <div className="flex flex-wrap gap-4 text-tiny text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <History size={14} /> <span>Navigate history:</span>
                        <Kbd><KbdKey>↑</KbdKey></Kbd>
                        <Kbd><KbdKey>↓</KbdKey></Kbd>
                    </div>
                    <div className="flex items-center gap-1">
                        <Keyboard size={14} /> <span>Clear terminal:</span>
                        <Kbd><KbdKey>Ctrl</KbdKey>+<KbdKey>L</KbdKey></Kbd>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Autocomplete:</span>
                        <Kbd><KbdKey>Tab</KbdKey></Kbd>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PromptFooter;

function Prompt({ userName }: { userName: string }) {
    return (
        <div className="select-none font-mono text-xs md:text-sm flex items-center">
            <span className="text-emerald-400">{userName}</span>
            <span className="text-slate-500">@</span>
            <span className="text-cyan-400">portfolio</span>
            <span className="text-slate-500">:</span>
            <span className="text-fuchsia-400">~</span>
            <span className="text-slate-500">$</span>
        </div>
    );
}
