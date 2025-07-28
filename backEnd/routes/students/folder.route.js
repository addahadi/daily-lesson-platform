const express = require("express");
const { createFolder, deleteFolder, saveCourseToFolder, deleteSavedCourse , getAllFolders, getCoursesInFolder } = require("../../controller/students/folder.controller");
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

router.get("/:folderId/courses",

  validate({folderId : "string"} , "params")
  , getCoursesInFolder);


router.post(
  "/save",
  validate({ course_id : "string", folder_id:"string" }, "body"),
  saveCourseToFolder
);
router.delete("/save/:course_id/:folder_id",
    validate({ course_id : "string" , folder_id : "string" }, "params"),
    deleteSavedCourse);


module.exports = router