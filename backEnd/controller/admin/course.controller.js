

const sql = require("../../db")



async function getAllCourses( req , res , next) {
    try {
        const response = await sql`
        SELECT c.* , COUNT(DISTINCT m.id) AS moduleCount, COUNT(DISTINCT l.id) AS lessonCount,      
        SUM(l.duration_minutes) AS totalDuration

        FROM courses c
        LEFT JOIN modules m ON c.id = m.course_id
        LEFT JOIN lessons l ON m.id = l.topic_id
        GROUP BY c.id
        ORDER BY c.created_at DESC
        `;
        if(response.length === 0) {
            return res.status(404).json({ 
                status : false,
                message: "No courses found" });
        }
        return res.status(200).json({
            status: true,
            message: "Courses fetched successfully",
            data: response
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
        WHERE m.course_id = ${courseId}
        GROUP BY m.id
        ORDER BY m.order_index;
        `
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
        const {orderedModules} = req.body;
        console.log(orderedModules)
        console.log(courseId)
        if (!courseId || !Array.isArray(orderedModules)) {
            return res.status(400).json({
                status: false,
                message: "Course ID and module order are required"
            });
        }

        const updatePromises = orderedModules.map((module, index) => {
            return sql`
                UPDATE modules
                SET order_index = ${index}
                WHERE id = ${module.id} AND course_id = ${courseId}
                RETURNING *;
            `;
        });

        const results = await Promise.all(updatePromises);

        if (results.some(result => result.length === 0)) {
            return res.status(404).json({
                status: false,
                message: "Some modules could not be updated"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Module order updated successfully",
            data: results
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
      WHERE id = ${moduleId}
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




module.exports = {
  getAllCourses,
  UpdateCreateCourse,
  getCourseModule,
    createModule,
    updateModule,
    UpdateModuleOrder
};