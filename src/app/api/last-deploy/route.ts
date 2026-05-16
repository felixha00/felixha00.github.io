import { NextResponse } from "next/server";

const GITHUB_USERNAME = process.env.GITHUB_USERNAME ?? "felixha00";
const GITHUB_REPO = process.env.GITHUB_REPO ?? "felixha00.github.io";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export const revalidate = 300;

type GitHubRun = {
  head_sha: string;
  head_branch: string;
  head_commit: { message: string; author: { name: string } } | null;
  status: string;
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  run_started_at?: string;
};

function shape(run: GitHubRun) {
  const state =
    run.status === "completed"
      ? (run.conclusion ?? "unknown").toUpperCase()
      : run.status.toUpperCase().replace(/_/g, " ");

  const createdAt = new Date(run.created_at).getTime();
  const readyAt = new Date(run.updated_at).getTime();
  const startedAt = run.run_started_at
    ? new Date(run.run_started_at).getTime()
    : createdAt;

  return {
    sha: run.head_sha.slice(0, 7),
    message: run.head_commit?.message.split("\n")[0] ?? null,
    branch: run.head_branch ?? null,
    author: run.head_commit?.author.name ?? null,
    state,
    createdAt,
    readyAt,
    duration:
      run.status === "completed"
        ? Math.round((readyAt - startedAt) / 1000)
        : null,
  };
}

export async function GET() {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio/1.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (GITHUB_TOKEN) headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/actions/runs?per_page=5&exclude_pull_requests=true`,
    { headers, next: { revalidate: 300 } }
  );

  if (!res.ok) {
    return NextResponse.json({ error: `GitHub API ${res.status}` }, { status: 502 });
  }

  const data = await res.json();
  const runs: GitHubRun[] = data.workflow_runs ?? [];
  if (!runs.length) {
    return NextResponse.json({ error: "no runs" }, { status: 404 });
  }

  const [current, ...rest] = runs.slice(0, 4).map(shape);
  return NextResponse.json({ current, recent: rest });
}
