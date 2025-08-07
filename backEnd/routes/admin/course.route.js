const express = require("express");

const { getAllCourses , UpdateCreateCourse , getCourseModule , createModule ,  updateModule, UpdateModuleOrder, softDeleteModule, ToggleCourseView} = require("../../controller/admin/course.controller");
const router = express.Router();

router.get("/", getAllCourses);
router.post("/", UpdateCreateCourse);
router.patch("/:courseId", ToggleCourseView);
router.get("/course-modules/:courseId", getCourseModule); 
router.post("/modules/:courseId", createModule);
router.post("/module-order/:courseId",UpdateModuleOrder)
router.put("/modules/:moduleId", updateModule);
router.delete("/modules/:moduleId" , softDeleteModule)
module.exports = router;
