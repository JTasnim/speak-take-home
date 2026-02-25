import Link from "next/link";
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
    <main className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="mt-1 text-sm text-gray-600">
          Pick a course to view lessons.
        </p>
      </header>

      {/* Error state */}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Couldn’t load courses</p>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <p className="mt-2 text-xs text-red-700">
            Make sure the server is running on <span className="font-mono">:3001</span>.
          </p>
        </div>
      ) : null}

      {/* Empty state */}
      {!error && data?.courses?.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-700">No courses found.</p>
        </div>
      ) : null}

      {/* List */}
      {!error && data?.courses?.length ? (
        <ul className="space-y-3">
          {data.courses.map((course) => (
            <li key={course.id}>
              <Link
                href={`/courses/${course.id}`}
                className="block rounded-xl border border-gray-200 p-4 shadow-sm transition hover:shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      {course.title}
                    </h2>
                    {course.description ? (
                      <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                        {course.description}
                      </p>
                    ) : (
                      <p className="mt-1 text-sm text-gray-500">
                        No description provided.
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {course.lessonCount} lessons
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}