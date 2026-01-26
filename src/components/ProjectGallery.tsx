"use client";

import React, { useRef, useState, useEffect, useMemo, act } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { urlFor } from "@/sanity/lib/image";
import {
    AspectRatio,
    Card,
    Inset,
    Box,
    Flex,
    Text,
    Heading,
    Badge,
    Grid,
    Button,
} from "@radix-ui/themes";
import { getCategoryConfig } from "@/config/const";
import { Calendar, Layers, Search } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Project } from "../../sanity.types";

// Constants
const MAIN_CATEGORIES = [
    { title: "Software & Web", value: "sfw" },
    { title: "Hardware & Tangibles", value: "hdw" },
    { title: "Visual & Brand", value: "viz" },
    { title: "Business & Ventures", value: "biz" },
];

interface ProjectGalleryProps {
    projects: Project[];
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "all");

    // Filtering Logic 
    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesCategory = activeCategory === "all" || project.category === activeCategory;

            const query = searchQuery.toLowerCase();
            const matchesSearch =
                project.title?.toLowerCase().includes(query) ||
                project.summary?.toLowerCase().includes(query) ||
                project.stack?.some(s => s.toLowerCase().includes(query));

            return matchesCategory && matchesSearch;
        });
    }, [projects, activeCategory, searchQuery]);

    // updates URL without refreshing when filters change
    const updateUrl = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    const handleCategoryChange = (val: string) => {
        setActiveCategory(val);
        updateUrl("cat", val);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        updateUrl("q", val);
    };

    const clearSearch = () => {
        setSearchQuery("");
        updateUrl("q", null);
    };

    //  animations 
    useGSAP(
        () => {
            if (!containerRef.current) return;

            const cards = containerRef.current.querySelectorAll(".project-card");

            gsap.set(cards, { y: 20, opacity: 0, scale: 0.95 });
            gsap.to(
                cards,
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    stagger: 0.05,
                    ease: "power2.out",
                    clearProps: "all"
                }
            );
        },
        { scope: containerRef, dependencies: [filteredProjects] }
    );

    return (
        <Flex className="gap-4 flex-col h-full flex-1 grow">

            {/* Filter & Search Bar */}
            <Flex
                direction={{ initial: "column", md: "row" }}
                justify="between"
                align={{ initial: "stretch", md: "center" }}
                gap="4"
                className="z-30 bg-background p-4 border shadow-sm"
            >
                {/* Categories */}
                <Flex gap="2" wrap="wrap">
                    <Button
                        variant={activeCategory === "all" ? "classic" : "outline"}
                        onClick={() => handleCategoryChange("all")}
                        size="2"
                        highContrast
                        color="gray"
                    >
                        All
                    </Button>
                    {MAIN_CATEGORIES.map((cat) => (
                        <Button
                            key={cat.value}
                            variant={activeCategory === cat.value ? "classic" : "soft"}
                            onClick={() => handleCategoryChange(cat.value)}
                            size="2"
                            color={activeCategory === cat.value ? "gray" : "gray"}
                            highContrast={activeCategory === cat.value}
                        >
                            {cat.title}
                        </Button>
                    ))}
                </Flex>

                {/* Search */}
                {/* <Box minWidth="250px">
                    <TextField.Root
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        variant="surface"
                    >
                        <TextField.Slot>
                            <Search className="w-4 h-4" />
                        </TextField.Slot>
                        {searchQuery && (
                            <TextField.Slot>
                                <IconButton
                                    size="1"
                                    variant="ghost"
                                    onClick={clearSearch}
                                    aria-label="Clear search"
                                >
                                    <LuX className="w-4 h-4" />
                                </IconButton>
                            </TextField.Slot>
                        )}
                    </TextField.Root>
                </Box> */}
            </Flex>

            {/* --- Results Grid --- */}
            <div ref={containerRef} className="flex flex-1 flex-col">
                {filteredProjects.length === 0 ? (
                    // Empty State
                    null
                    // <Flex
                    //     direction="column"
                    //     align="center"
                    //     justify="center"
                    //     height="300px"
                    // >
                    //     <Flex
                    //         align="center"
                    //         justify="center"
                    //         className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
                    //     >
                    //         <LuFilter className="w-6 h-6 opacity-40" />
                    //     </Flex>
                    //     <Heading size="4" mb="2">No projects found</Heading>
                    //     <Text color="gray">
                    //         Try adjusting your search or category filters.
                    //     </Text>
                    //     <Button
                    //         variant="outline"
                    //         className="mt-4"
                    //         onClick={() => {
                    //             setSearchQuery("");
                    //             setActiveCategory("all");
                    //             updateUrl("q", null);
                    //             updateUrl("cat", null);
                    //         }}
                    //     >
                    //         Clear all filters
                    //     </Button>
                    // </Flex>
                ) : (
                    <Grid
                        columns={{ initial: "1", md: "2", lg: "3" }}
                        gap="4"
                        width="auto"
                    >
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </Grid>
                )}
            </div>
        </Flex >
    );
}