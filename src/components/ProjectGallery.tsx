"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LuArrowUpRight, LuCalendar, LuLayers } from "react-icons/lu";
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
    Grid
} from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { Layers } from "lucide-react";
import { getCategoryTitle } from "@/config/const";

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
    const sp = useSearchParams();

    useGSAP(
        () => {
            if (!containerRef.current) return;

            const cards = containerRef.current.querySelectorAll(".project-card");

            gsap.fromTo(
                cards,
                { y: 40, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                }
            );
        },
        { scope: containerRef, dependencies: [projects] }
    );

    if (projects.length === 0) {
        return (
            <Flex
                direction="column"
                align="center"
                justify="center"
                height="256px"
                className="text-gray-500" // Optional utility for generic gray text
            >
                <Layers className="w-12 h-12 mb-4 opacity-20" />
                <Text>No projects found yet.</Text>
            </Flex>
        );
    }

    // Using Radix Grid for layout
    return (
        <Grid
            ref={containerRef}
            columns={{ initial: "1", md: "2", lg: "3" }}
            gap="4"
            width="auto"
        >
            {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
            ))}
        </Grid>
    );
}

function ProjectCard({ project }: { project: Project }) {
    return (
        <Link
            href={`/projects/${project.slug}`}
            className="project-card group flex w-full opacity-0 will-change-transform no-underline"
        >
            <Card size="2" className="w-full h-full transition-shadow shadow-xs hover:shadow-lg">
                <Inset clip="padding-box" side="top" pb="current" className="relative">

                    <AspectRatio ratio={16 / 9}>
                        {/* <div className="absolute z-10 p-4 bg-[#0a0a0a] -bottom-8 rounded-tr-xl">
                            <Badge className="bottom-0 bg-muted/50" variant="outline" color="gold" highContrast>
                                {getCategoryTitle(project.category) || "Project"}
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

                            {/* Floating Action Button */}
                            <Box position="absolute" top="3" right="3" style={{ zIndex: 20 }}>
                                <Flex
                                    align="center"
                                    justify="center"
                                    className="rounded-full bg-white/90 p-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white dark:bg-black/80"
                                >
                                    <LuArrowUpRight className="h-5 w-5" />
                                </Flex>
                            </Box>
                        </Box>
                    </AspectRatio>
                </Inset>

                {/* Content Layout using Flex and Box */}
                <Flex direction="column" gap="3" height="100%">
                    {/* Header: Category & Date */}
                    <Flex justify="between" align="center">
                        <Badge variant="soft" color="gold">
                            {getCategoryTitle(project.category) || "Project"}
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