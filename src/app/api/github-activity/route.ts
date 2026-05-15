import { NextResponse } from "next/server";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "felixha00";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

type GitHubEvent = {
  type: string;
  created_at: string;
  payload: { size?: number; commits?: unknown[] };
};

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export const revalidate = 300;

export async function GET() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio/1.0",
  };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
    { headers, next: { revalidate: 300 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: `GitHub API ${res.status}` }, { status: 502 });
  }

  const events: GitHubEvent[] = await res.json();
  const now = new Date();

  const map: Record<string, number> = {};
  for (let i = 0; i < 28; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    map[toDateKey(d)] = 0;
  }

  let lastPushAt: string | null = null;
  for (const ev of events) {
    if (ev.type !== "PushEvent") continue;
    const key = ev.created_at.slice(0, 10);
    if (key in map) map[key] += ev.payload.size ?? ev.payload.commits?.length ?? 1;
    if (!lastPushAt) lastPushAt = ev.created_at;
  }

  // oldest-first, 28 days
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (27 - i));
    const k = toDateKey(d);
    return { date: k, count: map[k] ?? 0 };
  });

  const thisWeek = days.slice(21).reduce((s, d) => s + d.count, 0);

  let streak = 0;
  for (let i = 27; i >= 0; i--) {
    if (days[i].count > 0) streak++;
    else break;
  }

  return NextResponse.json({ days, thisWeek, streak, lastPushAt, username: GITHUB_USERNAME });
}
