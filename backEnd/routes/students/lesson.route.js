const express = require("express");
const {
  getLessonDetails,
  getLessonsDetails,
  getFirstLesson,
  isLessonAccessible,
  startLesson,
  SubmitQuizzAnswer,
  getNextLesson,
  MarkAsComplete,
} = require("../../controller/students/lesson.controller");

const { validate } = require("../../middleware/validate");

const router = express.Router();

router.get(
  "/get",
  validate({ lessonId: "string", userId: "string" }, "query"),
  getLessonDetails
);

router.get("/getfirstlesson/:courseId", getFirstLesson);

router.post(
  "/checklesson",
  validate(
    {
      userId: "string",
      courseId: "string",
      moduleId: "number",
    },
    "body"
  ),
  isLessonAccessible
);

router.post(
  "/startlesson",
  validate(
    {
      enrollmentId: "number",
      moduleId: "number",
      lessonId: "string", // it's slug
    },
    "body"
  ),
  startLesson
);

router.get(
  "/submitanswer",
  validate(
    {
      quizz_id: "number",
      lesson_id: "string", // slug
      user_id: "string",
      selected_option: "number",
      correct: "boolean",
      module_id: "number",
    },
    "query"
  ),
  SubmitQuizzAnswer
);

router.get("/nextlesson/:courseId/:orderIndex", getNextLesson);

router.get(
  "/getLessons",
  validate({ courseId: "string", enrollmentId: "number" }, "query"),
  getLessonsDetails
);

router.post(
  "/markascomplete",
  validate(
    {
      lessonSlug: "string",
      enrollmentId: "number",
      moduleId: "number",
      userId: "string",
    },
    "body"
  ),
  MarkAsComplete
);

module.exports = router;
