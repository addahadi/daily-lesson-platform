import type { Course } from "@/Shared/lib/adminType";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";
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

  const getCourses = async (page: number) => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/course?page=${page}`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });

      const result = await handleResponse<Course[]>(response);

      if (typeof result === "string") {
        toastOnce(result);
        return null;
      }
      return result;
    } catch (err: any) {
      toastOnce(err.message);
      return null;
    }
  };
  const UpdateCourse = async (courseData: Partial<Course>) => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/course/`;
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
  };

  const ToggleCourseView = async (courseId: string) => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/course/${courseId}`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, {
        method: "PATCH",
        headers,
      });
      const data = await handleResponse<any>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.message;
    } catch (err: any) {
      toastOnce(err.message || "failed to hide the course");
    }
  };
  return {
    getCourses,
    UpdateCourse,
    ToggleCourseView,
  };
};

export default useCourseApi;
