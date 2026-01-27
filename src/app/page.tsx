"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Button, Flex, Heading, IconButton, } from "@radix-ui/themes";
import clsx from "clsx";
import Link from "next/link";
import { ArrowRight } from 'lucide-react';
import { MAIN_CATEGORIES } from "@/config/const";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parent controls the "Entrance" animation for all children
  // Safe because it runs inside an effect, not during render
  useGSAP(
    () => {
      gsap.from(".anim-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <main className="h-full flex grow flex-col">
      <main
        ref={containerRef}
        className="grid grid-cols-1 grid-rows-4 md:grid-cols-4 md:grid-rows-1 p-4 flex-1 pt-16 h-full gap-4 perspective-1000 overflow-hidden"
      >
        {MAIN_CATEGORIES.map((section, i) => (
          <SectionCard key={section.slug} section={section} index={i} />
        ))}
      </main>
      <div className="bg-background border border-border p-4">
        <Button color="gray" variant="classic" highContrast>All Projects</Button>
      </div>
    </main>


  );
}

function SectionCard({ section, index }: { section: typeof MAIN_CATEGORIES[number]; index: number }) {
  const { icon: Icon } = section
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // 1. Direct Event Handler (No contextSafe needed)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !spotlightRef.current || !contentRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spotlight
    gsap.to(spotlightRef.current, {
      opacity: 1,
      x: x,
      y: y,
      duration: 0.2,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    if (!spotlightRef.current || !contentRef.current) return;

    // Reset Spotlight
    gsap.to(spotlightRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <Link
      href={`/projects?cat=${section.slug}`}
      className="anim-card block h-full w-full relative group perspective-1000"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-full w-full relative"
      >
        <div
          ref={contentRef}
          className="h-full w-full flex border border-border bg-background relative overflow-hidden transform-style-3d will-change-transform"
          style={{ containerType: "size" }}
        >
          {/* Spotlight Gradient */}
          <div
            ref={spotlightRef}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_70%)] opacity-0 pointer-events-none blur-xl"
            style={{ top: 0, left: 0 }}
          />


          <Heading
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase select-none pointer-events-none whitespace-nowrap tracking-tighter opacity-10 md:rotate-90 font-custom"
            style={{
              fontSize: '120cqw',
              lineHeight: 1,
            }}
          >
            {section.slug}
          </Heading>

          <div className="self-end flex w-full pointer-events-none select-none p-4 z-1 bg-linear-to-t from-background to-transparent items-center gap-2 flex-row">
            <Icon className="size-6" />
            <Heading
              className={clsx([
                // index === 1 && "justify-end",,
              ])}
            >

              {section.title}
            </Heading>
            <Flex flexGrow={"1"} />
            <IconButton color={section.theme} variant="classic" radius="full">
              <ArrowRight />
            </IconButton>
          </div>

          <div className="absolute -top-px -left-px border-t border-l border-white/50 size-2 z-20" />
          <div className="absolute -top-px -right-px border-t border-r border-white/50 size-2 z-20" />
          <div className="absolute -bottom-px -left-px border-b border-l border-white/50 size-2 z-20" />
          <div className="absolute -bottom-px -right-px border-b border-r border-white/50 size-2 z-20" />
        </div>
      </div>
    </Link>
  );
}