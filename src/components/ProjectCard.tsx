"use client";

import { getProjectCategoryConfig } from "@/config/const";
import { formatProjectDate } from "@/lib/project-date";
import { urlFor } from "@/sanity/lib/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Layers, Trophy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Project } from "../../sanity.types";
import Image from "next/image";
import Link from "next/link";
import { InfiniteSlider } from "./motion-primitives/InfiniteSlider";
import GridBackground from "./fluff/GridBackground";
import { TextShimmer } from "./motion-primitives/TextShimmer";

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

const px = (value: string) => Number.parseFloat(value) || 0;

function useFirstLineStack(stack: string[]) {
    const footerRef = useRef<HTMLDivElement>(null);
    const overflowMeasureRef = useRef<HTMLSpanElement>(null);
    const tagMeasureRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const [visibleCount, setVisibleCount] = useState(stack.length);

    useLayoutEffect(() => {
        const footer = footerRef.current;
        if (!footer) return;

        let animationFrame = 0;

        const measure = () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(() => {
                const styles = window.getComputedStyle(footer);
                const innerWidth =
                    footer.clientWidth - px(styles.paddingLeft) - px(styles.paddingRight);
                const gap = px(styles.columnGap || styles.gap);
                const widths = stack.map((_, index) =>
                    tagMeasureRefs.current[index]?.getBoundingClientRect().width ?? 0
                );
                const allTagsWidth = widths.reduce(
                    (total, width, index) => total + width + (index > 0 ? gap : 0),
                    0
                );

                if (allTagsWidth <= innerWidth) {
                    setVisibleCount((current) =>
                        current === stack.length ? current : stack.length
                    );
                    return;
                }

                const overflowWidth =
                    overflowMeasureRef.current?.getBoundingClientRect().width ?? 0;
                const availableWidth = Math.max(0, innerWidth - overflowWidth - gap);
                let usedWidth = 0;
                let nextVisibleCount = 0;

                for (const width of widths) {
                    const nextWidth =
                        usedWidth + width + (nextVisibleCount > 0 ? gap : 0);
                    if (nextWidth > availableWidth) break;

                    usedWidth = nextWidth;
                    nextVisibleCount += 1;
                }

                setVisibleCount((current) =>
                    current === nextVisibleCount ? current : nextVisibleCount
                );
            });
        };

        measure();

        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(footer);
        tagMeasureRefs.current.forEach((tag) => {
            if (tag) resizeObserver.observe(tag);
        });
        if (overflowMeasureRef.current) {
            resizeObserver.observe(overflowMeasureRef.current);
        }

        return () => {
            cancelAnimationFrame(animationFrame);
            resizeObserver.disconnect();
        };
    }, [stack]);

    return { footerRef, overflowMeasureRef, tagMeasureRefs, visibleCount };
}

function ProjectOutcomeItem({
    outcome,
}: {
    outcome?: ProjectCardProject["outcome"];
}) {
    const textRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);
    const prefersReducedMotion = useReducedMotion();

    useLayoutEffect(() => {
        const el = textRef.current;
        if (!el) return;
        const measure = () => {
            const available = el.parentElement?.clientWidth ?? 0;
            setOffset(Math.max(0, el.offsetWidth - available));
        };
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        if (el.parentElement) ro.observe(el.parentElement);
        return () => ro.disconnect();
    }, [outcome]);

    if (!outcome) return null;

    const shouldAnimate = !prefersReducedMotion && offset > 0;

    return (
        <div className="absolute left-4 top-4 z-10 max-w-[calc(100%-2rem)]">
            <Item variant="default" className="shadow-md bg-card overflow-hidden">
                <ItemMedia variant="icon" className="text-muted-foreground shrink-0">
                    <Trophy />
                </ItemMedia>
                <ItemContent className="min-w-0 overflow-hidden">
                    <motion.div
                        ref={textRef}
                        className="w-max"
                        animate={shouldAnimate ? { x: [0, -offset] } : { x: 0 }}
                        transition={shouldAnimate ? {
                            duration: Math.max(1.5, offset / 40),
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "mirror",
                            repeatDelay: 1.5,
                        } : { duration: 0 }}
                    >
                        <ItemTitle className="line-clamp-none whitespace-nowrap w-max">
                            <TextShimmer className="[--base-color:var(--color-muted-foreground)][--base-gradient-color:var(--color-foreground)]">
                                {outcome}
                            </TextShimmer>
                        </ItemTitle>
                    </motion.div>
                </ItemContent>
            </Item>
        </div>
    );
}

