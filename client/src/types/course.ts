export type CourseSummary = {
  id: string;
  title: string;
  description?: string;
  lessonCount: number;
};

export type ListCoursesResponse = {
  courses: CourseSummary[];
};

export type Lesson = {
  id: string;
  title: string;
  description?: string;
};

export type CourseDetail = {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
};

export type GetCourseResponse = {
  course: CourseDetail;
};
