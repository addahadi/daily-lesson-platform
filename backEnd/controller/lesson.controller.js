
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

const response = `SELECT l.title, l.order_index , `;



module.exports = {getLessonDetails}