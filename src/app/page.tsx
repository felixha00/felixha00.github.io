"use client"

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flex, Heading, IconButton, Box } from "@radix-ui/themes";
import { MAIN_CATEGORIES } from "@/config/const";
import Image from "next/image";
import GridBackground from "@/components/fluff/GridBackground";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Balancer from 'react-wrap-balancer'
import LogoScene from "@/components/3DLogo";

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(".hero-text", {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        filter: "blur(10px)"
      })
        .from(".hero-icon", {
          x: -100,
          opacity: 0,
          duration: 1,
          // ease: "back.out(1.7)", // Added a slight bounce for the hand
        }, "0.1");
    },
    { scope: heroRef }
  );

  // Animation for the Grid Cards (Existing)
  useGSAP(
    () => {
      gsap.from(".anim-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.5, // Optional: Wait for hero to start before showing cards
      });
    },
    { scope: containerRef }
  );

  return (
    <main className="h-full flex grow flex-col">
      <div
        id="hero-div"
        ref={heroRef}
        className="hero-div flex grow items-center justify-center relative h-screen gap-6 overflow-hidden"
      >
        <GridBackground className="mt-16 border-muted border m-4" />


        <div>
          <LogoScene />
        </div>
        <div className="text-center font-geist-pixel-square">
          <Balancer>
            <h1 className="text-9xl">
              Hi there!
            </h1>
          </Balancer>
        </div>


        {/* <div className="hero-icon size-24 md:size-36 shrink-0 mb-10">
          <AspectRatio ratio={1}>
            <Image
              src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Waving%20Hand.png"
              alt="Waving Hand"
              fill
              unoptimized
              className="object-contain"
            />
          </AspectRatio>
        </div> */}
      </div>



      <div
        ref={containerRef}
        className="grid grid-cols-1 grid-rows-4 md:grid-cols-4 md:grid-rows-1 p-4 flex-1 min-h-screen gap-4 perspective-1000 overflow-hidden"
      >
        {MAIN_CATEGORIES.map((section, i) => (
          <SectionCard key={section.slug} section={section} index={i} />
        ))}
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
            className={cn("bottom-0 md:-bottom-1/12 -left-1/2 md:left-0", "absolute transition-colors right-0 uppercase select-none pointer-events-none whitespace-nowrap tracking-tighter font-saint md:[writing-mode:vertical-rl] text-[100cqh] leading-[0.8em] md:text-[100cqw] md:leading-[1.2em] group-hover:text-muted-foreground text-muted")}
          >
            {section.slug}{section.slug}{section.slug}
          </Heading>

          <div className="self-start flex w-full pointer-events-none select-none p-4 z-1 bg-linear-to-b from-background to-transparent from-25% items-start gap-2 flex-row">
            {/* <Icon className="size-full" /> */}
            <Heading
              className={clsx([
                // index === 1 && "justify-end",,
                "text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-geist-pixel-line group-hover:font-geist-pixel-square"
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