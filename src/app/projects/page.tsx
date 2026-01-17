import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";

export const metadata: Metadata = {
    title: "projects",
    description: "A showcase of my latest development projects and experiments.",
};

interface ProjectCard {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    image: any;
    date: string;
    stack: string[];
    category: string;
}

export default async function ProjectsPage() {
    // Fetch all projects sorted by date
    const projects = await client.fetch(PROJECTS_QUERY);

    return (
        <main className="max-w-6xl mx-auto px-4 py-12">
            {/* Page Header */}
            <header className="mb-12 text-center">/projects</header>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                    <Link
                        href={`/projects/${project.slug}`}
                        key={project._id}
                        className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Project Image */}
                        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                            {project.image ? (
                                <Image
                                    src={urlFor(project.image).width(600).height(400).url()}
                                    alt={project.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-w: 768px) 100vw, (max-w: 1200px) 50vw, 33vw"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Content Body */}
                        <div className="flex flex-col flex-grow p-6">
                            <div className="flex justify-between items-start mb-2">
                                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                                    {project.category || "Project"}
                                </span>
                                {project.date && (
                                    <span className="text-gray-400 text-xs">
                                        {new Date(project.date).getFullYear()}
                                    </span>
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                {project.title}
                            </h2>

                            <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                                {project.summary}
                            </p>

                            {/* Stack / Tags (Preview first 3) */}
                            {project.stack && project.stack.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100">
                                    {project.stack.slice(0, 3).map((tech) => (
                                        <span
                                            key={tech}
                                            className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                    {project.stack.length > 3 && (
                                        <span className="text-xs text-gray-400 px-1 py-1">
                                            +{project.stack.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No projects found.</p>
                </div>
            )}
        </main>
    );
}