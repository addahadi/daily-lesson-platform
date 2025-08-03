const express = require("express");
const {
  getLessonDetails,
  getFirstLesson,
  isLessonAccessible,
  startLesson,
  SubmitQuizzAnswer,
  getNextLesson,
  MarkAsComplete,
  getLessonsDetails
} = require("../../controller/students/lesson.controller");

const { validate } = require("../../middleware/validate.middleware");

const router = express.Router();


router.get("/getfirstlesson/:courseId", getFirstLesson);

router.post(
  "/is-lesson",
  validate(
    {
      userId: "string",
      courseId: "string",
      moduleId: "string",
    },
    "body"
  ),
  isLessonAccessible
);

router.post(
  "/start-lesson",
  validate(
    {
      enrollmentId: "string",
      moduleId: "string",
      lessonId: "string", // it's slug
    },
    "body"
  ),
  startLesson
);

router.post(
  "/answer-submit",
  validate(
    {
      quizz_id: "number",
      lesson_id: "string", // slug
      user_id: "string",
      selected_option: "number",
      correct: "boolean",
      module_id: "string",
    },
    "query"
  ),
  SubmitQuizzAnswer
);

router.get("/next-lesson/:moduleId/:orderIndex", getNextLesson);

router.get(
  "/all-lessons",
  validate({ courseId: "string", enrollmentId: "string" }, "query"),
  getLessonsDetails
);

router.post(
  "/completed",
  validate(
    {
      lessonSlug: "string",
      enrollmentId: "string",
      moduleId: "string",
      userId: "string",
    },
    "body"
  ),
  MarkAsComplete
);

router.get(
  "/:lessonSlug/:moduleId",
  validate({ lessonSlug: "string" , moduleId : "string"}, "params"),
  getLessonDetails
);

module.exports = router;
