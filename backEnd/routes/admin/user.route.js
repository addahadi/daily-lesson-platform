const express = require("express")
const { getUsers , UpdateUser , DeleteUser} = require("../../controller/admin/user.controller")
const router = express.Router()



router.get("/" , getUsers)
router.post("/:userId" , UpdateUser)
router.delete("/:userId" , DeleteUser);


module.exports = router