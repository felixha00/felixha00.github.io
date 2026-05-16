import Image from "next/image";
import { notFound } from "next/navigation";

import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProjectCategoryConfig } from "@/config/const";
import GridBackground from "@/components/fluff/GridBackground";
import ProjectContentTabs from "@/components/ProjectContentTabs";
import { Layers } from "lucide-react";

const getRawGithubUrl = (url: string) => {
    if (!url) return null;
    if (url.includes("raw.githubusercontent.com")) return url;
    return url
        .replace("github.com", "raw.githubusercontent.com")
        .replace("/blob/", "/");
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = await client.fetch(PROJECT_SLUGS_QUERY);
    return slugs.map((item: { slug: string }) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata(props: PageProps) {
    const params = await props.params;
    const project = await client.fetch(PROJECT_QUERY, params);

    if (!project) return {};

    return {
        title: `${project.title}`,
        description: project.summary,
        openGraph: {
            title: project.title,
            description: project.summary,
            images: project.image ? [urlFor(project.image).width(1200).height(630).url()] : [],
        },
    };
}

export default async function ProjectPage(props: PageProps) {
    const params = await props.params;
    const project = await client.fetch(PROJECT_QUERY, params);

    if (!project) {
        notFound();
    }

    const catConfig = getProjectCategoryConfig(project.category);
    let readmeContent: string | null = null;

    const CategoryIcon = catConfig?.icon ?? Layers;

    if (project.readmeUrl) {
        try {
            const rawUrl = getRawGithubUrl(project.readmeUrl);
            if (rawUrl) {
                const res = await fetch(rawUrl, { next: { revalidate: 3600 } });
                if (res.ok) {
                    readmeContent = await res.text();
                }
            }
        } catch (error) {
            console.error("Failed to fetch README", error);
        }
    }

    const hasSecondaryProjectLinks = Boolean(
        project.links?.some((link: { url?: string }) => link.url) ||
        project.attachments?.some((attachment: { url?: string }) => attachment.url)
    );
    const hasProjectLinks = Boolean(project.url || hasSecondaryProjectLinks);

    return (
        <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 overflow-x-hidden border-x border-border px-4 py-16">
            <header className="relative flex flex-col items-start gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-row items-center gap-1">
                        <Badge variant="outline">
                            <CategoryIcon data-icon="inline-start" />
                            {catConfig?.title || "Project"}
                        </Badge>
                        {project.for && (
                            <Badge variant="secondary">
                                {project.for?.name}
                            </Badge>
                        )}
                    </div>

                    {project.date && (
                        <span className="py-0.5 text-sm text-muted-foreground">
                            {new Date(project.date).getFullYear()}
                        </span>
                    )}
                </div>

                <h1 className="font-display text-5xl font-normal tracking-tight md:text-7xl">
                    {project.title}
                </h1>

                {project.summary && (
                    <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground">
                        {project.summary}
                    </p>
                )}

                {hasProjectLinks && (
                    <div className="flex flex-wrap gap-3">
                        {project.url && (
                            <Button asChild size="lg">
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit Project
                                </a>
                            </Button>
                        )}
                        {project.url && hasSecondaryProjectLinks && (
                            <Separator orientation="vertical" decorative className="h-auto" />
                        )}
                        {project.links?.map((link: { _key: string; label?: string; url?: string }) => (
                            link.url ? (
                                <Button key={link._key} asChild size="lg" variant="secondary">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {link.label}
                                    </a>
                                </Button>
                            ) : null
                        ))}
                        {project.attachments?.map((attachment: { _key: string; title?: string; url?: string }) => (
                            attachment.url ? (
                                <Button key={attachment._key} asChild size="lg" variant="secondary">
                                    <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {attachment.title}
                                    </a>
                                </Button>
                            ) : null
                        ))}
                    </div>
                )}
            </header>

            <Separator className="-mx-4 w-[calc(100%+2rem)]" />

            {project.image && (
                <div className="relative w-full overflow-hidden">
                    <Image
                        src={urlFor(project.image).width(1600).url()}
                        alt={project.image.alt || project.title}
                        width={1600}
                        height={900}
                        className="h-auto w-full object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                </div>
            )}

            <Separator className="-mx-4 w-[calc(100%+2rem)]" />

            {project.stack && project.stack.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    {project.stack.map((tech: string) => (
                        <Badge key={tech} variant="secondary">
                            {tech}
                        </Badge>
                    ))}
                </div>
            )}

            {project.tags && project.tags.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h2 className="text-sm font-bold uppercase">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-muted-foreground">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <Separator className="-mx-4 w-[calc(100%+2rem)]" />
            {(project.content?.length || readmeContent) && (
                <section className="prose max-w-none">
                    <ProjectContentTabs
                        sanityContent={project.content}
                        readmeContent={readmeContent}
                    />
                </section>
            )}
            <GridBackground />
        </main>
    );
}
