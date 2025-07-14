export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="inline-flex items-center mb-4">
          <div className="h-4 w-4 mr-2 bg-muted/10 rounded animate-pulse" />
          <div className="h-4 w-24 bg-muted/10 rounded animate-pulse" />
        </div>
        
        <div className="h-9 w-32 bg-muted/20 rounded animate-pulse mb-2" />
        <div className="h-6 w-64 bg-muted/10 rounded animate-pulse" />
      </div>

      {/* API Usage Section */}
      <section className="space-y-6">
        <div className="h-7 w-40 bg-muted/20 rounded animate-pulse mb-4" />
        
        {/* Rate Limit Card Skeleton */}
        <div className="border border-border rounded-lg p-6 space-y-4">
          <div className="space-y-3">
            <div className="h-5 w-32 bg-muted/20 rounded animate-pulse" />
            <div className="h-4 w-48 bg-muted/10 rounded animate-pulse" />
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 w-full bg-muted/10 rounded-full animate-pulse" />
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-muted/10 rounded animate-pulse" />
              <div className="h-4 w-20 bg-muted/10 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4 pt-2">
            <div className="space-y-1">
              <div className="h-4 w-20 bg-muted/10 rounded animate-pulse" />
              <div className="h-5 w-16 bg-muted/15 rounded animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="h-4 w-24 bg-muted/10 rounded animate-pulse" />
              <div className="h-5 w-20 bg-muted/15 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}