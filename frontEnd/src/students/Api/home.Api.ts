import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

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

        if (response.ok) {
          const result = await response.json();
          return result.data;
        } else if (response.status === 404) {
          console.warn(`No Course found`);
          return null;
        }
      } catch (err) {
        console.error(err);
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

        if (response.ok) {
          const result = await response.json();
          return result.data;
        }
      } catch (err) {
        console.error(err);
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

        if (response.ok) {
          const result = await response.json();
          return result.data;
        } else if (response.status === 404) {
          console.warn(`No next lesson found for course ${courseId}`);
          return null;
        }
      } catch (err) {
        console.error(err);
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

        if (response.ok) {
          const result = await response.json();
          return result.data;
        }
      } catch (err) {
        console.error(err);
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

        if (response.ok) {
          const result = await response.json();
          return result.data;
        }
      } catch (err) {
        console.error(err);
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
