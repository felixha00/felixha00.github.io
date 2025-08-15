"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    TerminalSquare,
    BriefcaseBusiness,
    FolderGit2,
    Cpu,
    Palette,
    Video,
    Plus,
    Fingerprint,
    X,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const INITIAL_SECTIONS = [
    { key: "home", label: "Home", icon: <Fingerprint className="size-3" /> },
    { key: "experience", label: "Experience", icon: <BriefcaseBusiness className="size-3" /> },
    { key: "software", label: "Software", icon: <FolderGit2 className="size-3" /> },
    { key: "hardware", label: "Hardware", icon: <Cpu className="size-3" /> },
    { key: "design", label: "Graphic Design", icon: <Palette className="size-3" /> },
    { key: "content", label: "Content Creation", icon: <Video className="size-3" /> },
];

export default function SlidingTabs() {
    const [sections, setSections] = useState(INITIAL_SECTIONS);
    const [activeTab, setActiveTab] = useState("home");
    const [hoverKey, setHoverKey] = useState<string | null>(null);
    const [tabCount, setTabCount] = useState(1);

    function handleAddTab() {
        const newKey = `tab${tabCount}`;
        const newTab = { key: newKey, label: "CLI", icon: <TerminalSquare className="size-3" /> };
        setSections((prev) => [...prev, newTab]);
        setActiveTab(newKey); // auto-select new tab
        setTabCount((c) => c + 1);
    }

    function handleRemoveTab(key: string) {
        setSections((prev) => {
            const idx = prev.findIndex((s) => s.key === key);
            const newSections = prev.filter((s) => s.key !== key);

            // choose previous tab if closing active one
            if (key === activeTab) {
                if (idx > 0) {
                    setActiveTab(newSections[idx - 1].key);
                } else if (newSections.length > 0) {
                    setActiveTab(newSections[0].key);
                } else {
                    setActiveTab(""); // no tabs left
                }
            }
            return newSections;
        });
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex grow">
            <ScrollArea className="rounded-md">
                <div className="w-full relative h-10">
                    <TabsList className="flex h-9 relative">
                        {sections.map((s, idx) => {
                            const isCustomTab = s.key.startsWith("tab");
                            const isActive = activeTab === s.key;

                            return <div
                                key={s.key}
                                className="relative flex items-center"
                                onMouseEnter={() => setHoverKey(s.key)}
                                onMouseLeave={() => setHoverKey(null)}
                            >
                                {hoverKey === s.key && (
                                    <motion.div
                                        layoutId="hoverBackground"
                                        className="absolute inset-0 bg-muted-foreground/10 rounded-md z-0"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* main tab trigger */}
                                <TabsTrigger
                                    data-active={isActive}
                                    value={s.key}
                                    className={cn('flex items-center gap-2 px-2 relative z-10 data-[active=true]:inset-shadow-sm data-[active=true]:inset-shadow-background/50', isCustomTab && "pr-6")}
                                >
                                    {s.icon}
                                    <span>{s.label}</span>
                                </TabsTrigger>

                                {/* Close button for dynamic CLI tabs */}
                                {isCustomTab && (
                                    <div
                                        className="absolute right-1 z-20 cursor-pointer rounded hover:bg-muted p-0.5"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveTab(s.key);
                                        }}
                                    >
                                        <X className={cn("size-3", isActive && "text-foreground")} />
                                    </div>
                                )}
                            </div>
                        })}

                        {/* Plus button */}
                        <Button
                            variant={"outline"}
                            onClick={handleAddTab}
                            className="flex h-7 ml-1 items-center justify-center aspect-square shrink-0 rounded-md hover:bg-muted transition-colors"
                        >
                            <Plus className="size-3" />
                        </Button>
                    </TabsList>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </Tabs>
    );
}
