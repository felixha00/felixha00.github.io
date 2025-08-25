import ProjectsGallery, { ProjectItem } from "@/components/projects-gallery";
import { getAllProjects } from "@/lib/projects";

export default async function ProjectsPage() {
    const projects = getAllProjects();

    // TODO make this less hacky
    const items = projects.map(p => {
        return { ...p.metadata, slug: p.slug }
    })

    console.log(items)

    return <ProjectsGallery items={items} baseRoute="/projects" />;
};
