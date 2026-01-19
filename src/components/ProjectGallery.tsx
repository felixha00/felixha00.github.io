"use client";

import React, { useRef, useState, useEffect, useMemo, act } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    LuArrowUpRight,
    LuCalendar,
    LuLayers,
    LuX,
    LuFilter
} from "react-icons/lu";
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
    TextField,
    Button,
    IconButton,
    Separator
} from "@radix-ui/themes";
import { getCategoryConfig } from "@/config/const";
import { Layers, Search } from "lucide-react";

// Constants
const MAIN_CATEGORIES = [
    { title: "Software & Web", value: "sfw" },
    { title: "Hardware & Tangibles", value: "hdw" },
    { title: "Visual & Brand", value: "viz" },
    { title: "Business & Ventures", value: "biz" },
];

export interface Project {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    image: any;
    date: string;
    stack: string[];
    category: string;
}

interface ProjectGalleryProps {
    projects: Project[];
}

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // -- State --
    // Initialize from URL params if available
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "all");

    // -- Filtering Logic --
    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            // 1. Category Filter
            const matchesCategory = activeCategory === "all" || project.category === activeCategory;

            // 2. Search Filter (Title, Summary, or Stack)
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                project.title?.toLowerCase().includes(query) ||
                project.summary?.toLowerCase().includes(query) ||
                project.stack?.some(s => s.toLowerCase().includes(query));

            return matchesCategory && matchesSearch;
        });
    }, [projects, activeCategory, searchQuery]);

    // -- URL Synchronization --
    // Updates URL without refreshing when filters change
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

    // -- Animations --
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
        <Flex direction="column" gap="6" width="100%">

            {/* --- Filter & Search Bar --- */}
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
                <Box minWidth="250px">
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
                </Box>
            </Flex>

            {/* --- Results Grid --- */}
            <div ref={containerRef} className="min-h-[400px]">
                {filteredProjects.length === 0 ? (
                    // Empty State
                    <Flex
                        direction="column"
                        align="center"
                        justify="center"
                        height="300px"
                        className="text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl"
                    >
                        <Flex
                            align="center"
                            justify="center"
                            className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4"
                        >
                            <LuFilter className="w-6 h-6 opacity-40" />
                        </Flex>
                        <Heading size="4" mb="2">No projects found</Heading>
                        <Text color="gray">
                            Try adjusting your search or category filters.
                        </Text>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSearchQuery("");
                                setActiveCategory("all");
                                updateUrl("q", null);
                                updateUrl("cat", null);
                            }}
                        >
                            Clear all filters
                        </Button>
                    </Flex>
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
        </Flex>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <Link
            href={`/projects/${project.slug}`}
            className="project-card group flex w-full will-change-transform no-underline"
        >
            <Card size="2" className="w-full h-full transition-shadow shadow-xs hover:shadow-lg">
                <Inset clip="padding-box" side="top" pb="current" className="relative">

                    <AspectRatio ratio={16 / 9}>
                        {/* <div className="absolute z-10 p-4 bg-[#0a0a0a] -bottom-8 rounded-tr-xl">
                            <Badge className="bottom-0 bg-muted/50" variant="outline" color="gold" highContrast>
                                {getCategoryConfig(project.category) || "Project"}
                            </Badge>
                        </div> */}
                        <Box position="relative" width="100%" height="100%" style={{ overflow: "hidden" }}>
                            {project.image ? (
                                <Image
                                    src={urlFor(project.image).width(768).height(432).fit("crop").url()}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out"
                                />
                            ) : (
                                <Flex align="center" justify="center" width="100%" height="100%" style={{ backgroundColor: "var(--gray-3)" }}>
                                    <Layers className="h-12 w-12 text-gray-300" />
                                </Flex>
                            )}
                        </Box>
                    </AspectRatio>
                </Inset>

                {/* Content Layout using Flex and Box */}
                <Flex direction="column" gap="3" height="100%">
                    {/* Header: Category & Date */}
                    <Flex justify="between" align="center">
                        <Badge variant="soft" color="gold">
                            {getCategoryConfig(project.category)?.title || "Project"}
                        </Badge>
                        {project.date && (
                            <Flex align="center" gap="1">
                                <LuCalendar className="w-3 h-3 text-gray-500" />
                                <Text size="1" color="gray">
                                    {new Date(project.date).getFullYear()}
                                </Text>
                            </Flex>
                        )}
                    </Flex>

                    {/* Title & Summary */}
                    <Box>
                        <Heading
                            size="5"
                            mb="1"
                        >
                            {project.title}
                        </Heading>
                        <Text as="p" size="2" color="gray" className="line-clamp-2">
                            {project.summary}
                        </Text>
                    </Box>

                    {/* Stack Badges */}
                    <div className="flex-wrap flex gap-1">
                        {project.stack?.map((tech) => (
                            <Badge key={tech} variant="soft" color="gray" highContrast={false}>
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </Flex>
            </Card>
        </Link>
    );
}