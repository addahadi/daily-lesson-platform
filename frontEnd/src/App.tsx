import "./App.css";
import { Route, Routes } from "react-router-dom";
import LoginInPage from "./students/app/LoginInPage";
import SignUpPage from "./students/app/SignUpPage";
import Home from "./students/app/sidebar/Home";
import Dashboard from "./students/app/sidebar/Dashboard";
import PrivateRoute from "./students/components/PrivateRoute";
import Profile from "./students/app/sidebar/Profile";
import Courses from "./students/app/sidebar/Courses";
import Discover from "./students/app/sidebar/Discover";
import Course from "./students/app/Course";
import Lesson from "./students/app/Lesson";
import Notes from "./students/app/sidebar/Notes";
import Private from "./Private";
import UserManagement from "./admin/app/UserManagement";
import CourseManegement from "./admin/app/CourseManegement";
import ModuleManagement from "./admin/app/ModuleManegement";
import LessonManagement from "./admin/app/LessonManagement";
import LessonContent from "./admin/app/LessonContent";
import AdminAnalytics from "./admin/app/adminAnalytics";
import Notification from "./admin/app/Notification";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const prefersDark = localStorage.getItem("theme") === "dark";
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (

      <Routes>
        <Route path="/" element={<PrivateRoute />} />
        <Route path="/login" element={<LoginInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<Courses />} />
          <Route path="discover" element={<Discover />} />
          <Route path="course/:CourseId" element={<Course />} />
          <Route path="notes" element={<Notes />} />
          <Route
            path="course/:courseId/module/:moduleId/lesson/:lessonId"
            element={<Lesson />}
          />
        </Route>
        <Route path="/admin" element={<Private />}>
          <Route path="user-management" element={<UserManagement />} />
          <Route path="course-management" element={<CourseManegement />} />
          <Route path="course/:courseId" element={<ModuleManagement />} />
          <Route
            path="course/:courseId/module/:moduleId"
            element={<LessonManagement />}
          />
          <Route
            path="course/:courseId/module/:moduleId/lesson/:lessonId"
            element={<LessonContent />}
          />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="notification" element={<Notification />} />
        </Route>
      </Routes>
  );
}

export default App;
