"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { animate, motion } from "motion/react";

const MotionLink = motion.create(Link);

export default function MiniSidebar() {
    const pathname = usePathname();
    const [docHeight, setDocHeight] = useState(0);

    const sidebarRef = useRef<HTMLElement>(null);
    const rulerRef = useRef<HTMLDivElement>(null);
    // Tracks scroll position so we can animate the ruler back on route change
    const lastScrollRef = useRef(0);
    const isAnimatingRef = useRef(false);
    const setRulerYRef = useRef<((value: number) => void) | null>(null);

    const items = useMemo(() => {
        const segments = pathname.split("/").filter((item) => item !== "");
        const breadcrumbs = segments.map((segment, index) => ({
            name: segment.replace(/-/g, " "),
            href: "/" + segments.slice(0, index + 1).join("/"),
        }));
        return [{ name: "home", href: "/" }, ...breadcrumbs];
    }, [pathname]);

    // Nav item animation + ruler slide-back on route change
    useEffect(() => {
        if (rulerRef.current && lastScrollRef.current > 0) {
            isAnimatingRef.current = true;
            const controls = animate(-lastScrollRef.current, 0, {
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                onUpdate: (latest) => setRulerYRef.current?.(latest),
                onComplete: () => {
                    isAnimatingRef.current = false;
                    setRulerYRef.current?.(-window.scrollY);
                }
            });

            return () => controls.stop();
        }
    }, [pathname]);

    // Direct scroll sync — no lerp, ruler matches scroll position exactly
    useEffect(() => {
        if (!rulerRef.current) return;

        const handleResize = () => {
            setDocHeight(document.documentElement.scrollHeight);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        const observer = new MutationObserver(handleResize);
        observer.observe(document.body, { childList: true, subtree: true });

        const setRulerY = (value: number) => {
            if (!rulerRef.current) return;
            rulerRef.current.style.transform = `translate3d(0, ${value}px, 0)`;
        };
        setRulerYRef.current = setRulerY;

        setRulerY(-window.scrollY);
        lastScrollRef.current = window.scrollY;

        const handleScroll = () => {
            lastScrollRef.current = window.scrollY;
            if (!isAnimatingRef.current) {
                setRulerY(-window.scrollY);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
            setRulerYRef.current = null;
        };
    }, []);

    const tickInterval = 100;
    const ticksCount = Math.ceil(docHeight / tickInterval) + 1;

    return (
        <motion.aside
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="fixed left-0 top-0 h-screen z-40 bg-background border-r border-border w-8 min-w-8 flex flex-col items-center select-none overflow-hidden"
        >
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
                        width: "25%",
                        left: "75%",
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
                            <MotionLink
                                href={item.href}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05,
                                    ease: [0.16, 1, 0.3, 1],
                                }}
                                className={`
                                    nav-item
                                    [writing-mode:vertical-rl] rotate-180
                                    text-xs uppercase transition-colors duration-200
                                    whitespace-nowrap font-mono
                                    ${
                                        isLast
                                            ? "text-foreground font-semibold cursor-default pointer-events-none"
                                            : "text-muted-foreground hover:text-foreground"
                                    }
                                `}
                            >
                                {item.name}
                            </MotionLink>
                            {!isLast && (
                                <motion.span
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        delay: index * 0.05,
                                        ease: [0.16, 1, 0.3, 1],
                                    }}
                                    className="nav-item [writing-mode:vertical-rl] rotate-180 text-[10px] text-muted-foreground/30"
                                >
                                    /
                                </motion.span>
                            )}
                        </React.Fragment>
                    );
                })}
            </nav>
        </motion.aside>
    );
}
