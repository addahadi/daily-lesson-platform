const sql = require("../db");


async function getAllCourses(req , res){
    try {
        const response = await sql`
        SELECT title , level , category , img_url , slug 
        FROM courses
        WHERE is_published = TRUE  
        `;

        const result = {
            status : true , 
            data : response
        }
         res.status(200).json(result)
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
}


async function getCourseBySlug(req , res){
  const {slug} = req.query
  try {
    const response = await sql`
    SELECT c.* , ( SELECT count(*) FROM modules m WHERE m.course_id = c.id) as total 
    FROM courses c  
    WHERE c.slug =  ${slug}
    `;
    const result = {
      status : true ,
      data : response[0] 
    }
    res.status(200).json(result)
  }
  catch(err){
    console.log(err);
    res.status(500).json({error : err.message})
  }
}





async function getCourseModules(req , res) {
  const { courseId } = req.params;   
  try {
    const response = await sql`
    SELECT title , order_index , created_at  , id as module_id
    FROM modules
    WHERE course_id = ${courseId}
    ORDER BY order_index ASC
    `
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

async function getModuleLessons(req , res){
  const {moduleId} = req.params
  try {
    const response = await sql`
    SELECT 
      title, slug as lesson_slug, duration_minutes, level, topic_id
    FROM 
      lessons
    WHERE 
      topic_id = ${moduleId} 
`;
    const result = {
      status: true,
      data: response,
    };
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}




module.exports = {getAllCourses , getCourseBySlug , getCourseModules , getModuleLessons}