import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";
import type { EnrolledLessons } from "@/Shared/lib/type";

const useHomeApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getEnrolledCourses = useCallback(async () => {
    const URL = `https://daily-lesson-platform.onrender.com/home/enrolled-courses`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });

      const data = await handleResponse<
        { title: string; course_id: string; enrollment_id: string }[]
      >(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data;
    } catch (err: any) {
      toastOnce(err.message || "Something went wrong");
      return null;
    }
  }, [getAuthHeader]);

  const getEnrolledCoursesNumber = useCallback(
    async () => {
      const URL = `https://daily-lesson-platform.onrender.com/home/total-enrolled-courses/`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<{total_courses: number}[]>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  const getNextLesson = useCallback(
    async (courseId: string, enrollmentId: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/home/next-lessons?courseId=${courseId}&enrollmentId=${enrollmentId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<EnrolledLessons>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  const getTotalLessons = useCallback(
    async () => {
      const URL = `https://daily-lesson-platform.onrender.com/home/total-lessons/`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<{
          completed_lessons: string;
          total_lessons: string;
        }[]>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  const getDailyStreak = useCallback(
    async () => {
      const URL = `https://daily-lesson-platform.onrender.com/home/streak-days/`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<{streak_count:number}[]>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  return {
    getEnrolledCourses,
    getEnrolledCoursesNumber,
    getNextLesson,
    getTotalLessons,
    getDailyStreak,
  };
};

export default useHomeApi;
