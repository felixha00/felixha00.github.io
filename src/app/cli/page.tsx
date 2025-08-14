"use client"

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {
    Command as CommandRoot,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandInput,
} from "@/components/ui/command";
import {
    Terminal,
    ArrowRight,
    Cpu,
    FolderGit2,
    Palette,
    Video,
    BriefcaseBusiness,
    Command as CommandIcon,
    Moon,
    Sun,
    Info,
    Zap,
} from "lucide-react";

/**
 * PortfolioCLI — a single-file React component that mimics a modern, Warp-like CLI
 * with color-coded prompt, inline suggestions, and command routing to a Works “page”.
 *
 * Tech:
 * - Tailwind for styling, shadcn/ui for primitives, lucide-react for icons, framer-motion for micro-interactions
 * - Drop-in ready for Next.js or Vite apps using Tailwind + shadcn
 *
 * Replace the `DATA` content with your real portfolio items.
 */

// --- Mock data (swap with your real stuff) -----------------------------------
const DATA = {
    experience: [
        {
            role: "Senior Developer",
            company: "Acme Labs",
            period: "2022 – Present",
            bullets: [
                "Led migration to edge-first architecture",
                "Shipped design system used across 7 teams",
            ],
        },
        {
            role: "Software Engineer",
            company: "Globex",
            period: "2019 – 2022",
            bullets: [
                "Built real-time analytics pipeline (Kafka + ClickHouse)",
                "Drove 38% infra cost reduction",
            ],
        },
    ],
    software: [
        {
            name: "Nebula",
            blurb: "Open-source UI toolkit for data-heavy dashboards.",
            link: "#",
            stack: ["TypeScript", "React", "Vite"],
        },
        {
            name: "Aquila",
            blurb: "CLI that composes microservices into previews on PR.",
            link: "#",
            stack: ["Go", "Docker", "GitHub Actions"],
        },
    ],
    hardware: [
        {
            name: "EdgeCam",
            blurb: "Low-power ML camera for on-device detection.",
            link: "#",
            stack: ["ESP32", "TensorFlow Lite", "3D Print"],
        },
    ],
    design: [
        {
            name: "Brand Kit — Nova",
            blurb: "Minimal brand system + UI kit for SaaS.",
            link: "#",
            stack: ["Figma", "Illustrator"],
        },
    ],
    content: [
        {
            name: "Scaling Frontends (Talk)",
            blurb: "Patterns for maintainable enterprise UIs.",
            link: "#",
            stack: ["Conf talk", "Slides"],
        },
    ],
};

// --- Utilities ----------------------------------------------------------------
const cls = (...arr) => arr.filter(Boolean).join(" ");

const SECTIONS = [
    { key: "experience", label: "Experience", icon: <BriefcaseBusiness className="w-4 h-4" /> },
    { key: "software", label: "Software", icon: <FolderGit2 className="w-4 h-4" /> },
    { key: "hardware", label: "Hardware", icon: <Cpu className="w-4 h-4" /> },
    { key: "design", label: "Graphic Design", icon: <Palette className="w-4 h-4" /> },
    { key: "content", label: "Content Creation", icon: <Video className="w-4 h-4" /> },
];

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

