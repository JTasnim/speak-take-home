// client/src/types/course.ts

export type CourseSummary = {
  id: string;
  title: string;
  subtitle?: string;
  language?: string;
  thumbnailImageUrl?: string;
  backgroundImageUrl?: string;
  lessonCount: number;
};

export type ListCoursesResponse = {
  courses: CourseSummary[];
};

export type Lesson = {
  id: string;
  title: string;
  subtitle?: string;
  thumbnailImageUrl?: string;
};

export type CourseDetail = {
  id: string;
  title: string;
  subtitle?: string;
  language?: string;
  thumbnailImageUrl?: string;
  backgroundImageUrl?: string;
  lessons: Lesson[];
};

export type GetCourseResponse = {
  course: CourseDetail;
};

export type LessonDetail = {
  id: string;
  title: string;
  subtitle?: string;
  thumbnailImageUrl?: string;
};

export type GetLessonResponse = {
  lesson: LessonDetail;
};

export type AudioChunk = {
  type: string;
  chunk: string;
  isFinal: boolean;
};

export type GetAudioChunksResponse = {
  chunks: AudioChunk[];
};
