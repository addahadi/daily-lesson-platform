const sql = require("../../db");

async function getEnrolledCourses(req, res, next) {
  const { userId } = req.params;
  try {
    const response = await sql`
      SELECT c.title, c.id course_id , e.id as enrollment_id , count(c.id) as total_courses
      FROM courses c
      JOIN enrollments e ON e.course_id = c.id
      WHERE e.user_id = ${userId} AND c.is_published = TRUE
      GROUP BY c.title , c.id , e.id`;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No enrolled courses found.",
      });
    }

    res.status(200).json({
      status: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

async function getEnrolledCoursesNumber(req, res, next) {
  const { userId } = req.params;
  try {
    const totalCourses = await sql`
      SELECT COUNT(*) AS total_courses
      FROM enrollments
      WHERE user_id = ${userId};
    `;

    res.status(200).json({
      status: true,
      data: totalCourses,
    });
  } catch (err) {
    next(err);
  }
}

async function getTotalLessons(req, res, next) {
  try {
    const { userId } = req.params;

    const result = await sql`
      SELECT 
        (SELECT COUNT(*) 
         FROM modules m
         JOIN lessons l ON m.id = l.topic_id AND l.is_deleted = false
         WHERE m.course_id IN (
           SELECT course_id FROM enrollments WHERE user_id = ${userId}
         )) AS total_lessons AND m.is_deleted = false ,  

        (SELECT COUNT(*) 
         FROM lesson_progress lp
         WHERE lp.completed = true
           AND lp.enrollment_id IN (
             SELECT id FROM enrollments WHERE user_id = ${userId}
           )) AS completed_lessons;
    `;

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Progress data not found.",
      });
    }

    res.status(200).json({
      status: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function getDailyStreak(req, res, next) {
  const { userId } = req.params;
  try {
    const user = await sql`
      SELECT streak_count , last_study_date
      FROM users WHERE users.clerk_id = ${userId}`;

    if (user.length === 0) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

async function getNextLesson(req, res, next) {
  const { courseId, enrollmentId } = req.query;
  try {
    const lessons = await sql`
      SELECT 
        l.duration_minutes, 
        l.level, 
        l.topic_id AS module_id, 
        l.id AS lesson_id, 
        l.slug
      FROM lessons l
      JOIN modules m ON l.topic_id = m.id AND m.is_deleted = false
      LEFT JOIN lesson_progress lp 
        ON l.id = lp.lesson_id AND lp.enrollment_id = ${enrollmentId}
      WHERE 
        m.course_id = ${courseId}
        AND l.is_deleted = false
        AND (lp.completed IS NULL OR lp.completed = false)
      ORDER BY m.order_index, l.order_index
      LIMIT 1;
    `;

    const progress = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE m.is_deleted = false) AS total_modules,
        COUNT(mp.id) AS total_progressed_modules
      FROM modules m
      LEFT JOIN module_progress mp 
        ON mp.module_id = m.id AND mp.enrollment_id = ${enrollmentId}
      WHERE m.course_id = ${courseId};
    `;

    if (lessons.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No available lessons found.",
      });
    }

    const { total_modules, total_progressed_modules } = progress[0];
    const progressPercentage =
      total_modules > 0
        ? Math.round((total_progressed_modules / total_modules) * 100)
        : 0;

    const response = {
      lesson: lessons[0],
      progressPercentage,
      total_modules,
      total_progressed_modules,
    };

    res.status(200).json({
      status: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEnrolledCourses,
  getNextLesson,
  getEnrolledCoursesNumber,
  getTotalLessons,
  getDailyStreak,
};
