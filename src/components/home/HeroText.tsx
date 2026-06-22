"use client";

import { motion } from "motion/react";
import { useRef } from "react";

import { FrameIcon, type FrameIconHandle } from "@/components/common/DesignerIcon";
import { CogIcon, type CogIconHandle } from "@/components/common/EngineerIcon";
import { BoxesIcon, type BoxesIconHandle } from "@/components/common/MakerIcon";

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };

export default function HeroText() {
    const designerRef = useRef<FrameIconHandle>(null);
    const engineerRef = useRef<CogIconHandle>(null);
    const makerRef = useRef<BoxesIconHandle>(null);
    const mobileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onEnter = (ref: React.RefObject<IconHandle | null>) => {
        ref.current?.startAnimation();
    };

    const onLeave = (ref: React.RefObject<IconHandle | null>) => {
        if (mobileTimerRef.current) {
            clearTimeout(mobileTimerRef.current);
            mobileTimerRef.current = null;
        }
        ref.current?.stopAnimation();
    };

    const onTap = (ref: React.RefObject<IconHandle | null>) => {
        if (mobileTimerRef.current) clearTimeout(mobileTimerRef.current);
        ref.current?.startAnimation();
        mobileTimerRef.current = setTimeout(() => {
            ref.current?.stopAnimation();
            mobileTimerRef.current = null;
        }, 2000);
    };

    const playOnce = (ref: React.RefObject<IconHandle | null>) => {
        ref.current?.startAnimation();
        setTimeout(() => ref.current?.stopAnimation(), 800);
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-5xl md:text-6xl font-normal font-display tracking-tight">
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    Hi,
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.14, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                    I&apos;m Felix.
                </motion.span>
            </h1>

            <div className="text-xl md:text-2xl max-w-xl leading-snug tracking-tight">
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.26, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                >
                    I&apos;m a multidisciplinary
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.36, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    onAnimationComplete={() => playOnce(designerRef)}
                >
                    <span
                        className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-role-designer text-role-text font-medium role-keycap-designer cursor-default select-none"
                        onMouseEnter={() => onEnter(designerRef)}
                        onMouseLeave={() => onLeave(designerRef)}
                        onClick={() => onTap(designerRef)}
                    >
                        <FrameIcon ref={designerRef} size={20} className="text-role-designer-icon" />
                        Designer
                    </span>,
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.44, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    onAnimationComplete={() => playOnce(engineerRef)}
                >
                    <span
                        className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-role-engineer text-role-text font-medium role-keycap-engineer cursor-default select-none"
                        onMouseEnter={() => onEnter(engineerRef)}
                        onMouseLeave={() => onLeave(engineerRef)}
                        onClick={() => onTap(engineerRef)}
                    >
                        <CogIcon ref={engineerRef} size={20} className="text-role-engineer-icon" />
                        Engineer
                    </span>
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.51, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    onAnimationComplete={() => playOnce(makerRef)}
                >
                    and <span
                        className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-role-maker text-role-text font-medium role-keycap-maker cursor-default select-none"
                        onMouseEnter={() => onEnter(makerRef)}
                        onMouseLeave={() => onLeave(makerRef)}
                        onClick={() => onTap(makerRef)}
                    >
                        <BoxesIcon ref={makerRef} size={20} className="text-role-maker-icon" />
                        Maker
                    </span>
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.58, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                    based in <span>Toronto, Canada.</span>
                </motion.span>
            </div>
        </div>
    );
}
