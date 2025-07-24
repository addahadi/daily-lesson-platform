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
  title: "string",
  content: "string",
  lessonId: "string", // slug
  userId: "string",
};

const lessonNoteParamsSchema = {
  lessonId: "string",
  userId: "string",
};

const getAllNotesQuerySchema = {
  userId: "string",
  page: "number",
};

const deleteNoteSchema = {
  userId: "string",
  lessonId: "string",
};

router.get(
  "/lesson-note/:lessonId/:userId",
  validate(lessonNoteParamsSchema, "params"),
  getLessonNote
);

router.post("/add-note", validate(addNoteSchema, "body"), addNote);

router.get(
  "/all-notes",
  validate(getAllNotesQuerySchema, "query"),
  getAllNotes
);

router.delete("/delete-note", validate(deleteNoteSchema, "query"), deleteNote);

module.exports = router;
