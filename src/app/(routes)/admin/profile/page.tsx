"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ProfileEditor() {
  const searchParams = useSearchParams();
  const homeId = searchParams.get("id");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    description: "",
    description_cy: "",
    welsh_language_notes: "",
    weekly_fee_from: "",
    weekly_fee_to: "",
    services: [] as string[],
    amenities: [] as string[],
  });

  useEffect(() => {
    if (!homeId) return;
    fetch(`/api/admin/profile?id=${homeId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setProfile({
            description: data.profile.description || "",
            description_cy: data.profile.description_cy || "",
            welsh_language_notes: data.profile.welsh_language_notes || "",
            weekly_fee_from: data.profile.weekly_fee_from?.toString() || "",
            weekly_fee_to: data.profile.weekly_fee_to?.toString() || "",
            services: data.profile.services || [],
            amenities: data.profile.amenities || [],
          });
        }
      });
  }, [homeId]);

  async function handleSave() {
    if (!homeId) return;
    setSaving(true);
    await fetch("/api/admin/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        care_home_id: homeId,
        ...profile,
        weekly_fee_from: profile.weekly_fee_from ? parseInt(profile.weekly_fee_from) : null,
        weekly_fee_to: profile.weekly_fee_to ? parseInt(profile.weekly_fee_to) : null,
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!homeId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-plum">No care home ID provided.</p>
      </div>
    );
  }

  const inputClass = "w-full rounded-[12px] border border-blush-grey bg-ivory px-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-heading text-2xl font-bold">Edit Profile</h1>

      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-dusk mb-1">Description (English)</label>
          <textarea
            rows={4}
            value={profile.description}
            onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dusk mb-1">Disgrifiad (Cymraeg)</label>
          <textarea
            rows={4}
            value={profile.description_cy}
            onChange={(e) => setProfile({ ...profile, description_cy: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-dusk mb-1">Welsh Language Notes</label>
          <textarea
            rows={2}
            value={profile.welsh_language_notes}
            onChange={(e) => setProfile({ ...profile, welsh_language_notes: e.target.value })}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-dusk mb-1">Weekly Fee From (£)</label>
            <input
              type="number"
              value={profile.weekly_fee_from}
              onChange={(e) => setProfile({ ...profile, weekly_fee_from: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dusk mb-1">Weekly Fee To (£)</label>
            <input
              type="number"
              value={profile.weekly_fee_to}
              onChange={(e) => setProfile({ ...profile, weekly_fee_to: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-full bg-secondary px-6 py-3 font-body font-bold text-white transition-colors hover:bg-secondary/90 disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default function ProfileEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-plum">Loading...</div>}>
      <ProfileEditor />
    </Suspense>
  );
}
