import { NextResponse } from "next/server";

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
const VERCEL_TEAM_SLUG = process.env.VERCEL_TEAM_SLUG;
const GITHUB_OWNER =
  process.env.GITHUB_OWNER ??
  process.env.GITHUB_USERNAME ??
  process.env.VERCEL_GIT_REPO_OWNER ??
  "felixha00";
const GITHUB_REPO =
  process.env.GITHUB_REPO ??
  process.env.VERCEL_GIT_REPO_SLUG ??
  "felixha00.github.io";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

type CommitEntry = {
  sha: string;
  message: string;
  branch: string | null;
  author: string | null;
  committedAt: number | null;
};

type GitHubCommit = {
  sha: string;
  commit: {
    message?: string;
    author?: {
      name?: string;
      date?: string;
    };
    committer?: {
      date?: string;
    };
  };
  author?: {
    login?: string;
  };
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

function shapeCommit(commit: GitHubCommit, branch: string | null): CommitEntry {
  const committedAt =
    Date.parse(commit.commit.author?.date ?? commit.commit.committer?.date ?? "") ||
    null;

  return {
    sha: commit.sha.slice(0, 7),
    message: commit.commit.message?.split("\n")[0] ?? "n/a",
    branch,
    author: commit.author?.login ?? commit.commit.author?.name ?? null,
    committedAt,
  };
}

async function fetchCommits(branch: string | null): Promise<CommitEntry[]> {
  const url = new URL(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits`
  );
  url.searchParams.set("per_page", "3");
  if (branch) url.searchParams.set("sha", branch);

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio/1.0",
  };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

  const res = await fetch(url.toString(), {
    headers,
    cache: "no-store",
  });

  if (!res.ok) return [];

  const commits: GitHubCommit[] = await res.json();
  return commits.map((commit) => shapeCommit(commit, branch));
}

export async function GET() {
  if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
    return NextResponse.json({ error: "missing Vercel config" }, { status: 503 });
  }

  const url = new URL("https://api.vercel.com/v6/deployments");
  url.searchParams.set("projectId", VERCEL_PROJECT_ID);
  url.searchParams.set("limit", "1");
  url.searchParams.set("state", "READY");
  url.searchParams.set("target", "production");
  if (VERCEL_TEAM_ID) url.searchParams.set("teamId", VERCEL_TEAM_ID);
  else if (VERCEL_TEAM_SLUG) url.searchParams.set("slug", VERCEL_TEAM_SLUG);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: `Vercel API ${res.status}` }, { status: 502 });
  }

  const data = await res.json();
  const deployments: VercelDeployment[] = data.deployments ?? [];
  if (!deployments.length) {
    return NextResponse.json({ error: "no Vercel deployments" }, { status: 404 });
  }

  const current = shape(deployments[0]);
  const commits = await fetchCommits(current.branch);
  const [latestCommit, ...recentCommits] = commits;

  return NextResponse.json({
    current,
    latestCommit: latestCommit ?? null,
    recentCommits: recentCommits.slice(0, 2),
    isLatestDeployed:
      latestCommit != null && current.sha != null
        ? latestCommit.sha === current.sha
        : null,
  });
}
