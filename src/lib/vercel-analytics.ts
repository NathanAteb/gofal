/**
 * Vercel Web Analytics API — pulls visitor/pageview data for briefings.
 *
 * Requires VERCEL_API_TOKEN and VERCEL_PROJECT_ID.
 * Enable Web Analytics at: vercel.com/[team]/[project]/analytics
 */

interface AnalyticsPeriod {
  visitors: number;
  pageViews: number;
  topPages: Array<{ key: string; total: number }>;
  topReferrers: Array<{ key: string; total: number }>;
  topCountries: Array<{ key: string; total: number }>;
}

async function fetchAnalytics(
  endpoint: string,
  from: string,
  to: string
): Promise<unknown> {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;
  if (!token || !projectId) return null;

  const params = new URLSearchParams({
    projectId,
    from,
    to,
    environment: "production",
  });
  if (teamId) params.set("teamId", teamId);

  const res = await fetch(
    `https://vercel.com/api/web/insights/${endpoint}?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) return null;
  return res.json();
}

export async function getAnalytics(): Promise<{
  last7Days: AnalyticsPeriod | null;
  previous7Days: AnalyticsPeriod | null;
}> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  try {
    const [thisWeekStats, prevWeekStats, topPages, topReferrers] =
      await Promise.all([
        fetchAnalytics("stats", fmt(sevenDaysAgo), fmt(now)),
        fetchAnalytics("stats", fmt(fourteenDaysAgo), fmt(sevenDaysAgo)),
        fetchAnalytics("path", fmt(sevenDaysAgo), fmt(now)),
        fetchAnalytics("referrer", fmt(sevenDaysAgo), fmt(now)),
      ]);

    const parseStats = (
      stats: unknown,
      pages: unknown,
      referrers: unknown
    ): AnalyticsPeriod | null => {
      if (!stats) return null;
      const s = stats as { data?: Array<{ visitors: number; pageViews: number }> };
      const totals = (s.data || []).reduce(
        (acc, d) => ({
          visitors: acc.visitors + (d.visitors || 0),
          pageViews: acc.pageViews + (d.pageViews || 0),
        }),
        { visitors: 0, pageViews: 0 }
      );

      const p = pages as { data?: Array<{ key: string; total: number }> };
      const r = referrers as { data?: Array<{ key: string; total: number }> };

      return {
        ...totals,
        topPages: (p?.data || []).slice(0, 5),
        topReferrers: (r?.data || []).slice(0, 5),
        topCountries: [],
      };
    };

    return {
      last7Days: parseStats(thisWeekStats, topPages, topReferrers),
      previous7Days: parseStats(prevWeekStats, null, null),
    };
  } catch {
    return { last7Days: null, previous7Days: null };
  }
}
