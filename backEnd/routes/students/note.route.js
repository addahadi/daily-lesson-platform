const express = require("express");
const router = express.Router();

const {
  deleteNote,
  getLessonNote,
  addNote,
  getAllNotes,
} = require("../../controller/students/note.controller");

const { validate } = require("../../middleware/validate.middleware");

const addNoteSchema = {
  content: "string",
  lessonId: "string", // slug
};

const lessonNoteParamsSchema = {
  lessonId: "string",
};

const getAllNotesQuerySchema = {
  page: "number",
};

const deleteNoteSchema = {
  lessonId: "string",
};

router.get(
  "/lesson-note/:lessonId",
  validate(lessonNoteParamsSchema, "params"),
  getLessonNote
);

router.post("/add-note", validate(addNoteSchema, "body"), addNote);

router.get(
  "/all-notes",
  validate(getAllNotesQuerySchema, "query"),
  getAllNotes
);

router.delete("/delete-note/:lessonId", validate(deleteNoteSchema, "params"), deleteNote);

module.exports = router;
