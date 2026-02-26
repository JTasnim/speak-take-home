import { Router } from "express";
import {
  getCourse,
  getLesson,
  listCourses,
} from "../services/courseService";

export const coursesRouter = Router();

// GET /api/courses
coursesRouter.get("/", (_req, res) => {
  res.json({ courses: listCourses() });
});

// GET /api/courses/:courseId
coursesRouter.get("/:courseId", (req, res) => {
  const { courseId } = req.params;
  res.json({ course: getCourse(courseId) });
});

// GET /api/courses/:courseId/lessons/:lessonId
coursesRouter.get("/:courseId/lessons/:lessonId", (req, res) => {
  const { courseId, lessonId } = req.params;
  res.json({ lesson: getLesson(courseId, lessonId) });
});
