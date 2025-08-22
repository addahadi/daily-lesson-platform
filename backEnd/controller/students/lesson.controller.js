const sql = require("../../db");
const { addXp, checkAchievements } = require("./xp.controller");

async function getLessonDetails(req, res, next) {
  const { lessonSlug, moduleId } = req.params;
  const userId = req.auth.userId;

  try {
    // Step 1: Fetch the lesson
    const lessonResult = await sql`
      SELECT 
        l.id AS lesson_id, 
        l.title, 
        l.content, 
        l.duration_minutes, 
        l.level, 
        l.order_index, 
        l.slug AS lesson_slug
      FROM lessons l
      WHERE l.slug = ${lessonSlug} AND l.topic_id = ${moduleId} AND l.is_deleted = false
    `;

    if (lessonResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "The requested lesson was not found.",
      });
    }

    const lesson = lessonResult[0];

    const quizResult = await sql`
      SELECT 
        q.id AS quizz_id,
        q.question, 
        q.options, 
        q.correct_option_index,
        a.id AS answer_id,
        a.selected_option_index,
        a.is_correct
      FROM quizzes q
      LEFT JOIN quiz_answers a ON a.quiz_id = q.id AND a.user_id = ${userId}
      WHERE q.lesson_id = ${lesson.lesson_id}
    `;

    const nextCheck = await sql`
      SELECT EXISTS (
        SELECT 1 FROM lessons 
        WHERE topic_id = ${moduleId} AND order_index > ${lesson.order_index} AND is_deleted = false
      ) AS has_next
    `;

    const isLast = !nextCheck[0]?.has_next;

    res.status(200).json({
      success: true,
      data: {
        ...lesson,
        quizz: quizResult.length > 0 ? quizResult[0] : null,
        previous: lesson.order_index !== 1,
        next: !isLast,
      },
    });
  } catch (err) {
    next(err);
  }
}




async function getLessonsDetails(req, res, next) {
  try {
    const { courseId : Courseslug, enrollmentId } = req.query;
    
    const courseResponse = await sql`
      SELECT id, slug, title FROM courses WHERE slug = ${Courseslug}
    `;
    if (courseResponse.length === 0) {
     if (courseResponse.length === 0) {
       return res.status(404).json({
         status: false,
         message: "The course you're looking for does not exist.",
       });
     }
    }

    const course = courseResponse[0];
    const modulesResponse = await sql`
      SELECT id, title, order_index FROM modules   WHERE course_id = ${course.id} AND is_deleted = false

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
      WHERE l.topic_id = ANY(${moduleIds}) AND l.is_deleted = false
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

async function getFirstLesson(client, courseId, res) {
  const firstLesson = await client`
    SELECT l.slug AS lesson_id, m.id AS module_id
    FROM courses c
    JOIN modules m ON c.id = m.course_id AND m.is_deleted = false
    JOIN lessons l ON m.id = l.topic_id AND l.is_deleted = false
    WHERE c.id = ${courseId}
    ORDER BY m.order_index, l.order_index
    LIMIT 1
  `;

  if (firstLesson.length === 0) {
    return res.status(404).json({
      status: false,
      message: "The first lesson could not be found for this course.",
    });
  }
  res.status(200).json({
    status: true,
    message: "you enrolled successfully , start your first lesson",
    data: firstLesson[0],
    action: "start the first lesson",
  });
}
async function isModuleAccessible(req, res, next) {
  const { userId, courseId, moduleId } = req.body;

  try {
    const courseResponse = await sql`
      SELECT id FROM courses WHERE slug = ${courseId}
    `;

    if (courseResponse.length === 0) {
      return res
        .status(404)
        .json({ status: false, error: "Course not found." });
    }

    const course = courseResponse[0];

    // Get all non-deleted modules in order
    const modules = await sql`
      SELECT id
      FROM modules
      WHERE course_id = ${course.id} AND is_deleted = false
      ORDER BY order_index ASC
    `;

    const index = modules.findIndex((m) => m.id === moduleId);

    if (index === -1) {
      return res
        .status(404)
        .json({ status: false, error: "Module not found." });
    }

    // First active module → always accessible
    if (index === 0) {
      return res.status(200).json({
        status: true,
        message: "Module is accessible.",
        isAccessible: true,
      });
    }

    const previousModuleId = modules[index - 1].id;

    // Check progress on previous active module
    const [accessCheck] = await sql`
      SELECT EXISTS (
        SELECT 1
        FROM module_progress mp
        JOIN enrollments e ON mp.enrollment_id = e.id
        WHERE e.user_id = ${userId}
          AND e.course_id = ${course.id}
          AND mp.module_id = ${previousModuleId}
          AND mp.progress = 100
      ) AS is_accessible
    `;

    return res.status(200).json({
      status: true,
      message: accessCheck.is_accessible
        ? "Module is accessible."
        : "Previous module is not completed yet.",
      isAccessible: accessCheck.is_accessible,
    });
  } catch (err) {
    next(err);
  }
}

async function startLesson(req, res, next) {
  const { enrollmentId, moduleId, lessonId: lessonSlug } = req.body;

  try {
    const lessonResult = await sql`
      SELECT id FROM lessons 
      WHERE slug = ${lessonSlug} 
        AND topic_id = ${moduleId} 
        AND is_deleted = false
    `;

    if (lessonResult.length === 0) {
      return res.status(404).json({
        status: false,
        message: "The lesson you tried to start does not exist.",
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

    const progress = await sql`
      SELECT completed 
      FROM lesson_progress
      WHERE enrollment_id = ${enrollmentId} 
        AND module_id = ${moduleId} 
        AND lesson_id = ${lessonId}
    `;

    const isCompleted = progress.length > 0 ? progress[0].completed : false;

    res.status(200).json({
      status: true,
      message: "Lesson progress initialized.",
      data: isCompleted,
    });
  } catch (err) {
    console.error("Database error:", err);
    next(err);
  }
}


async function SubmitQuizzAnswer(req, res, next) {
  try {
    await sql.begin(async (client) => {
      const {
        quizz_id,
        lesson_id,
        selected_option,
        correct,
        module_id,
      } = req.query;


      const userId = req.auth.userId 
      const user_id = userId
      const isCorrect = correct === "true" || correct === true;

      const lessonResult = await client`
        SELECT id FROM lessons 
        WHERE slug = ${lesson_id} AND topic_id = ${module_id} AND is_deleted = false
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
        .json({ 
          status: true, 
          message: "Your quiz answer has been saved + 50Xp" 
        });
    });
  } catch (err) {
    next(err);
  }
}

