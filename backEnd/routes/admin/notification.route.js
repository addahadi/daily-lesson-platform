const express = require("express")
const { getCoursesIds , getAllNotifications, createNotification , updateNotification, deleteNotification } = require("../../controller/admin/notification.controller")
const router = express.Router()



router.get("/courses-ids" , getCoursesIds)
router.get("/", getAllNotifications)
router.post("/", createNotification)
router.put("/:notificationId" , updateNotification)
router.delete("/:notificationId" , deleteNotification)
module.exports = router