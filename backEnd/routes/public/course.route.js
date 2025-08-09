const express = require("express")
const { getCoursesByCategory } = require("../../controller/public/course.controller")
const router = express.Router()

router.get("/category/:categoryId" , getCoursesByCategory)


module.exports = router