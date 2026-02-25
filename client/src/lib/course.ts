import { apiGet } from "./api";

export async function getLesson(courseId: string, lessonId: string) {
  return apiGet(`/api/courses/${courseId}/lessons/${lessonId}`);
}