// --- Component ----------------------------------------------------------------
export default function PortfolioCLI() {
    const [theme, setTheme] = useState("dark");
    const [route, setRoute] = useState<{ page: "terminal" | "works"; section?: string }>({ page: "terminal" });
    const [history, setHistory] = useState<string[]>([
        colorize(`Type 'help' to get started. Try 'works' to see everything.`),
    ]);
    const [value, setValue] = useState("");
    const [hint, setHint] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard focus into input like a real terminal
    useEffect(() => {
        const focus = () => inputRef.current?.focus();
        focus();
        window.addEventListener("click", focus);
        return () => window.removeEventListener("click", focus);
    }, []);

    // Simple inline suggestions based on prefix
    useEffect(() => {
        if (!value) return setHint(null);
        const found = ALL_COMMANDS.find((c) => c.cmd.startsWith(value));
        setHint(found ? found.cmd : null);
    }, [value]);

    // Handle command execution
    function run(cmd: string) {
        const normalized = cmd.trim().toLowerCase();
        if (!normalized) return;

        // Echo the command with Warp-like prompt
        const echoed = (
            `<span class='text-emerald-400'>guest</span>` +
            `@<span class='text-cyan-400'>portfolio</span>` +
            `:<span class='text-fuchsia-400'>~</span>$ ` +
            `<span class='text-slate-200'>${escapeHtml(cmd)}</span>`
        );

        pushHistory(echoed);

        // Routing + responses
        if (normalized === "help") {
            pushHistory(renderHelp());
            return;
        }

        if (normalized === "clear") {
            setHistory([]);
            return;
        }

        if (normalized === "works") {
            setRoute({ page: "works" });
            pushHistory(colorize("Opening Works… (tip: try 'works software')", "text-emerald-400"));
            return;
        }

        if (normalized.startsWith("works ")) {
            const section = normalized.split(" ")[1];
            const valid = SECTIONS.find((s) => s.key === section);
            if (valid) {
                setRoute({ page: "works", section });
                pushHistory(colorize(`Opening Works → ${valid.label}`, "text-emerald-400"));
            } else {
                pushHistory(colorize(`Unknown section: ${section}`, "text-rose-400"));
            }
            return;
        }

        if (normalized.startsWith("theme ")) {
            const next = normalized.split(" ")[1];
            if (next === "dark" || next === "light") {
                setTheme(next);
                pushHistory(colorize(`Theme set to ${next}.`, "text-emerald-400"));
            } else {
                pushHistory(colorize(`Unknown theme: ${next}`, "text-rose-400"));
            }
            return;
        }

        pushHistory(colorize(`Command not found: ${normalized}`, "text-rose-400"));
    }

    function pushHistory(html: string) {
        setHistory((h) => [...h, html]);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            const cmd = value;
            setValue("");
            setHint(null);
            run(cmd);
        }
        if (e.key === "Tab") {
            if (hint) {
                e.preventDefault();
                setValue(hint);
            }
        }
    }

    // Derived styles per theme
    const themeClass = theme === "dark" ? "dark" : "";

    return (
        <div className={cls(themeClass, "w-full min-h-screen bg-background text-foreground p-4")}>
            <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Terminal Card */}
                <Card className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 text-slate-100 shadow-xl">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="flex items-center gap-2 text-slate-100">
                            <Terminal className="w-5 h-5" />
                            <span>warp-like terminal</span>
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-300 border-emerald-700">interactive</Badge>
                            <Button size="icon" variant="ghost" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                            </Button>
                        </div>
                    </CardHeader>
                    <Separator className="bg-slate-800" />
                    <CardContent className="p-0">
                        <ScrollArea className="h-[480px] p-4">
                            <div className="space-y-2 text-sm leading-relaxed">
                                <AnimatePresence initial={false}>
                                    {history.map((line, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{ duration: 0.18 }}
                                            className="font-mono"
                                            dangerouslySetInnerHTML={{ __html: line }}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </ScrollArea>

                        {/* Input Row */}
                        <div className="border-t border-slate-800">
                            <div className="flex items-center gap-3 p-3 font-mono text-sm">
                                {/* Fancy prompt */}
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
                                <Button size="sm" className="gap-1" onClick={() => run(value || "help")}>Run<ArrowRight className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        {/* Quick command palette (optional) */}
                        <div className="p-3 pt-0">
                            <CommandRoot className="rounded-2xl border border-slate-800 bg-slate-900/50">
                                <CommandInput placeholder="Search commands…" />
                                <CommandList>
                                    <CommandEmpty>No matches.</CommandEmpty>
                                    <CommandGroup heading="Commands">
                                        {ALL_COMMANDS.map((c) => (
                                            <CommandItem key={c.cmd} onSelect={() => run(c.cmd)}>
                                                <CommandIcon className="mr-2 h-4 w-4" />
                                                <span className="font-mono">{c.cmd}</span>
                                                <span className="ml-auto text-xs text-slate-400">{c.desc}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </CommandRoot>
                        </div>
                    </CardContent>
                </Card>

                {/* Works Page / Panel */}
                <Card className="bg-card border-muted shadow-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Works
                        </CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-4">
                        <Tabs defaultValue={route.section || "all"} value={route.section || "all"} onValueChange={(v) => setRoute({ page: "works", section: v === "all" ? undefined : v })}>
                            <TabsList className="grid grid-cols-6 w-full">
                                <TabsTrigger value="all">All</TabsTrigger>
                                {SECTIONS.map((s) => (
                                    <TabsTrigger key={s.key} value={s.key} className="flex items-center gap-2">
                                        {s.icon}
                                        <span className="hidden md:inline">{s.label}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            <TabsContent value="all">
                                <WorksGrid />
                            </TabsContent>
                            {SECTIONS.map((s) => (
                                <TabsContent key={s.key} value={s.key}>
                                    <WorksGrid only={s.key} />
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// --- Subcomponents ------------------------------------------------------------
function Prompt() {
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

function WorksGrid({ only }: { only?: string }) {
    const groups = useMemo(() => {
        const mapped = [
            { key: "experience", title: "Experience", items: DATA.experience },
            { key: "software", title: "Software Projects", items: DATA.software },
            { key: "hardware", title: "Hardware Projects", items: DATA.hardware },
            { key: "design", title: "Graphic Design", items: DATA.design },
            { key: "content", title: "Content Creation", items: DATA.content },
        ];
        return only ? mapped.filter((m) => m.key === only) : mapped;
    }, [only]);

    return (
        <div className="space-y-8">
            {groups.map((g) => (
                <section key={g.key}>
                    <div className="flex items-center gap-2 mb-3">
                        <SectionIcon kind={g.key} />
                        <h3 className="text-lg font-semibold">{g.title}</h3>
                        <Badge variant="outline" className="ml-1">{g.items.length}</Badge>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {g.key === "experience" ? (
                            g.items.map((exp: any, i: number) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                                    <Card className="h-full">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-base font-medium">{exp.role}</div>
                                                <Badge variant="secondary">{exp.period}</Badge>
                                            </div>
                                            <div className="text-muted-foreground text-sm mb-2">{exp.company}</div>
                                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                                {exp.bullets.map((b: string, j: number) => (
                                                    <li key={j}>{b}</li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            g.items.map((p: any, i: number) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
                                    <Card className="h-full">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-base font-medium">{p.name}</div>
                                                <div className="flex gap-1 flex-wrap justify-end">
                                                    {p.stack?.map((t: string) => (
                                                        <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-muted-foreground text-sm mt-1 mb-3">{p.blurb}</p>
                                            <div className="flex items-center gap-2">
                                                <Button asChild size="sm" variant="secondary">
                                                    <a href={p.link}>View</a>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            ))}
        </div>
    );
}

function SectionIcon({ kind }: { kind: string }) {
    const map: Record<string, React.ReactNode> = {
        experience: <BriefcaseBusiness className="w-4 h-4" />,
        software: <FolderGit2 className="w-4 h-4" />,
        hardware: <Cpu className="w-4 h-4" />,
        design: <Palette className="w-4 h-4" />,
        content: <Video className="w-4 h-4" />,
    };
    return <span className="text-muted-foreground">{map[kind] ?? <Info className="w-4 h-4" />}</span>;
}

// --- Render helpers -----------------------------------------------------------
function renderHelp() {
    const list = ALL_COMMANDS.map((c) => `• <span class='text-cyan-300'>${c.cmd}</span> — <span class='text-slate-300'>${c.desc}</span>`).join("<br/>");
    return (
        `<div class='space-y-2'>` +
        `<div><span class='text-fuchsia-300'>help</span> — available commands</div>` +
        `<div class='pl-2'>${list}</div>` +
        `</div>`
    );
}

function colorize(text: string, clsName = "text-slate-300") {
    return `<span class='${clsName}'>${escapeHtml(text)}</span>`;
}

function escapeHtml(s: string) {
    return s
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}
