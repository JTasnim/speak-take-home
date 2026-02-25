import { apiGet } from "./api";

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
