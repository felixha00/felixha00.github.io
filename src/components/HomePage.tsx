"use client"

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import GridBackground from "@/components/fluff/GridBackground";
import Link from "next/link";
import PageSection from "@/components/PageSection";
import ProjectCard from "@/components/ProjectCard";
import ReactMarkdown from "react-markdown";
import Dither from "./Dither";
import remarkGfm from "remark-gfm";
import { Project } from "../../sanity.types";
import { TimeCard } from "@/components/cards/TimeCard";
import { WeatherCard } from "@/components/cards/WeatherCard";
import { LastDeployCard } from "@/components/cards/LastDeployCard";
import { GitHubActivityCard } from "@/components/cards/GitHubActivityCard";
import { HobbiesCard } from "@/components/cards/HobbiesCard";
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
                    <div className="flex flex-col w-full md:h-full p-8 gap-8">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-7xl font-normal font-display tracking-tight">
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    Hi,
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.14, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    I&apos;m Felix.
                                </motion.span>
                            </h1>

                            <p className="text-3xl max-w-xl leading-snug">
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.26, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    I&apos;m a multidisciplinary
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.36, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <span className="underline">Designer</span>,
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.44, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <span className="underline">Engineer</span>
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.51, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    and <span className="underline">Entrepreneur</span>
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.58, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    based in <span className="underline">Canada.</span>
                                </motion.span>
                            </p>
                        </div>

                        <div className="flex-1" />

                        <CategoryShortcuts />
                    </div>
                    <motion.div
                        className="relative border md:h-full md:overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-0 p-0"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
                        }}
                    >
                        {[TimeCard, WeatherCard, LastDeployCard, GitHubActivityCard].map((Card, i) => (
                            <motion.div
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                                }}
                            >
                                <Card />
                            </motion.div>
                        ))}
                        {/* <motion.div
                            className="col-span-full"
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                            }}
                        >
                            <HobbiesCard />
                        </motion.div> */}
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
                <PageSection title="About" scrollingText="about" className="col-span-1">
                    <div className="p-8 h-full flex flex-col justify-between bg-muted/50 rounded-lg">
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
                <PageSection title="Achievements" scrollingText="achievements" className="col-span-1">
                    <div className="prose p-8 bg-muted/50 rounded-lg">
                        <ReactMarkdown>
                            {profile.achievementsSimple ?? ""}
                        </ReactMarkdown>
                    </div>
                </PageSection>
                <PageSection title="Featured Projects" scrollingText="featured projects" className="col-span-1">
                    <div className="p-8 flex-col gap-4 flex bg-muted/50 rounded-lg">
                        {profile.featuredProjects?.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                        <Button asChild size="lg" className="w-full">
                            <Link href="/projects">View All Projects</Link>
                        </Button>
                    </div>
                </PageSection>
                <PageSection title="Links" scrollingText="links" className="col-span-1">
                    <div className="prose p-8 bg-muted/50 rounded-lg">
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
