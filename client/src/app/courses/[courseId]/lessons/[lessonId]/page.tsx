import Link from "next/link";
import Image from "next/image";
import { getLesson } from "@/lib/course";
import type { GetLessonResponse } from "@/types/course";

let data: GetLessonResponse | null = null;

type Params = {
  courseId: string;
  lessonId: string;
};

// Next 15+ may treat params as a Promise depending on setup
type PageProps = {
  params: Promise<Params> | Params;
};

export default async function LessonPage({ params }: PageProps) {
  const resolvedParams = "then" in params ? await params : params;
  const { courseId, lessonId } = resolvedParams;

  let data: any = null;
  let error: string | null = null;

  try {
    data = await getLesson(courseId, lessonId);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load lesson";
  }

  const lesson = data?.lesson;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href={`/courses/${courseId}`}
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to course
      </Link>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Couldn’t load lesson
          </p>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      ) : null}

      {!error && lesson ? (
        <>
          <header className="mb-6">
            <h1 className="text-3xl font-semibold tracking-tight">
              {lesson.title}
            </h1>
            {lesson.subtitle ? (
              <p className="mt-2 text-sm text-gray-400">{lesson.subtitle}</p>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No description provided.
              </p>
            )}
          </header>

          {/* Commit 6: Thumbnail */}
          {lesson.thumbnailImageUrl ? (
            <div className="mb-6 overflow-hidden rounded-2xl border">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={lesson.thumbnailImageUrl}
                  alt={lesson.title ?? "Lesson thumbnail"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          ) : null}

          {/* Audio card */}
          <section className="rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">Audio</h2>

            {lesson.audioUrl ? (
              <audio className="mt-3 w-full" controls src={lesson.audioUrl} />
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                No audio available for this lesson yet.
              </p>
            )}
          </section>
        </>
      ) : null}
    </main>
  );
}
