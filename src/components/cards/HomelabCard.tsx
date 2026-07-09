"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWatermark } from "@/components/cards/CardWatermark";
import { LiveDot } from "@/components/cards/LiveDot";
import { cn } from "@/lib/utils";
import { ServerCog } from "lucide-react";

const POLL_INTERVAL_MS = 15000;
const HIGH_LOAD_THRESHOLD = 88;

type HomelabStatus = {
  source?: "live" | "placeholder";
  updatedAt: string | null;
  system: {
    name: string;
    status: "online" | "degraded" | "offline" | "pending" | string;
    uptime?: string | null;
    nodes?: number | null;
  };
  endpoint?: {
    mode?: string | null;
    package?: string | null;
  };
  metrics: {
    cpuPct?: number | null;
    memoryPct?: number | null;
    diskPct?: number | null;
    gpuPct?: number | null;
  };
  storagePools: {
    name: string;
    usedPct?: number | null;
    status?: string | null;
    used?: string | null;
    total?: string | null;
  }[];
  vms: {
    running?: number | null;
    stopped?: number | null;
    total?: number | null;
    items?: {
      name: string;
      status: string;
      type?: string | null;
      node?: string | null;
    }[];
  };
};

type MetricKey = keyof HomelabStatus["metrics"];

const metricRows: { key: MetricKey; label: string }[] = [
  { key: "cpuPct", label: "CPU" },
  { key: "memoryPct", label: "RAM" },
  { key: "diskPct", label: "DISK" },
  { key: "gpuPct", label: "GPU" },
];

function pct(value: number | null | undefined): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function timeAgo(iso: string | null): string {
  if (!iso) return "not live";
  const ms = new Date(iso).getTime();
  if (!Number.isFinite(ms)) return "n/a";
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function statusTone(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "online" || normalized === "running" || normalized === "ok") {
    return "bg-[oklch(0.74_0.18_145)]";
  }
  if (normalized === "degraded" || normalized === "pending" || normalized === "sync") {
    return "bg-[oklch(0.78_0.15_80)]";
  }
  return "bg-muted-foreground";
}

function loadTone(value: number | null) {
  if (value == null) return "bg-muted-foreground/35";
  if (value >= HIGH_LOAD_THRESHOLD) return "bg-[oklch(0.62_0.22_27)]";
  if (value >= 68) return "bg-[oklch(0.78_0.15_80)]";
  return "bg-foreground/70";
}

// Load severity is color-coded on the bar, but meaning shouldn't live in color
// alone — this gives screen readers and colorblind users the same signal as text.
function loadSeverityWord(value: number | null): string | null {
  if (value == null) return null;
  if (value >= HIGH_LOAD_THRESHOLD) return "high";
  return null;
}

function StatusDot({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const isOnline = normalized === "online";

  return (
    <span className="relative flex size-2.5 shrink-0">
      {isOnline && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.74_0.18_145)] opacity-35 motion-reduce:hidden" />
      )}
      <span className={cn("relative inline-flex size-2.5 rounded-full", statusTone(status))} />
    </span>
  );
}

