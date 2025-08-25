import { motion, stagger, Variants } from "motion/react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components//ui/card";
import Link from "next/link";
import { Minus, Square, Wrench, X } from "lucide-react";
import TypeLabelBadge from "@/components/helpers/type-label-badge";
import {
    SiNextdotjs,
    SiReact,
    SiTailwindcss,
    SiTypescript,
    SiJavascript,
    SiNodedotjs,
    SiElectron,
} from "react-icons/si";
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.2,
            ease: "easeInOut",
            delayChildren: stagger(0.05)
        }
    },
    exit: { opacity: 0, y: -10 },
};

const MotionCard = motion.create(Card);
const MotionCardHeader = motion.create(CardHeader);

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeInOut" }
    },
    exit: { opacity: 0, y: -10 },
};

export type ProjectItem = {
    slug: string;
    title: string;
    description: string;
    summary: string;
    date: string;
    type: string;
    image?: string | null;
    stack?: string[]; // <-- tech stack IDs
};

const formatDate = (iso: string) => {
    // If it's only 4 digits (a year), return it as-is
    if (/^\d{4}$/.test(iso)) {
        return iso;
    }

    const date = new Date(iso);
    if (isNaN(date.getTime())) {
        return iso; // fallback if it's not a valid date
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
};


const backgroundVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 }
    },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

// Map stack IDs to icons + colors
const stackIcons: Record<string, { icon: ReactNode }> = {
    "next-js": { icon: <SiNextdotjs className="dark:text-white text-black" /> },
    "react": { icon: <SiReact color="#61DAFB" /> },
    "tailwind": { icon: <SiTailwindcss color="#06B6D4" /> },
    "typescript": { icon: <SiTypescript className="text-blue-600" /> },
    "javascript": { icon: <SiJavascript className="text-yellow-400" /> },
    "node-js": { icon: <SiNodedotjs className="text-green-600" /> },
    "electron": { icon: <SiElectron color="#47848F" /> }
};


export default function ProjectCard({ item, onOpen, baseRoute, typeLabels }) {
    return (
        <MotionCard
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="group h-full rounded relative flex flex-col gap-0 p-0 bg-card/50 border shadow-md"
        >
            <div className="flex items-center justify-between bg-foreground/10 p-1 border-b select-none">
                <span className="text-xs flex flex-row items-center gap-2 font-mono truncate max-w-[70%] px-1">
                    <Wrench size={10} className="shrink-0" />
                    {item.itemType}
                </span>
                <div className="flex gap-1">
                    <button className="hover:bg-foreground/20 p-1 rounded-sm">
                        <Minus size={12} />
                    </button>
                    <button className="hover:bg-foreground/20 p-1 rounded-sm">
                        <Square size={10} />
                    </button>
                    <button className="hover:bg-red-500 hover:text-white p-1 rounded-sm">
                        <X size={12} />
                    </button>
                </div>
            </div>

            <motion.div
                key={`bg-${item.slug}`}
                variants={backgroundVariants}
                className="absolute inset-0 -z-10 [transition:filter_300ms_ease-in-out] group-hover:brightness-150"
            >
                <Image
                    src="/img/edge.webp"
                    alt="background"
                    fill
                    loading="eager"
                    className="object-contain object-bottom opacity-50"
                />
            </motion.div>

            <motion.div layoutId={`image-${item.slug}`} className="relative p-6 bg-black bg-cover hover-brightness">
                {/* bg-[url('/img/default-bg.webp')] */}
                <motion.div variants={itemVariants} className="absolute right-6 bottom-0 z-[1] mb-[-0.5rem]">
                    {item.projectType &&
                        (<span className="cursor-pointer hover-opacity">
                            <TypeLabelBadge type={item.projectType} />
                        </span>)
                    }
                </motion.div>

                <div className="aspect-video bg-background relative">
                    <Image src={item.image || "/img/default-bg.webp"} alt={item.title} fill className="object-cover" />
                </div>
            </motion.div>

            <MotionCardHeader variants={itemVariants} className="p-6 pb-0">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-foreground font-mono tracking-tight">
                        <Link href={`${baseRoute}/${item.slug}`}>{item.title}</Link>
                    </CardTitle>
                </div>
            </MotionCardHeader>

            <CardContent className="flex flex-col grow gap-2 p-6">
                <motion.p variants={itemVariants} className="text-sm line-clamp-3">
                    {item.summary}
                </motion.p>

                <div className="grow" />

                <motion.time variants={itemVariants} className="text-xs font-mono tracking-tight text-muted-foreground">
                    {formatDate(item.date)}
                </motion.time>

                {/* --- Tech Stack Footer --- */}
                {item.stack && item.stack.length > 0 && (
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-2"
                    >
                        {item.stack.map((tech: string) => (
                            <Tooltip>
                                <TooltipTrigger key={tech} className="p-1 rounded bg-background/50 hover-brightness">
                                    {stackIcons[tech]?.icon || (
                                        <span className="text-xs font-mono">{tech}</span>
                                    )}
                                </TooltipTrigger>
                                <TooltipContent>
                                    {tech}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </motion.div>
                )}
            </CardContent>
        </MotionCard>
    );
}