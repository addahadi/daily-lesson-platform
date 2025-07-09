const express = require("express");
const router = express.Router();
const { verifyWebhook } = require("@clerk/express/webhooks");
const { SignUp } = require("../controller/students/auth.controller");
const { Clerk } = require("@clerk/clerk-sdk-node");



const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });


router.post("/", async (req, res) => {
  try {
    
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    const eventType = evt.type;

    if (eventType === "user.created") {
      const user = evt.data;

      const email = user.email_addresses[0]?.email_address;
      const firstName = user.first_name;
      const lastName = user.last_name;
      const clerkUserId = user.id
      if (!email || !firstName) {
        return res.status(400).json({
          message: "Missing required user information",
          details: "Email and first name are required",
        });
      }


      try {
        await clerkClient.users.updateUser(clerkUserId, {
          publicMetadata: {
            role: email === "addajs48@gmail.com" ? "admin" : "student",
            clerk_id: clerkUserId,
          },
        });

        console.log("Metadata added to Clerk user.");
      } catch (metaErr) {
        console.error("Failed to add metadata:", metaErr);
      }

      const requestBody = {
        clerk_id: user.id,
        email: email,
        full_name: `${firstName} ${lastName || ""}`.trim(),
        image_url: user.image_url || null,
        role: email === "addajs48@gmail.com" ? "admin" : "student",
        status : "active"
      };

      try {
        const result = await SignUp(requestBody);

        if (result && result.success !== false) {
          return res.status(200).json({
            message: "User created successfully",
          });
        } 
        else {
          console.error("SignUp failed:", result);
          return res.status(500).json({
            message: "Failed to create user",
            error: result.error || "Unknown error",
          });
        }
      } 
      catch (signUpError) {
        console.error("SignUp error:", signUpError);
        return res.status(500).json({
          message: "Failed to create user",
          error: signUpError.message,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message
    });
  }
});

module.exports = router;
