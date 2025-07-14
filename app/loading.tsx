export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-muted animate-spin border-t-foreground" />
      </div>
    </div>
  );
}