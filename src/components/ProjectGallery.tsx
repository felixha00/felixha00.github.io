"use client";

import React, { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
    Flex,
    Grid,
    Button,
} from "@radix-ui/themes";
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
    const router = useRouter();
    const searchParams = useSearchParams();

    const searchQuery = searchParams.get("q") || "";
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

    return (
        <Flex className="gap-4 flex-col h-full flex-1 grow">

            {/* Filter & Search Bar */}
            <Flex
                direction={{ initial: "column", md: "row" }}
                justify="between"
                align={{ initial: "stretch", md: "center" }}
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
            <div className="flex flex-1 flex-col">
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
                        className="gap-1"
                    >
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
                    </Grid>
                )}
            </div>
        </Flex >
    );
}
