import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/lib/utils"; 

const useHomeApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getEnrolledCourses = useCallback(
    async (userId: string) => {
      const URL = `http://localhost:8090/home/enrolled-courses/${userId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<{ data: any[] }>(response);
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

  const getEnrolledCoursesNumber = useCallback(
    async (userId: string) => {
      const URL = `http://localhost:8090/home/total-enrolled-courses/${userId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<{ data: number }>(response);
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
      const URL = `http://localhost:8090/home/next-lessons?courseId=${courseId}&enrollmentId=${enrollmentId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<{ data: any }>(response);
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
    async (userId: string) => {
      const URL = `http://localhost:8090/home/total-lessons/${userId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<{ data: number }>(response);
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
    async (userId: string) => {
      const URL = `http://localhost:8090/home/streak-days/${userId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<{ data: number }>(response);
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
