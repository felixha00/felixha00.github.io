import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { PortableText } from "next-sanity";
import { Badge, Button, Heading, Inset, Separator } from "@radix-ui/themes";
import { getCategoryConfig } from "@/config/const";

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
    const catConfig = getCategoryConfig(project.category)

    if (!project) {
        notFound();
    }

    return (
        <main className="flex-1 max-w-4xl w-4xl mx-auto px-4 py-16 overflow-x-hidden border-border border-x space-y-4">
            {/* Header Section */}
            <header className="flex flex-col space-y-4 relative items-start">
                <div className="flex flex-wrap gap-2 items-center">
                    <Badge color={catConfig?.theme}>
                        {catConfig?.title}
                    </Badge>
                    {project.date && (
                        <span className="text-muted-foreground text-sm py-0.5">
                            {new Date(project.date).getFullYear()}
                        </span>
                    )}
                </div>

                <Heading size={{ initial: "7", md: "9" }}>{project.title}</Heading>

                {project.summary && (
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {project.summary}
                    </p>
                )}

                {/* Project Links */}
                <div className="flex flex-wrap gap-4">
                    {project.url && (
                        <Button size={"3"} color={catConfig?.theme} highContrast>
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visit Project
                            </a>
                        </Button>
                    )}
                    {project.links?.map((link, index: number) => (
                        <>
                            {index === 0 && <Separator orientation={"vertical"} decorative className="h-auto" />}
                            <Button key={link._key} size={"3"} color={catConfig?.theme} variant="soft">
                                <a
                                    key={link._key}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.label}
                                </a>
                            </Button>
                        </>
                    ))}
                </div>
                {/* <div className="absolute w-full -z-10 bottom-0 aspect-[2] opacity-100">
                    <Image className="object-cover translate-y-4 scale-x-105" alt="accent" src="/img/1.webp" fill />
                </div> */}
            </header>


            {/* Main Image */}
            <Inset className="border border-accent -mx-4"></Inset>

            {project.image && (
                // 1. Remove h-100 md:h-150. Keep w-full.
                <div className="relative w-full overflow-hidden">
                    <Image
                        src={urlFor(project.image).width(1600).url()}
                        alt={project.image.alt || project.title}
                        width={1600}
                        height={900}
                        className="w-full h-auto object-cover"

                        priority
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                </div>
            )}

            <Inset className="border border-accent -mx-4"></Inset>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="md:col-span-8 prose prose-lg max-w-none">
                    {project.content && (
                        <PortableText value={project.content}
                        />
                    )}
                </div>

                {/* Side: Tags & Stack */}
                <aside className="md:col-span-4 space-y-8">
                    {project.stack && project.stack.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <h3>Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.stack.map((tech) => (
                                    <Badge key={tech} size={"3"}>
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.tags && project.tags.length > 0 && (
                        <div>
                            <h3 className="font-bold mb-3 uppercase text-sm">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="text-gray-500 text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </div>
        </main>
    );
}