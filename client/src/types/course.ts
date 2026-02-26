// client/src/types/course.ts

export type Lesson = {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  thumbnailImageUrl?: string;
  audioUrl?: string;
};

export type Course = {
  id: string;
  title: string;
  description?: string;
  subtitle?: string;
  lessons: Lesson[];
};

export type GetCoursesResponse = {
  courses: Course[];
};

export type GetCourseResponse = {
  course: Course;
};

export type GetLessonResponse = {
  lesson: Lesson;
};
