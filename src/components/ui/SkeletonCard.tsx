export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[16px] border border-blush-grey bg-white p-4 shadow-card">
      <div className="h-40 rounded-[12px] bg-linen" />
      <div className="mt-3 space-y-2">
        <div className="h-5 w-3/4 rounded bg-linen" />
        <div className="h-4 w-1/2 rounded bg-linen" />
        <div className="flex gap-2">
          <div className="h-6 w-16 rounded-full bg-linen" />
          <div className="h-6 w-16 rounded-full bg-linen" />
        </div>
        <div className="h-4 w-1/3 rounded bg-linen" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
