export type Course = {
  id: string;
  title: string;
  subtitle?: string;
  language?: string;
  thumbnailImageUrl?: string;
  backgroundImageUrl?: string;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  subtitle?: string;
  thumbnailImageUrl?: string;
};

export type CourseSummary = Omit<Course, "lessons"> & {
  lessonCount: number;
};

export type AudioChunk = {
  type: string;
  chunk: string;
  isFinal: boolean;
};