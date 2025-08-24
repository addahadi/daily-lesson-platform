import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

const useAnalyticApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getStreakAnalyticData = useCallback(async () => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/analytics/streaks`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching streak analytics:", err);
      return null;
    }
  }, [getAuthHeader]);

  const getLessonAnalyticData = useCallback(async () => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/analytics/lessons`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching lesson analytics:", err);
      return null;
    }
  }, [getAuthHeader]);

  const getUserAnalyticData = useCallback(async () => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/analytics/users`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching user analytics:", err);
      return null;
    }
  }, [getAuthHeader]);


  const getChartData = useCallback(async () => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/analytics/charts`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });
      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      return null
    } 
    catch (err) {
      console.error("Error fetching user analytics:", err);
      return null;
    }

  }, [getAuthHeader]);

  return {
    getLessonAnalyticData,
    getStreakAnalyticData,
    getUserAnalyticData,
    getChartData
  };
};

export default useAnalyticApi;
