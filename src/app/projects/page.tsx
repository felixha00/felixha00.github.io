import ProjectsGallery, { ProjectItem } from "@/components/projects-gallery";
import { getAllProjects } from "@/lib/projects";
import { Metadata, ResolvingMetadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = getAllProjects();

  // TODO make this less hacky
  const items = projects.map((p) => {
    return { ...p.metadata, slug: p.slug };
  });

  return <ProjectsGallery items={items} baseRoute="/projects" />;
}
