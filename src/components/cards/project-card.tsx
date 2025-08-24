import { useState, useEffect } from "react";
import { motion, stagger, Variants } from "motion/react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components//ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Minus, Square, Wrench, X } from "lucide-react";
import TypeLabelBadge from "@/components/helpers/type-label-badge";

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
const MotionBadge = motion.create(Badge);

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
    date: string;
    type: string;
    image?: string | null;
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });

const backgroundVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 }
    },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
};

export default function CardComponent({ item, onOpen, baseRoute, typeLabels }) {
    return (
        <MotionCard
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => onOpen(item.slug)}
            className="group h-full rounded relative flex flex-col gap-0 pt-0 bg-card/50 border shadow-md "
        >
            <div className="flex items-center justify-between bg-foreground/10 p-1 border-b select-none">
                <span className="text-xs flex flex-row items-center gap-2 font-mono truncate max-w-[70%] px-1">
                    <Wrench size={10} className="shrink-0" />
                    project
                </span>
                <div>

                </div>
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
                    className="object-contain object-bottom"
                />
            </motion.div>

            {item.image && (
                <motion.div layoutId={`image-${item.slug}`} className="relative aspect-video z-0">
                    <motion.div variants={itemVariants} className="absolute left-4 bottom-0 z-[1] mb-[-0.5rem]">
                        <TypeLabelBadge type={item.type} />
                    </motion.div>
                    <Image src={"/img/default-bg.webp"} alt={item.title} fill className="object-cover border border-dotted" />
                </motion.div>
            )}

            <MotionCardHeader variants={itemVariants} className="pb-2 pt-6">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="font-mono tracking-tight">
                        <Link href={`${baseRoute}/${item.slug}`}>{item.title}</Link>
                    </CardTitle>
                </div>
            </MotionCardHeader>

            <CardContent className="flex flex-col grow">
                <motion.p variants={itemVariants} className="text-sm line-clamp-3">
                    {item.description}
                </motion.p>
                <div className="grow" />
                <motion.time variants={itemVariants} className="mt-3 block text-xs font-mono text-muted-foreground">
                    {formatDate(item.date)}
                </motion.time>
            </CardContent>
        </MotionCard>
    );
}
