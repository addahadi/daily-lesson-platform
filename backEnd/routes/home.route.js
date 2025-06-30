const express = require("express")
const { getEnrolledCourses, getNextLesson, getEnrolledCoursesNumber, getTotalLessons } = require("../controller/home.controller")
const router = express.Router()


router.get("/enrolled-courses/:userId",getEnrolledCourses)
router.get("/next-lessons" , getNextLesson)
router.get("/total-enrolled-courses/:userId" , getEnrolledCoursesNumber)
router.get("/total-lessons/:userId" , getTotalLessons)


module.exports = router