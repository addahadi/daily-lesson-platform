const express = require("express");
require("dotenv").config();
const pool = require("./db");
const cors = require("cors")
const authRoutes = require("../backEnd/routes/auth.route")
const courseRoutes = require("../backEnd/routes/course.route")
const lessonRoutes = require("../backEnd/routes/lesson.route")
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
app.listen(8090 , () => {
    console.log("it is working")
})
