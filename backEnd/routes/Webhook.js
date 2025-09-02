const express = require("express");
const router = express.Router();
const { verifyWebhook } = require("@clerk/express/webhooks");
const {
  SignUp,
  UpdateUser,
} = require("../controller/students/auth.controller"); 
const { Clerk } = require("@clerk/clerk-sdk-node");

const clerkClient = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

router.post("/", async (req, res) => {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });

    const eventType = evt.type;
    const user = evt.data;
    const email = user.email_addresses?.[0]?.email_address;
    const firstName = user.first_name;
    const lastName = user.last_name;
    const clerkUserId = user.id;

    if (!email || !firstName) {
      return res.status(400).json({
        message: "Missing required user information",
        details: "Email and first name are required",
      });
    }

    const fullName = `${firstName} ${lastName || ""}`.trim();
    const role = email === "addajs48@gmail.com" ? "admin" : "student";

    const commonUserData = {
      clerk_id: clerkUserId,
      email,
      full_name: fullName,
      image_url: user.image_url || null,
      role,
      status: "active",
    };

    try {
      await clerkClient.users.updateUser(clerkUserId, {
        publicMetadata: {
          role,
          clerk_id: clerkUserId,
          status: "active",
        },
      });
    } catch (metaErr) {
      console.error("Failed to update metadata:", metaErr);
    }

    if (eventType === "user.created") {
      try {
        const result = await SignUp(commonUserData);
        if (result && result.success !== false) {
          return res.status(200).json({ message: "User created successfully" });
        }
        else {
          throw new Error(result.error)
        }
      }
      catch (signUpError) {
        res.status(500).json({
          message: "Failed to create user",
          error: signUpError.message,
        });
      }
    }

    if (eventType === "user.updated") {
      try {
        const result = await UpdateUser(commonUserData);

        if (result && result.success !== false) {
          return res.status(200).json({ message: "User updated successfully" });
        } 
        else {
          throw new Error(result.error);
        }
      } 
      catch (updateErr) {
        res.status(500).json({
          message: "Failed to update user",
          error: updateErr.message,
        });
      }
    }  
  } 
  catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

module.exports = router;
