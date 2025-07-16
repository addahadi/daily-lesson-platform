const express = require("express");
const { getLessonStatistics, getStreaksStatistics, getUserStatistics, getChartData } = require("../../controller/admin/analytics.controller");

const router = express.Router();

router.get("/streaks", getStreaksStatistics);
router.get("/lessons", getLessonStatistics);
router.get("/users", getUserStatistics);
router.get("/charts" , getChartData)

module.exports = router;
