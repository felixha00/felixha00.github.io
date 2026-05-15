"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type DeployData = {
  sha: string | null;
  message: string | null;
  branch: string | null;
  state: string;
  createdAt: number | null;
  readyAt: number | null;
  duration: number | null;
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

export function LastDeployCard() {
  const [data, setData] = useState<DeployData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/last-deploy")
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
            Last Deploy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-xs text-muted-foreground">
            FETCH_ERROR — deploy data unavailable
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
            Last Deploy
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-2 rounded-full shrink-0" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
          <div className="flex items-start gap-2">
            <Skeleton className="h-5 w-14 shrink-0" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Separator />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const isReady = data.state === "READY";

  return (
    <Card className="rounded-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Last Deploy
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2 shrink-0">
            {isReady && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-40" />
            )}
            <span
              className={`relative inline-flex rounded-full size-2 ${isReady ? "bg-green-500" : "bg-yellow-500"}`}
            />
          </span>
          <span className="font-mono text-xs">{data.state}</span>
          <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
            {timeAgo(data.readyAt)}
          </span>
        </div>

        {data.sha && (
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="font-mono text-xs shrink-0">
              {data.sha}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground line-clamp-1 leading-relaxed">
              {data.message}
            </span>
          </div>
        )}

        <Separator />

        <dl className="grid grid-cols-1 gap-1.5 font-mono text-xs">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">BRANCH</dt>
            <dd className="truncate text-right">{data.branch ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">DURATION</dt>
            <dd className="tabular-nums">
              {data.duration != null ? `${data.duration}s` : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">DEPLOYED</dt>
            <dd className="tabular-nums">{timeAgo(data.createdAt)}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
