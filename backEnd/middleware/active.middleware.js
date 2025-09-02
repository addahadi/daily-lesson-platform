const { requireAuth } = require("@clerk/express");

function requireActiveUser() {
  return [
    requireAuth(),
    async (req, res, next) => {
      try {
        const status = req.auth.sessionClaims?.status;

        if (status === "unactive") {
          return res.status(403).json({ message: "Your account is inactive" });
        }

        next();
      } catch (err) {
        console.error("requireActiveUser error:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
    },
  ];
}

module.exports = requireActiveUser;
