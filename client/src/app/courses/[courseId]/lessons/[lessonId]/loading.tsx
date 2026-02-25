export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="h-6 w-40 animate-pulse rounded bg-gray-800/40" />
      <div className="mt-6 h-10 w-3/4 animate-pulse rounded bg-gray-800/40" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-gray-800/30" />
      <div className="mt-10 h-28 w-full animate-pulse rounded bg-gray-800/30" />
    </main>
  );
}
