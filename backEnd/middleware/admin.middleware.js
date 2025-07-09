

const { requireAuth } = require("@clerk/express");

function requireAdmin(){
    return [
        requireAuth()
        , 
        async (req , res , next) => {
            const Role = req.auth().sessionClaims?.user_role;
            if(Role !== "admin"){
                return res.status(403).json({
                    message : "admin only"
                })
            }
            next()
        }
    ]
}

module.exports = requireAdmin