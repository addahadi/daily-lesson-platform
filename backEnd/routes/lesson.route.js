const express = require("express")
const { getLessonDetails , getLessonsDetails  , getFirstLesson , isLessonAccessible , startLesson} = require("../controller/lesson.controller")
const router = express.Router()


router.get("/get/:lessonId" , (req , res) => {
    getLessonDetails(req  , res)
})


router.get("/getfirstlesson/:courseId" , (req , res) => {
    getFirstLesson(req , res)
})


router.post("/checklesson" , (req ,res) => {
    isLessonAccessible(req ,res)
})

router.post("/startlesson" , (req ,res) => {
    startLesson(req , res)
})
router.get("/getLessons/:courseId" , (req , res) => {
    getLessonsDetails(req , res)
})

module.exports = router