async function getNextLesson(req, res, next) {
  try {
    const { orderIndex, moduleId } = req.params;

    const moduleCheck = await sql`
      SELECT id FROM modules WHERE id = ${moduleId} AND is_deleted = false
    `;
    if (moduleCheck.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Module not found.",
      });
    }

    const nextLesson = await sql`
      SELECT slug FROM lessons 
      WHERE topic_id = ${moduleId} 
        AND order_index = ${orderIndex}
        AND is_deleted = false
    `;

    if (nextLesson.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No next lesson found. This might be the last lesson.",
      });
    }

    res.status(200).json({
      status: true,
      data: nextLesson[0].slug,
      message: "Next lesson found.",
    });
  } catch (err) {
    next(err);
  }
}

async function markLessonComplete(req, res, next) {
  const { lessonSlug, enrollmentId, moduleId } = req.body;
  const userId = req.auth.userId
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const xp = 10;
  const source = "lesson_complete";
  console.log(lessonSlug , enrollmentId , moduleId)
  try {
    await sql.begin(async (client) => {

      const lessonResult = await client`
        SELECT id FROM lessons 
        WHERE slug = ${lessonSlug} AND topic_id = ${moduleId} AND is_deleted = false
      ;`

      if (lessonResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Lesson not found.",
        });
      }

      const lessonId = lessonResult[0].id;

      const alreadyCompleted = await client`
        SELECT completed FROM lesson_progress
        WHERE enrollment_id = ${enrollmentId} AND lesson_id = ${lessonId}
      ;`

      if (alreadyCompleted[0].completed) {
        return res.status(200).json({
          success: true,
          message: "Lesson already marked as complete.",
        });
      }

      const hasQuiz = await client`
        SELECT EXISTS (
          SELECT 1 FROM quizzes 
          WHERE lesson_id = ${lessonId}
        ) AS exists
      ;`

      if (hasQuiz[0].exists) {
        const quizCompleted = await client`
          SELECT EXISTS (
            SELECT 1 FROM quiz_answers 
            WHERE lesson_id = ${lessonId} 
            AND user_id = ${userId}
          ) AS exists
        ;`

        if (!quizCompleted[0].exists) {
          return res.status(400).json({
            success: false,
            message:
              "Please complete the quiz before marking this lesson complete.",
          });
        }
      }



      await client`
        UPDATE lesson_progress 
        SET completed = TRUE, completed_at = NOW()
        WHERE enrollment_id = ${enrollmentId} AND lesson_id = ${lessonId}
      `;
      const [totalLessons, completedLessons] = await Promise.all([
        client`
          SELECT COUNT(*) AS count 
          FROM lessons 
          WHERE topic_id = ${moduleId} AND is_deleted = false
        `,
        client`
          SELECT COUNT(*) AS count FROM lesson_progress
          WHERE completed = TRUE AND enrollment_id = ${enrollmentId} AND lesson_id IN (
            SELECT id FROM lessons WHERE topic_id = ${moduleId} AND is_deleted = false
          )
        `,
      ]);

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

      let CourseCompletedAlert = false;

      const [{ completed }] = await client`
        SELECT completed FROM enrollments WHERE id = ${enrollmentId}
      `;

      if (!completed) {
        const [{ course_id }] = await client`
        SELECT course_id FROM enrollments WHERE id = ${enrollmentId}
      `;

        const [{ total_modules, completed_modules }] = await client`
          SELECT 
            COUNT(DISTINCT m.id) AS total_modules,
            COUNT(DISTINCT mp.id) FILTER (WHERE mp.progress = 100) AS completed_modules
          FROM modules m
          LEFT JOIN module_progress mp 
            ON mp.module_id = m.id AND mp.enrollment_id = ${enrollmentId}
          WHERE m.course_id = ${course_id}
        `;

        if (total_modules === completed_modules && total_modules > 0) {
          await client`
            UPDATE enrollments
            SET completed = true
            WHERE id = ${enrollmentId}
          `;
          CourseCompletedAlert = true;
        }
      }
      await addXp(client, source, userId, xp)
      await checkAchievements(client, enrollmentId, userId)

      res.status(200).json({
        success: true,
        message: `Lesson marked as complete. ${xp}Xp added`,
        data: {
          lessonId,
          moduleProgress: progress,
          xpAwarded: xp,
          CourseCompletedAlert,
        },
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
  isModuleAccessible,
  startLesson,
  SubmitQuizzAnswer,
  getNextLesson,
  markLessonComplete,
};
