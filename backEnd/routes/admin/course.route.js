const express = require("express");

const { getAllCourses , UpdateCreateCourse , getCourseModule , createModule ,  updateModule, UpdateModuleOrder} = require("../../controller/admin/course.controller");
const router = express.Router();

router.get("/", getAllCourses);
router.post("/", UpdateCreateCourse);
router.get("/course-modules/:courseId", getCourseModule); 
router.post("/modules/:courseId", createModule);
router.put("/modules/:moduleId", updateModule);

module.exports = router;
