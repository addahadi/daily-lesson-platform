const sql = require("../db");


async function SignUp(req, res) {
  const { id, fullName, imageUrl, emailAddresses } = req.body;

  console.log(id);

  try {
    const result = await sql`
      INSERT INTO users (clerk_id, name, avatar_url , email)
      VALUES (${id}, ${fullName}, ${imageUrl} , ${emailAddresses})
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;

    console.log(result);

    res.status(201).json({
      message: "User inserted",
      data: result[0], 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}


async function enrollToCourse(req, res) {
  const { userId, courseId } = req.body;
  try {
    const response = await sql`
      INSERT INTO enrollments (user_id, course_id) VALUES (${userId}, ${courseId}) 
    `
    res.status(201).json({
      message: "User enrolled to course",
    });
    console.log(response);
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}



async function checkEnroll(req ,res){
  const {courseId , userId} = req.query
  try {
    const response = await sql`SELECT EXISTS (SELECT 1 FROM enrollments WHERE course_id = ${courseId} AND user_id = ${userId})`
    console.log(response)
    res.status(200).send(response[0])
  }
  catch(err){
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
async function getEnroll(req, res) {
  const { courseId, userId } = req.query;

  try {
    console.log(courseId , userId)
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
    console.error(err);
    res.status(500).json({
      status: false,
      error: err.message,
    });
  }
}


module.exports = { SignUp , enrollToCourse , checkEnroll , getEnroll};
