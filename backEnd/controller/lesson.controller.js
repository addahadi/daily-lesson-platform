
const { response } = require("express");
const sql = require("../db")

async function getLessonDetails(req , res){
    const { lessonId } = req.params;
    
    try {
      console.log(lessonId)
        const response = await sql`SELECT 
          l.id AS lesson_id, 
          l.title, 
          l.content, 
          l.duration_minutes, 
          l.level, 
          l.order_index, 
          l.slug AS lesson_slug,
          q.question, 
          q.options, 
          q.correct_option_index
        FROM lessons l
        LEFT JOIN quizzes q ON l.id = q.lesson_id
        WHERE l.slug = ${lessonId};

        `;
        const result = {
            status : true,
            data : response
          }
          res.status(200).json(result)
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error : err.message})
    }

    
}


async function getLessonsDetails(req , res) {
  try {
    const { courseId } = req.params;

    const courseResponse = await sql`
      SELECT  id , slug , title 
      FROM courses 
      WHERE slug = ${courseId}
    `;

    if (courseResponse.length === 0) {
      return res.status(404).json({
        status: false,
        error: "Course not found",
      });
    }

    const course = courseResponse[0];

    const modulesResponse = await sql`
      SELECT id, title, order_index 
      FROM modules 
      WHERE course_id = ${course.id} 
      ORDER BY order_index
    `;

    if (modulesResponse.length === 0) {
      return res.status(200).json({
        status: true,
        data: {
          course,
          modules: [],
        },
      });
    }

    const moduleIds = modulesResponse.map((module) => module.id);
    const lessonsResponse = await sql`
      SELECT id, title, order_index, slug, topic_id
      FROM lessons 
      WHERE topic_id = ANY(${moduleIds})
      ORDER BY topic_id, order_index
    `;

    const structuredModules = modulesResponse.map((module) => ({
      module_id: module.id,
      title: module.title,
      order_index: module.order_index,
      lessons: lessonsResponse
        .filter((lesson) => lesson.topic_id === module.id)
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          order_index: lesson.order_index,
          slug: lesson.slug,
        })),
    }));

    const result = {
      status: true,
      data: {
        course,
        modules: structuredModules,
      },
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
}



async function getFirstLesson(req , res){
  const {courseId} = req.params
  
  try {
    const response = await sql`SELECT l.slug as lesson_id, m.id as module_id 
    FROM courses c 
    JOIN modules m ON c.id = m.course_id 
    JOIN lessons l ON m.id = l.topic_id 
    WHERE c.slug = ${courseId} 
    AND m.order_index = 1 
    AND l.order_index = 1`;
    res.status(200).json(response);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }

}

async function isLessonAccessible(req, res) {
  const { userId, courseId, moduleId } = req.body;

  try {
    const courseResponse = await sql`
      SELECT  id , slug , title 
      FROM courses 
      WHERE slug = ${courseId}
    `;

    if (courseResponse.length === 0) {
      return res.status(404).json({
        status: false,
        error: "Course not found",
      });
    }

    const course = courseResponse[0];

    const response = await sql`
      SELECT EXISTS (
        SELECT 1 FROM module_progress mp
        JOIN enrollments e ON mp.enrollment_id = e.id
        WHERE e.user_id = ${userId}
        AND e.course_id = ${course.id}
        AND mp.module_id = (
          SELECT id
          FROM modules
          WHERE modules.course_id = ${course.id}
          AND order_index = (
            SELECT order_index - 1
            FROM modules
            WHERE id = ${moduleId}
          )
        )
        AND mp.progress = 100
      ) OR (
        SELECT order_index FROM modules WHERE id = ${moduleId}
      ) = 1 as is_accessible`;

    console.log(response);
    res.status(200).json({
      isAccessible: response[0].is_accessible,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
}


async function startLesson(req, res) {
  const { enrollmentId, moduleId, lessonId: lessonSlug } = req.body;

  try {
 
    const lessonResult = await sql`
      SELECT id FROM lessons 
      WHERE slug = ${lessonSlug} AND topic_id = ${moduleId}
    `;

    if (lessonResult.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Lesson not found",
      });
    }

    const lessonId = lessonResult[0].id;

    await sql`
      INSERT INTO module_progress (enrollment_id, module_id, started_at, progress)
      VALUES (${enrollmentId}, ${moduleId}, NOW(), 0)
      ON CONFLICT (enrollment_id, module_id) DO NOTHING
    `;

    await sql`
      INSERT INTO lesson_progress (enrollment_id, module_id, lesson_id, completed)
      VALUES (${enrollmentId}, ${moduleId}, ${lessonId}, false)
      ON CONFLICT (enrollment_id, module_id, lesson_id) DO NOTHING
    `;

    res.status(200).json({
      status: true,
      message: "successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}



module.exports = {getLessonDetails , getLessonsDetails , getFirstLesson , isLessonAccessible , startLesson}