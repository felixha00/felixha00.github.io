import { getCategoryConfig } from "@/config/const";
import { urlFor } from "@/sanity/lib/image";
import { Card, Inset, AspectRatio, Flex, Badge, Text, Heading, Box } from "@radix-ui/themes";
import { Layers, Calendar } from "lucide-react";
import { useMemo } from "react";
import { Project } from "../../sanity.types";
import Image from "next/image";
import Link from "next/link";
import { InfiniteSlider } from "./motion-primitives/InfiniteSlider";
// import { InfiniteSlider } from "./fluff/InfiniteSliderGSAP";

export default function ProjectCard({ project }: { project: Project }) {

    const { icon: Icon, ...cfg } = useMemo(() => getCategoryConfig(project.category!)!, [project])

    return (
        <Link
            href={`/projects/${project.slug}`}
            className="project-card group flex w-full will-change-transform no-underline"
        >
            <Card size="2" className="w-full h-full transition-shadow shadow-xs hover:shadow-lg">
                <Inset clip="padding-box" side="top" pb="current" className="relative">
                    <AspectRatio ratio={16 / 9}>
                        <div className="absolute border-l z-10 p-4 pr-7 tr-clipped-corner -bottom-6.5 bg-(--color-panel)">
                            <div className="flex flex-row">
                                <Badge variant="soft" color="gray" className={"group-hover:rt-high-contrast"}>
                                    {project.for?.name}
                                </Badge>
                                <Badge variant="soft" color={cfg?.theme}>
                                    <Icon size="10" /> {cfg?.title || "Project"}
                                </Badge>
                            </div>
                        </div>
                        <Box position="relative" width="100%" height="100%" style={{ overflow: "hidden" }}>
                            {project.image ? (
                                <Image
                                    src={urlFor(project.image).width(768).height(432).fit("crop").url()}
                                    alt={project.title || "Project Image"}
                                    fill
                                    className="object-cover duration-500 ease-out group-hover:brightness-25 group-hover:blur-md"
                                />
                            ) : (
                                <Flex align="center" justify="center" width="100%" height="100%" style={{ backgroundColor: "var(--gray-3)" }}>
                                    <Layers className="h-12 w-12 text-gray-300" />
                                </Flex>
                            )}
                            <div className="absolute top-0 bottom-0 right-0 left-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ containerType: "size", lineHeight: 1.2 }}>
                                <InfiniteSlider speed={24}>
                                    <h1 className="font-custom tracking-tighter font-medium uppercase text-[100cqh] box">{project.title}</h1>
                                </InfiniteSlider>
                            </div>
                        </Box>
                    </AspectRatio>
                </Inset>

                <Flex direction="column" gap="3" height="100%">
                    {/* header */}
                    <Flex justify="end" align="center">
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

                    {/* badges */}
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