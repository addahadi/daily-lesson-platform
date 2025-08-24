const express = require("express")
const { getUserNotifications, MarkAllRead, MarkAsRead } = require("../../controller/students/notification")
const { validate } = require("../../middleware/validate.middleware")
const router = express.Router()


router.get("/", getUserNotifications)
router.patch(
  "/mark-all-read",
  MarkAllRead
);
router.patch("/:notificationId" , MarkAsRead)


module.exports = router