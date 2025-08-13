const express = require("express")
const { getCoursesByCategory, getCoursesIds, getCourseInfoBySlug, getFeaturedCourses } = require("../../controller/public/course.controller")
const router = express.Router()

router.get("/featured", getFeaturedCourses)
router.get("/category/:slug_category" , getCoursesByCategory)
router.get("/" , getCoursesIds)
router.get("/:slug", getCourseInfoBySlug)

module.exports = router