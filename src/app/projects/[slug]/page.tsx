import { getAllProjects, getProject, getProjectSource } from '@/lib/projects';
import MDXContent from '@/components/helpers/mdx-content';
import matter from 'gray-matter';
import Image from 'next/image';
import path from 'path';
import fs from 'fs';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';

const contentDir = path.join(process.cwd(), 'content', 'projects');

type Props = { params: { slug: string } };

export async function generateStaticParams() {
    const projects = getAllProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

// export async function generateStaticParams() {
//     return fs.readdirSync(contentDir)
//         .filter((f) => f.endsWith('.mdx'))
//         .map((file) => ({ slug: file.replace(/\.mdx$/, '') }));
// }


export default async function ProjectPage({ params }: Props) {
    const source = getProjectSource(params.slug);
    const { content, data } = matter(source);

    // const source = fs.readFileSync(getProject(params.slug), 'utf8')
    // const { content, frontmatter: data } = await compileMDX({
    //     source,
    //     options: { parseFrontmatter: true },
    // })

    // console.log("contentDir", contentDir)
    // const filePath = path.join(contentDir, `${params.slug}.mdx`);

    // if (!fs.existsSync(filePath)) {
    //     notFound();
    // }

    // const source = fs.readFileSync(filePath, 'utf8');
    // const { data } = matter(source);
    // const MDXContent = (await import(`/content/projects/${params.slug}.mdx`)).default;


    return (
        <article className="grow w-full max-w-6xl border-x mx-auto prose p-4 dark:prose-invert prose-neutral prose-headings:tracking-tight">

            <div className='text-center'>
                <h1 >{data.title}</h1>
                <h2 className='text-xl'>{data.summary}</h2>
            </div>

            <div className='relative aspect-video overflow-hidden'>
                <Image alt={data.title + "Image"} src={data.image} fill className='object-cover object-center'></Image>
            </div>

            <code>
                {JSON.stringify(data)}
            </code>
            <MDXContent source={content} />
            {/* {content} */}
        </article >
    );
}

