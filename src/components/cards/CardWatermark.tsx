import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function CardWatermark({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Icon
      aria-hidden
      strokeWidth={1}
      className={cn(
        "pointer-events-none absolute -top-10 -right-10 size-64 text-foreground/2",
        className
      )}
    />
  );
}
