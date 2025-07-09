import { useAuth } from "@clerk/clerk-react";

const useHomeApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const getEnrolledCourses = async (userId: string) => {
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
  };

  const getEnrolledCoursesNumber = async (userId: string) => {
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
  };

  const getNextLesson = async (courseId: string, enrollmentId: string) => {
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
  };

  const getTotalLessons = async (userId: string) => {
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
  };

  const getDailyStreak = async (userId: string) => {
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
  };

  return {
    getEnrolledCourses,
    getEnrolledCoursesNumber,
    getNextLesson,
    getTotalLessons,
    getDailyStreak,
  };
};

export default useHomeApi;
