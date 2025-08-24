const express = require("express");
const {
  getLessonDetails,
  getFirstLesson,
  startLesson,
  SubmitQuizzAnswer,
  getNextLesson,
  getLessonsDetails,
  markLessonComplete,
} = require("../../controller/students/lesson.controller");

const { validate } = require("../../middleware/validate.middleware");

const router = express.Router();


router.get("/getfirstlesson/:courseId", getFirstLesson);

router.post(
  "/start-lesson",
  validate(
    {
      enrollmentId: "string",
      moduleId: "string",
      lessonId: "string",
    },
    "body"
  ),
  startLesson
);

router.post(
  "/answer-submit",
  validate(
    {
      quizz_id: "string",
      lesson_id: "string", // slug
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
    },
    "body"
  ),
  markLessonComplete
);

router.get(
  "/:lessonSlug/:moduleId",
  validate({ lessonSlug: "string" , moduleId : "string"}, "params"),
  getLessonDetails
);

module.exports = router;
