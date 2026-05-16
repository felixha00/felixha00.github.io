import { NextResponse } from "next/server";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export const revalidate = 300;

function shape(d: Record<string, unknown>) {
  return {
    sha: (d.meta as Record<string, string> | undefined)?.githubCommitSha?.slice(0, 7) ?? null,
    message: (d.meta as Record<string, string> | undefined)?.githubCommitMessage ?? null,
    branch: (d.meta as Record<string, string> | undefined)?.githubCommitRef ?? null,
    author: (d.meta as Record<string, string> | undefined)?.githubCommitAuthorName ?? null,
    state: d.state as string,
    createdAt: d.createdAt as number,
    readyAt: (d.ready as number | null) ?? null,
    duration:
      d.ready && d.buildingAt
        ? Math.round(((d.ready as number) - (d.buildingAt as number)) / 1000)
        : null,
  };
}

export async function GET() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json({ error: "missing config" }, { status: 503 });
  }

  const url = new URL("https://api.vercel.com/v6/deployments");
  url.searchParams.set("projectId", VERCEL_PROJECT_ID);
  url.searchParams.set("limit", "4");
  url.searchParams.set("state", "READY");
  url.searchParams.set("target", "production");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Vercel API ${res.status}` }, { status: 502 });
  }

  const data = await res.json();
  const deployments: Record<string, unknown>[] = data.deployments ?? [];
  if (!deployments.length) {
    return NextResponse.json({ error: "no deployments" }, { status: 404 });
  }

  const [current, ...rest] = deployments.map(shape);
  return NextResponse.json({ current, recent: rest });
}
