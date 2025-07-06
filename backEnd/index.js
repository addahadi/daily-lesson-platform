const express = require("express");
require("dotenv").config();
const cors = require("cors")
const authRoutes = require("../backEnd/routes/auth.route")
const courseRoutes = require("../backEnd/routes/course.route")
const lessonRoutes = require("../backEnd/routes/lesson.route")
const homeRoutes = require("../backEnd/routes/home.route")
const noteRoutes = require("../backEnd/routes/note.route")
const errorHandler = require("../backEnd/middleware/error.middleware")
const app = express();
app.use(express.json());


app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
  
  


app.use("/auth", authRoutes);
app.use("/course" , courseRoutes);
app.use("/lesson" , lessonRoutes);
app.use("/home" , homeRoutes)
app.use("/note" , noteRoutes)
app.use(errorHandler);

app.listen(8090 , () => {
    console.log("it is working")
})
