"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import type { GetLessonResponse, LessonDetail } from "@/types/course";
import { RecordingPanel } from "@/components/RecordingPanel";

export default function LessonPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const data = await apiGet<GetLessonResponse>(
          `/api/courses/${courseId}/lessons/${lessonId}`
        );
        setLesson(data.lesson);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-4">
        <div className="skeleton h-4 w-20 mb-4" />
        <div className="skeleton h-8 w-3/4 mb-2" />
        <div className="skeleton h-4 w-1/2 mb-6" />
        <div className="skeleton h-48 w-full mb-4" />
        <div className="skeleton h-64 w-full" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen px-4 py-4">
        <Link href={`/courses/${courseId}`} className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <div className="recording-error mt-4 animate-fade-in">
          <p className="font-medium">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen animate-fade-in">
      {/* Back link */}
      <div className="px-4 pt-4">
        <Link href={`/courses/${courseId}`} className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to course
        </Link>
      </div>

      {/* Lesson thumbnail */}
      {lesson?.thumbnailImageUrl && (
        <div className="relative w-full aspect-[16/9] overflow-hidden mt-2">
          <Image
            src={lesson.thumbnailImageUrl}
            alt={lesson.title ?? "Lesson"}
            fill
            className="object-cover"
            priority
            sizes="512px"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 50%, var(--color-bg) 100%)",
            }}
          />
        </div>
      )}

      {/* Lesson info */}
      <div className="px-4 -mt-8 relative" style={{ zIndex: 1 }}>
        <header className="mb-6">
          <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            {lesson?.title}
          </h1>
          {lesson?.subtitle && (
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {lesson.subtitle}
            </p>
          )}
        </header>

        {/* Recording Panel */}
        <RecordingPanel />

        <div className="h-8" />
      </div>
    </main>
  );
}
