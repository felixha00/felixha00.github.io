"use client";
import { LenisRef, ReactLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<LenisRef>(null);

    useEffect(() => {
        const lenis = lenisRef.current?.lenis;
        if (!lenis) return;

        lenis.on("scroll", ScrollTrigger.update);

        function update(time: number) {
            lenis?.raf(time * 1000);
        }
        gsap.ticker.add(update);

        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.off("scroll", ScrollTrigger.update);
            gsap.ticker.remove(update);
        };
    })
}