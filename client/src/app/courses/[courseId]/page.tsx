import Link from "next/link";
import Image from "next/image";
import { apiGet } from "@/lib/api";
import type { GetCourseResponse } from "@/types/course";

type PageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

async function getCourse(courseId: string) {
  return apiGet<GetCourseResponse>(`/api/courses/${courseId}`);
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;

  let data: GetCourseResponse | null = null;
  let error: string | null = null;

  try {
    data = await getCourse(courseId);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load course";
  }

  return (
    <main className="min-h-screen">
      {/* Back link */}
      <div className="px-4 pt-4">
        <Link href="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Courses
        </Link>
      </div>

      {error && (
        <div className="px-4 pt-4">
          <div className="recording-error animate-fade-in">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {!error && data && (
        <div className="animate-fade-in">
          {/* Hero */}
          {data.course.backgroundImageUrl && (
            <div className="relative w-full aspect-[2/1] overflow-hidden">
              <Image
                src={data.course.backgroundImageUrl}
                alt={data.course.title}
                fill
                className="object-cover"
                priority
                sizes="512px"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to bottom, transparent 30%, var(--color-bg) 100%)",
                }}
              />
            </div>
          )}

          <div className="px-4 -mt-8 relative" style={{ zIndex: 1 }}>
            <header className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
                {data.course.title}
              </h1>
              {data.course.subtitle && (
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {data.course.subtitle}
                </p>
              )}
              {data.course.language && (
                <div className="mt-2">
                  <span className="badge">{data.course.language}</span>
                </div>
              )}
            </header>

            {/* Lessons */}
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--color-text-muted)", letterSpacing: "0.08em" }}
              >
                {data.course.lessons.length} {data.course.lessons.length === 1 ? "Lesson" : "Lessons"}
              </h2>

              {data.course.lessons.length === 0 ? (
                <div className="glass-card p-4 text-center">
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    No lessons available yet.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2 stagger-children pb-6">
                  {data.course.lessons.map((lesson, i) => (
                    <li key={lesson.id}>
                      <Link
                        href={`/courses/${courseId}/lessons/${lesson.id}`}
                        className="lesson-card"
                      >
                        {lesson.thumbnailImageUrl ? (
                          <Image
                            src={lesson.thumbnailImageUrl}
                            alt={lesson.title}
                            width={56}
                            height={56}
                            className="lesson-card-thumb"
                          />
                        ) : (
                          <div
                            className="lesson-card-thumb flex items-center justify-center"
                            style={{
                              background: "var(--gradient-subtle)",
                              color: "var(--color-accent)",
                              fontWeight: 700,
                              fontSize: "1.1rem",
                            }}
                          >
                            {i + 1}
                          </div>
                        )}

                        <div className="lesson-card-info">
                          <p className="lesson-card-title">{lesson.title}</p>
                          {lesson.subtitle && (
                            <p className="lesson-card-subtitle">{lesson.subtitle}</p>
                          )}
                        </div>

                        <svg
                          className="lesson-card-arrow"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </main>
  );
}
