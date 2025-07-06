const express = require("express");
const router = express.Router();

const {
  deleteNote,
  getLessonNote,
  addNote,
  getAllNotes,
} = require("../../controller/students/note.controller");

router.get("/lesson-note/:lessonId/:userId", getLessonNote);
router.post("/add-note", addNote);
router.delete("/delete-note", deleteNote);
router.get("/all-notes", getAllNotes);
module.exports = router;
