const sql = require("../db")

async function getEnrolledCourses(req ,res){
    const {userId} = req.params
    try {
        const response = await sql`
        SELECT c.title, c.id course_id , e.id as enrollment_id , count(c.id) as total_courses
        FROM courses c
        JOIN enrollments e ON e.course_id = c.id
        WHERE  e.user_id = ${userId}
        GROUP BY c.title , c.id , e.id `
        
        if(!(response.length > 0)){
            return res.status(404).json({
                status : false , 
                message : "not found"
            })

        }
        res.status(200).json({
            data : response
        })

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message : err.message
        })
    }
}

async function getEnrolledCoursesNumber(req , res){
    const {userId} = req.params
    try {
        const totalCourses = await sql`
            SELECT COUNT(*) AS total_courses
            FROM enrollments
            WHERE user_id = ${userId};
        `
        res.status(200).json({
            status: true,
            data: totalCourses,
          });
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message : err.message
        })
    }
}

async function getTotalLessons(req , res){
    try {
      const { userId } = req.params;

      const result = await sql`
          SELECT 
            (SELECT COUNT(*) 
            FROM modules m
            JOIN lessons l ON m.id = l.topic_id
            WHERE m.course_id IN (
            SELECT course_id FROM enrollments WHERE user_id = ${userId}
            )
            ) AS total_lessons,

            (SELECT COUNT(*) 
            FROM lesson_progress lp
            WHERE lp.completed = true
            AND lp.enrollment_id IN (
                SELECT id FROM enrollments WHERE user_id = ${userId}
            )
            ) AS completed_lessons;
        `;
      if (result.length === 0) {
        return res.status(404).json({ error: "Progress data not found" });
      }

      res.json({
        status : true ,
        data : result
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } 
}




async function getNextLesson(req , res)  {
    const {courseId , enrollmentId} = req.query
    try {
        const lessons = await  sql`
        SELECT l.duration_minutes , l.level , l.topic_id as module_id , l.id as lesson_id , l.slug
        FROM lessons l
        JOIN modules m ON l.topic_id = m.id
        LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.enrollment_id = ${enrollmentId}
        WHERE m.course_id = ${courseId}
          AND (lp.completed IS NULL OR lp.completed = false)
        ORDER BY m.order_index, l.order_index
        LIMIT 1
        `
        const progress = await sql`
        SELECT 
            COUNT(m.id) as total_modules,
            COUNT(mp.id) as total_progressed_modules,
            COUNT(mp.progress) as progress_count         
        FROM modules m         
        LEFT JOIN module_progress mp ON mp.module_id = m.id AND mp.enrollment_id = ${enrollmentId}
        WHERE m.course_id = ${courseId}        
        `;
        
        if(lessons.length == 0){
            return res.status(404).json({
                status : false,
                message : "no enrolled lessons"
            })
        }
        const { total_modules, total_progressed_modules } = progress[0];
        const progressPercentage =
          total_modules > 0
            ? Math.round((total_progressed_modules / total_modules) * 100)
            : 0;

        const response = {
          lesson: lessons[0],
          progressPercentage: progressPercentage,
          total_modules,
          total_progressed_modules
        };
        res.status(200).json({
          status: true,
          data: response,
        });

    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message : err.message
        })
    }
}


module.exports = {getEnrolledCourses , getNextLesson , getEnrolledCoursesNumber , getTotalLessons}