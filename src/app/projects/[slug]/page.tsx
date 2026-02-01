import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { PortableText } from "next-sanity";
import { Badge, Button, Heading, Inset, Separator } from "@radix-ui/themes";
import { getCategoryConfig } from "@/config/const";
import ProjectContentTabs from "@/components/ProjectContentTabs";
import GridBackground from "@/components/fluff/GridBackground";

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

    let readmeContent: string | null = null;

    if (project.readmeUrl) {
        try {
            const rawUrl = getRawGithubUrl(project.readmeUrl);
            if (rawUrl) {
                const res = await fetch(rawUrl, { next: { revalidate: 3600 } }); // Cache for 1 hour
                if (res.ok) {
                    readmeContent = await res.text();
                }
            }
        } catch (error) {
            console.error("Failed to fetch README", error);
        }
    }

    return (
        <main className="flex-1 max-w-4xl w-4xl mx-auto px-4 py-16 overflow-x-hidden border-border border-x space-y-4">
            {/* Header Section */}
            <header className="flex flex-col space-y-4 relative items-start">
                <div className="flex flex-wrap gap-2 items-center">
                    <div className="flex flex-row items-center">
                        {project.for && <Badge color={"gray"} highContrast>
                            {project.for?.name}
                        </Badge>}
                        <Badge color={catConfig?.theme}>
                            {catConfig?.title}
                        </Badge>
                    </div>

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
                    {project.links?.length !== 0 && <Separator orientation={"vertical"} decorative className="h-auto" />}
                    {project.links?.map((link, index: number) => (
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

                    ))}
                    {project.attachments?.map((att, index: number) => (
                        <Button key={att._key} size={"3"} color={catConfig?.theme} variant="soft">
                            <a
                                key={att._key}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {att.title}
                            </a>
                        </Button>

                    ))}
                </div>
                {/* <div className="absolute w-full -z-10 bottom-0 aspect-[2] opacity-100">
                    <Image className="object-cover translate-y-4 scale-x-105" alt="accent" src="/img/1.webp" fill />
                </div> */}
            </header>


            {/* Main Image */}
            <Inset className="border border-accent -mx-4"></Inset>

            {project.image && (
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

            <Separator className="-mx-4 w-screen"></Separator>

            {project.stack && project.stack.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    {/* <h3 className="font-bold uppercase text-sm font-mono">Tags</h3> */}
                    <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                            <Badge highContrast key={tech} size={"1"} color={catConfig?.theme}>
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
                            <Badge key={tag} className="text-gray-500 text-sm">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
            <Separator className="border border-accent -mx-4 w-screen"></Separator>
            {/* <Inset clip={"padding-box"} className="-mx-4 -mt-4">
                <div className="prose max-w-none">
                    <ProjectContentTabs
                        sanityContent={project.content}
                        readmeContent={readmeContent}
                    />
                </div>

            </Inset> */}
            <GridBackground />
        </main>
    );
}