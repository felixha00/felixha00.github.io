"use client";
import { motion } from "motion/react";

export const MotionFade = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className={className}
    >
        {children}
    </motion.div>
);