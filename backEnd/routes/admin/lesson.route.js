const express = require('express');
const { getAllLessons, updateOrderLesson, updateLesson, createUpdateLesson, updateLessonContent, updateOrAddLessonQuizz } = require('../../controller/admin/lesson.controller');



const router = express.Router()

router.get("/:moduleId" , getAllLessons);
router.post("/:moduleId", createUpdateLesson);
router.put("/order/:moduleId" , updateOrderLesson)
router.put("/:lessonId" , updateLesson);
router.put("/content/:lessonId" , updateLessonContent)
router.put("/quizz/:lessonId" , updateOrAddLessonQuizz)

module.exports = router;