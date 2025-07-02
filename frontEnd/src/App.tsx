import "./App.css";

import { Route, Routes } from "react-router-dom";
import LoginInPage from "./app/LoginInPage";
import SignUpPage from "./app/SignUpPage";
import Home from "./app/sidebar/Home";
import Dashboard from "./app/sidebar/Dashboard";
import PrivateRoute from "./components/component/PrivateRoute";
import Profile from "./app/sidebar/Profile";
import Courses from "./app/sidebar/Courses";
import useSyncUserProfile from "./hook/useSyncUserProfile"
import Discover from "./app/sidebar/Discover";
import Course from "./app/Course";
import Lesson from "./app/Lesson";
import Notes from "./app/sidebar/Notes";
function App() {
  useSyncUserProfile();
  return (
      <Routes>
        <Route path="/" element={<PrivateRoute />}></Route>
        <Route path="/login" element={<LoginInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home/>}/>
          <Route path="profile" element={<Profile />} />
          <Route path="courses" element={<Courses/>} />
          <Route path="discover" element={<Discover />} />
          <Route path="course/:CourseId" element={<Course/>} />
          <Route path="notes" element={<Notes/>} />
        <Route
          path="course/:courseId/module/:moduleId/lesson/:lessonId"
          element={<Lesson />}
        />
        </Route>

      </Routes>
    
  );
}
export default App;
