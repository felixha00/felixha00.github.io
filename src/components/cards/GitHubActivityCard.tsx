"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type ActivityData = {
  days: { date: string; count: number }[];
  thisWeek: number;
  streak: number;
  lastPushAt: string | null;
  username: string;
};

function timeAgo(isoOrMs: string | number | null): string {
  if (isoOrMs == null) return "—";
  const diff =
    Date.now() -
    (typeof isoOrMs === "string" ? new Date(isoOrMs).getTime() : isoOrMs);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function cellOpacity(count: number, max: number): number {
  if (count === 0) return 0.07;
  return 0.18 + (count / max) * 0.82;
}

export function GitHubActivityCard() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/github-activity")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <Card className="rounded-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Commit Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-xs text-muted-foreground">
            FETCH_ERROR — activity unavailable
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="rounded-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Commit Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            {[0, 1, 2, 3].map((w) => (
              <div key={w} className="flex gap-1">
                {[...Array(7)].map((_, d) => (
                  <Skeleton key={d} className="size-3 rounded-sm shrink-0" />
                ))}
              </div>
            ))}
          </div>
          <Separator />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.days.map((d) => d.count), 1);

  return (
    <Card className="rounded-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Commit Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          {[0, 1, 2, 3].map((week) => (
            <div key={week} className="flex gap-1">
              {data.days.slice(week * 7, week * 7 + 7).map((day) => (
                <div
                  key={day.date}
                  className="size-3 rounded-sm bg-foreground shrink-0"
                  style={{ opacity: cellOpacity(day.count, maxCount) }}
                  title={`${day.date}: ${day.count} commit${day.count !== 1 ? "s" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>

        <Separator />

        <dl className="grid grid-cols-1 gap-1.5 font-mono text-xs">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">THIS WEEK</dt>
            <dd className="tabular-nums">{data.thisWeek}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">STREAK</dt>
            <dd className="tabular-nums">
              {data.streak > 0 ? `${data.streak}d` : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">LAST PUSH</dt>
            <dd className="tabular-nums">{timeAgo(data.lastPushAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
