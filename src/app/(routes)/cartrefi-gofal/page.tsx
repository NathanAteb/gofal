import { Suspense } from "react";
import { DirectoryContent } from "./DirectoryContent";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";

export default function DirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <SkeletonGrid count={6} />
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
