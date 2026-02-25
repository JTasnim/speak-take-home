import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { GetCourseResponse } from "@/types/course";

type PageProps = {
  // Next.js can provide params asynchronously in App Router
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
    <main className="mx-auto max-w-2xl px-4 py-6">
      <Link
        href="/"
        className="mb-4 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to courses
      </Link>

      {/* Error state */}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Couldn’t load course
          </p>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      ) : null}

      {!error && data ? (
        <>
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              {data.course.title}
            </h1>

            {data.course.description ? (
              <p className="mt-2 text-sm text-gray-600">
                {data.course.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No description provided.
              </p>
            )}
          </header>

          <section>
            <h2 className="mb-3 text-lg font-medium">Lessons</h2>

            {data.course.lessons.length === 0 ? (
              <p className="text-sm text-gray-600">
                This course has no lessons.
              </p>
            ) : (
              <ul className="space-y-2">
                {data.course.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link
                      href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className="block rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50"
                    >
                      <p className="font-medium text-gray-900">
                        {lesson.title}
                      </p>

                      {lesson.description ? (
                        <p className="mt-1 text-sm text-gray-600">
                          {lesson.description}
                        </p>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}
