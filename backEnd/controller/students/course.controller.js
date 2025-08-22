const sql = require("../../db");









async function getAllCourses(req, res, next) {
  const userId = req.auth.userId;
  const page = req.query.page || 1;
  const limit = 1;
  const offset = (page - 1) * limit;
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
        ) AS total_duration,
        e.completed as completed_course
      FROM courses c
      LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = ${userId}
      WHERE c.is_published = TRUE
      LIMIT ${limit} OFFSET ${offset};
    `;
    
    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No published courses found.",
      });
    }
    
    const [{total_courses}] = await sql`
    SELECT COUNT(*) AS total_courses
    FROM courses
      WHERE is_published = TRUE;
    `;
    
    console.log(response)
    const totalPages = Math.ceil(total_courses / limit); 
    const isFinalPage = page >= totalPages;    
    return res.status(200).json({
      status: true,
      message: "Courses retrieved successfully.",
      data: response,
      final : !isFinalPage
    });
  } catch (err) {
    next(err);
  }
}

async function getCourseBySlug(req, res, next) {
  const { slug } = req.query;
  try {
    const response = await sql`
      SELECT 
          c.id,
          c.title,
          c.level,
          c.category,
          c.img_url,
          c.slug,
          c.content,
          c.description,
          (
            SELECT COALESCE(COUNT(m.id), 0)
            FROM modules m
            WHERE m.course_id = c.id AND m.is_deleted = false
          ) AS total_modules,
          (
            SELECT COALESCE(SUM(l.duration_minutes), 0)
            FROM modules m
            JOIN lessons l ON l.topic_id = m.id
            WHERE m.course_id = c.id AND m.is_deleted = false AND l.is_deleted = false
          ) AS total_duration
        FROM courses c
        WHERE c.is_published = TRUE AND c.slug = ${slug};
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
  const { difficulty, category, search } = req.query;
  const userId = req.auth.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = 1;
  const offset = (page - 1) * limit;

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
      WHERE c.is_published = TRUE
      ${difficulty ? sql`AND c.level = ${difficulty}` : sql``}
      ${category ? sql`AND c.category = ${category}` : sql``}
      ${search ? sql`AND c.title ILIKE ${"%" + search + "%"}` : sql``}
      ORDER BY c.id DESC
      LIMIT ${limit} OFFSET ${offset};
    `;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No courses match the selected filters.",
      });
    }

    const [{ total_courses }] = await sql`
      SELECT COUNT(*) AS total_courses
      FROM courses c
      WHERE c.is_published = TRUE
      ${difficulty ? sql`AND c.level = ${difficulty}` : sql``}
      ${category ? sql`AND c.category = ${category}` : sql``}
      ${search ? sql`AND c.title ILIKE ${"%" + search + "%"}` : sql``}
    `;

    const totalPages = Math.ceil(total_courses / limit);
    const isFinalPage = page >= totalPages;

    return res.status(200).json({
      status: true,
      message: "Filtered courses retrieved successfully.",
      data: response,
      final: !isFinalPage,
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
