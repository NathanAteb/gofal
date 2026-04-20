/**
 * Vercel API helpers for rollback flow
 */

interface VercelDeployment {
  uid: string;
  url: string;
  created: number;
  state: string;
  target: string | null;
  meta?: {
    githubCommitMessage?: string;
    githubCommitRef?: string;
  };
}

function getHeaders() {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) throw new Error("VERCEL_API_TOKEN not set");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getRecentProductionDeployments(limit = 5): Promise<VercelDeployment[]> {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!projectId) throw new Error("VERCEL_PROJECT_ID not set");

  const params = new URLSearchParams({
    projectId,
    limit: String(limit),
    target: "production",
    state: "READY",
  });
  if (teamId) params.set("teamId", teamId);

  const res = await fetch(`https://api.vercel.com/v6/deployments?${params}`, {
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch deployments");
  const data = await res.json();
  return data.deployments || [];
}

export async function promoteDeployment(deploymentId: string): Promise<void> {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!projectId) throw new Error("VERCEL_PROJECT_ID not set");

  const params = new URLSearchParams();
  if (teamId) params.set("teamId", teamId);

  const res = await fetch(`https://api.vercel.com/v6/deployments/${deploymentId}/promote?${params}`, {
    method: "POST",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to promote deployment: ${err.error?.message || "unknown"}`);
  }
}
