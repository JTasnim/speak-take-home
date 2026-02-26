import Link from "next/link";
import Image from "next/image";
import { apiGet } from "@/lib/api";
import type { ListCoursesResponse } from "@/types/course";

async function getCourses() {
  return apiGet<ListCoursesResponse>("/api/courses");
}

export default async function HomePage() {
  let data: ListCoursesResponse | null = null;
  let error: string | null = null;

  try {
    data = await getCourses();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load courses";
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="gradient-header text-center animate-fade-in">
        <h1 className="text-3xl font-extrabold tracking-tight">
          <span className="gradient-text">Speak</span>
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Choose a course and start speaking
        </p>
      </div>

      <div className="px-4 py-6">
        {/* Error state */}
        {error && (
          <div className="recording-error animate-fade-in">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-xs mt-1" style={{ opacity: 0.7 }}>
                Make sure the server is running on <code className="font-mono">:3001</code>
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!error && data?.courses?.length === 0 && (
          <div className="glass-card p-6 text-center animate-fade-in">
            <p style={{ color: "var(--color-text-secondary)" }}>No courses available yet.</p>
          </div>
        )}

        {/* Course list */}
        {!error && data?.courses?.length ? (
          <ul className="space-y-3 stagger-children">
            {data.courses.map((course) => (
              <li key={course.id}>
                <Link
                  href={`/courses/${course.id}`}
                  className="glass-card block p-4"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    {course.thumbnailImageUrl && (
                      <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden" style={{ borderRadius: "var(--radius-sm)" }}>
                        <Image
                          src={course.thumbnailImageUrl}
                          alt={course.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>
                        {course.title}
                      </h2>
                      {course.subtitle && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                          {course.subtitle}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {course.language && (
                          <span className="badge">{course.language}</span>
                        )}
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {course.lessonCount} {course.lessonCount === 1 ? "lesson" : "lessons"}
                        </span>
                      </div>
                    </div>

                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ color: "var(--color-text-muted)", flexShrink: 0, marginTop: 2 }}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
  );
}
