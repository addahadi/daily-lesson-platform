const sql = require("../../db");









async function getAllCourses(req, res, next) {
  const userId = req.auth.userId;
  try {
    const response = await sql`
      SELECT 
        EXISTS (
          SELECT 1 
          FROM course_save cs 
          JOIN folders f ON f.id = cs.folder_id  
          WHERE cs.course_id = c.id AND f.user_id = ${userId}
        ) AS is_saved,
        c.id,
        c.title,
        c.level,
        c.category,
        c.img_url,
        c.slug,
        (
          SELECT COALESCE(SUM(l.duration_minutes), 0)
          FROM modules m
          JOIN lessons l ON l.topic_id = m.id
          WHERE m.course_id = c.id AND m.is_deleted = false AND l.is_deleted = false
        ) AS total_duration
      FROM courses c
      WHERE c.is_published = TRUE;
    `;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No published courses found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Courses retrieved successfully.",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

async function getCourseBySlug(req, res, next) {
  const { slug } = req.query;
  try {
    const response = await sql`
      SELECT c.*, (
        SELECT COUNT(*) 
        FROM modules m 
        WHERE m.course_id = c.id AND m.is_deleted = false
      ) AS total
      FROM courses c
      WHERE c.slug = ${slug} AND c.is_published = TRUE;
    `;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Course not found or is not published.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Course details retrieved successfully.",
      data: response[0],
    });
  } catch (err) {
    next(err);
  }
}

async function getCourseModules(req, res, next) {
  const { courseId } = req.params;
  try {
    const response = await sql`
      SELECT title, order_index, created_at, id AS module_id
      FROM modules
      WHERE course_id = ${courseId} AND is_deleted = false
      ORDER BY order_index NULLS LAST;
    `;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No available modules found for this course.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Modules retrieved successfully.",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

async function getFilteredCourses(req, res, next) {
  try {
    const { difficulty, category } = req.query;

    const result = await sql`
      SELECT title, level, category, img_url, slug
      FROM courses
      WHERE is_published = TRUE
      ${difficulty ? sql`AND level = ${difficulty}` : sql``}
      ${category ? sql`AND category = ${category}` : sql``}
    `;

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No courses match the selected filters.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Filtered courses retrieved successfully.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function getModuleLessons(req, res, next) {
  const { moduleId } = req.params;
  try {
    const response = await sql`
      SELECT 
        title, slug AS lesson_slug, duration_minutes, level, topic_id
      FROM lessons
      WHERE topic_id = ${moduleId} AND is_deleted = false;
    `;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No lessons found for this module.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Lessons retrieved successfully.",
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllCourses,
  getCourseBySlug,
  getCourseModules,
  getModuleLessons,
  getFilteredCourses,
};
