import { NextResponse } from "next/server";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export const revalidate = 300;

export async function GET() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json({ error: "missing config" }, { status: 503 });
  }

  const url = new URL("https://api.vercel.com/v6/deployments");
  url.searchParams.set("projectId", VERCEL_PROJECT_ID);
  url.searchParams.set("limit", "1");
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
  const d = data.deployments?.[0];
  if (!d) return NextResponse.json({ error: "no deployments" }, { status: 404 });

  return NextResponse.json({
    sha: (d.meta?.githubCommitSha as string | undefined)?.slice(0, 7) ?? null,
    message: (d.meta?.githubCommitMessage as string | undefined) ?? null,
    branch: (d.meta?.githubCommitRef as string | undefined) ?? null,
    state: d.state as string,
    createdAt: d.createdAt as number,
    readyAt: d.ready as number | null,
    duration:
      d.ready && d.buildingAt
        ? Math.round(((d.ready as number) - (d.buildingAt as number)) / 1000)
        : null,
  });
}
