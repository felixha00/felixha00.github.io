"use client"

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import GridBackground from "@/components/fluff/GridBackground";
import Link from "next/link";
import InfoCard from "@/components/InfoCard";
import ProjectCard from "@/components/ProjectCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Project } from "../../sanity.types";
import { TimeCard } from "@/components/cards/TimeCard";
import { WeatherCard } from "@/components/cards/WeatherCard";
import { LastDeployCard } from "@/components/cards/LastDeployCard";
import CategoryShortcuts from "@/components/home/CategoryShortcuts";
import { ArrowRight } from "lucide-react";

type HomeProfile = {
    shortBio?: string;
    achievementsSimple?: string;
    featuredProjects?: Project[];
    links?: string;
};

type HomePageProps = {
    profile: HomeProfile;
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
                    <div className="flex flex-col w-full md:h-full p-4 gap-4">
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

                            <p className="text-3xl max-w-xl leading-snug tracking-tight">
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
                                    <span>🧑‍🎨 Designer</span>,
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.44, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <span>👨‍💻 Engineer</span>
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.51, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    and <span>👨‍💼 Creator</span>
                                </motion.span>
                                {" "}
                                <motion.span
                                    className="inline-block"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.58, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    based in <span>🇨🇦 Canada.</span>
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
                        {[TimeCard, WeatherCard, LastDeployCard].map((Card, i) => (
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
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4">
                <InfoCard title="About" scrollingText="about" className="col-span-1">
                    <div className="p-8 h-full flex flex-col justify-between bg-muted/50 rounded-lg">
                        <article className="prose">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {profile.shortBio ?? ""}
                            </ReactMarkdown>
                        </article>
                    </div>
                </InfoCard>
                <InfoCard title="Achievements" scrollingText="achievements" className="col-span-1">
                    <div className="prose p-8 bg-muted/50 rounded-lg">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {profile.achievementsSimple ?? ""}
                        </ReactMarkdown>
                    </div>
                </InfoCard>
                <InfoCard title="Featured Projects" scrollingText="featured projects" className="col-span-1" action={<Button asChild size="lg" >
                    <Link href="/projects">View All Projects <ArrowRight data-icon="inline-end" /> </Link>
                </Button>}>
                    <div className="p-4 flex-col gap-4 flex bg-muted/50 rounded-lg">
                        {profile.featuredProjects?.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                </InfoCard>
                <InfoCard title="Links" scrollingText="links" className="col-span-1">
                    <div className="prose p-8 bg-muted/50 rounded-lg h-full">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {profile.links ?? ""}
                        </ReactMarkdown>
                    </div>
                </InfoCard>
            </div>
        </main>
    );
}
