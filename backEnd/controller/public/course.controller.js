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


module.exports  = { getCoursesByCategory}