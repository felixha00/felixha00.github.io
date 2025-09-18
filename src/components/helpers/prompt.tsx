"use client";

import { useAppContext } from "@/providers/app-provider";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function Prompt({ userName = "guest", dir = "" }: { userName?: string; dir?: string }) {
  const { ip } = useAppContext();

  return (
    <div className="flex flex-col gap-2 bg-foreground/5 hover:bg-foreground/10 transition-colors px-1 p-0.5 rounded">
      <div className="select-none font-mono text-xs md:text-sm flex items-center">
        <div className="hidden md:block">
          <span className="text-ansi-green">{ip}</span>
          <span className="text-muted-foreground">@</span>
          <span className="text-ansi-cyan">portfolio</span>
          <span className="text-muted-foreground">:</span>
        </div>
        <span className="text-ansi-magenta">
          {dir}
          <span className="text-muted-foreground">$</span>
        </span>
      </div>
    </div>
  );
}

export default Prompt;
