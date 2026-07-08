import { cn } from "@/lib/utils";

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex size-1.5", className)} title="Live">
      <span
        aria-hidden
        className="motion-reduce:hidden absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/35"
      />
      <span
        aria-hidden
        className="relative inline-flex size-1.5 rounded-full bg-foreground/55"
      />
      <span className="sr-only">Live, updating in real time</span>
    </span>
  );
}
