import { NextResponse } from "next/server";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const VERCEL_TEAM_SLUG = process.env.VERCEL_TEAM_SLUG;

export const revalidate = 300;

type VercelDeployment = {
  uid?: string;
  state?: string;
  readyState?: string;
  createdAt?: number;
  created?: number;
  buildingAt?: number;
  ready?: number;
  meta?: Record<string, string | undefined>;
  creator?: {
    username?: string;
    githubLogin?: string;
    email?: string;
  };
};

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

function valueOrNull(value: number | undefined): number | null {
  return typeof value === "number" ? value : null;
}

function shape(deployment: VercelDeployment): DeployEntry {
  const meta = deployment.meta ?? {};
  const createdAt = valueOrNull(deployment.createdAt ?? deployment.created);
  const readyAt = valueOrNull(deployment.ready);
  const buildingAt = valueOrNull(deployment.buildingAt);

  return {
    sha: meta.githubCommitSha?.slice(0, 7) ?? null,
    message: meta.githubCommitMessage ?? null,
    branch: meta.githubCommitRef ?? meta.gitBranch ?? null,
    author:
      meta.githubCommitAuthorName ??
      deployment.creator?.githubLogin ??
      deployment.creator?.username ??
      deployment.creator?.email ??
      null,
    state: deployment.readyState ?? deployment.state ?? "UNKNOWN",
    createdAt,
    readyAt,
    duration:
      readyAt != null && buildingAt != null
        ? Math.round((readyAt - buildingAt) / 1000)
        : null,
  };
}

export async function GET() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json({ error: "missing Vercel config" }, { status: 503 });
  }

  const url = new URL("https://api.vercel.com/v6/deployments");
  url.searchParams.set("projectId", VERCEL_PROJECT_ID);
  url.searchParams.set("limit", "4");
  url.searchParams.set("state", "READY");
  url.searchParams.set("target", "production");
  if (VERCEL_TEAM_ID) url.searchParams.set("teamId", VERCEL_TEAM_ID);
  else if (VERCEL_TEAM_SLUG) url.searchParams.set("slug", VERCEL_TEAM_SLUG);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Vercel API ${res.status}` }, { status: 502 });
  }

  const data = await res.json();
  const deployments: VercelDeployment[] = data.deployments ?? [];
  if (!deployments.length) {
    return NextResponse.json({ error: "no Vercel deployments" }, { status: 404 });
  }

  const [current, ...recent] = deployments.map(shape);
  return NextResponse.json({ current, recent });
}
