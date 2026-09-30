export default function JourneyLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 h-8 w-48 animate-pulse rounded bg-muted-background" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl bg-muted-background"
          />
        ))}
      </div>
    </div>
  );
}
