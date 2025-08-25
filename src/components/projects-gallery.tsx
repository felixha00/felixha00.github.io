"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, stagger, Variants } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "./ui/badge";
import ProjectCard from "./cards/project-card";

export type ProjectItem = {
    slug: string;
    title: string;
    summary: string;
    date: string;
    projectType: string;
    image?: string | null;
};

export type ProjectsGalleryProps = {
    items: ProjectItem[];
    baseRoute?: string;
    typeLabels?: Record<string, string>;
};

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: "easeInOut",
            delayChildren: stagger(0.1)
        }
    },
    exit: { opacity: 0, y: -10 },
};


const uniqueTypes = (items: ProjectItem[]) =>
    Array.from(new Set(items.map((i) => i.projectType))).sort((a, b) => a.localeCompare(b));

export default function ProjectsGallery({
    items,
    baseRoute = "/projects",
    typeLabels = {},
}: ProjectsGalleryProps) {
    const router = useRouter();
    const pathname = usePathname();
    const search = useSearchParams();

    const qParam = search.get("q") ?? "";
    const typeParam = search.get("type") ?? "all";
    const sortParam = search.get("sort") ?? "newest";
    const openParam = search.get("open") ?? null;

    const [query, setQuery] = useState(qParam);

    useEffect(() => setQuery(qParam), [qParam]);

    const types = useMemo(() => ["all", ...uniqueTypes(items)], [items]);

    const filtered = useMemo(() => {
        let out = items.slice();
        if (typeParam !== "all") out = out.filter((i) => i.projectType === typeParam);
        if (qParam) {
            const needle = qParam.toLowerCase();
            out = out.filter(
                (i) =>
                    i.title.toLowerCase().includes(needle) ||
                    i.summary.toLowerCase().includes(needle)
            );
        }
        switch (sortParam) {
            case "oldest":
                out.sort((a, b) => +new Date(a.date) - +new Date(b.date));
                break;
            case "title":
                out.sort((a, b) => a.title.localeCompare(b.title));
                break;
            default:
                out.sort((a, b) => +new Date(b.date) - +new Date(a.date));
        }
        return out;
    }, [items, qParam, typeParam, sortParam]);

    const setParams = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(search.toString());
        Object.entries(updates).forEach(([k, v]) => {
            if (!v) params.delete(k);
            else params.set(k, String(v));
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    const onOpen = (slug: string) => {
        setParams({ open: slug });
        router.push(`${baseRoute}/${slug}`);
    };

    const onClose = () => {
        router.back();
        setParams({ open: null });
    };

    return (
        <div className="p-2 flex flex-col grow gap-2">
            {/* <section className="mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold">Projects</h1>
                <p className="text-gray-600 mt-2">Filter, sort, and click a card to zoom into details.</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-0 items-stretch">
                    <Input
                        placeholder="Search by title or description"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setParams({ q: query })}
                        className="md:col-span-2"
                    />

                    <Select value={typeParam} onValueChange={(v) => setParams({ type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {types.map((t) => (
                                <SelectItem key={t} value={t}>
                                    {t === "all" ? "All types" : typeLabels[t] ?? t}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortParam} onValueChange={(v) => setParams({ sort: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                            <SelectItem value="title">Title A → Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section> */}

            <section>
                <motion.ul variants={containerVariants} initial="hidden"
                    animate="show" className="grid grow gap-2 items-stretch grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
                    <AnimatePresence>
                        {filtered.map((item) => (
                            <motion.li key={item.slug} layout layoutId={`card-${item.slug}`} className="group">
                                <ProjectCard key={item.slug} item={item} onOpen={onOpen} typeLabels={typeLabels} baseRoute={baseRoute} />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </motion.ul>
            </section>
        </div>
    );
}

