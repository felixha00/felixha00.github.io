import ProjectsGallery, { ProjectItem } from "@/components/projects-gallery";
import { getAllProjects } from "@/lib/projects";

const DemoProjectsPage = () => {
    const projects = getAllProjects();

    return <ProjectsGallery items={projects} baseRoute="/projects" />;
};

export default DemoProjectsPage