const { requireAuth } = require("@clerk/express");
const { users } = require("@clerk/clerk-sdk-node"); 

function requireAdmin() {
  return [
    requireAuth(),
    async (req, res, next) => {
      try {
        const role = req.auth.sessionClaims?.user_role;

        if (role !== "admin") {
          return res.status(403).json({ message: "admin only" });
        }
        
        const email = req.auth.sessionClaims?.email;
        
        if (email === "demo@devlevelup.com" && req.method !== "GET") {
          return res.status(403).json({ message: "Demo account is read-only" });
        }

        next();
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
  ];
}

module.exports = requireAdmin;
