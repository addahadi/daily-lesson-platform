const express = require("express");
const router = express.Router();
const {SignUp , enrollToCourse} = require("../controller/auth.controller")


router.post("/signup" , (req , res) => {
    SignUp(req , res)
})

router.post("/enroll" , (req ,res) => {
    enrollToCourse(req , res)    
})


module.exports = router