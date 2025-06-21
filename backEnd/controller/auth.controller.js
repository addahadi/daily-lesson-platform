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

module.exports = { SignUp , enrollToCourse };
