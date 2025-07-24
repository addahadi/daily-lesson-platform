const express = require("express");
const { createFolder, deleteFolder, saveCourseToFolder, deleteSavedCourse , getAllFolders } = require("../../controller/students/folder.controller");
const { validate } = require("../../middleware/validate.middleware");
const router = express.Router()



router.post(
  "/",
  validate({ title: "string"}, "body"),
  createFolder
);
router.delete(
  "/:folderId",
  validate({ folderId: "string" }, "params"),
  deleteFolder
);


router.get("/", getAllFolders);



router.post(
  "/save",
  validate({ course_id : "string", folder_id:"string" }, "body"),
  saveCourseToFolder
);
router.delete("/save/:saveId",
    validate({ saveId : "string" }, "params"),
    deleteSavedCourse);


module.exports = router