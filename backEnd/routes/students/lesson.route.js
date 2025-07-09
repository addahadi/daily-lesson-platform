const express = require("express")
const {
  getLessonDetails,
  getLessonsDetails,
  getFirstLesson,
  isLessonAccessible,
  startLesson,
  SubmitQuizzAnswer,
  getNextLesson,
  MarkAsComplete,
} = require("../../controller/students/lesson.controller");
const router = express.Router()


router.get("/get/" , (req , res) => {
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

router.get("/submitanswer" , (req , res) => {
    SubmitQuizzAnswer(req , res)
})


router.get(
  "/nextlesson/:courseId/:orderIndex",
  (req, res) => {
    getNextLesson(req, res);
  }
);


router.get("/getLessons" , (req , res) => {
    getLessonsDetails(req , res)
})


router.post("/markascomplete" , (req , res) => {
    MarkAsComplete(req , res)
})



module.exports = router