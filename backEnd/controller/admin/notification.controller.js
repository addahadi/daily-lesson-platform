const sql = require("../../db");




// Get target users based on notification target type
async function getTargetUsers({ sent_to, course_id }) {
  try {
    let users = [];

    if (sent_to === "all_users") {
      users = await sql`
        SELECT clerk_id AS user_id
        FROM users 
        WHERE status = 'active'
      ;`
    } else if (sent_to === "enrolled_users" && course_id) {
      users = await sql`
        SELECT DISTINCT u.clerk_id AS user_id
        FROM users u
        INNER JOIN enrollments e ON u.clerk_id = e.user_id
        WHERE e.course_id = ${course_id} 
        AND u.status = 'active'
      ;`
    }

    if (users.length === 0) {
      throw new Error("No target users found.");
    }

    return users;
  } catch (error) {
    throw error;
  }
}
async function createUserNotifications(req, res, next) {
  try {
    const { sent_to, courseId, notificationId } = req.body;

    const users = await getTargetUsers({ sent_to, course_id: courseId });

    if (users.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No eligible users found for notification.",
      });
    }

    const rows = users.map((user) => [notificationId, user.user_id, false]);

    const result = await sql`
      INSERT INTO user_notification (
        notification_id,
        user_id,
        is_read
      )
      VALUES ${sql(rows)}
      RETURNING id, notification_id, user_id, is_read, created_at
    `;

    res.status(200).json({
      status: true,
      message: `Notifications were sent to ${result.length} user(s) successfully.`,
      data: result,
    });
  } catch (error) {
    console.error("Error in createUserNotifications:", error);
    next(error);
  }
}

// GET /courses/ids
async function getCoursesIds(req, res, next) {
  try {
    const response = await sql`
            SELECT title, id 
            FROM courses 
            LIMIT 7
        `;

    if (response.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No courses are available",
      });
    }

    res.status(200).json({
      status: true,
      data: response,
    });
  } catch (err) {
    next(err);
  }
}

// GET /notifications
async function getAllNotifications(req, res, next) {
  try {
    const notifications = await sql`
            SELECT * FROM notifications
        `;

    if (notifications.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No available notifications",
      });
    }

    res.status(200).json({
      status: true,
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
}



async function createNotification(req, res, next) {
  try {
    const { type, title, message, sent_to, content_type, course_id } = req.body;

    // Validation
    if (!type || !title || !message || !sent_to) {
      return res.status(400).json({
        status: false,
        message: "Type, title, message, and sent_to are required fields",
      });
    }

    // Additional validation for new_content type
    if (type === "new_content" && !content_type) {
      return res.status(400).json({
        status: false,
        message: "Content type is required for new content notifications",
      });
    }

    // Validation for enrolled-users with non-course content
    if (sent_to === "enrolled_users" && content_type !== "course" && !course_id) {
      return res.status(400).json({
        status: false,
        message: "Course ID is required for enrolled users notifications",
      });
    }

    // If course_id is provided, verify it exists
    if (course_id) {
      const courseExists = await sql`
        SELECT id FROM courses WHERE id = ${course_id}
      `;

      if (courseExists.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Course not found",
        });
      }
    }

    const notification = await sql`
      INSERT INTO notifications (
        type, 
        title, 
        body, 
        sent_to, 
        content_type, 
        course_id, 
        created_at, 
        updated_at
      )
      VALUES (
        ${type}, 
        ${title}, 
        ${message}, 
        ${sent_to}, 
        ${content_type || null}, 
        ${course_id || null}, 
        NOW(), 
        NOW()
      )
      RETURNING *
    `;

    res.status(201).json({
      status: true,
      message: "Notification created successfully",
      data: notification[0],
    });
  } catch (err) {
    next(err);
  }
}

async function updateNotification(req , res , next){
    try {
      const { notificationId } = req.params;
      const { type, title, message, sent_to, content_type, courseId } = req.body;

      const existingNotification = await sql`
      SELECT * FROM notifications WHERE id = ${notificationId}
    `;

      if (existingNotification.length === 0) {
        return res.status(404).json({
          status: false,
          message: "Notification not found",
        });
      }

      if (courseId) {
        const courseExists = await sql`
        SELECT id FROM courses WHERE id = ${courseId}
      `;

        if (courseExists.length === 0) {
          return res.status(404).json({
            status: false,
            message: "Course not found",
          });
        }
      }

      const updatedNotification = await sql`
      UPDATE notifications 
      SET 
        type = ${type},
        title = ${title},
        body = ${message},
        sent_to = ${sent_to},
        content_type = ${content_type || null},
        course_id = ${courseId || null},
        updated_at = NOW()
      WHERE id = ${notificationId}
      RETURNING *
    `;

      res.status(200).json({
        status: true,
        message: "Notification updated successfully",
        data: updatedNotification[0],
      });
    } catch (err) {
      next(err);
    }
} 

async function deleteNotification(req , res , next){
  try {
    const {notificationId} = req.params
    if(!notificationId){
      return res.status(400).json({
        status : false , 
        message : "bad request"
      })
    }
    await sql`
      DELETE FROM notifications WHERE id = ${notificationId};
    `;

    res.status(200).json({
      status : true , 
      message : "notification was deleted succesfully"
    })
  }
  catch(err){
    next(err)
  }
}

module.exports = {
  getCoursesIds,
  getAllNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  createUserNotifications,
};
