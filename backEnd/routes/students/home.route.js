const express = require("express");
const {
  getEnrolledCourses,
  getNextLesson,
  getEnrolledCoursesNumber,
  getTotalLessons,
  getDailyStreak,
} = require("../../controller/students/home.controller");

const { validate } = require("../../middleware/validate.middleware");

const router = express.Router();

router.get(
  "/enrolled-courses/:userId",
  validate({ userId: "string" }, "params"),
  getEnrolledCourses
);

router.get(
  "/next-lessons",
  validate(
    {
      courseId: "string", 
      enrollmentId: "string",
    },
    "query"
  ),
  getNextLesson
);

router.get(
  "/total-enrolled-courses/:userId",
  validate({ userId: "string" }, "params"),
  getEnrolledCoursesNumber
);

router.get(
  "/total-lessons/:userId",
  validate({ userId: "string" }, "params"),
  getTotalLessons
);

router.get(
  "/streak-days/:userId",
  validate({ userId: "string" }, "params"),
  getDailyStreak
);

module.exports = router;
