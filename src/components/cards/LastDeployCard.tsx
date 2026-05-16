"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type DeployEntry = {
  sha: string | null;
  message: string | null;
  branch: string | null;
  author: string | null;
  state: string;
  createdAt: number | null;
  readyAt: number | null;
  duration: number | null;
};

type DeployData = {
  current: DeployEntry;
  recent: DeployEntry[];
};

function timeAgo(ms: number | null): string {
  if (ms == null) return "—";
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtDate(ms: number | null): string {
  if (ms == null) return "—";
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const opacities = [0.55, 0.35, 0.2];

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
          <Separator />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const { current, recent } = data;
  const isReady = current.state === "SUCCESS";

  return (
    <Card className="rounded-none h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Last Deploy
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full gap-3">

        {/* Status row */}
        <div className="flex items-center gap-2">
          <span className="relative flex size-2 shrink-0">
            {isReady && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-40" />
            )}
            <span
              className={`relative inline-flex rounded-full size-2 ${isReady ? "bg-green-500" : "bg-yellow-500"}`}
            />
          </span>
          <span className="font-mono text-xs">{current.state}</span>
          <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">
            {timeAgo(current.readyAt)}
          </span>
        </div>

        {/* Current commit */}
        {current.sha && (
          <div className="flex items-start gap-2">
            <Badge variant="secondary" className="font-mono text-xs shrink-0">
              {current.sha}
            </Badge>
            <span className="font-mono text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {current.message}
            </span>
          </div>
        )}

        <div className="grow" />

        <Separator />

        {/* Deploy metadata */}
        <dl className="grid grid-cols-1 gap-1.5 font-mono text-xs">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">BRANCH</dt>
            <dd className="truncate text-right">{current.branch ?? "—"}</dd>
          </div>
          {current.author && (
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">AUTHOR</dt>
              <dd className="truncate text-right">{current.author}</dd>
            </div>
          )}
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">DURATION</dt>
            <dd className="tabular-nums">
              {current.duration != null ? `${current.duration}s` : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">DEPLOYED</dt>
            <dd className="tabular-nums">{fmtDate(current.createdAt)}</dd>
          </div>
        </dl>


        {/* Recent commits */}
        {recent.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-col gap-2">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                Recent
              </p>
              {recent.map((entry, i) => (
                <div
                  key={entry.sha ?? i}
                  className="flex flex-col gap-0.5"
                  style={{ opacity: opacities[i] ?? 0.15 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground bg-muted px-1 shrink-0 leading-5">
                      {entry.sha ?? "???????"}
                    </span>
                    <span className="font-mono text-xs line-clamp-1 flex-1 min-w-0">
                      {entry.message ?? "—"}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground tabular-nums shrink-0 ml-auto">
                      {timeAgo(entry.readyAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-0">
                    <span className="font-mono text-xs text-muted-foreground">
                      {fmtDate(entry.createdAt)}
                      {entry.duration != null ? ` · ${entry.duration}s` : ""}
                      {entry.branch ? ` · ${entry.branch}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
