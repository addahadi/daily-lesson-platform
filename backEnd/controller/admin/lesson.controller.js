
const sql = require("../../db");

async function getAllLessons(req, res , next) {
    const moduleId = req.params.moduleId;
    try {
        const response = await sql`
          SELECT * FROM lessons 
          WHERE topic_id = ${moduleId} AND is_deleted = false
          ORDER BY order_index;
        `;

        if (response.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No lessons found for this module",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Lessons retrieved successfully",
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
}

async function createUpdateLesson(req, res, next) {
  try {
    const { title, content, duration_minutes, level, slug } = req.body;
    const moduleId = req.params.moduleId;
    console.log(title , content , duration_minutes , level , slug)
    const lesson = await sql`
      INSERT INTO lessons (title, content, duration_minutes, level, slug, topic_id, order_index)
      VALUES (
        ${title}, ${content}, ${duration_minutes}, ${level}, ${slug}, ${moduleId},
        (
          SELECT COALESCE(MAX(order_index), 0) + 1 
          FROM lessons 
          WHERE topic_id = ${moduleId}
        )
      )
      ON CONFLICT (slug, topic_id) WHERE is_deleted = false 
      DO UPDATE
      SET 
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        duration_minutes = EXCLUDED.duration_minutes,
        level = EXCLUDED.level,
        order_index = (
          SELECT order_index 
          FROM lessons 
          WHERE slug = ${slug} AND topic_id = ${moduleId}
        )
      RETURNING *;
    `;

    if (lesson.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Failed to update or create the lesson",
      });
    }

    res.status(200).json({
      status: true,
      message: "Successfully updated or inserted",
      data: lesson[0],
    });
  } catch (err) {
    next(err);
  }
}


function updateLesson(req, res, next) {
    const lessonId = req.params.lessonId;
    res.status(200).json({ message: `Lesson with ID ${lessonId} updated successfully` });
}


async function updateOrderLesson(req, res, next) {
  try {
        const {moduleId} = req.params
        const requestBody = req.body;
        console.log(requestBody , moduleId)
        if (!moduleId || !Array.isArray(requestBody)) {
            return res.status(400).json({
                status: false,
                message: "ModuleId and lesson array are required"
            });
        }

        const updatePromises = requestBody.map((lesson) => {
            return sql`
                UPDATE lessons
                SET order_index = ${lesson.order_index}
                WHERE id = ${lesson.id} AND topic_id = ${moduleId} AND is_deleted = false
                RETURNING id
            `;
        });

        const results = await Promise.all(updatePromises);

        if (results.some(result => result.length === 0)) {
            return res.status(404).json({
                status: false,
                message: "Some lessons could not be updated"
            });
        }

        return res.status(200).json({
            status: true,
            message: "lesson order updated successfully",
        });
        
    } catch (error) {
        console.error("Error updating module order:", error);   
        next(error);
    }
}



async function updateLessonContent(req , res , next){
  try {
    const {lessonId} = req.params
    const content = req.body
    console.log(content)
    if(!content) {
      
      return res.status(400).json({
        status : false , 
        message : " no content"
      })
    }
    const response = await sql`    
      UPDATE lessons 
      SET content = ${content}
      WHERE id = ${lessonId}
      RETURNING content`
    if(response.length === 0){
      return res.status(404).json({
        status : false , 
        message : "failed to save"
      })
    }
    res.status(200).json({
      status : true , 
      data : response[0]
    })
  }
  catch(err){
    next(err)
  }
}
async function updateOrAddLessonQuizz(req, res, next) {
  try {
    const {question, options, correct_option_index } = req.body;
    const {lessonId } = req.params;
    if (
      !question ||
      !options ||
      correct_option_index === undefined ||
      !lessonId
    ) {
      return res.status(400).json({
        status: false,
        message: "Bad request body: Missing required fields",
      });
    }

    const result = await sql`
      INSERT INTO quizzes (lesson_id, question, options, correct_option_index)
      VALUES (${lessonId}, ${question}, ${options}, ${correct_option_index})
      ON CONFLICT (lesson_id)
      DO UPDATE SET
        question = EXCLUDED.question,
        options = EXCLUDED.options,
        correct_option_index = EXCLUDED.correct_option_index
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Failed to insert/update the quizz",
      });
    }

    return res.status(200).json({
      status: true,
      data: result[0],
    });
  } catch (err) {
    next(err);
  }
}
const softDeleteLesson = async (req, res, next) => {
  const { lessonId } = req.params;

  try {
    await sql.begin(async (tx) => {
      const [lesson] = await tx`
        SELECT topic_id , order_index
        FROM lessons
        WHERE id = ${lessonId}
      `;
      if (!lesson) {
        return res.status(404).json({
          status: false,
          message: "Lesson not found.",
        });
      }
      const deletedOrderIndex = lesson.order_index;
      const topicId = lesson.topic_id;
      // 2. Soft delete the lesson
      await tx`
        UPDATE lessons
        SET is_deleted = true
        WHERE id = ${lessonId};
      `;
      // 4. Reorder subsequent lessons (decrement their order_index)
      await tx`
          UPDATE lessons
          SET order_index = order_index - 1, updated_at = NOW()
          WHERE topic_id = ${topicId}
            AND order_index > ${deletedOrderIndex}
            AND is_deleted = false;
        `;

        
      })
      
      res.status(200).json({
        status: true,
        message: "Lesson soft-deleted and order normalized.",
      });
      
      
      
  } catch (error) {
    console.error("Error in softDeleteLesson:", error);
    next(error);
  }
};


module.exports = {
    createUpdateLesson , 
    getAllLessons ,
    updateLesson,
    updateOrderLesson,
    updateLessonContent,
    updateOrAddLessonQuizz,
    softDeleteLesson
}