function GaugeRow({
  label,
  value,
}: {
  label: string;
  value: number | null | undefined;
}) {
  const normalized = pct(value);
  const severity = loadSeverityWord(normalized);

  return (
    <div className="grid gap-1">
      <div className="flex items-baseline justify-between gap-2 font-mono text-xs">
        <span className="text-muted-foreground uppercase tracking-widest">{label}</span>
        <span className="tabular-nums">
          {normalized == null ? "n/a" : `${normalized}%`}
          {severity ? <span className="text-muted-foreground"> · {severity}</span> : null}
        </span>
      </div>
      <div
        className="h-1 overflow-hidden rounded-[1px] bg-muted"
        role="progressbar"
        aria-label={`${label} utilization`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={normalized ?? undefined}
      >
        <div
          className={cn("h-full rounded-[1px] transition-[width] duration-500 ease-out", loadTone(normalized))}
          style={{ width: `${normalized ?? 0}%` }}
        />
      </div>
    </div>
  );
}

function StoragePoolRow({ pool }: { pool: HomelabStatus["storagePools"][number] }) {
  const used = pct(pool.usedPct);
  const status = pool.status?.toLowerCase();
  const capacity = [pool.used, pool.total].filter(Boolean).join("/");

  return (
    <div className="grid gap-1">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 font-mono text-xs">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className={cn("size-1.5 shrink-0 rounded-full", statusTone(pool.status ?? "unknown"))} />
          <span className="truncate uppercase tracking-wide">{pool.name}</span>
        </div>
        <span className="shrink-0 tabular-nums text-right">
          {used == null ? "n/a" : `${used}%`}
          {capacity ? <span className="text-muted-foreground"> · {capacity}</span> : null}
          {status && status !== "ok" ? <span className="text-muted-foreground"> · {status}</span> : null}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-[1px] bg-muted">
        <div
          className={cn("h-full rounded-[1px]", loadTone(used))}
          style={{ width: `${used ?? 0}%` }}
        />
      </div>
    </div>
  );
}

function VmRail({ running, total }: HomelabStatus["vms"]) {
  const safeTotal = Math.max(0, Math.round(total ?? 0));
  const safeRunning = Math.max(0, Math.min(safeTotal, Math.round(running ?? 0)));
  const visibleTotal = Math.max(1, Math.min(safeTotal || 10, 16));
  const activeVisible = Math.round((safeRunning / Math.max(safeTotal, 1)) * visibleTotal);

  return (
    <div className="flex flex-wrap items-center gap-1" aria-hidden>
      {Array.from({ length: visibleTotal }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-4 w-1.5 rounded-[1px] bg-foreground transition-opacity duration-300",
            i < activeVisible ? "opacity-70" : "opacity-14"
          )}
        />
      ))}
      {safeTotal > visibleTotal && (
        <span className="pl-1 font-mono text-[10px] text-muted-foreground">
          +{safeTotal - visibleTotal}
        </span>
      )}
    </div>
  );
}

