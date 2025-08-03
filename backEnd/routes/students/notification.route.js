const express = require("express")
const { getUserNotifications, MarkAllRead, MarkAsRead } = require("../../controller/students/notification")
const { validate } = require("../../middleware/validate.middleware")
const router = express.Router()


router.get("/:user_id", validate(
    {user_id : "string"}, "params"
) , getUserNotifications)
router.patch(
  "/:user_id",
  validate({ user_id: "string" }, "params"),
  MarkAllRead
);
router.patch("/:notificationId" , MarkAsRead)


module.exports = router