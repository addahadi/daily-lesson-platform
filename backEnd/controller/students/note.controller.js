const sql = require("../../db");

async function deleteNote(req, res, next) {
  try {
    const { lessonId } = req.params;
    const userId = req.auth.userId
    const deletedNote = await sql`
      DELETE FROM notes 
      WHERE user_id = ${userId} AND lesson_slug = ${lessonId}
      RETURNING id
    `;

    if(deletedNote.length === 0){
      return res.status(404).json({
        status : false , 
        message : "failed to delete the note"
      })
    }

    res
      .status(200)
      .json({ status: true, message: "Note deleted successfully" });
  } catch (err) {
    next(err);
  }
}

async function addNote(req, res, next) {
  try {
    const { title, content, lessonId } = req.body;
    const userId = req.auth.userId;

    const note = await sql`
      INSERT INTO notes (title, content, lesson_slug, user_id)
      VALUES (${title}, ${content}, ${lessonId}, ${userId})
      ON CONFLICT (user_id, lesson_slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        updated_at = now()
      RETURNING id
    `;

    if (note.length === 0) {
      return res.status(500).json({
        status: false,
        message: "Failed to insert or update note",
      });
    }

    res.status(200).json({
      status: true,
      message: "Note saved successfully",
    });
  } catch (err) {
    next(err);
  }
}

async function getLessonNote(req, res, next) {
  try {
    const { lessonId } = req.params;
    const userId = req.auth.userId;

    const result = await sql`
      SELECT content, title 
      FROM notes
      WHERE user_id = ${userId} AND lesson_slug = ${lessonId}
    `;

    if (result.length === 0) {
      return res.status(200).json({
        status: false,
        data: { title: "", content: "" },
        message: "No note found for this lesson",
      });
    }

    res.status(200).json({
      status: true,
      data: result[0],
    });
  } catch (err) {
    next(err);
  }
}

async function getAllNotes(req, res, next) {
  try {
    const {page = 1 } = req.query;
    const userId = req.auth.userId
    const pageSize = 1;
    const offset = (page - 1) * pageSize;

    const notes = await sql`
      SELECT 
        n.content, 
        n.title AS note_title, 
        l.title AS lesson_title, 
        n.created_at, 
        l.topic_id, 
        l.slug AS lesson_slug,
        (SELECT slug FROM courses WHERE courses.id = m.course_id) AS course_slug
      FROM notes n
      JOIN lessons l ON n.lesson_slug = l.slug
      JOIN modules m ON m.id = l.topic_id
      WHERE n.user_id = ${userId}
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    if (notes.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No notes found",
        data: [],
      });
    }

    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count 
      FROM notes
      WHERE user_id = ${userId}
    `;

    const totalPages = Math.ceil(count / pageSize);
    const isFinalPage = page >= totalPages;

    res.status(200).json({
      status: true,
      data: notes,
      final: !isFinalPage,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { deleteNote, addNote, getLessonNote, getAllNotes };