function VmStatusList({ items }: { items?: NonNullable<HomelabStatus["vms"]["items"]> }) {
  const visibleItems = items ?? [];
  if (visibleItems.length === 0) return null;

  return (
    <div className="grid auto-rows-min gap-1">
      {visibleItems.map((vm) => (
        <div
          key={`${vm.name}-${vm.node ?? "node"}`}
          className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1.5 font-mono text-xs"
        >
          <span className={cn("size-1.5 rounded-full", statusTone(vm.status))} />
          <span className="truncate">{vm.name}</span>
          <span className="uppercase text-muted-foreground">
            {vm.type ?? vm.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function HomelabSkeleton() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Homelab
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <Skeleton className="size-3 rounded-full" />
            <Skeleton className="h-7 w-28" />
          </div>
          <Skeleton className="h-3 w-3/4" />
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

type HomelabStatusState = {
  data: HomelabStatus | null;
  error: boolean;
  pollFailing: boolean;
  lastSyncedAt: number | null;
  nowMs: number;
};

const HomelabStatusContext = createContext<HomelabStatusState | null>(null);

function usePolledHomelabStatus(): HomelabStatusState {
  const [data, setData] = useState<HomelabStatus | null>(null);
  const [error, setError] = useState(false);
  const [pollFailing, setPollFailing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    function poll() {
      fetch("/api/homelab")
        .then((r) => {
          if (!r.ok) throw new Error("fetch failed");
          return r.json();
        })
        .then((nextData: HomelabStatus) => {
          if (cancelled) return;
          hasLoadedRef.current = true;
          setData(nextData);
          setError(false);
          setPollFailing(false);
          setLastSyncedAt(Date.now());
        })
        .catch(() => {
          if (cancelled) return;
          // A transient poll failure shouldn't nuke telemetry that's already on screen —
          // only the very first load can fall through to the hard error state.
          if (!hasLoadedRef.current) {
            setError(true);
          } else {
            setPollFailing(true);
          }
        });
    }

    poll();
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Drives the "next sync in Ns" countdown independently of the poll itself.
  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return { data, error, pollFailing, lastSyncedAt, nowMs };
}

// Owns the poll loop above LiveCardPanel's layout switch, so the 15s fetch
// cadence and "next sync" countdown survive the card moving between the
// desktop grid and the carousel instead of restarting on every crossing.
export function HomelabStatusProvider({ children }: { children: React.ReactNode }) {
  const status = usePolledHomelabStatus();
  return (
    <HomelabStatusContext.Provider value={status}>
      {children}
    </HomelabStatusContext.Provider>
  );
}

function useHomelabStatus(): HomelabStatusState {
  const ctx = useContext(HomelabStatusContext);
  if (!ctx) throw new Error("HomelabCard must be rendered within HomelabStatusProvider");
  return ctx;
}

export function HomelabCard() {
  const { data, error, pollFailing, lastSyncedAt, nowMs } = useHomelabStatus();
  const pools = data?.storagePools ?? [];

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Homelab
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-xs text-muted-foreground">
            FETCH_ERROR: homelab unavailable
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!data) return <HomelabSkeleton />;

  const status = data.system.status || "unknown";
  const vmTotal = data.vms.total ?? 0;
  const vmRunning = data.vms.running ?? 0;
  const vmStopped = data.vms.stopped ?? Math.max(0, vmTotal - vmRunning);
  const isPlaceholder = data.source === "placeholder";
  const endpointLabel = data.endpoint?.package || data.endpoint?.mode || "read-only json";

  const nextSyncInSec =
    lastSyncedAt != null ? Math.max(0, Math.ceil((lastSyncedAt + POLL_INTERVAL_MS - nowMs) / 1000)) : null;

  const visiblePools = pools.slice(0, 3);
  const poolsMoreCount = Math.max(0, pools.length - visiblePools.length);
  const vmItems = data.vms.items ?? [];
  const visibleVmItems = vmItems.slice(0, 3);
  const vmItemsMoreCount = Math.max(0, vmItems.length - visibleVmItems.length);

  return (
    <Card className="relative h-full flex flex-col">
      <CardWatermark icon={ServerCog} />
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Homelab
        </CardTitle>
        <CardAction>
          {isPlaceholder ? (
            <Badge variant="outline" className="font-mono text-[10px] uppercase">
              schema
            </Badge>
          ) : pollFailing ? (
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
              <span aria-hidden className="size-1.5 rounded-full bg-[oklch(0.78_0.15_80)]" />
              retrying
            </span>
          ) : (
            <LiveDot />
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <StatusDot status={status} />
              <span className="truncate font-display text-3xl leading-none tracking-tight">
                {data.system.name}
              </span>
            </div>
            <div className="flex gap-1.5 pb-1">
              <Badge variant="secondary" className="font-mono text-xs uppercase">
                {status}
              </Badge>
              {data.system.nodes ? (
                <Badge variant="outline" className="font-mono text-xs">
                  {data.system.nodes} node{data.system.nodes === 1 ? "" : "s"}
                </Badge>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
            <span>
              UPTIME <span className="text-foreground/80 tabular-nums">{data.system.uptime ?? "n/a"}</span>
            </span>
            <span aria-hidden>·</span>
            <span>
              SYNCED{" "}
              <span className="text-foreground/80 tabular-nums">
                {isPlaceholder ? "standby" : timeAgo(data.updatedAt)}
              </span>
            </span>
            <span aria-hidden>·</span>
            <span>
              NEXT SYNC{" "}
              <span className="text-foreground/80 tabular-nums">
                {nextSyncInSec == null ? "…" : `${nextSyncInSec}s`}
              </span>
            </span>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {metricRows.map(({ key, label }) => (
            <GaugeRow key={key} label={label} value={data.metrics[key]} />
          ))}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Storage
            </p>
            {visiblePools.length > 0 ? (
              <div className="flex flex-col gap-1.5">
                {visiblePools.map((pool) => (
                  <StoragePoolRow key={pool.name} pool={pool} />
                ))}
                {poolsMoreCount > 0 && (
                  <p className="font-mono text-[10px] text-muted-foreground">+{poolsMoreCount} more</p>
                )}
              </div>
            ) : (
              <p className="font-mono text-xs text-muted-foreground">pool data n/a</p>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2 font-mono text-[11px]">
              <span className="uppercase tracking-widest text-muted-foreground">VMs</span>
              <span className="tabular-nums text-muted-foreground">
                {vmRunning}/{vmTotal} up · {vmStopped} down
              </span>
            </div>
            <VmRail running={vmRunning} total={vmTotal} />
            <VmStatusList items={visibleVmItems} />
            {vmItemsMoreCount > 0 && (
              <p className="font-mono text-[10px] text-muted-foreground">+{vmItemsMoreCount} more</p>
            )}
          </div>
        </div>

        <p className="mt-auto pt-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground/70">
          {endpointLabel}
        </p>
      </CardContent>
    </Card>
  );
}
