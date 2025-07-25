const sql = require("../../db");


async function getAllCourses(req , res , next){
    try {
        const response = await sql`
        SELECT title , level , category , img_url , slug 
        FROM courses
        WHERE is_published = TRUE  
        `;
        if(response.length === 0){
          res.status(404).json({
            status : false ,
            message : "no courses available"
          })
        }
        const result = {
            status : true , 
            data : response
        }
         res.status(200).json(result)
      } catch (err) {
        next()
      }
}


async function getCourseBySlug(req , res , next){
  const {slug} = req.query
  try {
    const response = await sql`
    SELECT c.* , ( SELECT count(*) FROM modules m WHERE m.course_id = c.id) as total 
    FROM courses c  
    WHERE c.slug =  ${slug}
    `;
    if(response.length === 0){
      return res.status(404).json({
        status : false , 
        message : "no such course"
      })
    }
    const result = {
      status : true ,
      data : response[0] 
    }
    res.status(200).json(result)
  }
  catch(err){
    next()
  }
}





async function getCourseModules(req , res , next) {
  const { courseId } = req.params;   
  try {
    const response = await sql`
    SELECT title , order_index , created_at  , id as module_id
    FROM modules
    WHERE course_id = ${courseId}
    ORDER BY order_index ASC
    `
    if(response.length === 0){
      res.status(404).json({
        status : false , 
        message : "no modules available in this course"
      })
    }
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

async function getFilteredCourses(req, res, next) {
  try {
    const { difficulty, category } = req.query;

    let query = sql`SELECT title, level, category, img_url, slug FROM courses WHERE is_published = TRUE`;

    if (difficulty) {
      query = sql`${query} AND level = ${difficulty}`;
    }

    if (category) {
      query = sql`${query} AND category = ${category}`;
    }

    const result = await query;

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No lessons found for the given filters.",
      });
    }

    return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (err) {
    next(err);
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
  if (response.length === 0) {
    return res.status(404).json({
      status: false,
      message: "no lessons available in this course",
    });
  }
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




module.exports = {getAllCourses , getCourseBySlug , getCourseModules , getModuleLessons , getFilteredCourses}