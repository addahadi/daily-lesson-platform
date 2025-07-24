import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/lib/utils"; 

const useProfileApiController = () => {
  const getUserInfo = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8090/auth/user-info/${userId}`,
        {
          method: "GET",
        }
      );

      const data = await handleResponse<{ data: any }>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data;
    } catch (error: any) {
      toastOnce(error.message || "Failed to fetch user info");
      return null;
    }
  }, []);

  const getUserAchievements = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8090/auth/user-achievements/${userId}`,
        {
          method: "GET",
        }
      );

      const data = await handleResponse<{ data: any }>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data;
    } catch (error: any) {
      toastOnce(error.message || "Failed to fetch user achievements");
      return null;
    }
  }, []);

  const getXpLogs = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8090/auth/xp-logs/${userId}`,
        {
          method: "GET",
        }
      );

      const data = await handleResponse<{ data: any[] }>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data;
    } catch (error: any) {
      toastOnce(error.message || "Failed to fetch XP logs");
      return null;
    }
  }, []);

  return {
    getUserInfo,
    getUserAchievements,
    getXpLogs,
  };
};

export default useProfileApiController;
