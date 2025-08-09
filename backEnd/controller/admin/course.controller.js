

const sql = require("../../db")



async function getAllCourses( req , res , next) {
    const page = req.query.page || 1;
    const limit = 1
    const offset = (page - 1) * limit
    try {
        const response = await sql`
        SELECT c.*, 
          COUNT(DISTINCT CASE WHEN m.is_deleted = false THEN m.id END) AS moduleCount, 
          COUNT(DISTINCT CASE WHEN l.is_deleted = false THEN l.id END) AS lessonCount,
          SUM(CASE WHEN l.is_deleted = false THEN l.duration_minutes ELSE 0 END) AS totalDuration
        FROM courses c
        LEFT JOIN modules m ON c.id = m.course_id
        LEFT JOIN lessons l ON m.id = l.topic_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
        `;

         const [{ count }] = await sql`
          SELECT COUNT(*)::int as count FROM courses
        `;

        const totalPages = Math.ceil(count / limit);
        const isFinalPage = page >= totalPages;
        if(response.length === 0) {
            return res.status(404).json({ 
                status : false,
                message: "No courses found" });
        }
        return res.status(200).json({
            status: true,
            message: "Courses fetched successfully",
            data: response,
            final : !isFinalPage
        });
    }
    catch (error){
        next(error);
    }

}


async function getCourseModule(req, res, next) {
    try {
        const {courseId} = req.params;
        if (!courseId) {
            return res.status(400).json({
                status: false,
                message: "Course ID is required"
            });
        }

        const response = await sql`
        SELECT m.id , m.title , m.order_index , SUM(l.duration_minutes) AS totalDuration , COUNT(l.id) AS lessonCount
        FROM modules m
        LEFT JOIN lessons l ON m.id = l.topic_id
        WHERE m.course_id = ${courseId} AND m.is_deleted = false
        GROUP BY m.id
        ORDER BY m.order_index;
        `;
        if(response.length === 0){
            return res.status(404).json({
                status : false , 
                message : "no modules found for this course"
            })
        }
        res.status(200).json({
            status: true,
            message: "Modules fetched successfully",
            data: response
        });
    }
    catch(error){
        next(error)
    }
}

async function UpdateCreateCourse(req ,res , next) {
    try {
        const courseData = req.body;
        if (!courseData) {
            return res.status(400).json({
                status: false,
                message: "Course data are required"
            });
        }

        const response = await sql`
                    INSERT INTO courses (title, description, img_url, created_at , category , level , slug , content)
                    VALUES (
                        ${courseData.title},
                        ${courseData.description},
                        ${courseData.img_url},
                        NOW(),
                        ${courseData.category},
                        ${courseData.difficulty},
                        ${courseData.slug},
                        ${courseData.content}
                    )
                    ON CONFLICT (slug) DO UPDATE SET
                        title = EXCLUDED.title,
                        description = EXCLUDED.description,
                        img_url = EXCLUDED.img_url,
                        category = EXCLUDED.category,
                        level = EXCLUDED.level,
                        slug = EXCLUDED.slug,
                        content = EXCLUDED.content,
                        updated_at = NOW()
                    RETURNING *;
`;
        if (response.length === 0) {
            return res.status(404).json({
                status: false,
                message: "Course not found or could not be updated"
            });
        }
        return res.status(200).json({
            status: true,
            message: "Course updated successfully",
            data: response
        });
    } catch (error) {
        console.error("Error updating or creating course:", error);
        next(error);
    }
}

