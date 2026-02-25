export type Course = {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  description?: string;
};

export type CourseSummary = Omit<Course, "lessons"> & {
  lessonCount: number;
};