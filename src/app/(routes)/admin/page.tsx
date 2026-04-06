"use client";

import { useEffect, useState } from "react";

interface DashboardData {
  claims: { id: string; claimant_name: string; claimant_email: string; claimant_role: string; verified: boolean; created_at: string; care_home_id: string }[];
  enquiries: { id: string; family_name: string; family_email: string; care_type: string; status: string; created_at: string; care_home_id: string }[];
  stats: { total_homes: number; claimed: number; enquiries: number; pending_claims: number };
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    // Simple password check — in production, use Supabase Auth
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "gofal2026") {
      setAuthed(true);
      fetchData();
    }
  }

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="font-heading text-2xl font-bold text-center">Admin</h1>
        <form onSubmit={handleAuth} className="mt-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-primary px-6 py-3 font-body font-bold text-white"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-muted-plum">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      {data?.stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Homes", value: data.stats.total_homes },
            { label: "Claimed", value: data.stats.claimed },
            { label: "Enquiries", value: data.stats.enquiries },
            { label: "Pending Claims", value: data.stats.pending_claims },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[16px] border border-blush-grey bg-white p-4 text-center">
              <p className="font-heading text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-plum">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Claims */}
      <div className="mt-8">
        <h2 className="font-heading text-xl font-bold">Recent Claims</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blush-grey text-left">
                <th className="pb-2 font-semibold">Name</th>
                <th className="pb-2 font-semibold">Email</th>
                <th className="pb-2 font-semibold">Role</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.claims?.map((claim) => (
                <tr key={claim.id} className="border-b border-blush-grey/50">
                  <td className="py-2">{claim.claimant_name}</td>
                  <td className="py-2">{claim.claimant_email}</td>
                  <td className="py-2">{claim.claimant_role}</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${claim.verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                      {claim.verified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="py-2">{new Date(claim.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!data?.claims || data.claims.length === 0) && (
                <tr><td colSpan={5} className="py-4 text-center text-muted-plum">No claims yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiries */}
      <div className="mt-8">
        <h2 className="font-heading text-xl font-bold">Recent Enquiries</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blush-grey text-left">
                <th className="pb-2 font-semibold">Name</th>
                <th className="pb-2 font-semibold">Email</th>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.enquiries?.map((enq) => (
                <tr key={enq.id} className="border-b border-blush-grey/50">
                  <td className="py-2">{enq.family_name}</td>
                  <td className="py-2">{enq.family_email}</td>
                  <td className="py-2">{enq.care_type}</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      enq.status === "converted" ? "bg-green-100 text-green-800" :
                      enq.status === "sent" ? "bg-blue-100 text-blue-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-2">{new Date(enq.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!data?.enquiries || data.enquiries.length === 0) && (
                <tr><td colSpan={5} className="py-4 text-center text-muted-plum">No enquiries yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
