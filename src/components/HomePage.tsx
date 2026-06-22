import { Button } from "@/components/ui/button";
import GridBackground from "@/components/fluff/GridBackground";
import Link from "next/link";
import InfoCard from "@/components/InfoCard";
import ProjectCard from "@/components/ProjectCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Project } from "../../sanity.types";
import CategoryShortcuts from "@/components/home/CategoryShortcuts";
import { ArrowRight } from "lucide-react";
import HeroText from "@/components/home/HeroText";
import LiveCardPanel from "@/components/home/LiveCardPanel";

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
                        <HeroText />
                        <div className="flex-1" />
                        <CategoryShortcuts />
                    </div>
                    <LiveCardPanel />
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
                <InfoCard title="Featured Projects" scrollingText="featured projects" className="col-span-1" action={
                    <Button asChild size="lg">
                        <Link href="/projects">View All Projects <ArrowRight data-icon="inline-end" /></Link>
                    </Button>
                }>
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
