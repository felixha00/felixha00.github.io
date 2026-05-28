"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function ScrollToTop() {
    const lenis = useLenis();
    const pathname = usePathname();

    useEffect(() => {
        lenis?.scrollTo(0, { immediate: true });
    }, [pathname, lenis]);

    return null;
}

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis root autoRaf options={{ duration: 1 }}>
            <ScrollToTop />
            {children}
        </ReactLenis>
    );
}
