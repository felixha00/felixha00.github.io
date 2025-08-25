import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { slugify } from './utils';
import { getMDXData } from '@/lib/mdx';

const projectsPath = path.join(process.cwd(), 'content', 'projects');

// export type ProjectMeta = {
//     itemType: "project"
//     projectType?: string,
//     slug: string;
//     title: string;
//     summary: string;
//     date: string;
//     image?: string;
//     stack?: Array<string>
// };

export function getAllProjects() {
    const projects = getMDXData(path.join(process.cwd(), 'content', 'projects'))

    // const files = fs.readdirSync(projectsPath);

    return projects.map((project) => {
        return {
            ...project,
            metadata: {
                ...project.metadata,
                projectType: project.metadata.type,
                itemType: "project" as const,
            }
        }
        // const { metadata, slug } = project
        // return {
        //     itemType: "project" as const,
        //     projectType: metadata.type,
        //     slug: slugify(slug),
        //     title: metadata.title || 'Project',
        //     summary: metadata.summary || '',
        //     date: metadata.date || '',
        //     image: metadata.image || '/img/default-bg.webp',
        //     stack: metadata.stack || [],
        // }
    }).sort((a, b) => (a.metadata.date > b.metadata.date ? -1 : 1));
}


export function getProjectSource(slug: string) {
    const fullPath = path.join(projectsPath, `${slug}.mdx`);
    return fs.readFileSync(fullPath, 'utf8');
}

export function getProject(slug: string) {
    return path.join(projectsPath, `${slug}.mdx`)
}