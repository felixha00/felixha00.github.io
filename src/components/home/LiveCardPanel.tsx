"use client";

import type React from "react";
import { motion } from "motion/react";
import { TimeCard } from "@/components/cards/TimeCard";
import { WeatherCard } from "@/components/cards/WeatherCard";
import { LastDeployCard } from "@/components/cards/LastDeployCard";

export default function LiveCardPanel() {
    return (
        <motion.div
            className="hidden md:grid relative border md:h-full md:overflow-y-auto md:overscroll-contain [scrollbar-gutter:stable] grid-cols-1 lg:grid-cols-2 gap-0 p-0"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
            }}
        >
            {([
                { Card: TimeCard, className: "lg:col-span-2" },
                { Card: WeatherCard },
                { Card: LastDeployCard },
            ] as { Card: React.ComponentType; className?: string }[]).map(({ Card, className }, i) => (
                <motion.div
                    key={i}
                    className={className}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                    }}
                >
                    <Card />
                </motion.div>
            ))}
        </motion.div>
    );
}
