import { NextResponse } from "next/server";

const HOMELAB_STATUS_URL = process.env.HOMELAB_STATUS_URL;
const HOMELAB_STATUS_TOKEN = process.env.HOMELAB_STATUS_TOKEN;

export const revalidate = 60;

type RecordLike = Record<string, unknown>;

const placeholderStatus = {
  source: "placeholder",
  updatedAt: null,
  system: {
    name: "pve-01",
    status: "pending",
    uptime: "endpoint pending",
    nodes: 1,
  },
  endpoint: {
    mode: "read-only json",
  },
  metrics: {
    cpuPct: 18,
    memoryPct: 43,
    diskPct: 62,
    gpuPct: 7,
  },
  storagePools: [
    { name: "local-zfs", usedPct: 62, status: "ok", used: "1.9T", total: "3.1T" },
    { name: "nvme", usedPct: 48, status: "ok", used: "880G", total: "1.8T" },
    { name: "backup", usedPct: 71, status: "sync", used: "5.7T", total: "8T" },
  ],
  vms: {
    running: 8,
    stopped: 2,
    total: 10,
    items: [
      { name: "proxy", status: "running", type: "lxc" },
      { name: "media", status: "running", type: "vm" },
      { name: "lab-db", status: "running", type: "vm" },
      { name: "builder", status: "stopped", type: "vm" },
    ],
  },
};

function objectFrom(value: unknown): RecordLike {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RecordLike)
    : {};
}

function arrayFrom(value: unknown): RecordLike[] {
  return Array.isArray(value) ? value.map(objectFrom).filter((entry) => Object.keys(entry).length > 0) : [];
}

function stringFrom(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

function numberFrom(...values: unknown[]): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value.replace("%", ""));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function normalizeStatus(raw: unknown) {
  const root = objectFrom(raw);
  const prometheus = objectFrom(root.prometheus);
  const proxmox = objectFrom(root.proxmox);
  const metrics = objectFrom(root.metrics);
  const system = objectFrom(root.system ?? root.node);
  const endpoint = objectFrom(root.endpoint ?? root.ingress ?? root.funnel);
  const vms = objectFrom(root.vms ?? proxmox.vms ?? proxmox.vmStatus);

  const poolsSource =
    root.storagePools ??
    root.storage ??
    proxmox.storagePools ??
    proxmox.storage ??
    proxmox.pools;

  const vmItemsSource =
    vms.items ??
    vms.instances ??
    vms.list ??
    root.vmItems ??
    proxmox.vmItems;

  const poolEntries = arrayFrom(poolsSource).map((pool) => ({
    name: stringFrom(pool.name, pool.id, pool.storage, pool.pool) ?? "pool",
    usedPct: numberFrom(pool.usedPct, pool.usagePct, pool.percentUsed, pool.usedPercent, pool.used),
    status: stringFrom(pool.status, pool.state, pool.health),
    used: stringFrom(pool.usedText, pool.usedLabel, pool.usedBytesHuman, pool.usedDisplay),
    total: stringFrom(pool.totalText, pool.totalLabel, pool.totalBytesHuman, pool.totalDisplay),
  }));

  const vmItems = arrayFrom(vmItemsSource).map((vm) => ({
    name: stringFrom(vm.name, vm.id, vm.vmid) ?? "vm",
    status: stringFrom(vm.status, vm.state) ?? "unknown",
    type: stringFrom(vm.type, vm.kind),
    node: stringFrom(vm.node, vm.host),
  }));

  const runningFromItems = vmItems.filter((vm) => vm.status.toLowerCase() === "running").length;
  const stoppedFromItems = vmItems.filter((vm) => vm.status.toLowerCase() === "stopped").length;

  return {
    source: "live",
    updatedAt: stringFrom(root.updatedAt, root.timestamp, root.time) ?? new Date().toISOString(),
    system: {
      name: stringFrom(system.name, system.hostname, proxmox.node, root.name) ?? placeholderStatus.system.name,
      status: stringFrom(system.status, root.status, proxmox.status) ?? "online",
      uptime: stringFrom(system.uptime, root.uptime, proxmox.uptime),
      nodes: numberFrom(system.nodes, system.nodeCount, proxmox.nodes, proxmox.nodeCount),
    },
    endpoint: {
      mode: stringFrom(endpoint.mode, root.mode) ?? "read-only json",
      package: stringFrom(endpoint.package, endpoint.npmPackage, root.package),
    },
    metrics: {
      cpuPct: numberFrom(metrics.cpuPct, metrics.cpu, metrics.cpuUtilization, prometheus.cpuPct, prometheus.cpu),
      memoryPct: numberFrom(
        metrics.memoryPct,
        metrics.ramPct,
        metrics.memory,
        metrics.ram,
        prometheus.memoryPct,
        prometheus.ramPct
      ),
      diskPct: numberFrom(metrics.diskPct, metrics.disk, metrics.diskUtilization, prometheus.diskPct, prometheus.disk),
      gpuPct: numberFrom(metrics.gpuPct, metrics.gpu, metrics.gpuUtilization, prometheus.gpuPct, prometheus.gpu),
    },
    storagePools: poolEntries,
    vms: {
      running: numberFrom(vms.running, vms.runningCount) ?? runningFromItems,
      stopped: numberFrom(vms.stopped, vms.stoppedCount) ?? stoppedFromItems,
      total: numberFrom(vms.total, vms.totalCount) ?? vmItems.length,
      items: vmItems,
    },
  };
}

export async function GET() {
  if (!HOMELAB_STATUS_URL) {
    return NextResponse.json(placeholderStatus);
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "portfolio/1.0",
  };

  if (HOMELAB_STATUS_TOKEN) {
    headers.Authorization = `Bearer ${HOMELAB_STATUS_TOKEN}`;
  }

  const res = await fetch(HOMELAB_STATUS_URL, {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `homelab endpoint ${res.status}` },
      { status: 502 }
    );
  }

  const data = await res.json();

  return NextResponse.json(normalizeStatus(data));
}
