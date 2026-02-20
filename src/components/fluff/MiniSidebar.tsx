"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef, useMemo } from "react";
import gsap from "gsap";

// Utility for smooth interpolation (Lerp)
const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
};

export default function MiniSidebar() {
    const pathname = usePathname();
    const [docHeight, setDocHeight] = useState(0);

    const sidebarRef = useRef<HTMLElement>(null);
    const rulerRef = useRef<HTMLDivElement>(null);

    // Store the current visual position of the ruler to interpolate from
    const rulerPosRef = useRef(0);

    // Populates the sidebar items based on the current path
    const items = useMemo(() => {
        const segments = pathname.split("/").filter((item) => item !== "");
        const breadcrumbs = segments.map((segment, index) => ({
            name: segment.replace(/-/g, " "),
            href: "/" + segments.slice(0, index + 1).join("/"),
        }));
        return [{ name: "home", href: "/" }, ...breadcrumbs];
    }, [pathname]);

    // 1. Sidebar Entry & Nav Item Changes
    // useEffect(() => {
    //     const ctx = gsap.context(() => {
    //     }, sidebarRef);

    //     return () => ctx.revert();
    // }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Kill any conflicting animations on these elements
            gsap.killTweensOf(".nav-item");

            gsap.fromTo(
                ".nav-item",
                {
                    opacity: 0,
                    x: -15, // Slide from "outside" (left relative to vertical text)
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    stagger: {
                        amount: 0.2,
                    },
                    ease: "power4.out",
                    overwrite: "auto"
                }
            );
        }, sidebarRef);

        return () => ctx.revert();
    }, [pathname]);

    // smooth ruler with lerp
    useEffect(() => {
        if (!rulerRef.current) return;

        const handleResize = () => {
            setDocHeight(document.documentElement.scrollHeight);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const observer = new MutationObserver(handleResize);
        observer.observe(document.body, { childList: true, subtree: true });

        rulerPosRef.current = -window.scrollY;

        const setter = gsap.quickSetter(rulerRef.current, "y", "px");

        const updateRuler = () => {
            const targetY = -window.scrollY;

            const diff = targetY - rulerPosRef.current;

            if (Math.abs(diff) < 0.5) {
                rulerPosRef.current = targetY;
            } else {
                // higher factor = snappier, lower = heavier
                rulerPosRef.current = lerp(rulerPosRef.current, targetY, 0.1);
            }

            setter(rulerPosRef.current);
        };

        gsap.ticker.add(updateRuler);

        return () => {
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
            gsap.ticker.remove(updateRuler);
        };
    }, []);

    const tickInterval = 100;
    const ticksCount = Math.ceil(docHeight / tickInterval) + 1;

    return (
        <aside
            ref={sidebarRef}
            className="fixed left-0 top-0 h-screen z-40 bg-background border-r border-border w-8 min-w-8 flex flex-col items-center select-none overflow-hidden"
        >
            <AnimateOnMount />

            <div
                ref={rulerRef}
                className="absolute top-0 left-0 w-full pointer-events-none will-change-transform"
                style={{ height: docHeight }}
            >
                {/* 10px marks */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                        backgroundSize: `10px 10px`,
                        width: '25%',
                        left: '75%'
                    }}
                />
                {/* 100px big marks */}
                {Array.from({ length: ticksCount }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute left-0 w-full flex flex-col items-start"
                        style={{ top: `${i * tickInterval}px` }}
                    >
                        <div className="w-1/2 h-px bg-foreground/30" />

                        <span className="[writing-mode:vertical-rl] rotate-180 text-[8px] font-mono text-muted-foreground mt-2 ml-2">
                            {i * tickInterval}
                        </span>
                    </div>
                ))}
            </div>

            <nav className="relative flex flex-col-reverse items-center gap-2 pb-4 pt-12 w-full bg-linear-to-t from-background via-background/95 to-transparent mt-auto z-50">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <React.Fragment key={item.href}>
                            <Link
                                href={item.href}
                                className={`
                                    nav-item
                                    [writing-mode:vertical-rl] rotate-180 
                                    text-xs uppercase transition-colors duration-200
                                    whitespace-nowrap font-mono
                                    ${isLast
                                        ? "text-foreground font-semibold cursor-default pointer-events-none"
                                        : "text-muted-foreground hover:text-foreground"}
                                `}
                            >
                                {item.name}
                            </Link>
                            {!isLast && (
                                <span className="nav-item [writing-mode:vertical-rl] rotate-180 text-[10px] text-muted-foreground/30">
                                    /
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </nav>
        </aside>
    );
}

// prevents sidebar from animating on every route change, only on first mount
function AnimateOnMount() {
    useEffect(() => {
        // slide sidebar in from left
        gsap.fromTo(
            "aside",
            { xPercent: -100 },
            {
                xPercent: 0,
                duration: 1,
                ease: "power4.out",
                delay: 0.2
            }
        );
    }, []);
    return null;
}