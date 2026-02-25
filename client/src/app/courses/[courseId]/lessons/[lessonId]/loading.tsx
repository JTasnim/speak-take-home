export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6">
        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-8 w-72 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="space-y-3">
        <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
        <div className="h-12 w-full animate-pulse rounded bg-gray-200" />
      </div>
    </main>
  );
}
