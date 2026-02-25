import Link from "next/link";
import { apiGet } from "@/lib/api";
import type { GetLessonResponse } from "@/types/course";

type PageProps = {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
};

async function getLesson(courseId: string, lessonId: string) {
  return apiGet<GetLessonResponse>(
    `/api/courses/${courseId}/lessons/${lessonId}`,
  );
}

export default async function LessonPage({ params }: PageProps) {
  const { courseId, lessonId } = await params;

  let data: GetLessonResponse | null = null;
  let error: string | null = null;

  try {
    data = await getLesson(courseId, lessonId);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load lesson";
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center gap-4">
        <Link
          href={`/courses/${courseId}`}
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to course
        </Link>
      </div>

      {/* error state */}
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Couldn’t load lesson
          </p>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      ) : null}

      {/* success state */}
      {!error && data ? (
        <>
          <header className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              {data.lesson.title}
            </h1>

            {data.lesson.description ? (
              <p className="mt-2 text-sm text-gray-600">
                {data.lesson.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No description provided.
              </p>
            )}
          </header>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Audio</h2>

            {data.lesson.audioUrl ? (
              <audio controls className="w-full">
                <source src={data.lesson.audioUrl} />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p className="text-sm text-gray-600">
                No audio available for this lesson yet.
              </p>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}
