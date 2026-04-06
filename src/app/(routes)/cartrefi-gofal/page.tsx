import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { DirectoryContent } from "./DirectoryContent";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cartrefi Gofal yng Nghymru / Care Homes in Wales",
  description:
    "Porwch drwy bob cartref gofal yng Nghymru. Cymharwch graddfeydd CIW, prisiau, a darpariaeth Gymraeg. Browse every care home in Wales.",
};

async function getInitialHomes() {
  try {
    const supabase = await createClient();
    const { data, count } = await supabase
      .from("care_homes")
      .select("*, care_home_profiles(*)", { count: "exact" })
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("name", { ascending: true })
      .range(0, 11);

    return { homes: data || [], total: count || 0 };
  } catch {
    return { homes: [], total: 0 };
  }
}

export default async function DirectoryPage() {
  const { homes: initialHomes, total: initialTotal } = await getInitialHomes();

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <SkeletonGrid count={6} />
        </div>
      }
    >
      <DirectoryContent
        initialHomes={initialHomes}
        initialTotal={initialTotal}
      />
    </Suspense>
  );
}
