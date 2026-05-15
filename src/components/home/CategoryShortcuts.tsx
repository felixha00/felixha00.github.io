"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECT_CATEGORIES } from "@/config/const";
import { ArrowUpRight } from "lucide-react";

const DESCRIPTIONS: Record<string, string> = {
  sfw: "Web apps, digital tools, and interactive experiences",
  hdw: "Physical prototypes, electronics, and tangible interfaces",
  viz: "Logos, identities, motion, and graphic systems",
  biz: "Ventures, products, and entrepreneurial projects",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function CategoryShortcuts() {
  return (
    <motion.div
      className="grid grid-cols-2 gap-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {PROJECT_CATEGORIES.map((category) => {
        const Icon = category.icon;

        return (
          <motion.div key={category.slug} variants={itemVariants}>
            <Link
              href={`/projects?cat=${category.slug}`}
              className="group block h-full"
              aria-label={`Browse ${category.title} projects`}
            >
              <Card className="relative h-full cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
                <div
                  className="absolute inset-0 bg-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <CardHeader className="relative gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex size-10 items-center justify-center rounded-md bg-muted transition-colors duration-200 group-hover:bg-background/10">
                      <Icon className="size-5 transition-colors duration-200 group-hover:text-background" />
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground transition-colors duration-200 group-hover:text-background/70" />
                  </div>
                  <div>
                    <CardTitle className="font-display text-lg transition-colors duration-200 group-hover:text-background">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="transition-colors duration-200 group-hover:text-background/60">
                      {DESCRIPTIONS[category.slug]}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
