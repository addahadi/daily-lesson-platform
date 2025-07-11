import type { Course } from "@/lib/adminType";
import { useAuth } from "@clerk/clerk-react";

const useCourseApi = () => {
  const { getToken } = useAuth();
  const getAuthHeader = async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const getCourses = async () => {
    const URL = `http://localhost:8090/admin/course/`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });
      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      else if (response.status === 404) {
        return null
      }
    } catch (err) {
      console.error(err);
    }
  };
  const UpdateCourse = async (courseData: Partial<Course>) => {
    const URL = `http://localhost:8090/admin/course/`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify(courseData),
      });
      if (response.ok) {
        const result = await response.json();
        return result.data;
      } else {
        console.error("Failed to update course");
      }

    } catch (err) {
      console.error(err);
    }
  }

  return {
    getCourses,
    UpdateCourse
  };
};

export default useCourseApi;
