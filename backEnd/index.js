const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

const { requireAuth } = require("@clerk/express");




// public routes

const publicCourseRoute = require("../backEnd/routes/public/course.route")


// student routes
const authRoutes = require("../backEnd/routes/students/auth.route");
const courseRoutes = require("../backEnd/routes/students/course.route");
const lessonRoutes = require("../backEnd/routes/students/lesson.route");
const homeRoutes = require("../backEnd/routes/students/home.route");
const noteRoutes = require("../backEnd/routes/students/note.route");
const errorHandler = require("../backEnd/middleware/error.middleware");
const webhookRouter = require("../backEnd/routes/Webhook");
const folderRouter = require("../backEnd/routes/students/folder.route")
const notificationRoute  = require("../backEnd/routes/students/notification.route")

// admin router
const adminUserRouter = require("../backEnd/routes/admin/user.route");
const requireAdmin = require("./middleware/admin.middleware");
const adminCourseRouter = require("../backEnd/routes/admin/course.route");
const lessonRoutesAdmin = require("../backEnd/routes/admin/lesson.route");
const analyticsRouteAdmin = require("../backEnd/routes/admin/analytics.route")
const notificationRouteAdmin = require("../backEnd/routes/admin/notification.route")

import cors from "cors";

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://devlevelup-dashboard.vercel.app",
  
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(
  "/api/webhooks",
  express.raw({ type: "*/*" }),
  webhookRouter
);

app.use(express.json());

// API routes

app.use("/public/courses" , publicCourseRoute)
app.use("/auth" , requireAuth(), authRoutes);
app.use("/course" , requireAuth(), courseRoutes);
app.use("/lesson" , requireAuth(), lessonRoutes);
app.use("/home" , requireAuth(), homeRoutes);
app.use("/note" , requireAuth(), noteRoutes);
app.use("/folder" , requireAuth() , folderRouter)
app.use("/notifications", requireAuth(), notificationRoute);
app.use("/admin/user" , requireAdmin() , adminUserRouter);
app.use("/admin/course" , requireAdmin() , adminCourseRouter);
app.use("/admin/lesson", requireAdmin(), lessonRoutesAdmin);
app.use("/admin/analytics" , requireAdmin() , analyticsRouteAdmin)
app.use("/admin/notifications" , requireAdmin() , notificationRouteAdmin);

app.use(errorHandler);


const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
