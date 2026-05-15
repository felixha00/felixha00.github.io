"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "@/components/Clock";

const TZ = process.env.NEXT_PUBLIC_MY_TIMEZONE || "America/Toronto";

type TimeExtra = {
  dayOfWeek: string;
  dateStr: string;
  epoch: number;
  utcOffset: string;
  tzAbbr: string;
};

function computeUtcOffset(tz: string): string {
  try {
    const now = new Date();
    const utcMs = new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
    const tzMs = new Date(now.toLocaleString("en-US", { timeZone: tz })).getTime();
    const diffH = (tzMs - utcMs) / 3600000;
    const sign = diffH >= 0 ? "+" : "-";
    const abs = Math.abs(diffH);
    const h = String(Math.floor(abs)).padStart(2, "0");
    const m = String(Math.round((abs % 1) * 60)).padStart(2, "0");
    return `UTC${sign}${h}:${m}`;
  } catch {
    return "UTC";
  }
}

function computeTzAbbr(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(new Date());
    return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
  } catch {
    return tz;
  }
}

export function TimeCard() {
  const [extra, setExtra] = useState<TimeExtra | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setExtra({
        dayOfWeek: new Intl.DateTimeFormat("en-US", {
          timeZone: TZ,
          weekday: "short",
        }).format(now).toUpperCase(),
        dateStr: new Intl.DateTimeFormat("en-US", {
          timeZone: TZ,
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(now).toUpperCase(),
        epoch: Math.floor(now.getTime() / 1000),
        utcOffset: computeUtcOffset(TZ),
        tzAbbr: computeTzAbbr(TZ),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="md:col-span-2 rounded-none h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Local Time
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-wrap items-end gap-3">
          <div className="text-5xl">
            <Clock />
          </div>
          {extra ? (
            <div className="flex gap-1.5 pb-1">
              <Badge variant="secondary" className="font-mono text-xs">
                {extra.tzAbbr}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {extra.utcOffset}
              </Badge>
            </div>
          ) : (
            <Skeleton className="h-6 w-28" />
          )}
        </div>

        <Separator />

        {extra ? (
          <dl className="grid grid-cols-2 gap-x-8 gap-y-1.5 font-mono text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">DAY</dt>
              <dd>{extra.dayOfWeek}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">DATE</dt>
              <dd>{extra.dateStr}</dd>
            </div>
            <div className="col-span-2 flex justify-between gap-2">
              <dt className="text-muted-foreground">EPOCH</dt>
              <dd className="tabular-nums">{extra.epoch}</dd>
            </div>
            <div className="col-span-2 flex justify-between gap-2">
              <dt className="shrink-0 text-muted-foreground">TZ</dt>
              <dd className="truncate text-right">{TZ}</dd>
            </div>
          </dl>
        ) : (
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
