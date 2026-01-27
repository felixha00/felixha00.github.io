"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Box, Button, Flex, Heading, IconButton, } from "@radix-ui/themes";
import clsx from "clsx";
import Link from "next/link";
import { ArrowRight } from 'lucide-react';
import { MAIN_CATEGORIES } from "@/config/const";
import { cn } from "@/lib/utils";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);

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
      <div className="bg-background border border-border p-4 z-50">
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !spotlightRef.current || !contentRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // spotlight
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

    // reset spotlight
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
          className="h-full w-full flex border border-border bg-background relative overflow-hidden transform-style-3d will-change-transform group-hover:border-muted-foreground transition-colors"
          style={{ containerType: "size" }}
        >
          {/* spotlight gradient */}
          <div
            ref={spotlightRef}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-100 h-100 bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_70%)] opacity-0 pointer-events-none blur-xl"
            style={{ top: 0, left: 0 }}
          />

          <Heading
            className={cn("bottom-0 md:-bottom-1/12 -left-1/2 md:left-0", "absolute transition-colors right-0 uppercase select-none pointer-events-none whitespace-nowrap tracking-tighter font-custom md:[writing-mode:vertical-rl] text-[100cqh] leading-[0.8em] md:text-[100cqw] md:leading-[1.2em] group-hover:text-muted-foreground text-muted")}
          >
            {section.slug}{section.slug}{section.slug}
          </Heading>

          <div className="self-start flex w-full pointer-events-none select-none p-4 z-1 bg-linear-to-b from-background to-transparent from-25% items-start gap-2 flex-row">
            {/* <Icon className="size-full" /> */}
            <Heading
              className={clsx([
                // index === 1 && "justify-end",,
                "text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl"
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
        <Box
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex"
          style={{
            background: `linear-gradient(to top, var(--${section.theme}-a6), transparent)`
          }}
        >
        </Box>
        <Box className="absolute p-4 bottom-0 left-0 right-0">
          <Icon />
        </Box>
      </div>
    </Link>
  );
}