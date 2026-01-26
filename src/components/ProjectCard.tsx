import { getCategoryConfig } from "@/config/const";
import { urlFor } from "@/sanity/lib/image";
import { Card, Inset, AspectRatio, Flex, Badge, Text, Heading, Box } from "@radix-ui/themes";
import { Layers, Calendar } from "lucide-react";
import { useMemo } from "react";
import { Project } from "../../sanity.types";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {

    const cfg = useMemo(() => getCategoryConfig(project.category!), [project])

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
                                {cfg?.title || "Project"}
                            </Badge>
                        </div> */}
                        <Box position="relative" width="100%" height="100%" style={{ overflow: "hidden" }}>
                            {project.image ? (
                                <Image
                                    src={urlFor(project.image).width(768).height(432).fit("crop").url()}
                                    alt={project.title || "Project Image"}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out grayscale-0 group-hover:grayscale-100"
                                />
                            ) : (
                                <Flex align="center" justify="center" width="100%" height="100%" style={{ backgroundColor: "var(--gray-3)" }}>
                                    <Layers className="h-12 w-12 text-gray-300" />
                                </Flex>
                            )}
                        </Box>
                    </AspectRatio>
                </Inset>

                <Flex direction="column" gap="3" height="100%">
                    {/* header */}
                    <Flex justify="between" align="center">
                        <div className="flex flex-row gap-2">
                            <Badge variant="soft" color={cfg?.theme}>
                                {cfg?.title || "Project"}
                            </Badge>
                            <Badge variant="solid" color="gray" highContrast>
                                {project.for?.name}
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