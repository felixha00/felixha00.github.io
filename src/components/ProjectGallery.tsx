"use client";

import React, { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ProjectCard from "./ProjectCard";
import { Project } from "../../sanity.types";
import { PROJECT_CATEGORIES } from "@/config/const";
import { LayoutGridIcon, SearchXIcon } from "lucide-react";

interface ProjectGalleryProps {
    projects: Project[];
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const searchQuery = searchParams.get("q") || "";
    const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "all");

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesCategory = activeCategory === "all" || project.category === activeCategory;
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                project.title?.toLowerCase().includes(query) ||
                project.summary?.toLowerCase().includes(query) ||
                project.stack?.some((stackItem) => stackItem.toLowerCase().includes(query));

            return matchesCategory && matchesSearch;
        });
    }, [projects, activeCategory, searchQuery]);

    const updateUrl = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(params.toString() ? `?${params.toString()}` : pathname, { scroll: false });
    };

    const handleCategoryChange = (value: string) => {
        setActiveCategory(value);
        updateUrl("cat", value);
    };

    const clearFilters = () => {
        setActiveCategory("all");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        params.delete("cat");
        router.replace(params.toString() ? `?${params.toString()}` : pathname, { scroll: false });
    };

    return (
        <div className="flex flex-1 grow flex-col gap-4">
            <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
                <ToggleGroup
                    type="single"
                    value={activeCategory}
                    onValueChange={(value) => {
                        if (value) handleCategoryChange(value);
                    }}
                    variant="outline"
                    size="sm"
                    spacing={1}
                    className="flex-wrap justify-start"
                >
                    <ToggleGroupItem value="all">
                        <LayoutGridIcon data-icon="inline-start" />
                        All
                    </ToggleGroupItem>
                    {PROJECT_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;

                        return (
                            <ToggleGroupItem key={cat.slug} value={cat.slug}>
                                <Icon data-icon="inline-start" />
                                {cat.title}
                            </ToggleGroupItem>
                        );
                    })}
                </ToggleGroup>
            </div>

            <div className="flex flex-1 flex-col">
                {filteredProjects.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <SearchXIcon />
                            </EmptyMedia>
                            <EmptyTitle className="font-display text-3xl">No projects found</EmptyTitle>
                            <EmptyDescription>
                                Try a different category or clear the current filters.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button variant="outline" onClick={clearFilters}>
                                Clear filters
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                            >
                                <ProjectCard project={project} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