async function UpdateModuleOrder(req, res, next) {
  try {
    const { courseId } = req.params;
    const { orderedModules } = req.body;

    if (!courseId || !Array.isArray(orderedModules)) {
      return res.status(400).json({
        status: false,
        message: "Course ID and module order are required",
      });
    }

    const results = [];

    for (let index = 0; index < orderedModules.length; index++) {
      const module = orderedModules[index];
      const result = await sql`
        UPDATE modules
        SET order_index = ${index}
        WHERE id = ${module.id} AND course_id = ${courseId} AND is_deleted = false
        RETURNING *;
      `;

      if (result.length === 0) {
        return res.status(404).json({
          status: false,
          message: `Module with ID ${module.id} not found or already deleted.`,
        });
      }

      results.push(result[0]);
    }

    return res.status(200).json({
      status: true,
      message: "Module order updated successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error updating module order:", error);
    next(error);
  }
}


async function createModule(req, res, next) {
  try {
    const { courseId } = req.params;
    const { title } = req.body;

    const response = await sql`
      INSERT INTO modules (course_id, title, order_index)
      VALUES (
        ${courseId},
        ${title},
        (
          SELECT COALESCE(MAX(order_index), 0) + 1
          FROM modules
          WHERE course_id = ${courseId}
        )
      )
      RETURNING *;
    `;

    if (response.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Module could not be created",
      });
    }

    return res.status(201).json({
      status: true,
      message: "Module created successfully",
      data: response[0],
    });
  } catch (error) {
    console.error("Error creating module:", error);
    next(error);
  }
}



async function updateModule(req, res, next) {
  try {
    const { moduleId } = req.params;
    const { title } = req.body;

    const response = await sql`
      UPDATE modules
      SET title = ${title}
      WHERE id = ${moduleId} AND is_deleted = false

      RETURNING *;
    `;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Module not found or not updated",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Module updated successfully",
      data: response[0],
    });
  } catch (error) {
    console.error("Error updating module:", error);
    next(error);
  }
}

const ToggleCourseView = async (req, res, next) => {
  const { courseId } = req.params;

  try {
    const [result] = await sql`
      UPDATE courses
      SET is_published = NOT is_published
      WHERE id = ${courseId}
      RETURNING is_published;
    `;

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      status: true,
      message: result.is_published
        ? "Course is now visible to users."
        : "Course has been hidden from users.",
    });
  } catch (err) {
    console.error("Error toggling course visibility:", err);
    next(err);
  }
};


const softDeleteModule = async (req, res, next) => {
  const { moduleId } = req.params;

  try {
    const [module] = await sql`
      SELECT course_id
      FROM modules
      WHERE id = ${moduleId}
      LIMIT 1;
    `;

    if (!module) {
      return res.status(404).json({
        status: false,
        message: "Module not found.",
      });
    }

    const courseId = module.course_id;

    // 2. Soft delete the module
    await sql`
      UPDATE modules
      SET is_deleted = true
      WHERE id = ${moduleId};
    `;

    // 3. Soft delete lessons under this module
    await sql`
      UPDATE lessons
      SET is_deleted = true
      WHERE topic_id = ${moduleId};
    `;

    // 4. Get remaining non-deleted modules
    const remainingModules = await sql`
      SELECT id
      FROM modules
      WHERE course_id = ${courseId} AND is_deleted = false
      ORDER BY order_index ASC;
    `;

    if (remainingModules.length > 0) {
      const caseStatements = [];
      const ids = [];

      remainingModules.forEach((mod, index) => {
        caseStatements.push(`WHEN '${mod.id}' THEN ${index+1}`);
        ids.push(`'${mod.id}'`);
      });

      const caseSql = caseStatements.join(" ");
      const idList = ids.join(", ");

      await sql.unsafe(`
        UPDATE modules
        SET order_index = CASE id
          ${caseSql}
        END
        WHERE id IN (${idList});
      `);
    }

    res.status(200).json({
      status: true,
      message:
        "Module and its lessons soft-deleted, and module order normalized.",
    });
  } catch (error) {
    console.error("Error in softDeleteModule:", error);
    next(error);
  }
};





module.exports = {
  getAllCourses,
  UpdateCreateCourse,
  getCourseModule,
  createModule,
  updateModule,
  UpdateModuleOrder,
  softDeleteModule,
  ToggleCourseView,
};