const express = require("express");
const router = express.Router();
const {SignUp , enrollToCourse , checkEnroll , getEnroll} = require("../controller/auth.controller")


router.post("/signup" , (req , res) => {
    SignUp(req , res)
})

router.post("/enroll" , (req ,res) => {
    enrollToCourse(req , res)    
})

router.get("/checkenroll" , (req , res) => {
    checkEnroll(req , res)
})

router.get("/getenroll" , (req ,res) => {
    getEnroll(req , res)
})
module.exports = router