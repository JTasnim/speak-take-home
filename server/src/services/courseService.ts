import fs from "fs";
import path from "path";
import { AudioChunk, Course, CourseSummary, Lesson } from "../types/course";
import { HttpError } from "../types/http";

const COURSE_PATH = path.resolve(__dirname, "../../../assets/course.json");
const AUDIO_PATH = path.resolve(__dirname, "../../../assets/audio.json");

type CourseDb = {
  courses: Course[];
};

function readCourseFile(): CourseDb {
  try {
    const raw = fs.readFileSync(COURSE_PATH, "utf-8");
    const parsed = JSON.parse(raw) as CourseDb;

    if (!parsed || !Array.isArray(parsed.courses)) {
      throw new Error("Invalid course.json format: expected { courses: [] }");
    }

    return parsed;
  } catch (err) {
    throw new HttpError(
      500,
      "COURSE_DB_LOAD_FAILED",
      "Failed to load course database",
    );
  }
}

const db = readCourseFile();

export function listCourses(): CourseSummary[] {
  return db.courses.map(({ lessons, ...rest }) => ({
    ...rest,
    lessonCount: Array.isArray(lessons) ? lessons.length : 0,
  }));
}

export function getCourse(courseId: string): Course {
  const course = db.courses.find((c) => c.id === courseId);
  if (!course) {
    throw new HttpError(
      404,
      "COURSE_NOT_FOUND",
      `Course '${courseId}' not found`,
    );
  }
  return course;
}

export function getLesson(courseId: string, lessonId: string): Lesson {
  const course = getCourse(courseId);
  const lesson = course.lessons?.find((l) => l.id === lessonId);
  if (!lesson) {
    throw new HttpError(
      404,
      "LESSON_NOT_FOUND",
      `Lesson '${lessonId}' not found in course '${courseId}'`,
    );
  }
  return lesson;
}

export function getAudioChunks(): AudioChunk[] {
  try {
    const raw = fs.readFileSync(AUDIO_PATH, "utf-8");
    return JSON.parse(raw) as AudioChunk[];
  } catch (err) {
    throw new HttpError(
      500,
      "AUDIO_LOAD_FAILED",
      "Failed to load audio chunks",
    );
  }
}