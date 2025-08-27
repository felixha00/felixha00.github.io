import { getAllProjects } from '@/lib/projects'
import CustomMDX from '@/components/helpers/remote-mdx'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Separator } from "@/components/ui/separator"
import { ImageZoom } from '@/components/ui/shadcn-io/image-zoom'
import { Button } from '@/components/ui/button'

import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { useMDXComponents } from '@/components/mdx-components'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import remarkGfm from 'remark-gfm'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
    const projects = getAllProjects()
    return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = params

    const allProjects = getAllProjects()
    const projIndex = allProjects.findIndex((i) => i.slug === slug)

    if (projIndex === -1) notFound()

    const proj = allProjects[projIndex]
    const { content, metadata } = proj

    const { default: MDXContent } = await evaluate(content, {
        remarkPlugins: [remarkGfm],
        ...runtime,
        options: { baseUrl: import.meta.url }
    })

    // Get previous and next projects, loop around
    const prevProject = allProjects[(projIndex - 1 + allProjects.length) % allProjects.length]
    const nextProject = allProjects[(projIndex + 1) % allProjects.length]

    return (
        <>
            <Separator />
            <div className='flex flex-row gap-2 justify-between'>
                <Link href={`/projects/${prevProject.slug}`}>
                    <Button className='rounded-none group' variant={"secondary"}>
                        <ArrowLeft className='size-4 group-hover:-translate-x-0.5 transition-transform' /> Prev <span className='hidden md:block text-muted-foreground'>{prevProject.metadata.title}</span>
                    </Button>
                </Link>

                <Link href={`/projects/${nextProject.slug}`}>
                    <Button className='rounded-none group' variant={"secondary"}>
                        <span className='text-muted-foreground hidden md:block'>{nextProject.metadata.title}</span> Next <ArrowRight className='size-4 group-hover:translate-x-0.5 transition-transform' />
                    </Button>
                </Link>
            </div>
            <Separator />

            <div className='relative'>
                <div className="text-center p-12 relative">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{metadata.title}</h1>

                    <p className="text-lg md:text-xl text-muted-foreground mt-2">{metadata.summary}</p>

                    <div className="flex flex-wrap justify-center gap-2 mt-12">
                        {metadata.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className='!border bg-background/50 backdrop-blur-lg p-2 shadow-xl'>{tag}</Badge>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-col items-center sm:flex-row justify-center gap-4 text-sm text-muted-foreground">
                        <span>{metadata.date}</span>
                        {metadata.url && (
                            <Link href={metadata.url} target="_blank">
                                <Button className='hover:cursor-pointer group gap-1 shadow-xl'>
                                    Visit Project <ArrowUpRight className="transition-transform size-4" />
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="absolute inset-0 -z-10 opacity-80">
                        <Image
                            src="/img/edge.webp"
                            alt="background"
                            fill
                            loading="eager"
                            className="object-cover object-bottom"
                        />
                    </div>

                </div>


                {metadata.links &&
                    <div className="flex w-full flex-wrap gap-0  items-center bg-background/50 backdrop-blur-lg">
                        {/* <Button asChild>
                            <div className="bg-muted/50 border rounded-none">
                                Links
                            </div>
                        </Button> */}

                        {Object.entries(metadata.links).map(([label, url]) =>
                            url ? (
                                <Link
                                    key={label}
                                    href={url}
                                    target="_blank"
                                    className="flex flex-1" // <-- make the link itself grow
                                >
                                    <Button
                                        variant="secondary"
                                        className="hover:cursor-pointer group gap-1 rounded-none border flex-1" // <-- ensure button fills parent
                                    >
                                        {label} <ArrowUpRight className="transition-transform w-4 h-4" />
                                    </Button>
                                </Link>
                            ) : null
                        )}
                    </div>
                }

            </div>

            <Separator />

            <ImageZoom>
                <div className="relative aspect-video w-full overflow-hidden hover-opacity">
                    <Image
                        alt={metadata.title + " image"}
                        src={metadata.image || "/img/default-bg.webp"}
                        fill
                        className="object-cover object-center p-4"
                        priority
                    />
                </div>
            </ImageZoom>

            <Separator />

            <article className="prose relative dark:prose-invert prose-neutral max-w-none p-4 md:p-8 leading-tight prose-hr:my-4 prose-img:rounded">
                <MDXContent components={useMDXComponents()} />
            </article>
        </>
    )
}
