import { handleResponse, toastOnce } from "@/Shared/lib/utils";
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
      const data = await handleResponse<Record<string, string | number>>(
        response
      );

      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data ?? null;
    } catch (err) {
      console.error("Error fetching streak analytics:", err);
      toastOnce((err as Error).message);
      return null;
    }
  }, [getAuthHeader]);

  const getLessonAnalyticData = useCallback(async () => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/analytics/lessons`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });
      const data = await handleResponse<Record<string, string | number>>(
        response
      );

      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data ?? null;
    } catch (err) {
      console.error("Error fetching lesson analytics:", err);
      toastOnce((err as Error).message);
      return null;
    }
  }, [getAuthHeader]);

  const getUserAnalyticData = useCallback(async () => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/analytics/users`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });
      const data = await handleResponse<Record<string, string | number>>(
        response
      );

      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data ?? null;
    } catch (err) {
      console.error("Error fetching user analytics:", err);
      toastOnce((err as Error).message);
      return null;
    }
  }, [getAuthHeader]);

  const getChartData = useCallback(async () => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/analytics/charts`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });
      const data = await handleResponse<Record<string, number>>(response);

      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data ?? null;
    } catch (err) {
      console.error("Error fetching chart analytics:", err);
      toastOnce((err as Error).message);
      return null;
    }
  }, [getAuthHeader]);

  return {
    getLessonAnalyticData,
    getStreakAnalyticData,
    getUserAnalyticData,
    getChartData,
  };
};

export default useAnalyticApi;
