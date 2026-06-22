"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useRef } from "react";

import { FrameIcon, type FrameIconHandle } from "@/components/common/DesignerIcon";
import { CogIcon, type CogIconHandle } from "@/components/common/EngineerIcon";
import { BoxesIcon, type BoxesIconHandle } from "@/components/common/MakerIcon";

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };
type Role = "designer" | "engineer" | "maker";

const SHADOW_REST = 4;
const SHADOW_PRESS = 1;
const KEY_TRAVEL = SHADOW_REST - SHADOW_PRESS; // 3px

const pressSpring = { type: "spring", stiffness: 400, damping: 17, mass: 0.3 } as const;

// Single progress value drives both y-travel and shadow depth in lockstep
function useKeycapPress(role: Role) {
    const progress = useMotionValue(0);
    const y = useTransform(progress, [0, 1], [0, KEY_TRAVEL]);
    const boxShadow = useTransform(progress, (p) => {
        const depth = SHADOW_REST - p * (SHADOW_REST - SHADOW_PRESS);
        return `inset 0 1px 0 oklch(1 0 0 / 0.22), 0 ${depth.toFixed(2)}px 0 var(--role-${role}-shadow)`;
    });
    return {
        y,
        boxShadow,
        press: () => animate(progress, 1, pressSpring),
        release: () => animate(progress, 0, pressSpring),
    };
}

export default function HeroText() {
    const designerRef = useRef<FrameIconHandle>(null);
    const engineerRef = useRef<CogIconHandle>(null);
    const makerRef = useRef<BoxesIconHandle>(null);
    const mobileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const designer = useKeycapPress("designer");
    const engineer = useKeycapPress("engineer");
    const maker = useKeycapPress("maker");

    const onEnter = (ref: React.RefObject<IconHandle | null>) => ref.current?.startAnimation();

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
                    <motion.span className="relative inline-block" style={{ y: designer.y }}>
                        <motion.span
                            className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-role-designer text-role-text font-medium cursor-default select-none"
                            style={{ boxShadow: designer.boxShadow }}
                            onMouseEnter={() => onEnter(designerRef)}
                            onMouseLeave={() => onLeave(designerRef)}
                            onPointerDown={designer.press}
                            onPointerUp={designer.release}
                            onPointerLeave={designer.release}
                            onPointerCancel={designer.release}
                            onClick={() => onTap(designerRef)}
                        >
                            <FrameIcon ref={designerRef} size={20} className="text-role-designer-icon" />
                            Designer
                        </motion.span>
                    </motion.span>,
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.44, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    onAnimationComplete={() => playOnce(engineerRef)}
                >
                    <motion.span className="relative inline-block" style={{ y: engineer.y }}>
                        <motion.span
                            className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-role-engineer text-role-text font-medium cursor-default select-none"
                            style={{ boxShadow: engineer.boxShadow }}
                            onMouseEnter={() => onEnter(engineerRef)}
                            onMouseLeave={() => onLeave(engineerRef)}
                            onPointerDown={engineer.press}
                            onPointerUp={engineer.release}
                            onPointerLeave={engineer.release}
                            onPointerCancel={engineer.release}
                            onClick={() => onTap(engineerRef)}
                        >
                            <CogIcon ref={engineerRef} size={20} className="text-role-engineer-icon" />
                            Engineer
                        </motion.span>
                    </motion.span>
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.51, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    onAnimationComplete={() => playOnce(makerRef)}
                >
                    and{" "}
                    <motion.span className="relative inline-block" style={{ y: maker.y }}>
                        <motion.span
                            className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-role-maker text-role-text font-medium cursor-default select-none"
                            style={{ boxShadow: maker.boxShadow }}
                            onMouseEnter={() => onEnter(makerRef)}
                            onMouseLeave={() => onLeave(makerRef)}
                            onPointerDown={maker.press}
                            onPointerUp={maker.release}
                            onPointerLeave={maker.release}
                            onPointerCancel={maker.release}
                            onClick={() => onTap(makerRef)}
                        >
                            <BoxesIcon ref={makerRef} size={20} className="text-role-maker-icon" />
                            Maker
                        </motion.span>
                    </motion.span>
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
