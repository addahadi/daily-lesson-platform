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
const { validate } = require("../../middleware/validate");

router.post("/signup", SignUp);

router.post(
  "/enroll",
  validate({ courseId: "string" }, "body"),
  enrollToCourse
);

router.get(
  "/is-enroll",
  validate({ courseId: "string", userId: "string" }, "query"),
  checkEnroll
);

router.get(
  "/getenroll",
  validate({ courseId: "string", userId: "string" }, "query"),
  getEnroll
);

router.get(
  "/user-info/:userId",
  validate({ userId: "string" }, "params"),
  getUserInfo
);

router.get(
  "/user-achievements/:userId",
  validate({ userId: "string" }, "params"),
  getUserAchievments
);

router.get(
  "/xp-logs/:userId",
  validate({ userId: "string" }, "params"),
  getXpLogs
);

module.exports = router;
