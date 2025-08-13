const { request } = require("express");
const sql = require("../../db");
const { getFirstLesson } = require("./lesson.controller");


async function SignUp(requestBody) {
    const result = await sql`
      INSERT INTO users (clerk_id, name, avatar_url , email,role , status)
      VALUES (${requestBody.clerk_id}, ${requestBody.full_name}, ${requestBody.image_url} , ${requestBody.email} , ${requestBody.role} , ${requestBody.status})
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;
    return result?.length > 0
      ? { success: true, data: result[0] }
      : { success: false, error: "User not found or no changes applied" };
}

async function UpdateUser(requestBody) {
  const result = await sql`
    UPDATE users
    SET 
      name = ${requestBody.full_name},
      avatar_url = ${requestBody.image_url},
      email = ${requestBody.email},
      role = ${requestBody.role},
      status = ${requestBody.status}
    WHERE clerk_id = ${requestBody.clerk_id}
    RETURNING *;
  `;

  return result?.length > 0
    ? { success: true, data: result[0] }
    : { success: false, error: "User not found or no changes applied" };
}


async function enrollToCourse(req , res , next) {
  const userId = req.auth.userId;
  const { courseId } = req.body;
  try {
    await sql.begin(async (client) => {
      await client`
            INSERT INTO enrollments (user_id, course_id) 
            VALUES (${userId}, ${courseId})
          `;
      await getFirstLesson(client, courseId, res);
    })
  }
  catch(err){
    next(err)
  }
}


async function checkEnroll(req, res, next) {
  const { courseSlug } = req.query;
  console.log(courseSlug)
  const userId = req.auth.userId;
  console.log(userId)
  try {
    await sql.begin(async (client) => {

      const [{course_id}] = await client`
        SELECT id as course_id
        FROM courses
        WHERE slug = ${courseSlug}
      `;
      const checkEnroll = await client`
        SELECT id as enrollment_id 
        FROM enrollments 
        WHERE course_id = ${course_id} AND user_id = ${userId}
      `;

      if (checkEnroll.length === 0) {
        return res.status(200).json({
          status : false , 
          action : "enroll"
        })
      }

      const enrollment_id = checkEnroll[0].enrollment_id;

      const Continue = await client`
        SELECT l.slug as lesson_id, l.topic_id as module_id 
        FROM lessons l
        LEFT JOIN lesson_progress p ON p.lesson_id = l.id
        WHERE p.enrollment_id = ${enrollment_id} 
        ORDER BY p.started_at DESC
        LIMIT 1
      `;
      if (Continue.length === 0) {  
        return await getFirstLesson(client, courseId, res);
      }

      return res.status(200).json({
        status: true,
        data: Continue[0],
        action: "continue learning",
      });

    });
  } catch (err) {
    console.error("Error in enrollToCourse:", err);
    next(err);
  }
}





async function getEnroll(req, res , next) {
  const { courseId, userId } = req.query;

  try {
    const response = await sql`
      SELECT e.id AS enrollmentId 
      FROM enrollments e 
      JOIN courses c ON c.id = e.course_id 
      WHERE c.slug = ${courseId} 
        AND e.user_id = ${userId}
    `;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        error: "Enrollment not found for this user and course.",
      });
    }

    res.status(200).json({
      status: true,
      data: response,
    });
  } catch (err) {
    next()
  }
}




async function getUserAchievments(req , res , next){
  const userId = req.auth.userId
  try {
    const user_achievements = await sql`
    SELECT 
    a.*, 
    EXISTS (
      SELECT 1 
      FROM user_achievements 
      WHERE user_id = ${userId} 
        AND achievement_id = a.id
    ) AS earned
    FROM achievements a;

    `
    res.status(200).json({
      status : true , 
      data : user_achievements
    })
  }
  catch(err){
    next()
  }
}




async function getUserInfo(req ,res , next){
  const userId = req.auth.userId
  try {
    const userInfoResult = await sql`
    SELECT * FROM users WHERE clerk_id = ${userId}
    `
    if(userInfoResult.length === 0){
      res.status(404).json({
        status : false ,
        message : "user was not found"
      })
    }
    res.status(200).json({
      status: true , 
      data : userInfoResult
    })
  }
  catch(err){
    next()
  }
}


module.exports = { SignUp , UpdateUser , enrollToCourse  , getEnroll , getUserInfo , getUserAchievments , checkEnroll};
