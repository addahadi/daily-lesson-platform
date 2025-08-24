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
  "/enrolled-courses",
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
  "/total-enrolled-courses",
  getEnrolledCoursesNumber
);

router.get(
  "/total-lessons",
  getTotalLessons
);

router.get(
  "/streak-days",
  getDailyStreak
);

module.exports = router;
