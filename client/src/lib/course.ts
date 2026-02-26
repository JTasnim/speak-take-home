import { apiGet } from "./api";
import type { GetAudioChunksResponse } from "@/types/course";

// Course list
export async function getCourses() {
  return apiGet("/api/courses");
}

// Course detail
export async function getCourse(courseId: string) {
  return apiGet(`/api/courses/${courseId}`);
}

// Lesson detail
export async function getLesson(courseId: string, lessonId: string) {
  return apiGet(`/api/courses/${courseId}/lessons/${lessonId}`);
}

// Audio chunks for simulated recording
export async function getAudioChunks() {
  return apiGet<GetAudioChunksResponse>("/api/audio-chunks");
}