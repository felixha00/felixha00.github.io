"use client"

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import GridBackground from "@/components/fluff/GridBackground";
import Link from "next/link";
import Balancer from 'react-wrap-balancer'
import PageSection from "@/components/PageSection";
import ProjectCard from "@/components/ProjectCard";
import ReactMarkdown from "react-markdown";
import Dither from "./Dither";
import remarkGfm from "remark-gfm";
import { Project } from "../../sanity.types";
import { TimeCard, WeatherCard } from "@/components/home/StatsGrid";
import CategoryShortcuts from "@/components/home/CategoryShortcuts";

{/* <FaultyTerminal
                    className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
                    scale={2}
                    gridMul={[2, 1]}
                    digitSize={1.2}
                    timeScale={0.5}
                    pause={false}
                    scanlineIntensity={0.5}
                    glitchAmount={1}
                    flickerAmount={1}
                    noiseAmp={1}
                    chromaticAberration={0}
                    dither={0}
                    curvature={0.1}
                    tint="#ffffff"
                    mouseReact
                    mouseStrength={0.5}
                    pageLoadAnimation
                // brightness={0.6}
                /> */}

type HomeProfile = {
    shortBio?: string;
    achievementsSimple?: string;
    featuredProjects?: Project[];
    links?: string;
};

type HomePageProps = {
    profile: HomeProfile;
    projectsCarousel: Project[];
};

export default function HomePage({ profile }: HomePageProps) {

    return (
        <main className="h-full flex grow flex-col">
            <div
                id="hero-div"
                className="hero-div flex grow items-start justify-center relative md:h-screen gap-6 overflow-hidden p-4 pt-16"
            >
                <GridBackground className="mt-16 border-muted border m-4 bg-background" />
                <div className="grid md:h-full w-full grid-cols-1 md:grid-cols-2 gap-0">
                    <motion.div
                        className="flex flex-col w-full md:h-full p-8 gap-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: {
                                    staggerChildren: 0.12,
                                },
                            },
                        }}
                    >
                        <motion.h1
                            className="text-7xl font-normal font-display tracking-tight"
                            variants={{
                                hidden: { x: 100, opacity: 0, filter: "blur(10px)" },
                                visible: { x: 0, opacity: 1, filter: "blur(0px)" },
                            }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Balancer>
                                Hi, I&apos;m Felix.
                            </Balancer>
                        </motion.h1>
                        <motion.p
                            className="text-3xl max-w-xl"
                            variants={{
                                hidden: { x: 80, opacity: 0, filter: "blur(10px)" },
                                visible: { x: 0, opacity: 1, filter: "blur(0px)" },
                            }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Balancer>
                                👤 I&apos;m a multidisciplinary <span className="underline">Designer</span>, <span className="underline">Engineer</span> and <span className="underline">Entrepreneur</span> based in <span className="underline">Canada.</span>
                            </Balancer>
                        </motion.p>
                        <div className="flex-1" />
                        <CategoryShortcuts />
                    </motion.div>
                    <motion.div
                        className="relative border md:h-full md:overflow-y-auto flex flex-col gap-0 p-0"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
                        }}
                    >
                        {/* <Dither
                            waveColor={[0.5, 0.5, 0.5]}
                            disableAnimation={false}
                            enableMouseInteraction
                            mouseRadius={0.3}
                            colorNum={4}
                            waveAmplitude={0.3}
                            waveFrequency={3}
                            waveSpeed={0.05}
                        /> */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                            }}
                        >
                            <TimeCard />
                        </motion.div>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                            }}
                        >
                            <WeatherCard />
                        </motion.div>
                    </motion.div>
                </div>



                {/* <div className="hero-icon size-24 md:size-36 shrink-0 mb-10">
          <AspectRatio ratio={1}>
            <Image
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Waving%20Hand.png"
              alt="Waving Hand"
              fill
              unoptimized
              className="object-contain"
            />
          </AspectRatio>
        </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
                <PageSection title="👤 About" scrollingText="about" className="col-span-1">
                    <div className="p-8 h-full flex flex-col justify-between bg-muted/50 rounded-xl">
                        <article className="prose">
                            <ReactMarkdown>
                                {profile.shortBio ?? ""}
                            </ReactMarkdown>
                        </article>
                        <Button size="lg" className="w-fit">
                            View Full Bio
                        </Button>
                    </div>
                </PageSection>
                <PageSection title="🏆 Achievements" scrollingText="achievements" className="col-span-1">
                    <div className="prose p-8 bg-muted/50 rounded-xl">
                        <ReactMarkdown>
                            {profile.achievementsSimple ?? ""}
                        </ReactMarkdown>
                    </div>
                </PageSection>
                <PageSection title="⭐ Featured Projects" scrollingText="featured projects" className="col-span-1">
                    <div className="p-8 flex-col gap-4 flex">
                        {profile.featuredProjects?.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                        <Button asChild size="lg" className="w-full">
                            <Link href="/projects">View All Projects</Link>
                        </Button>
                    </div>
                </PageSection>
                <PageSection title="🌐 Links" scrollingText="links" className="col-span-1">
                    <div className="prose p-8 bg-muted/50 rounded-xl">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {profile.links ?? ""}
                        </ReactMarkdown>
                    </div>
                </PageSection>
            </div>

            {/* <div
                ref={containerRef}
                className="grid grid-cols-1 grid-rows-4 md:grid-cols-4 md:grid-rows-1 p-4 flex-1 min-h-screen gap-4 perspective-1000 overflow-hidden"
            >
                {PROJECT_CATEGORIES.map((section, i) => (
                    <SectionCard key={section.slug} section={section} index={i} />
                ))}
            </div> */}
        </main>
    );
}
