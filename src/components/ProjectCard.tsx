import { getProjectCategoryConfig } from "@/config/const";
import { urlFor } from "@/sanity/lib/image";
import { Card, Inset, AspectRatio, Flex, Badge, Text, Heading, Box } from "@radix-ui/themes";
import { Layers, Calendar } from "lucide-react";
import { useMemo, useRef } from "react";
import { Project } from "../../sanity.types";
import Image from "next/image";
import Link from "next/link";
import { InfiniteSlider } from "./motion-primitives/InfiniteSlider";
import GridBackground from "./fluff/GridBackground";

export default function ProjectCard({ project }: { project: Project }) {

    const { icon: Icon, ...cfg } = useMemo(() => getProjectCategoryConfig(project.category!)!, [project])
    const card = useRef(null)

    return (
        <Link
            ref={card}
            href={`/projects/${project.slug}`}
            className="project-card group flex w-full will-change-transform no-underline hover-outline"
        >
            <Card size="2" className="relative w-full h-full before:bg-background">
                {/* <IconButton highContrast color="gray" className="absolute z-40 top-0 right-0" size="3" radius="none" variant="classic"><ExternalLink /></IconButton> */}
                <GridBackground />
                <Inset clip="padding-box" side="top" pb="current" className="relative">
                    <AspectRatio ratio={16 / 9}>
                        {/* <div className="absolute border-l z-10 p-4 round -bottom-6.5 bg-background">
                            <div className="flex flex-row">
                                <Badge color="gray">
                                    {project.for?.name || "Personal"}
                                </Badge>
                                <Badge variant="soft" color={cfg?.theme}>
                                    <Icon size="10" /> {cfg?.title || "Project"}
                                </Badge>
                            </div>
                        </div> */}
                        <Box position="relative" width="100%" height="100%" style={{ overflow: "hidden" }}>
                            {project.image ? (
                                <Image
                                    src={urlFor(project.image).width(768).height(432).fit("crop").url()}
                                    alt={project.title || "Project Image"}
                                    fill
                                    className="object-cover duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <Flex align="center" justify="center" width="100%" height="100%" style={{ backgroundColor: "var(--gray-3)" }}>
                                    <Layers className="h-12 w-12 text-gray-300" />
                                </Flex>
                            )}
                            <div className="absolute top-0 bottom-0 right-0 left-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-difference" style={{ containerType: "size", lineHeight: 1 }}>
                                <InfiniteSlider speed={24}>
                                    <h1 className="font-display tracking-tighter font-bold uppercase text-[100cqh]">{project.title?.replaceAll(" ", "")}</h1>
                                </InfiniteSlider>
                            </div>
                        </Box>
                    </AspectRatio>
                </Inset>

                <Flex direction="column" gap="2" height="100%">
                    {/* header */}
                    <Flex justify="between" align="center">
                        <div className="flex flex-row">
                            <Badge color="gray">
                                {project.for?.name || "Personal"}
                            </Badge>
                            <Badge variant="soft" color={cfg?.theme}>
                                <Icon size="10" /> {cfg?.title || "Project"}
                            </Badge>
                        </div>
                        {project.date && (
                            <Flex align="center" gap="1">
                                <Calendar className="size-3" />
                                <Text size="1" color="gray">
                                    {new Date(project.date).getFullYear()}
                                </Text>
                            </Flex>
                        )}
                    </Flex>

                    {/* title and summary */}
                    <Box className="flex flex-col gap-2">
                        <Heading className="font-bold font-display"
                        >
                            {project.title}
                        </Heading>
                        <Text as="p" size="2" color="gray" className="line-clamp-2">
                            {project.summary}
                        </Text>
                    </Box>

                    {/* <Flex className="grow" /> */}

                    {/* badges */}
                    <div className="flex flex-wrap gap-1 shrink-0">
                        {project.stack?.map((tech) => (
                            <Badge key={tech} variant="soft" color="gray" highContrast={false}>
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </Flex>
            </Card >
        </Link >
    );
}
