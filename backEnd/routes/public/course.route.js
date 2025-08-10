const express = require("express")
const { getCoursesByCategory } = require("../../controller/public/course.controller")
const router = express.Router()

router.get("/category/:slug_category" , getCoursesByCategory)


module.exports = router