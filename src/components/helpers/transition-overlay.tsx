// components/TransitionOverlay.tsx
'use client';

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

function getLabel(pathname: string) {
    if (pathname.includes('projects')) return 'Projects';
    if (pathname.includes('experience')) return 'Experience';
    if (pathname.includes('bio')) return 'Bio';
    if (pathname.includes('gallery')) return 'Gallery';
    return 'Home';
}

export default function TransitionOverlay({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const prevPathnameRef = useRef<string | null>(null);

    const [message, setMessage] = useState('');
    const [prevMessage, setPrevMessage] = useState('')
    const [showChildren, setShowChildren] = useState(false);
    const [animating, setAnimating] = useState(true);

    useEffect(() => {
        const prevPath = prevPathnameRef.current;
        const prevLabel = prevPath ? getLabel(prevPath) : null;
        const currentLabel = getLabel(pathname);

        if (prevLabel) {
            setPrevMessage(prevLabel)
            setMessage(currentLabel);
        } else {
            // first render
            setMessage(currentLabel);
        }

        prevPathnameRef.current = pathname;

        setAnimating(true);
        setShowChildren(false);
    }, [pathname]);

    return (
        <>
            <AnimatePresence
                onExitComplete={() => setShowChildren(true)}
            >
                {animating && (
                    <>
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            onAnimationComplete={() => setAnimating(false)}
                            className="fixed inset-0 flex items-center justify-center bg-background"
                        >
                            <motion.h1 className="text-foreground text-7xl md:text-9xl lowercase font-bold font-mono text-center px-4"
                            >
                                {prevMessage}
                            </motion.h1>
                            <motion.h1
                                className="text-foreground text-7xl md:text-9xl lowercase font-bold font-mono text-center px-4"
                            >
                                {message}
                            </motion.h1>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {showChildren && children}
        </>
    );
}
