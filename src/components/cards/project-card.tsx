import { motion, stagger, Variants } from "motion/react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components//ui/card";
import Link from "next/link";
import { Minus, Square, Wrench, X } from "lucide-react";
import TypeLabelBadge from "@/components/helpers/type-label-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import STACK_ICONS from "@/components/helpers/stack-icons";

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

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
        opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeInOut" }
    },
    exit: { opacity: 0, y: -10 },
};

const MotionCard = motion.create(Card);
const MotionCardHeader = motion.create(CardHeader);


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


export default function ProjectCard({ item, onOpen, baseRoute, typeLabels }) {
    return (
        <MotionCard
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="group h-full rounded relative flex flex-col gap-0 p-0 bg-card/50 border shadow-md my-inset-shadow"
        >
            <div className="flex items-center justify-between bg-foreground/10 p-1 border-b select-none">
                <span className="text-xs flex flex-row items-center gap-2 font-mono truncate max-w-[70%] px-1 ">
                    <Wrench size={10} className="shrink-0" />
                    {item.itemType}
                </span>
                <div className="flex gap-1 [&>button]:transition-colors [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:size-5">
                    <button className="hover:bg-foreground/20 rounded-sm">
                        <Minus size={12} />
                    </button>
                    <button className="hover:bg-foreground/20 rounded-sm">
                        <Square size={9} />
                    </button>
                    <button className="hover:bg-foreground/20 rounded-sm">
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

            {/* image container */}
            <Link href={`${baseRoute}/${item.slug}`}>
                <motion.div layoutId={`image-${item.slug}`} className="relative p-6 bg-background bg-cover hover-brightness border ">
                    {/* bg-[url('/img/default-bg.webp')] */}
                    <motion.div variants={itemVariants} className="absolute right-6 bottom-0 z-[1] mb-[-0.5rem]">
                        {item.projectType &&
                            (<span className="cursor-pointer hover-opacity">
                                <TypeLabelBadge type={item.projectType} />
                            </span>)
                        }
                    </motion.div>

                    {/* image */}
                    <div className="aspect-video bg-background relative">
                        <Image src={item.image || "/img/default-bg.webp"} alt={item.title} fill className="object-cover" />
                    </div>
                </motion.div>
            </Link>
            <MotionCardHeader variants={itemVariants} className="p-6 pb-0">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="font-heading text-lg">
                        <Link href={`${baseRoute}/${item.slug}`}>{item.title}</Link>
                    </CardTitle>
                </div>
            </MotionCardHeader>

            <CardContent className="flex flex-col grow gap-2 p-6 pt-2">
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
                        className="flex flex-wrap gap-1"
                    >
                        {item.stack.map((tech: string) => {
                            const stackItem = STACK_ICONS[tech];

                            const iconNode = stackItem?.icon || (
                                <span className="text-xs font-mono">{tech}</span>
                            );
                            const stackName = stackItem.name

                            return (
                                <Tooltip key={tech}>
                                    <TooltipTrigger asChild>
                                        {stackItem?.link ? (
                                            <Link
                                                href={stackItem.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded bg-background/50 hover-brightness 
                                           [&>svg]:!text-foreground [&>svg]:size-3 border 
                                           cursor-pointer inline-flex items-center justify-center"
                                            >
                                                {iconNode}
                                            </Link>
                                        ) : (
                                            <div
                                                className="p-1.5 rounded bg-background/50 [&>svg]:!text-foreground 
                                           [&>svg]:size-3 border inline-flex items-center justify-center"
                                            >
                                                {iconNode}
                                            </div>
                                        )}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {stackName} ↗
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </motion.div>
                )}
            </CardContent>
        </MotionCard>
    );
}