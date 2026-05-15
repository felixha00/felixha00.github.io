"use client";

import { motion } from "motion/react";
import { TimeCard } from "@/components/cards/TimeCard";
import { LocationCard } from "@/components/cards/LocationCard";
import { WeatherCard } from "@/components/cards/WeatherCard";

const statsItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function StatsGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={statsItemVariants}><TimeCard /></motion.div>
      <motion.div variants={statsItemVariants}><LocationCard /></motion.div>
      <motion.div variants={statsItemVariants}><WeatherCard /></motion.div>
    </motion.div>
  );
}
