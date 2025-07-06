import "./App.css";

import { Route, Routes } from "react-router-dom";
import LoginInPage from "./students/app/LoginInPage";
import SignUpPage from "./students/app/SignUpPage";
import Home from "./students/app/sidebar/Home";
import Dashboard from "./students/app/sidebar/Dashboard";
import PrivateRoute from "./components/component/PrivateRoute";
import Profile from "./students/app/sidebar/Profile";
import Courses from "./students/app/sidebar/Courses";
import useSyncUserProfile from "./students/hook/useSyncUserProfile";
import Discover from "./students/app/sidebar/Discover";
import Course from "./students/app/Course";
import Lesson from "./students/app/Lesson";
import Notes from "./students/app/sidebar/Notes";
function App() {
  useSyncUserProfile();
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute />}></Route>
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
    </Routes>
  );
}
export default App;
