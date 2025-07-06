const express = require("express")
const { getEnrolledCourses, getNextLesson, getEnrolledCoursesNumber, getTotalLessons, getDailyStreak } = require("../controller/home.controller")
const router = express.Router()


router.get("/enrolled-courses/:userId",getEnrolledCourses)
router.get("/next-lessons" , getNextLesson)
router.get("/total-enrolled-courses/:userId" , getEnrolledCoursesNumber)
router.get("/total-lessons/:userId" , getTotalLessons)
router.get("/streak-days/:userId" , getDailyStreak)

module.exports = router