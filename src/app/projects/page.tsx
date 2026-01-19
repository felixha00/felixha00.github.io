

import { Metadata } from "next";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import ProjectGallery from "@/components/ProjectGallery";


export const metadata: Metadata = {
    title: "Projects | My Portfolio",
    description: "A showcase of my latest development projects and experiments.",
};

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function ProjectsPage() {
    const projects = await client.fetch(PROJECTS_QUERY);

    console.log("!! projects", projects)
    return (
        <main className="p-4 h-full flex-1 pt-16">
            <ProjectGallery projects={projects} />
        </main>
    );
}