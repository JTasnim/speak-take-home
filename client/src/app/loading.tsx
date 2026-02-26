export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="gradient-header text-center">
        <div className="skeleton h-8 w-24 mx-auto" />
        <div className="skeleton h-4 w-48 mx-auto mt-3" />
      </div>
      <div className="px-4 py-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4">
            <div className="flex items-start gap-3">
              <div className="skeleton w-14 h-14 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
                <div className="skeleton h-5 w-24" style={{ borderRadius: "9999px" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
