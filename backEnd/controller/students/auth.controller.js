const { request } = require("express");
const sql = require("../../db");


async function SignUp(requestBody) {
    const result = await sql`
      INSERT INTO users (clerk_id, name, avatar_url , email,role , status)
      VALUES (${requestBody.clerk_id}, ${requestBody.full_name}, ${requestBody.image_url} , ${requestBody.email} , ${requestBody.role} , ${requestBody.status})
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;
    return result
}


async function enrollToCourse(req, res , next) {
  const { userId, courseId } = req.body;
  try {
    const response = await sql`
      INSERT INTO enrollments (user_id, course_id) VALUES (${userId}, ${courseId}) 
    `
    res.status(201).json({
      message: "User enrolled to course",
    });
  }
  catch (err) {
    next()
  }
}



async function checkEnroll(req ,res , next){
  const {courseId , userId} = req.query
  try {
    const response = await sql`SELECT EXISTS (SELECT 1 FROM enrollments WHERE course_id = ${courseId} AND user_id = ${userId})`
    res.status(200).send(response[0])
  }
  catch(err){
    next()
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
  const {userId} = req.params
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
  const {userId} = req.params
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


module.exports = { SignUp , enrollToCourse , checkEnroll , getEnroll , getUserInfo , getUserAchievments};
