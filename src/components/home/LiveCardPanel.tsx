"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
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

type Tier = { kind: "grid" } | { kind: "carousel" };

// Panel width alone isn't a reliable signal for whether a 2x2 grid fits: this
// panel sits in a column that's roughly half the *viewport* width, so a wide
// but short browser window (common on laptops) can be plenty wide while still
// too short for two rows of card content, forcing internal scrollbars. So the
// tier is driven by the panel's own rendered box (via ResizeObserver on the
// wrapper below) rather than viewport media queries — a container query in
// spirit, just computed in JS since the choice also swaps which component
// tree mounts (grid vs. carousel), which CSS alone can't decide.
//
// Both numbers were picked against the cards' actual rendered content (not
// round breakpoint numbers): below this row height/width the denser cards
// (Local Time, Weather) start needing their internal scroll, so anything
// short of this reads better as a full-size carousel slide than a cramped
// grid cell. Tuned so ordinary maximized-browser desktops land in the grid —
// only genuinely small (tablet-width) or short (unmaximized-window) viewports
// fall back to the carousel.
const GRID_MIN_WIDTH = 600;
const GRID_MIN_HEIGHT = 680;

function computeTier(width: number, height: number): Tier {
    if (width >= GRID_MIN_WIDTH && height >= GRID_MIN_HEIGHT) return { kind: "grid" };
    return { kind: "carousel" };
}

function useContainerTier(ref: React.RefObject<HTMLElement | null>): Tier | null {
    const [tier, setTier] = useState<Tier | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            const { width, height } = entry.contentRect;
            setTier(computeTier(width, height));
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [ref]);

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

// The only carousel tier left scrolls horizontally, but the wrapper still
// stretches to the panel's full height (rather than hugging the card's
// natural height) so a wide-but-short desktop window — which lands here
// because it failed the grid's *height* check, not its width one — doesn't
// leave a blank gap under the card while the hero's left column keeps going
// to the bottom of the row. That stretch is gated to md: (rather than
// unconditional h-full) because below md the panel is genuinely auto-height
// with no definite size anywhere in its ancestor chain, and a percentage
// height resolved against an indefinite ancestor renders as a collapsed,
// content-free slide in Safari instead of falling back to content size.
function CardCarousel() {
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
            className="flex flex-col md:h-full px-4 md:py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
            <Carousel
                orientation="horizontal"
                opts={{ duration: reduceMotion ? 0 : 20 }}
                setApi={setApi}
                aria-label="Live status cards"
                className="min-h-0 flex-1"
            >
                <CarouselContent>
                    {CARDS.map(({ Card, label }) => (
                        <CarouselItem
                            key={label}
                            // Slides are capped in absolute width, not just percentage —
                            // 85% of a wide-but-short panel produced an oversized, sparse
                            // card. Capping keeps the card a sane size and just grows the
                            // peek of the neighboring card on wider panels instead.
                            className="min-h-0 basis-[min(85%,26rem)]"
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
    const panelRef = useRef<HTMLDivElement>(null);
    const tier = useContainerTier(panelRef);

    // HomelabStatusProvider sits above the tier switch so its poll loop and
    // countdown survive the grid/carousel boundary even though those are
    // still two distinct trees (a static grid can't carry carousel ARIA
    // semantics, so they're deliberately not unified into one component).
    // The wrapper fills its grid cell at md: and up so ResizeObserver
    // measures the desktop column's real available space rather than
    // content size. Below md the grid cell has no defined height budget to
    // measure against (single-column, auto-height layout), so the wrapper
    // is left auto-height there too instead of asking for a percentage of
    // an ancestor that has none to give — the source of the Safari bug
    // where CardCarousel's slides rendered with zero height.
    return (
        <HomelabStatusProvider>
            <div ref={panelRef} className="min-h-0 h-auto md:h-full">
                {tier?.kind === "grid" && <DesktopCardGrid />}
                {tier?.kind === "carousel" && <CardCarousel />}
            </div>
        </HomelabStatusProvider>
    );
}
