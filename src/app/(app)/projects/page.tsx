

import { Metadata } from "next";
import { Suspense } from "react";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import ProjectGallery from "@/components/ProjectGallery";
import { Skeleton } from "@/components/ui/skeleton";


export const metadata: Metadata = {
    title: "Projects",
    description: "A showcase of Felix Ha's work across software, hardware, visual branding, and ventures.",
    openGraph: {
        title: "Projects | felix ha",
        description: "A showcase of Felix Ha's work across software, hardware, visual branding, and ventures.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Projects | felix ha",
        description: "A showcase of Felix Ha's work across software, hardware, visual branding, and ventures.",
    },
};

export const revalidate = 60; // ISR: Revalidate every 60 seconds

function ProjectGalleryFallback() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
                {Array.from({ length: 5 }, (_, index) => (
                    <Skeleton key={index} className="h-7 w-28" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                    <Skeleton key={index} className="aspect-[4/3] w-full" />
                ))}
            </div>
        </div>
    );
}

export default async function ProjectsPage() {
    const projects = await client.fetch(PROJECTS_QUERY);

    return (
        <main className="flex flex-1 flex-col p-4 pt-16">
            <Suspense fallback={<ProjectGalleryFallback />}>
                <ProjectGallery projects={projects} />
            </Suspense>
        </main>
    );
}
