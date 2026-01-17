import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PROJECT_QUERY, PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { PortableText, SanityProject } from "next-sanity";

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

    return (
        <main className="max-w-4xl mx-auto px-4 py-12">
            {/* Header Section */}
            <header className="mb-10">
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {project.category}
                    </span>
                    {project.date && (
                        <span className="text-gray-500 text-sm py-0.5">
                            {new Date(project.date).getFullYear()}
                        </span>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>

                {project.summary && (
                    <p className="text-xl text-gray-600 leading-relaxed mb-6">
                        {project.summary}
                    </p>
                )}

                {/* Project Links */}
                <div className="flex flex-wrap gap-4">
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Visit Project
                        </a>
                    )}
                    {project.links?.map((link) => (
                        <a
                            key={link._key}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </header>

            {/* Main Image */}
            {project.image && (
                <div className="relative w-full h-[400px] md:h-[600px] mb-12 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                        src={urlFor(project.image).width(1200).height(800).url()}
                        alt={project.image.alt || project.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-w: 768px) 100vw, 1200px"
                    />
                </div>
            )}

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
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm tracking-wider">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.stack.map((tech) => (
                                    <span key={tech} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.tags && project.tags.length > 0 && (
                        <div>
                            <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm tracking-wider">Tags</h3>
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