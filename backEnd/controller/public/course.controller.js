const sql = require("../../db")



const slugToCategoryMap = {
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Fullstack",
  "mobile-development": "Mobile Development",
  "data-science-and-ai": "Data Science & AI",
  "devops-and-cloud": "DevOps & Cloud",
  cybersecurity: "Cybersecurity",
  "game-development": "Game Development",
};

async function getCoursesByCategory(req, res, next) {
  const { slug_category } = req.params;

  const category = slugToCategoryMap[slug_category]
  console.log(category)
  try {
    const response = await sql`
      SELECT 
        c.id,
        c.title,
        c.level,
        c.category,
        c.img_url,
        c.slug,
        (
          SELECT COALESCE(SUM(l.duration_minutes), 0)
          FROM modules m
          JOIN lessons l ON l.topic_id = m.id
          WHERE m.course_id = c.id AND m.is_deleted = false AND l.is_deleted = false
        ) AS total_duration
      FROM courses c
      WHERE c.is_published = TRUE AND c.category = ${category};
    `;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: `No published courses found in category: ${category}.`,
      });
    }
    console.log(response)

    return res.status(200).json({
      status: true,
      message: `Courses in category "${category}" retrieved successfully.`,
      data: response,
    });
  } catch (err) {
    next(err);
  }
}



async function getCoursesIds(req ,res , next) {
  try {
    const response = await sql`
    SELECT id , slug
    FROM courses
    WHERE is_published = TRUE;
  `;

  if(response.length === 0){
    return res.status(404).json({
      status: false,
      message: "No published courses found.",
    });
  }
  return res.status(200).json({
    status: true,
    message: "Published course IDs retrieved successfully.",
    data: response,
  })}
  catch (error) {
   next(error)
  }
}


async function getCourseInfoBySlug(req, res, next){
  const { slug } = req.params;
  try{
    sql.begin(async (client)=> {
      const CourseDetails = await client`
        SELECT 
          c.id,
          c.title,
          c.level,
          c.category,
          c.img_url,
          c.slug,
          c.content,
          c.description,
          (
            SELECT COALESCE(COUNT(m.id), 0)
            FROM modules m
            WHERE m.course_id = c.id AND m.is_deleted = false
          ) AS total_modules,
          (
            SELECT COALESCE(SUM(l.duration_minutes), 0)
            FROM modules m
            JOIN lessons l ON l.topic_id = m.id
            WHERE m.course_id = c.id AND m.is_deleted = false AND l.is_deleted = false
          ) AS total_duration
        FROM courses c
        WHERE c.is_published = TRUE AND c.slug = ${slug};
      `;
      if (CourseDetails.length === 0) {
        return res.status(404).json({
          status: false,
          message: `No published course found with slug: ${slug}.`,
        });
      }
      const ModuleDetails = await client`
        SELECT title, order_index, created_at, id AS module_id
        FROM modules
        WHERE course_id = ${CourseDetails[0].id} AND is_deleted = false
        ORDER BY order_index
      `;

      if (ModuleDetails.length === 0) {
        return res.status(404).json({
          status: false,
          message: `No modules found for course with slug: ${slug}.`,
        });
      }
      const ModulesId = ModuleDetails.map(module => module.module_id);
      const Lessons = await client`
        SELECT id, title , slug as lesson_slug , topic_id, duration_minutes
        FROM lessons
        WHERE topic_id = ANY(${ModulesId}) AND is_deleted = false
        ORDER BY topic_id, order_index;
      `;
      const response = ModuleDetails.map((module) => {
        return {
          ...module,
          lessons: Lessons.filter(lesson => lesson.topic_id === module.module_id)
        }
      })
      return res.status(200).json({
        status: true,
        message: `Course details for slug "${slug}" retrieved successfully.`,
        data: {
          course: CourseDetails[0],
          courseInfo: response
        }
      });
    });
  }
  catch(err){
    next(err)
  }
}


async function getFeaturedCourses(req, res, next) {
  try {
    const response = await sql`
      SELECT title, description, slug, img_url
      FROM courses
      WHERE is_published = TRUE
      ORDER BY created_at DESC
      LIMIT 3;
    `;
    console.log(response)

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No featured courses found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Featured courses retrieved successfully.",
      data: response,
    });
  } catch (error) {
    next(error);
  }
}

module.exports  = { getCoursesByCategory , getCoursesIds , getCourseInfoBySlug , getFeaturedCourses}