/**
 * GitHub API helpers for deploy flow
 */

const GITHUB_API = "https://api.github.com";

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

function getRepo(): string {
  return process.env.GITHUB_REPO || "NathanAteb/gofal";
}

export async function createPR(branch: string, title: string, body: string): Promise<{ number: number; url: string }> {
  const res = await fetch(`${GITHUB_API}/repos/${getRepo()}/pulls`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      title,
      body,
      head: branch,
      base: "main",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to create PR: ${err.message}`);
  }

  const data = await res.json();
  return { number: data.number, url: data.html_url };
}

export async function mergePR(prNumber: number, commitTitle: string): Promise<void> {
  const res = await fetch(`${GITHUB_API}/repos/${getRepo()}/pulls/${prNumber}/merge`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({
      merge_method: "squash",
      commit_title: commitTitle,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to merge PR: ${err.message}`);
  }
}

export async function deleteBranch(branch: string): Promise<void> {
  await fetch(`${GITHUB_API}/repos/${getRepo()}/git/refs/heads/${branch}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
}
