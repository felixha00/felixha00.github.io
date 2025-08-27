"use client";

import { motion } from "motion/react";
import Image from "next/image";

export default function BreathingBackground() {
    return (
        <motion.div
            className="absolute inset-0 -z-10 opacity-80"
            animate={{
                filter: ["brightness(100%)", "brightness(120%)", "brightness(100%)"],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
            <Image
                src="/img/edge.webp"
                alt="background"
                fill
                loading="eager"
                className="object-cover object-bottom"
            />
        </motion.div>
    );
}