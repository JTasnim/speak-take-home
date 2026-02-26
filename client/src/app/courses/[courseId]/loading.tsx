export default function CourseLoading() {
  return (
    <main className="min-h-screen">
      <div className="px-4 pt-4">
        <div className="skeleton h-4 w-16 mb-4" />
      </div>
      <div className="skeleton w-full aspect-[2/1]" style={{ borderRadius: 0 }} />
      <div className="px-4 -mt-8 relative" style={{ zIndex: 1 }}>
        <div className="skeleton h-7 w-3/4 mb-2" />
        <div className="skeleton h-4 w-1/2 mb-2" />
        <div className="skeleton h-5 w-28 mb-6" style={{ borderRadius: "9999px" }} />
        <div className="skeleton h-3 w-20 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-3">
              <div className="flex items-center gap-3">
                <div className="skeleton w-14 h-14 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-3/4" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
