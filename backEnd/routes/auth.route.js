const express = require("express");
const router = express.Router();
const {SignUp , enrollToCourse , checkEnroll , getEnroll, getUserInfo, getUserAchievments} = require("../controller/auth.controller");
const { getXpLogs } = require("../controller/xp.controller");


router.post("/signup" , (req , res) => {
    SignUp(req , res)
})

router.post("/enroll" , (req ,res) => {
    enrollToCourse(req , res)    
})

router.get("/checkenroll" , (req , res) => {
    checkEnroll(req , res)
})

router.get("/getenroll", (req, res) => {
  getEnroll(req, res);
});
 
router.get("/user-info/:userId" , (req , res) => {
    getUserInfo(req ,res)
})

router.get("/user-achievements/:userId" , getUserAchievments)

router.get("/xp-logs/:userId" , getXpLogs)

module.exports = router