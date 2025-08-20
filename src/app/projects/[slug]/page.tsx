// import { allProjects } from 'contentlayer/generated';
// import { notFound } from 'next/navigation';
// import { useMDXComponent } from 'next-contentlayer/hooks';

// export async function generateStaticParams() {
//     return allProjects.map(p => ({ slug: p.slugAsParams }));
// }

// export async function generateMetadata({ params }) {
//     const project = allProjects.find(p => p.slugAsParams === params.slug);
//     if (!project) return {};
//     return {
//         title: project.title,
//         description: project.summary,
//         openGraph: {
//             images: project.cover ? [project.cover] : [],
//         },
//     };
// }

// export default function Page({ params }) {
//     const project = allProjects.find(p => p.slugAsParams === params.slug);
//     if (!project) notFound();

//     const MDXContent = useMDXComponent(project.body.code);

//     return (
//         <article className="prose max-w-3xl mx-auto py-10">
//             <h1>{project.title}</h1>
//             <MDXContent />
//         </article>
//     );
// }

export default async function Page({
    params
}: {
    params: Promise<{ param: string }>;
}) {
    const { param } = await params;
    return (
        <div></div>
    );
}