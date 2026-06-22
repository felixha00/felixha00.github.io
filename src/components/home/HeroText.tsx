"use client";

import { motion } from "motion/react";

export default function HeroText() {
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

            <p className="text-xl md:text-2xl max-w-xl leading-snug tracking-tight">
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
                >
                    <span className="inline-flex items-center rounded px-2 py-0.5 bg-role-designer text-role-text font-medium role-keycap-designer">Designer</span>,
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.44, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                    <span className="inline-flex items-center rounded px-2 py-0.5 bg-role-engineer text-role-text font-medium role-keycap-engineer">Engineer</span>
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.51, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                    and <span className="inline-flex items-center rounded px-2 py-0.5 bg-role-maker text-role-text font-medium role-keycap-maker">Maker</span>
                </motion.span>
                {" "}
                <motion.span
                    className="inline-block"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.58, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                    based in <span>🇨🇦 Canada.</span>
                </motion.span>
            </p>
        </div>
    );
}
