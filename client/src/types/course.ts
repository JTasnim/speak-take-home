export type CourseSummary = {
  id: string;
  title: string;
  description?: string;
  lessonCount: number;
};

export type ListCoursesResponse = {
  courses: CourseSummary[];
};