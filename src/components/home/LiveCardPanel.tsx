"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { TimeCard } from "@/components/cards/TimeCard";
import { WeatherCard } from "@/components/cards/WeatherCard";
import { LastDeployCard } from "@/components/cards/LastDeployCard";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const CARDS: { Card: React.ComponentType; label: string; className?: string }[] = [
    { Card: TimeCard, label: "Local Time", className: "lg:col-span-2" },
    { Card: WeatherCard, label: "Weather" },
    { Card: LastDeployCard, label: "Last Deploy" },
];

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

    useEffect(() => {
        const query = window.matchMedia("(min-width: 768px)");
        const update = () => setIsDesktop(query.matches);

        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    return isDesktop;
}

// Below md there's no room for three stacked panels, so the same cards
// become a swipeable strip instead, one full card in view at a time.
function MobileCardCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const root = scrollRef.current;
        if (!root) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const mostVisible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (!mostVisible) return;
                const index = slideRefs.current.findIndex((el) => el === mostVisible.target);
                if (index !== -1) setActiveIndex(index);
            },
            { root, threshold: [0.6] }
        );

        slideRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, []);

    function goTo(index: number) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        slideRefs.current[index]?.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
            inline: "center",
            block: "nearest",
        });
    }

    return (
        <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
            <div
                ref={scrollRef}
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Live status cards"
                className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto motion-safe:scroll-smooth px-4 focus-visible:outline-none"
            >
                {CARDS.map(({ Card, label }, i) => (
                    <div
                        key={label}
                        ref={(el) => {
                            slideRefs.current[i] = el;
                        }}
                        className="w-[85%] shrink-0 snap-center"
                    >
                        <Card />
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-center h-12">
                {CARDS.map(({ label }, i) => (
                    <Button
                        key={label}
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => goTo(i)}
                        aria-label={`Show ${label} card`}
                        aria-current={i === activeIndex ? "true" : undefined}
                        className="flex items-center justify-center p-2"
                    >
                        <span
                            aria-hidden
                            className={cn(
                                "block size-1.5 rounded-full bg-foreground/70 transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none",
                                i === activeIndex ? "scale-125 opacity-100" : "opacity-30"
                            )}
                        />
                    </Button>
                ))}
            </div>
        </motion.div>
    );
}

function DesktopCardGrid() {
    return (
        <motion.div
            role="region"
            aria-label="Live status cards"
            className="hidden md:grid relative min-h-0 border bg-background/80 md:h-full md:overflow-hidden grid-cols-1 lg:grid-cols-2 md:grid-rows-[minmax(0,1fr)_minmax(0,0.82fr)] gap-4 p-4 **:data-[slot=card]:min-h-0 **:data-[slot=card]:rounded-lg **:data-[slot=card]:py-4 **:data-[slot=card]:gap-4 **:data-[slot=card-header]:px-4 **:data-[slot=card-content]:px-4"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
            }}
        >
            {CARDS.map(({ Card, className }, i) => (
                <motion.div
                    key={i}
                    className={cn("min-h-0", className)}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                    }}
                >
                    <Card />
                </motion.div>
            ))}
        </motion.div>
    );
}

export default function LiveCardPanel() {
    const isDesktop = useIsDesktop();

    if (isDesktop === null) return null;
    return isDesktop ? <DesktopCardGrid /> : <MobileCardCarousel />;
}
