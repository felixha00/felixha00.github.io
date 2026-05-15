"use client";

import { ReactLenis } from "lenis/react";

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
    return (
        <ReactLenis
            root
            autoRaf
            options={{
                duration: 1,
            }}
        >
            {children}
        </ReactLenis>
    );
}