export default function ProjectCard({ project }: { project: ProjectCardProject }) {
    const category = useMemo(
        () => getProjectCategoryConfig(project.category ?? ""),
        [project.category]
    );
    const CategoryIcon = category?.icon ?? Layers;
    const slug = getSlugValue(project.slug);
    const projectHref = slug ? `/projects/${slug}` : "/projects";
    const stack = useMemo(() => project.stack ?? [], [project.stack]);
    const { footerRef, overflowMeasureRef, tagMeasureRefs, visibleCount } =
        useFirstLineStack(stack);
    const visibleStack = stack.slice(0, visibleCount);
    const overflowStack = stack.slice(visibleCount);
    const dateLabel = formatProjectDate(project.date, project.isCurrent);

    return (
        <Card className="project-card group relative h-full w-full pt-0 px-0 transition-colors hover:ring-foreground/20">
            <GridBackground />
            <ProjectOutcomeItem outcome={project.outcome} />
            <Link
                href={projectHref}
                className="relative block no-underline outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={`View ${project.title ?? "project"}`}
            >
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
                                aria-hidden
                                className="absolute inset-0 overflow-hidden whitespace-nowrap opacity-0 mix-blend-difference transition-opacity duration-500 group-hover:opacity-100"
                                style={{ containerType: "size", lineHeight: 1 }}
                            >
                                <InfiniteSlider speed={24}>
                                    <span className="font-display text-[100cqh] font-bold uppercase tracking-tighter">
                                        {project.title.replaceAll(" ", "")}
                                    </span>
                                </InfiniteSlider>
                            </div>
                        )}
                    </div>
                </AspectRatio>
            </Link>
            <Link
                href={projectHref}
                className="relative block no-underline outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                aria-label={`View ${project.title ?? "project"}`}
            >
                <CardHeader className="`relative">
                    <div className="flex flex-wrap items-center gap-1">
                        <Badge variant="outline">
                            <CategoryIcon data-icon="inline-start" />
                            {category?.title || "Project"}
                        </Badge>
                        <Badge variant="secondary">
                            {project.for?.name || "Personal"}
                        </Badge>
                    </div>
                    {dateLabel && (
                        <CardAction className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarIcon className="size-3" />
                            {dateLabel}
                        </CardAction>
                    )}
                    <CardTitle className="font-display text-xl font-bold mt-4">
                        {project.title}
                    </CardTitle>
                    {project.summary && (
                        <CardDescription className="line-clamp-2">
                            {project.summary}
                        </CardDescription>
                    )}
                </CardHeader>
            </Link>

            <CardFooter
                ref={footerRef}
                className="relative mt-auto min-h-14 justify-start gap-1 overflow-hidden"
            >
                <div aria-hidden className="pointer-events-none invisible absolute flex items-center gap-1">
                    {stack.map((tech, index) => (
                        <span
                            key={`${tech}-${index}`}
                            ref={(node) => {
                                tagMeasureRefs.current[index] = node;
                            }}
                        >
                            <Badge variant="outline" className="max-w-28 truncate">
                                {tech}
                            </Badge>
                        </span>
                    ))}
                    <span ref={overflowMeasureRef}>
                        <Button type="button" variant="outline" size="xs">
                            +{stack.length} more
                        </Button>
                    </span>
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
                    {visibleStack.length > 0 ? (
                        visibleStack.map((tech, index) => (
                            <Badge
                                key={`${tech}-${index}`}
                                variant="outline"
                                className="max-w-28 truncate"
                            >
                                {tech}
                            </Badge>
                        ))
                    ) : (
                        <span className="sr-only">No stack tags</span>
                    )}
                </div>
                {overflowStack.length > 0 && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                aria-label={`Show ${overflowStack.length} more stack tags`}
                            >
                                +{overflowStack.length} more
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56">
                            <div className="flex flex-wrap gap-1">
                                {overflowStack.map((tech, index) => (
                                    <Badge
                                        key={`${tech}-${visibleCount + index}`}
                                        variant="secondary"
                                        className="max-w-full truncate"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                )}
            </CardFooter>
        </Card>
    );
}
