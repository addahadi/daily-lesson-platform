

const express = require("express")
const {
  getAllCourses,
  getCourseBySlug,
  getCourseModules,
  getFilteredCourses,
  getModuleLessons,
} = require("../../controller/students/course.controller");
const router = express.Router()


router.get("/getall" , (req , res) => {
    getAllCourses(req , res)    
})

router.get("/getbyslug" , (req , res) => {
    console.log("yesyeys")
    getCourseBySlug(req , res)
})

router.get("/getmodules/:courseId" , (req , res) => {
    getCourseModules(req , res)
})

router.get("/getlessons/:moduleId" , (req , res) => {
    getModuleLessons(req , res)
})

router.get("/filtered-courses" , getFilteredCourses )

module.exports = router