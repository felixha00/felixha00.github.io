"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "./ui/badge";
import CardComponent from "./cards/project-card";

export type ProjectItem = {
    slug: string;
    title: string;
    description: string;
    date: string;
    type: string;
    image?: string | null;
};

export type ProjectsGalleryProps = {
    items: ProjectItem[];
    baseRoute?: string;
    typeLabels?: Record<string, string>;
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });

const uniqueTypes = (items: ProjectItem[]) =>
    Array.from(new Set(items.map((i) => i.type))).sort((a, b) => a.localeCompare(b));

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
        if (typeParam !== "all") out = out.filter((i) => i.type === typeParam);
        if (qParam) {
            const needle = qParam.toLowerCase();
            out = out.filter(
                (i) =>
                    i.title.toLowerCase().includes(needle) ||
                    i.description.toLowerCase().includes(needle)
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
        <div className="px-2 flex flex-col gap-2">
            {/* <section className="mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold">Projects</h1>
                <p className="text-gray-600 mt-2">Filter, sort, and click a card to zoom into details.</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-0 items-stretch">
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
                <ul className="grid gap-2 items-stretch grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
                    <AnimatePresence>
                        {filtered.map((item) => (
                            <motion.li key={item.slug} layout layoutId={`card-${item.slug}`} className="group">
                                <CardComponent item={item} onOpen={onOpen} typeLabels={typeLabels} baseRoute={baseRoute} key={item.slug} />
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            </section>

            <AnimatePresence>
                {openParam && (
                    <motion.div key={openParam} className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                        <motion.div layoutId={`card-${openParam}`} className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border">
                            <motion.div layoutId={`image-${openParam}`} className="relative h-64 w-full bg-gray-100">
                                {items.find((i) => i.slug === openParam)?.image && (
                                    <Image src={items.find((i) => i.slug === openParam)!.image!} alt={items.find((i) => i.slug === openParam)!.title} fill className="object-cover" />
                                )}
                            </motion.div>
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-6">
                                    <div>
                                        <h2 className="text-2xl font-semibold">{items.find((i) => i.slug === openParam)?.title}</h2>
                                        <time className="mt-1 block text-sm text-gray-500">{formatDate(items.find((i) => i.slug === openParam)?.date || "")}</time>
                                    </div>
                                    <Button variant="outline" onClick={onClose}>Back</Button>
                                </div>
                                <p className="mt-4 text-gray-700">{items.find((i) => i.slug === openParam)?.description}</p>
                                <div className="mt-6 flex items-center gap-3">
                                    <Link href={`${baseRoute}/${openParam}`}><Button>View full case study</Button></Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

