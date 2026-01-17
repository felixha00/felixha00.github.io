"use client";
import { ReactLenis } from "lenis/react";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<any>(null);

    useEffect(() => {
        function update(time: number) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        // Connect GSAP ticker to Lenis
        gsap.ticker.add(update);

        // Disable lag smoothing in GSAP to prevent jumps during heavy scrolling
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        // autoRaf={false} is critical because we are manually driving the raf loop with GSAP
        <ReactLenis root ref={lenisRef} autoRaf={false}>
            {children}
        </ReactLenis>
    );
}