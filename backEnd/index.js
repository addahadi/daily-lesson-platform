const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const rateLimit = require("express-rate-limit");

// 🌍 Global limiter (protect everything, but generous enough for normal usage)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000, // 1000 requests per IP 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

//  Auth limiter (stop brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200, // only 200 login attempts per 15 min per IP
  message: {
    success: false,
    error: "Too many login attempts. Try again later.",
  },
});

//  Notes limiter (prevent spam save/updates)
const notesLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 60, 
  message: {
    success: false,
    error: "You are saving/updating notes too quickly.",
  },
});

//  Lessons limiter (users fetch lessons often, so higher cap)
const lessonsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 200, 
});

//  Quiz limiter (avoid quiz answer spam)
const quizLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 30, 
  message: {
    success: false,
    error: "Too many quiz submissions. Slow down.",
  },
});

//  Notifications limiter (avoid polling spam)
const notificationsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 60,
});


const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://devlevelup-dashboard.vercel.app",
];

app.use(globalLimiter); 


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow requests with no origin
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
  require("../backEnd/routes/Webhook")
);

app.use(express.json());


// Public
app.use("/public/courses", require("../backEnd/routes/public/course.route"));

// Student
const requireActiveUser = require("./middleware/active.middleware");
app.use(
  "/auth",
  authLimiter,
  requireActiveUser(),
  require("../backEnd/routes/students/auth.route")
);
app.use(
  "/course",
  requireActiveUser(),
  require("../backEnd/routes/students/course.route")
);
app.use(
  "/lesson",
  lessonsLimiter,
  requireActiveUser(),
  require("../backEnd/routes/students/lesson.route")
);
app.use(
  "/home",
  requireActiveUser(),
  require("../backEnd/routes/students/home.route")
);
app.use(
  "/note",
  notesLimiter,
  requireActiveUser(),
  require("../backEnd/routes/students/note.route")
);
app.use(
  "/folder",
  requireActiveUser(),
  require("../backEnd/routes/students/folder.route")
);
app.use(
  "/notifications",
  notificationsLimiter,
  requireActiveUser(),
  require("../backEnd/routes/students/notification.route")
);

// Admin
const requireAdmin = require("./middleware/admin.middleware");
app.use(
  "/admin/user",
  requireAdmin(),
  require("../backEnd/routes/admin/user.route")
);
app.use(
  "/admin/course",
  requireAdmin(),
  require("../backEnd/routes/admin/course.route")
);
app.use(
  "/admin/lesson",
  requireAdmin(),
  require("../backEnd/routes/admin/lesson.route")
);
app.use(
  "/admin/analytics",
  requireAdmin(),
  require("../backEnd/routes/admin/analytics.route")
);
app.use(
  "/admin/notifications",
  requireAdmin(),
  require("../backEnd/routes/admin/notification.route")
);

const errorHandler = require("../backEnd/middleware/error.middleware");
app.use(errorHandler);

const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
