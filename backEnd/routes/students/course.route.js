

const express = require("express")
const {
  getAllCourses,
  getCourseBySlug,
  getCourseModules,
  getFilteredCourses,
  getModuleLessons,
  getCoursesByCategory,
} = require("../../controller/students/course.controller");
const router = express.Router()


router.get("/getall" , (req , res, next) => {
    getAllCourses(req , res, next)
})

router.get("/getbyslug" , (req , res, next) => {
    console.log("yesyeys")
    getCourseBySlug(req , res, next)
})

router.get("/getmodules/:courseId" , (req , res, next) => {
    getCourseModules(req , res, next)
})

router.get("/getlessons/:moduleId" , (req , res, next) => {
    getModuleLessons(req , res, next)
})

router.get("/filtered-courses" , getFilteredCourses )



module.exports = router