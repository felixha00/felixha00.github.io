"use client";

import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECT_CATEGORIES } from "@/config/const";
import { ArrowUpRight } from "lucide-react";

const DESCRIPTIONS: Record<string, string> = {
  sfw: "Web apps, digital tools, and interactive experiences",
  hdw: "Physical prototypes, electronics, and tangible interfaces",
  viz: "Logos, identities, motion, and graphic systems",
  biz: "Ventures, products, and entrepreneurial projects",
};

const HOVER_BG: Record<string, string> = {
  blue: "oklch(0.65 0.25 250)",
  red: "oklch(0.65 0.23 22)",
  green: "oklch(0.68 0.22 145)",
  gold: "oklch(0.8 0.18 87)",
};

export default function CategoryShortcuts() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {PROJECT_CATEGORIES.map((category) => {
        const hoverBg = HOVER_BG[category.theme] ?? "oklch(0.65 0.22 250)";
        const Icon = category.icon;

        return (
          <Link
            key={category.slug}
            href={`/projects?cat=${category.slug}`}
            className="group block"
            aria-label={`Browse ${category.title} projects`}
          >
            <Card className="relative h-full cursor-pointer overflow-hidden transition-shadow hover:shadow-md">
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                style={{ backgroundColor: hoverBg }}
                aria-hidden="true"
              />
              <CardHeader className="relative gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-md bg-muted transition-colors duration-200 group-hover:bg-black/10">
                    <Icon className="size-5 transition-colors duration-200 group-hover:text-[oklch(0.12_0_0)]" />
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground transition-colors duration-200 group-hover:text-[oklch(0.18_0_0)]" />
                </div>
                <div>
                  <CardTitle className="font-display text-lg transition-colors duration-200 group-hover:text-[oklch(0.12_0_0)]">
                    {category.title}
                  </CardTitle>
                  <CardDescription className="transition-colors duration-200 group-hover:text-[oklch(0.22_0_0)]">
                    {DESCRIPTIONS[category.slug]}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
