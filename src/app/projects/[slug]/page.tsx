import { getAllProjects, getProjectSource } from '@/lib/projects'
import CustomMDX from '@/components/helpers/remote-mdx'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Separator } from "@/components/ui/separator"
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
    const projects = getAllProjects()
    return projects.map((p) => ({ slug: p.slug }))
}


export default async function ProjectPage({ params }: Props) {
    const { slug } = await params

    const proj = getAllProjects().find((i) => i.slug === slug)
    if (!proj) {
        notFound()
    }

    const { content, metadata } = proj


    return (
        <div className="relative grow w-full max-w-4xl mx-auto gap-0 flex flex-col">

            {/* page height border styles */}
            <div className='absolute top-0 bottom-0 right-0 left-0 border-x -z-[1]'></div>


            {/* Cover image */}
            <ImageZoom>
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl hover-opacity">

                    <Image
                        alt={metadata.title + " image"}
                        src={metadata.image}
                        fill
                        className="object-cover object-center p-4"
                        priority
                    />

                </div>
            </ImageZoom>

            <Separator />

            <div className="relative text-center p-12">
                {/* <p>{metadata.itemType}</p> */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{metadata.title}</h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-2">{metadata.summary}</p>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {metadata.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>

                {/* Date + Link */}
                <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4 text-sm text-muted-foreground">
                    <span>{metadata.date}</span>
                    {metadata.url && (
                        <Link
                            href={metadata.url}
                            target="_blank"
                            className="underline hover:text-primary"
                        >
                            Visit Project
                        </Link>
                    )}
                </div>

                <div
                    // key={`bg-${item.slug}`}
                    // variants={backgroundVariants}
                    className="absolute inset-0 -z-10 opacity-80"
                >
                    <Image
                        src="/img/edge.webp"
                        alt="background"
                        fill
                        loading="eager"
                        className="object-fill object-bottom"
                    />
                </div>
            </div>


            <Separator className='mb-4' />

            {/* MDX content */}
            <article className="prose dark:prose-invert prose-neutral max-w-none px-4 leading-tight">
                <CustomMDX source={content} />
            </article>
        </div>
    )
}
