import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const projectsPath = path.join(process.cwd(), 'content', 'projects');

export type ProjectMeta = {
    itemType: "project"
    projectType?: string,
    slug: string;
    title: string;
    summary: string;
    date: string;
    image?: string;
    stack?: Array<string>
};

export function getAllProjects(): ProjectMeta[] {
    const files = fs.readdirSync(projectsPath);

    return files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const fullPath = path.join(projectsPath, file);
            const source = fs.readFileSync(fullPath, 'utf8');
            const { data } = matter(source);
            return {
                itemType: "project" as const,
                projectType: data.type,
                slug: file.replace(/\.mdx$/, ''),
                title: data.title || 'Project',
                summary: data.summary || '',
                date: data.date || '',
                image: data.image || '/img/default-bg.webp',
                stack: data.stack || [],
            };
        })
        .sort((a, b) => (a.date > b.date ? -1 : 1)); // Newest first
}



// export async function getProjectSource(slug: string) {
//     const fullPath = path.join(projectsPath, `${slug}.mdx`);
//     const fileContents = fs.readFileSync(fullPath, 'utf8');

//     const matterResult = matter(fileContents);

//     const processedContent = await remark()
//     .use(html)
//     .process(matterResult.content);

//   const contentHtml = processedContent.toString();


export function getProjectSource(slug: string) {
    const fullPath = path.join(projectsPath, `${slug}.mdx`);
    return fs.readFileSync(fullPath, 'utf8');
}

// return {
//     slug,
//     contentHtml,
//     ...matterResult.data,
//   };
// }


// export async function getPostData(id) {
//   const fullPath = path.join(postsDirectory, `${id}.md`);
//   const fileContents = fs.readFileSync(fullPath, 'utf8');

//   // Use gray-matter to parse the post metadata section
//   const matterResult = matter(fileContents);

//   // Use remark to convert markdown into HTML string
//   const processedContent = await remark()
//     .use(html)
//     .process(matterResult.content);
//   const contentHtml = processedContent.toString();

//   // Combine the data with the id and contentHtml
//   return {
//     id,
//     contentHtml,
//     ...matterResult.data,
//   };
// }

export function getProject(slug: string) {
    return path.join(projectsPath, `${slug}.mdx`)
}