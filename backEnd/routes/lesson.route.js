const express = require("express")
const { getLessonDetails } = require("../controller/lesson.controller")
const router = express.Router()


router.get("/get/:lessonId" , (req , res) => {
    getLessonDetails(req  , res)
})


router.get("/getLessons" , (req , res) => {
        
})

module.exports = router