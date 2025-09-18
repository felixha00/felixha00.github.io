"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Kbd, KbdKey } from "./ui/shadcn-io/kbd";
import { useNavigator } from "@/providers/client-navigator-context";
import { useCommand } from "@/providers/command-provider";
import { useAppContext } from "@/providers/app-provider";
import Prompt from "@/components/helpers/prompt";
import { usePathname } from "next/navigation";
import { Keyboard, History } from "lucide-react";
import { CommandsHistory } from "@/app/page";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

const ALL_COMMANDS = [
  { cmd: "help", desc: "Show available commands" },
  { cmd: "clear", desc: "Clear the terminal output" },
  // { cmd: "works", desc: "Open the Works page" },
  // { cmd: "works experience", desc: "Go to Experience section" },
  // { cmd: "works software", desc: "Go to Software Projects" },
  // { cmd: "works hardware", desc: "Go to Hardware Projects" },
  // { cmd: "works design", desc: "Go to Graphic Design" },
  // { cmd: "works content", desc: "Go to Content Creation" },

  // { cmd: "theme light", desc: "Switch to light theme" },
  // { cmd: "theme dark", desc: "Switch to dark theme" },
  // { cmd: "theme system", desc: "Switch to dark theme" },

  // { cmd: "cd home", desc: "Go to Home page" },
  // { cmd: "goto cli", desc: "Go to CLI page" },

  // { cmd: "play {url}", desc: "Play a YouTube video by URL" },
];

type Props = {
  onClear?: () => void;
};

const PromptFooter = ({ onClear }: Props) => {
  const [value, setValue] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { commandsHistory, runCommand } = useCommand();

  const { isMobile } = useNavigator();
  const pn = usePathname();
  const { ip } = useAppContext();

  useEffect(() => {
    if (!value) {
      setHint(null);
      return;
    }
    const match = ALL_COMMANDS.find((c) => c.cmd.startsWith(value));
    setHint(match ? match.cmd : null);
  }, [value]);

  function executeCommand(cmd: string) {
    const trimmed = cmd.trim() || "help";

    runCommand(trimmed);
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      executeCommand(value);
      setValue("");
      setHint(null);
    }
    if (e.key === "Tab") {
      if (hint) {
        e.preventDefault();
        setValue(hint);
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setValue(history[newIndex]);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : -1;
      setHistoryIndex(newIndex);
      setValue(newIndex === -1 ? "" : history[newIndex]);
    }
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      onClear?.();
    }
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* <Sheet>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent side="bottom" className="absolute w-full h-64">
                    <SheetHeader className="hidden">
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet> */}

      <div className="bg-background flex-col grow items-center border text-sm gap-2 font-mono">
        {/* {isOpen && <>
                    <ScrollArea className="bg-muted/25 h-32 p-2 grow shrink-0 flex flex-col max-w-full" id="commands-history">
                        <div className="font-mono prose leading-tight prose-neutral dark:prose-invert prose-sm prose-code:font-mono prose-img:rounded">
                            <CommandsHistory commandsHistory={commandsHistory} />
                        </div>
                    </ScrollArea>
                    <Separator />
                </>} */}

        <div className="flex items-center gap-2 p-2 bg-muted/50" style={{ zIndex: 60 }}>
          <Prompt userName={ip} dir={pn} />
          <div className="relative flex-1 transition-all">
            <input
              ref={inputRef}
              value={value}
              onFocus={() => setIsOpen(true)}
              onBlur={() => {
                // Delay to allow clicks on items before closing
                setTimeout(() => setIsOpen(false), 150);
              }}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onKeyDown={onKeyDown}
              placeholder="Type a command… (try: works)"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground/50 text-left"
            />

            {hint && hint !== value && (
              <span className="pointer-events-none absolute left-0 top-0 text-muted-foreground select-none">
                <span className="invisible">{value}</span>
                <span className="opacity-60">{hint.slice(value.length)}</span>
              </span>
            )}
          </div>
          <Button
            variant={"secondary"}
            size="sm"
            className="pr-1 pl-2 gap-2"
            onClick={() => {
              executeCommand(value);
              setValue("");
            }}
          >
            Run
            <Kbd>
              <KbdKey>⤶</KbdKey>
            </Kbd>
          </Button>
        </div>
        {/* {!isMobile && (
                <div className="flex flex-wrap gap-4 text-tiny text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <History size={14} /> <span>Navigate history:</span>
                        <Kbd><KbdKey>↑</KbdKey></Kbd>
                        <Kbd><KbdKey>↓</KbdKey></Kbd>
                    </div>
                    <div className="flex items-center gap-1">
                        <Keyboard size={14} /> <span>Clear terminal:</span>
                        <Kbd><KbdKey>Ctrl</KbdKey>+<KbdKey>L</KbdKey></Kbd>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>Autocomplete:</span>
                        <Kbd><KbdKey>Tab</KbdKey></Kbd>
                    </div>
                </div>
            )} */}
      </div>
    </>
  );
};

export default PromptFooter;
