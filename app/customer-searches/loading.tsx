export default function Loading() {
  return (
    <div className="flex-1 space-y-8 mx-auto max-w-4xl px-1">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-10 w-48 bg-muted/20 rounded animate-pulse" />
        <div className="h-6 w-64 bg-muted/10 rounded animate-pulse" />
      </div>

      {/* Search Pattern Cards Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-muted/20 rounded animate-pulse" />
              <div className="h-5 w-24 bg-muted/10 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/10 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted/10 rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted/10 rounded-full animate-pulse" />
              <div className="h-6 w-16 bg-muted/10 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}