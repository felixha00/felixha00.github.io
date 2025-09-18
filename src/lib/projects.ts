import fs from "fs";
import path from "path";
import { getMDXData } from "@/lib/mdx";

// ---- Types ---- //

export interface ProjectLinks {
  [key: string]: string | undefined; // allow flexibility
}

export interface ProjectMetadata {
  dir: string;
  title: string;
  image: string;
  summary: string;
  date: string; // could be Date if you parse it
  url: string;
  category: string;
  tags: string[];
  stack: string[];
  links: ProjectLinks;
  projectType?: string;
  itemType?: "project";
}

export interface Project {
  metadata: ProjectMetadata;
  content: string;
  slug: string;
}

// ---- Constants ---- //

const projectsPath = path.join(process.cwd(), "content", "projects");

// ---- Functions ---- //

export function getAllProjects(): Project[] {
  const projects = getMDXData(projectsPath) as Project[];

  return projects
    .map((project) => {
      return {
        ...project,
        metadata: {
          ...project.metadata,
          projectType: project.metadata.category,
          itemType: "project" as const,
        },
      };
    })
    .sort((a, b) => (a.metadata.date > b.metadata.date ? -1 : 1));
}

export function getProjectSource(slug: string): string {
  const fullPath = path.join(projectsPath, `${slug}.mdx`);
  return fs.readFileSync(fullPath, "utf8");
}

export function getProject(slug: string): string {
  return path.join(projectsPath, `${slug}.mdx`);
}
