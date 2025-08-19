"use client";

// components/Layout.js
import { useEffect, useRef, useState } from "react";

function Layout({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setIsLoaded(true);
  }, []);

  const crtVariants = {
    hidden: { scaleY: 0, opacity: 0, filter: "brightness(0%) contrast(0%)" },
    visible: {
      scaleY: 1,
      opacity: 1,
      filter: "brightness(100%) contrast(100%)",
      transition: {
        duration: 1.2,
        ease: [0.6, 0.05, -0.01, 0.9],
      },
    },
  };

  const flickerVariants = {
    flicker: {
      opacity: [1, 0.6, 1, 0.8, 1],
      transition: {
        duration: 0.4,
        repeat: 2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate={isLoaded ? ["visible", "flicker"] : "hidden"}
      variants={crtVariants}
      style={{
        minHeight: "100vh",
        overflow: "hidden",
        background: "#000",
        color: "#0f0",
        fontFamily: "'Courier New', monospace",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <motion.div variants={flickerVariants}>{children}</motion.div>
    </motion.div>
  );
}

import { AnimatePresence, motion } from 'motion/react';
import HomeContent from "../content/home.mdx";
import { useMDXComponents } from '@/components/mdx-components';
import { useCommand } from '@/providers/command-provider';
import dynamic from 'next/dynamic';
import { useAppContext } from "@/providers/app-provider";
import { cn } from "@/lib/utils";
import Prompt from "@/components/helpers/prompt";
const ThreeLogo = dynamic(() => import("@/components/three-logo"), { ssr: false });

export default function Home() {
  const { commandsHistory } = useCommand();

  return (
    <div className="flex flex-col grow px-2 gap-4">
      {/* hero */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 1 }}
        className={cn("rounded-2xl w-full text-center bg-muted/50 items-center justify-center content-center", false && "bg-linear-to-b from-muted to-transparent")}
      >
        <div className='h-full w-full'>
          <ThreeLogo />

          {/* <h1 className='absolute'>Felix Ha</h1>
          <p className="text-lg text-muted-foreground mt-2">web + gfx + design — 🎓 McMaster University comp eng graduate '23 </p> */}
        </div>

      </motion.div>

      {/* command history */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, delay: 0.5 }}
        className='grow shrink-0 flex flex-col max-w-full font-mono prose leading-tight prose-neutral dark:prose-invert prose-sm prose-code:font-mono prose-img:rounded'
        id="cli-container"
      >
        <div className="grow flex flex-col justify-end overflow-y-auto">
          <HomeContent components={useMDXComponents()} />
          <AnimatePresence>
            {commandsHistory.map((entry, idx) => (
              <motion.div
                key={idx} // better to use a unique id if available
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <div className="flex flex-row gap-2"><Prompt />{`${entry.command}`}</div>
                <div>{entry.output}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div >
  );
}