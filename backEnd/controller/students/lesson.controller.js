const sql = require("../../db");
const { addXp, checkAchievements } = require("./xp.controller");



async function getLessonDetails(req, res, next) {
  const {lessonSlug} = req.params;
  const userId = req.auth.userId
  try {
    const lessons = await sql`
      SELECT 
        l.id AS lesson_id, 
        l.title, 
        l.content, 
        l.duration_minutes, 
        l.level, 
        l.order_index, 
        l.slug AS lesson_slug,
        q.id AS quizz_id,
        q.question, 
        q.options, 
        q.correct_option_index,
        a.id AS answer_id,
        a.selected_option_index,
        a.is_correct
      FROM lessons l
      LEFT JOIN quizzes q ON l.id = q.lesson_id
      LEFT JOIN quiz_answers a ON a.quiz_id = q.id AND a.user_id = ${userId} 
      WHERE l.slug = ${lessonSlug};
    `;
    if (lessons.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Lesson not found." });
    }
    if(lessons[0].order_index === 1){
      return res.status(200).json({ success: true, 
        data: {
          ...lessons[0],
          previous:false,
          next:true
        }
      });
    }
    const LastLesson
    res.status(200).json({ success: true, data: lessons });
  } catch (err) {
    next(err);
  }
}

async function getLessonsDetails(req, res, next) {
  try {
    console.log("Hit")
    const { courseId : Courseslug, enrollmentId } = req.query;
    
    const courseResponse = await sql`
      SELECT id, slug, title FROM courses WHERE slug = ${Courseslug}
    `;
    console.log(courseResponse)
    if (courseResponse.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Course not found." });
    }

    const course = courseResponse[0];
    const modulesResponse = await sql`
      SELECT id, title, order_index FROM modules WHERE course_id = ${course.id} ORDER BY order_index
    `;

    const moduleIds = modulesResponse.map((module) => module.id);

    const lessonsResponse = await sql`
      SELECT 
        l.id, 
        l.title, 
        l.order_index, 
        l.slug, 
        l.topic_id,
        COALESCE(p.completed, false) AS completed
      FROM lessons l
      LEFT JOIN lesson_progress p ON (l.id = p.lesson_id AND p.enrollment_id = ${enrollmentId})
      WHERE l.topic_id = ANY(${moduleIds})
      ORDER BY l.topic_id, l.order_index
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
          completed: lesson.completed,
        })),
    }));

    res
      .status(200)
      .json({ status: true, data: { course, modules: structuredModules } });
  } catch (err) {
    next(err);
  }
}

async function getFirstLesson(client , courseId ,  res) {

    const firstLesson = await client`
      SELECT l.slug AS lesson_id, m.id AS module_id
      FROM courses c
      JOIN modules m ON c.id = m.course_id
      JOIN lessons l ON m.id = l.topic_id
      WHERE c.id = ${courseId} AND m.order_index = 1 AND l.order_index = 1
    `;
    if (firstLesson.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Lesson was not found" });
    }
    res.status(200).json({ 
      status: true, 
      data: firstLesson[0], 
      action : "start the first lesson"
    });
}

async function isLessonAccessible(req, res, next) {
  const { userId, courseId, moduleId } = req.body;
  try {
    const courseResponse = await sql`
      SELECT id, slug, title FROM courses WHERE slug = ${courseId}
    `;
    if (courseResponse.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Course not found." });
    }

    const course = courseResponse[0];
    const accessCheck = await sql`
      SELECT EXISTS (
        SELECT 1 FROM module_progress mp
        JOIN enrollments e ON mp.enrollment_id = e.id
        WHERE e.user_id = ${userId}
          AND e.course_id = ${course.id}
          AND mp.module_id = (
            SELECT id FROM modules
            WHERE modules.course_id = ${course.id}
              AND order_index = (
                SELECT order_index - 1 FROM modules WHERE id = ${moduleId}
              )
          )
          AND mp.progress = 100
      ) OR (
        SELECT order_index FROM modules WHERE id = ${moduleId}
      ) = 1 AS is_accessible
    `;
    res.status(200).json({ isAccessible: accessCheck[0].is_accessible });
  } catch (err) {
    next(err);
  }
}

async function startLesson(req, res, next) {
  const { enrollmentId, moduleId, lessonId: lessonSlug } = req.body;
  try {
    const lessonResult = await sql`
      SELECT id FROM lessons WHERE slug = ${lessonSlug} AND topic_id = ${moduleId}
    `;
    if (lessonResult.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Lesson not found." });
    }

    const lessonId = lessonResult[0].id;
    await sql.begin(async (client) => {
      await client`
        INSERT INTO module_progress (enrollment_id, module_id, started_at, progress)
        VALUES (${enrollmentId}, ${moduleId}, NOW(), 0)
        ON CONFLICT (enrollment_id, module_id) DO NOTHING
      `;

      const existingProgress = await client`
        SELECT completed FROM lesson_progress
        WHERE enrollment_id = ${enrollmentId} AND module_id = ${moduleId} AND lesson_id = ${lessonId}
      `;

      let isCompleted =
        existingProgress.length > 0 ? existingProgress[0].completed : false;

      if (existingProgress.length === 0) {
        await client`
          INSERT INTO lesson_progress (enrollment_id, module_id, lesson_id, completed)
          VALUES (${enrollmentId}, ${moduleId}, ${lessonId}, false)
        `;
      }

      res.status(200).json({
        status: true,
        message: "Lesson progress initialized successfully.",
        completed: isCompleted,
      });
    });
  } catch (err) {
    next(err);
  }
}

async function SubmitQuizzAnswer(req, res, next) {
  try {
    await sql.begin(async (client) => {
      const {
        quizz_id,
        lesson_id,
        user_id,
        selected_option,
        correct,
        module_id,
      } = req.query;

      if (
        !quizz_id ||
        !lesson_id ||
        !user_id ||
        selected_option == null ||
        correct == null ||
        !module_id
      ) {
        return res
          .status(400)
          .json({ status: false, message: "Missing required fields." });
      }

      const isCorrect = correct === "true" || correct === true;

      const lessonResult = await client`
        SELECT id FROM lessons WHERE slug = ${lesson_id} AND topic_id = ${module_id}
      `;
      if (lessonResult.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "Lesson not found." });
      }

      const lessonId = lessonResult[0].id;

      await client`
        INSERT INTO quiz_answers (quiz_id, lesson_id, user_id, selected_option_index, is_correct)
        VALUES (${quizz_id}, ${lessonId}, ${user_id}, ${selected_option}, ${isCorrect})
        ON CONFLICT (quiz_id, lesson_id, user_id) DO NOTHING
      `;

      if (isCorrect) {
        const xp = 50;
        const source = "quizz_completed";
        await addXp(client, source, user_id, parseInt(xp));
      }

      res
        .status(200)
        .json({ status: true, message: "Quiz answer recorded successfully." });
    });
  } catch (err) {
    next(err);
  }
}

async function getNextLesson(req, res, next) {
  try {
    const { orderIndex, courseId } = req.params;
    const courseSlug = await sql`
      SELECT id as course_id FROM courses WHERE slug = ${courseId}
    `;
    const nextLesson = await sql`
      SELECT slug, topic_id FROM lessons WHERE order_index = ${orderIndex} AND topic_id IN (
        SELECT id FROM modules WHERE course_id = ${courseSlug[0].course_id}
      )
    `;
    res.status(200).json({ status: true, result: nextLesson });
  } catch (err) {
    next(err);
  }
}

async function MarkAsComplete(req, res, next) {
  const { lessonSlug, enrollmentId, moduleId, userId } = req.body;
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const xp = 10;
  const source = "lesson_complete";

  try {
    await sql.begin(async (client) => {
      const lessonResult = await client`
        SELECT id FROM lessons WHERE slug = ${lessonSlug} AND topic_id = ${moduleId}
      `;
      if (lessonResult.length === 0) {
        return res
          .status(404)
          .json({ status: false, message: "Lesson not found." });
      }

      const lessonId = lessonResult[0].id;

      const solved = await client`
        SELECT EXISTS (SELECT 1 FROM quiz_answers WHERE lesson_id = ${lessonId}) AS exists
      `;
      if (!solved[0].exists) {
        return res.json({
          success: false,
          message:
            "Please complete the quiz before marking the lesson as complete.",
        });
      }

      const updateResult = await client`
        UPDATE lesson_progress SET completed = TRUE, completed_at = NOW()
        WHERE enrollment_id = ${enrollmentId} AND lesson_id = ${lessonId}
      `;
      if (updateResult.count === 0) {
        return res.status(404).json({
          success: false,
          message: "Lesson progress entry not found.",
        });
      }

      const totalLessons = await client`
        SELECT COUNT(*) AS count FROM lessons WHERE topic_id = ${moduleId}
      `;
      const completedLessons = await client`
        SELECT COUNT(*) AS count FROM lesson_progress
        WHERE completed = TRUE AND enrollment_id = ${enrollmentId} AND lesson_id IN (
          SELECT id FROM lessons WHERE topic_id = ${moduleId}
        )
      `;
      const progress = Math.round(
        (completedLessons[0].count / totalLessons[0].count) * 100
      );

      await client`
        UPDATE module_progress SET progress = ${progress}
        WHERE enrollment_id = ${enrollmentId} AND module_id = ${moduleId}
      `;

      await client`
        UPDATE users SET
          streak_count = CASE WHEN last_study_date = ${yesterday} THEN streak_count + 1 ELSE 1 END,
          last_study_date = ${today}
        WHERE clerk_id = ${userId} AND last_study_date IS DISTINCT FROM ${today}
      `;

      await addXp(client, source, userId, xp);
      await checkAchievements(client, enrollmentId, userId);

      res.status(200).json({
        success: true,
        message: "Lesson marked as completed.",
      });
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLessonDetails,
  getLessonsDetails,
  getFirstLesson,
  isLessonAccessible,
  startLesson,
  SubmitQuizzAnswer,
  getNextLesson,
  MarkAsComplete,
};
