import { getProjectCategoryConfig } from "@/config/const";
import { urlFor } from "@/sanity/lib/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Layers } from "lucide-react";
import { useMemo, useRef } from "react";
import { Project } from "../../sanity.types";
import Image from "next/image";
import Link from "next/link";
import { InfiniteSlider } from "./motion-primitives/InfiniteSlider";
import GridBackground from "./fluff/GridBackground";

type ProjectCardProject = Project & {
    slug?: Project["slug"] | string;
    for?: {
        name?: string;
    };
};

const getSlugValue = (slug: ProjectCardProject["slug"]) => {
    if (!slug) return null;
    return typeof slug === "string" ? slug : slug.current ?? null;
};

export default function ProjectCard({ project }: { project: ProjectCardProject }) {
    const category = useMemo(
        () => getProjectCategoryConfig(project.category ?? ""),
        [project.category]
    );
    const CategoryIcon = category?.icon ?? Layers;
    const card = useRef<HTMLAnchorElement>(null);
    const slug = getSlugValue(project.slug);

    return (
        <Link
            ref={card}
            href={slug ? `/projects/${slug}` : "/projects"}
            className="project-card group block h-full w-full no-underline"
        >
            <Card className="relative h-full w-full transition-colors hover:ring-foreground/20 pt-0">
                <GridBackground />
                <CardContent className="relative px-0 pt-0">
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                        <div className="relative h-full w-full overflow-hidden">
                            {project.image ? (
                                <Image
                                    src={urlFor(project.image).width(768).height(432).fit("crop").url()}
                                    alt={project.image.alt || project.title || "Project image"}
                                    fill
                                    className="object-cover duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                    <Layers className="size-12" />
                                </div>
                            )}
                            {project.title && (
                                <div
                                    className="absolute inset-0 overflow-hidden whitespace-nowrap opacity-0 mix-blend-difference transition-opacity duration-500 group-hover:opacity-100"
                                    style={{ containerType: "size", lineHeight: 1 }}
                                >
                                    <InfiniteSlider speed={24}>
                                        <h1 className="font-display text-[100cqh] font-bold uppercase tracking-tighter">
                                            {project.title.replaceAll(" ", "")}
                                        </h1>
                                    </InfiniteSlider>
                                </div>
                            )}
                        </div>
                    </AspectRatio>
                </CardContent>

                <CardHeader className="relative">
                    <div className="flex flex-wrap items-center gap-1">
                        <Badge variant="secondary">
                            {project.for?.name || "Personal"}
                        </Badge>
                        <Badge variant="outline">
                            <CategoryIcon data-icon="inline-start" />
                            {category?.title || "Project"}
                        </Badge>
                    </div>
                    {project.date && (
                        <CardAction className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarIcon className="size-3" />
                            {new Date(project.date).getFullYear()}
                        </CardAction>
                    )}
                    <CardTitle className="font-display text-xl font-bold">
                        {project.title}
                    </CardTitle>
                    {project.summary && (
                        <CardDescription className="line-clamp-2">
                            {project.summary}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardFooter className="relative mt-auto flex flex-wrap justify-start gap-1">
                    {project.stack?.map((tech) => (
                        <Badge key={tech} variant="secondary">
                            {tech}
                        </Badge>
                    ))}
                </CardFooter>
            </Card>
        </Link>
    );
}
