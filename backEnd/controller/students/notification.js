const sql = require("../../db")

const getUserNotifications = async (req, res, next) => {
  const userId = req.auth.userId;
  const { user_id } = req.params;
  console.log("req.auth.userId:", userId, typeof userId);
  console.log("req.params.user_id:", user_id, typeof user_id);

  try {
    if (userId !== user_id) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized access.",
      });
    }

    const userNotifications = await sql`
      SELECT 
        nu.id, 
        nu.is_read, 
        nu.created_at,
        n.type, 
        n.title, 
        n.body, 
        n.content_type, 
        n.course_id
      FROM user_notification AS nu
      JOIN notifications AS n ON n.id = nu.notification_id
      WHERE nu.user_id = ${userId}
      ORDER BY nu.created_at DESC
    `;

    if (userNotifications.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No notifications found.",
      });
    }

    res.status(200).json({
      status: true,
      data: userNotifications,
    });
  } catch (err) {
    next(err);
  }
};

const MarkAllRead = async (req, res, next) => {
  const { user_id } = req.params;
  const userId = req.auth.userId;

  try {
    if (userId !== user_id) {
      return res.status(403).json({
        status: false,
        message: "Unauthorized access.",
      });
    }

    const result = await sql`
      UPDATE user_notification
      SET is_read = true
      WHERE user_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No unread notifications found.",
      });
    }

    res.status(200).json({
      status: true,
      message: `${result.length} notifications marked as read.`,
    });
  } catch (err) {
    next(err);
  }
};

const MarkAsRead = async (req, res, next) => {
  const userId = req.auth.userId;
  const { notification_id } = req.params;

  try {
    const [existing] = await sql`
      SELECT id FROM user_notification
      WHERE id = ${notification_id} AND user_id = ${userId}
    `;

    if (!existing) {
      return res.status(404).json({
        status: false,
        message: "Notification not found or unauthorized.",
      });
    }

    const [updated] = await sql`
      UPDATE user_notification
      SET is_read = true
      WHERE id = ${notification_id}
      RETURNING id
    `;

    res.status(200).json({
      status: true,
      message: "Notification marked as read.",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};



module.exports = {
    MarkAllRead,
    MarkAsRead,
    getUserNotifications
}