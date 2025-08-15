const express = require("express");
const router = express.Router();
const {
  SignUp,
  enrollToCourse,
  getEnroll,
  getUserInfo,
  getUserAchievments,
  checkEnroll,
} = require("../../controller/students/auth.controller");

const { getXpLogs } = require("../../controller/students/xp.controller");
const { validate } = require("../../middleware/validate.middleware");

router.post("/signup", SignUp);

router.post(
  "/enroll",
  validate({ courseId: "string" }, "body"),
  enrollToCourse
);

router.get(
  "/is-enroll",
  validate({ courseSlug: "string"}, "query"),
  checkEnroll
);

router.get(
  "/getenroll",
  validate({ courseId: "string", userId: "string" }, "query"),
  getEnroll
);

router.get(
  "/user-info",
  getUserInfo
);

router.get(
  "/user-achievements/",
  getUserAchievments
);

router.get(
  "/xp-logs",
  getXpLogs
);

module.exports = router;
