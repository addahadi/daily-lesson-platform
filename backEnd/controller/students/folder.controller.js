const sql = require("../../db"); 

const createFolder = async (req, res , next) => {
  const { title } = req.body;
  const userId = req.auth.userId;


  try {
    const [folder] = await sql`
      INSERT INTO folders (user_id, title)
      VALUES (${userId}, ${title})
      RETURNING *
    `;
    res.status(200).json({ status: true, data: folder });
  } catch (err) {
    next(err)
  }
};

const deleteFolder = async (req, res , next) => {
  const { folderId } = req.params;
  const userId = req.auth.userId;


  try {
    const [deleted] = await sql`
      DELETE FROM folders
      WHERE id = ${folderId} AND user_id = ${userId}
      RETURNING *
    `;

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Folder not found or unauthorized" });
    }

    res.status(200).json({ status: true, message: "Folder deleted" });
  } catch (err) {
    next(err)
  }
};


const saveCourseToFolder = async (req, res , next) => {
  const { course_id, folder_id } = req.body;
  const userId = req.auth.userId;


  try {
    const [folder] = await sql`
      SELECT id FROM folders WHERE id = ${folder_id} AND user_id = ${userId}
    `;
    if (!folder) {
      return res.status(403).json({ error: "Unauthorized folder access" });
    }

    const [saved] = await sql`
      INSERT INTO course_save (course_id, folder_id)
      VALUES (${course_id}, ${folder_id})
      RETURNING *
    `;
    if(saved.length === 0){
      return res.status(404).json({
        status : false , 
        message : "failed to save the course"
      })
    }
    res.status(200).json({ status: true, data: saved });
  } catch (err) {
    next(err)
  }
};

const deleteSavedCourse = async (req, res , next) => {
  const { folder_id , course_id } = req.params;
  const userId = req.auth.userId;


  try {
    const [deleted] = await sql`
      DELETE FROM course_save
      WHERE course_id = ${course_id} AND folder_id = ${folder_id}
      AND folder_id IN (
        SELECT id FROM folders WHERE user_id = ${userId}
      )
      RETURNING *
    `;

    if (!deleted) {
      return res.status(404).json({ error: "Save not found or unauthorized" });
    }

    res.status(200).json({ status: true, message: "Course unsaved" });
  } catch (err) {
    next(err)
  }
};



const getAllFolders = async (req, res) => {
  const userId = req.auth.userId;

 
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const folders = await sql`
      SELECT id, title, created_at
      FROM folders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;
    const [{ count }] = await sql`
      SELECT COUNT(*)::int
      FROM folders
      WHERE user_id = ${userId}
    `;
    if(folders.length === 0){
      return res.status(404).json({
        status: false,
        message: "no folders for the user",
      });
    }
    return res.status(200).json({
      status: true,
      data: folders,
      total: count,
    });
  } catch (err) {
    console.error("Get folders error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getCoursesInFolder = async (req, res) => {
  const { folderId } = req.params;
  const userId = req.auth.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {

    const [folder] = await sql`
      SELECT id FROM folders WHERE id = ${folderId} AND user_id = ${userId}
    `;

    if (!folder) {
      return res
        .status(403)
        .json({ error: "Folder not found or unauthorized" });
    }

    const savedCourses = await sql`
      SELECT 
        cs.id AS save_id,
        c.id,
        c.title,
        c.category,
        c.slug,
        c.level,
        c.img_url,
        (
          SELECT COALESCE(SUM(l.duration_minutes), 0)
          FROM modules m
          JOIN lessons l ON l.topic_id = m.id
          WHERE m.course_id = c.id
        ) AS total_duration
      FROM course_save cs
      JOIN courses c ON c.id = cs.course_id
      WHERE cs.folder_id = ${folderId}
      ORDER BY cs.saved_at DESC
    `;

    if(savedCourses.length === 0 ){
      return res.status(404).json({
        status : false , 
        message : "no saved courses found "
      })
    }

    
    res.status(200).json({
      status: true,
      data: savedCourses,
    });
  } catch (err) {
    console.error("Get saved courses error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  deleteSavedCourse,
  createFolder,
  saveCourseToFolder,
  deleteFolder,
  getAllFolders,
  getCoursesInFolder,
};