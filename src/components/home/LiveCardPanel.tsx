"use client";

import type React from "react";
import { motion } from "motion/react";
import { TimeCard } from "@/components/cards/TimeCard";
import { WeatherCard } from "@/components/cards/WeatherCard";
import { LastDeployCard } from "@/components/cards/LastDeployCard";

export default function LiveCardPanel() {
    return (
        <motion.div
            className="relative border md:h-full md:overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-0 p-0"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.35 } },
            }}
        >
            {([TimeCard, WeatherCard, LastDeployCard] as React.ComponentType[]).map((Card, i) => (
                <motion.div
                    key={i}
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
                    }}
                >
                    <Card />
                </motion.div>
            ))}
        </motion.div>
    );
}
