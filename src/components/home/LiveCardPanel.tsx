"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { TimeCard } from "@/components/cards/TimeCard";
import { WeatherCard } from "@/components/cards/WeatherCard";
import { LastDeployCard } from "@/components/cards/LastDeployCard";
import { HomelabCard, HomelabStatusProvider } from "@/components/cards/HomelabCard";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

const CARDS: { Card: React.ComponentType; label: string }[] = [
    { Card: TimeCard, label: "Local Time" },
    { Card: WeatherCard, label: "Weather" },
    { Card: HomelabCard, label: "Homelab" },
    { Card: LastDeployCard, label: "Last Deploy" },
];

type Tier = "horizontal" | "vertical" | "grid";

// Content-driven, not device-driven: below sm there's only room for one
// narrow card at a time; sm-md has height to spare so cards stack instead;
// md+ has width for all four to sit in a static grid at once.
function useTier(): Tier | null {
    const [tier, setTier] = useState<Tier | null>(null);

    useEffect(() => {
        const mdQuery = window.matchMedia("(min-width: 768px)");
        const smQuery = window.matchMedia("(min-width: 640px)");

        const update = () => {
            if (mdQuery.matches) setTier("grid");
            else if (smQuery.matches) setTier("vertical");
            else setTier("horizontal");
        };

        update();
        mdQuery.addEventListener("change", update);
        smQuery.addEventListener("change", update);
        return () => {
            mdQuery.removeEventListener("change", update);
            smQuery.removeEventListener("change", update);
        };
    }, []);

    return tier;
}

function usePrefersReducedMotion() {
    const [reduced, setReduced] = useState(false);

    useEffect(() => {
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setReduced(query.matches);
        update();
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    return reduced;
}

// One carousel instance covers both sub-md tiers. Swapping `orientation`
// changes embla's axis under the hood (reInit, not a remount) so the four
// cards stay mounted — no lost polling, no replayed skeletons — while
// swiping horizontally on narrow phones or vertically once there's height
// to spare.
function CardCarousel({ tier }: { tier: "horizontal" | "vertical" }) {
    const [api, setApi] = useState<CarouselApi>();
    const [activeIndex, setActiveIndex] = useState(0);
    const reduceMotion = usePrefersReducedMotion();

    useEffect(() => {
        if (!api) return;
        const onSelect = () => setActiveIndex(api.selectedScrollSnap());
        onSelect();
        api.on("select", onSelect);
        api.on("reInit", onSelect);
        return () => {
            api.off("select", onSelect);
            api.off("reInit", onSelect);
        };
    }, [api]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
            <Carousel
                orientation={tier}
                opts={{ duration: reduceMotion ? 0 : 20 }}
                setApi={setApi}
                aria-label="Live status cards"
                className="px-4"
            >
                <CarouselContent className={cn(tier === "vertical" && "h-[min(70vh,600px)]")}>
                    {CARDS.map(({ Card, label }) => (
                        <CarouselItem
                            key={label}
                            className={cn("min-h-0", tier === "horizontal" ? "basis-[85%]" : "basis-1/2")}
                        >
                            <Card />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <div className="flex items-center justify-center h-12">
                {CARDS.map(({ label }, i) => (
                    <Button
                        key={label}
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => api?.scrollTo(i)}
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
            className="grid relative min-h-0 border bg-background/80 h-full overflow-hidden grid-cols-2 grid-rows-2 gap-4 p-4 **:data-[slot=card]:min-h-0 **:data-[slot=card]:rounded-lg **:data-[slot=card]:py-3 **:data-[slot=card]:gap-3 **:data-[slot=card-header]:px-4 **:data-[slot=card-content]:px-4"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
            }}
        >
            {CARDS.map(({ Card, label }) => (
                <motion.div
                    key={label}
                    className="min-h-0"
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
    const tier = useTier();

    // HomelabStatusProvider sits above the tier switch so its poll loop and
    // countdown never restart when tier changes, even though the grid and
    // carousel below it are still two distinct trees.
    return (
        <HomelabStatusProvider>
            {tier === "grid" && <DesktopCardGrid />}
            {(tier === "horizontal" || tier === "vertical") && <CardCarousel tier={tier} />}
        </HomelabStatusProvider>
    );
}
