"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";

import { FrameIcon, type FrameIconHandle } from "@/components/common/DesignerIcon";
import { CogIcon, type CogIconHandle } from "@/components/common/EngineerIcon";
import { BoxesIcon, type BoxesIconHandle } from "@/components/common/MakerIcon";

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };
type Role = "designer" | "engineer" | "maker";

// Shadow offsets: resting = 4px, pressed = 1px (key moves down 3px to compensate)
const SHADOW_REST = 4;
const SHADOW_PRESS = 1;
const KEY_TRAVEL = SHADOW_REST - SHADOW_PRESS;

function keycapShadow(role: Role, pressed: boolean): React.CSSProperties {
    const depth = pressed ? SHADOW_PRESS : SHADOW_REST;
    const highlight = pressed ? "oklch(1 0 0 / 0.12)" : "oklch(1 0 0 / 0.22)";
    return {
        boxShadow: `inset 0 1px 0 ${highlight}, 0 ${depth}px 0 var(--role-${role}-shadow)`,
    };
}

const pressSpring = { type: "spring", stiffness: 400, damping: 17, mass: 0.3 } as const;

export default function HeroText() {
    const designerRef = useRef<FrameIconHandle>(null);
    const engineerRef = useRef<CogIconHandle>(null);
    const makerRef = useRef<BoxesIconHandle>(null);
    const mobileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [pressedRole, setPressedRole] = useState<Role | null>(null);

    const onEnter = (ref: React.RefObject<IconHandle | null>) => ref.current?.startAnimation();

    const onLeave = (ref: React.RefObject<IconHandle | null>) => {
        if (mobileTimerRef.current) {
            clearTimeout(mobileTimerRef.current);
            mobileTimerRef.current = null;
        }
        ref.current?.stopAnimation();
    };

    const onPress = (role: Role) => setPressedRole(role);
    const onRelease = () => setPressedRole(null);

    const onTap = (role: Role, ref: React.RefObject<IconHandle | null>) => {
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
                    {/* Wrapper handles y-travel; inner span owns the visual + shadow */}
                    <motion.span
                        className="relative inline-block"
                        animate={{ y: pressedRole === "designer" ? KEY_TRAVEL : 0 }}
                        transition={pressSpring}
                    >
                        <span
                            className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-role-designer text-role-text font-medium cursor-default select-none"
                            style={keycapShadow("designer", pressedRole === "designer")}
                            onMouseEnter={() => onEnter(designerRef)}
                            onMouseLeave={() => { onLeave(designerRef); onRelease(); }}
                            onPointerDown={() => onPress("designer")}
                            onPointerUp={onRelease}
                            onPointerLeave={onRelease}
                            onPointerCancel={onRelease}
                            onClick={() => onTap("designer", designerRef)}
                        >
                            <FrameIcon ref={designerRef} size={20} className="text-role-designer-icon" />
                            Designer
                        </span>
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
                    <motion.span
                        className="relative inline-block"
                        animate={{ y: pressedRole === "engineer" ? KEY_TRAVEL : 0 }}
                        transition={pressSpring}
                    >
                        <span
                            className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-role-engineer text-role-text font-medium cursor-default select-none"
                            style={keycapShadow("engineer", pressedRole === "engineer")}
                            onMouseEnter={() => onEnter(engineerRef)}
                            onMouseLeave={() => { onLeave(engineerRef); onRelease(); }}
                            onPointerDown={() => onPress("engineer")}
                            onPointerUp={onRelease}
                            onPointerLeave={onRelease}
                            onPointerCancel={onRelease}
                            onClick={() => onTap("engineer", engineerRef)}
                        >
                            <CogIcon ref={engineerRef} size={20} className="text-role-engineer-icon" />
                            Engineer
                        </span>
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
                    <motion.span
                        className="relative inline-block"
                        animate={{ y: pressedRole === "maker" ? KEY_TRAVEL : 0 }}
                        transition={pressSpring}
                    >
                        <span
                            className="inline-flex items-center gap-1.5 rounded px-2 py-0.5 bg-role-maker text-role-text font-medium cursor-default select-none"
                            style={keycapShadow("maker", pressedRole === "maker")}
                            onMouseEnter={() => onEnter(makerRef)}
                            onMouseLeave={() => { onLeave(makerRef); onRelease(); }}
                            onPointerDown={() => onPress("maker")}
                            onPointerUp={onRelease}
                            onPointerLeave={onRelease}
                            onPointerCancel={onRelease}
                            onClick={() => onTap("maker", makerRef)}
                        >
                            <BoxesIcon ref={makerRef} size={20} className="text-role-maker-icon" />
                            Maker
                        </span>
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
