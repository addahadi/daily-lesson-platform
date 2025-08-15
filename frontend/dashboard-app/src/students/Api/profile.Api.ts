import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/lib/utils"; 
import { useAuth } from "@clerk/clerk-react";
import type { achievementsProps, UserInfoProps, XpData } from "@/lib/type";

const useProfileApiController = () => {
  const { getToken } = useAuth();
  const getAuthHeader = async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };
  const getUserInfo = useCallback(async () => {
    const headers = await getAuthHeader()
    try {
      const response = await fetch(
        `http://localhost:8090/auth/user-info/`,
        {
          method: "GET",
          headers : headers
        }
      );

      const data = await handleResponse<UserInfoProps>(response);
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

  const getUserAchievements = useCallback(async () => {
    const headers = await getAuthHeader();

    try {
      const response = await fetch(
        `http://localhost:8090/auth/user-achievements/`,
        {
          method: "GET",
          headers:headers
        }
      );

      const data = await handleResponse<achievementsProps[]>(response);
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

  const getXpLogs = useCallback(async () => {
    const headers = await getAuthHeader();
    try {
      const response = await fetch(
        `http://localhost:8090/auth/xp-logs/`,
        {
          method: "GET",
          headers: headers
        }
      );

      const data = await handleResponse<XpData[]>(response);
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
