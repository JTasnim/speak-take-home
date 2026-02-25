import Link from "next/link";
import { getLesson } from "@/lib/course";

type PageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: PageProps) {
  const { courseId, lessonId } = await params;

  let data: any = null;
  let error = "";

  try {
    data = await getLesson(courseId, lessonId);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load lesson";
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Link
          href={`/courses/${courseId}`}
          className="mb-6 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to course
        </Link>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            Couldn’t load lesson
          </p>
          <p className="mt-1 text-sm text-red-700">{error}</p>
        </div>
      </main>
    );
  }

  const lesson = data?.lesson;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href={`/courses/${courseId}`}
        className="mb-6 inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to course
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          {lesson?.title}
        </h1>
        {lesson?.subtitle ? (
          <p className="mt-2 text-sm text-gray-500">{lesson.subtitle}</p>
        ) : null}
      </header>

      <section className="rounded-xl border p-5">
        <h2 className="text-lg font-semibold">Audio</h2>
        <p className="mt-2 text-sm text-gray-500">
          No audio available for this lesson yet.
        </p>
      </section>
    </main>
  );
}
