"use client";

// TODO: Migrate to either motion/react or gsap for performance reasons

import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Register GSAP plugins immediately
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<any>(null);

    useEffect(() => {
        const update = (time: number) => {
            // time * 1000 converts seconds to milliseconds
            lenisRef.current?.lenis?.raf(time * 1000);
        };

        // Attach GSAP's ticker to Lenis
        gsap.ticker.add(update);

        // Disable GSAP's internal lag smoothing to prevent stuttering when using a smooth scroll library
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    return (
        <ReactLenis
            root
            ref={lenisRef}
            autoRaf={false} // Important: Let GSAP handle the loop!
            options={{
                duration: 1,
                // other lenis options...
            }}
        >
            {children}
        </ReactLenis>
    );
}