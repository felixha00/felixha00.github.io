"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { InfiniteSlider } from "@/components/motion-primitives/InfiniteSlider";

type Hobby = {
  emoji: string;
  label: string;
  description?: string;
  href?: string;
};

const HOBBIES: Hobby[] = [
  {
    emoji: "🧗",
    label: "Rock Climbing",
    // description: "Indoor and outdoor. Projecting V6 boulders at Basecamp.",
  },
  {
    emoji: "🎛️",
    label: "Raving",
    description: "Drum and bass, bass house",
  },
  {
    emoji: "🎮",
    label: "Gaming",
  },
  {
    emoji: "💻",
    label: "Coding",
    description: "Building tools and experiments outside work. This site is one.",
    href: "/projects",
  },
  {
    emoji: "🖌️",
    label: "Design",
    description: "Type-forward print, logos, brand work. Mostly personal projects.",
    href: "/projects",
  },
  {
    emoji: "🔧",
    label: "Tinkering",
    description: "3D printing, CAD, keyboards and tangibles.",
  },
  {
    emoji: "🏋️",
    label: "Weightlifting",
  },
  {
    emoji: "🤸",
    label: "Calisthenics",
    // description: "Working toward muscle-ups and front lever progressions.",
  },
  {
    emoji: "🖥️",
    label: "Self-Hosting",
    description: "Proxmox: Jellyfin, Nextcloud, OpenMediaVault and more",
  },
];


export function HobbiesCard() {
  const [paused, setPaused] = useState(false);

  return (
    <Card className="rounded-none overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Interests
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-visible">
        <InfiniteSlider speed={40} gap={0} paused={paused} className="overflow-visible">
          {HOBBIES.map((hobby) => (
            <HoverCard key={hobby.label} openDelay={0} closeDelay={80}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  aria-label={hobby.label}
                  className="group relative flex items-center justify-center size-32 shrink-0 select-none bg-transparent border-0 cursor-default focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40 rounded-sm"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                  onFocus={() => setPaused(true)}
                  onBlur={() => setPaused(false)}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-2 rounded-full bg-foreground/[0.06] group-hover:bg-foreground/[0.14] transition-colors duration-300 ease-out"
                  />
                  <span
                    aria-hidden="true"
                    className="relative z-10 text-6xl leading-none transition-transform duration-300 ease-out group-hover:scale-110"
                  >
                    {hobby.emoji}
                  </span>
                </button>
              </HoverCardTrigger>
              <HoverCardContent side="top" align="center" className="w-52 p-3">
                <div className="flex flex-col gap-2">
                  <p className="font-display text-base leading-tight">{hobby.label}</p>
                  {hobby.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {hobby.description}
                    </p>
                  )}
                  {hobby.href && (
                    <Button asChild size="sm" variant="outline" className="mt-1 h-7 text-xs font-mono">
                      <Link href={hobby.href}>
                        View work <ArrowRight className="ml-1 size-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </InfiniteSlider>
      </CardContent>
    </Card>
  );
}
