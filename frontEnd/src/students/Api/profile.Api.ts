import { useCallback } from "react";

const useProfileApiController = () => {
  const getUserInfo = useCallback(async (userId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8090/auth/user-info/${userId}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const { data } = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
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
      if (response.ok) {
        const { data } = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error fetching user achievements:", error);
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
      if (response.ok) {
        const { data } = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error fetching XP logs:", error);
    }
  }, []);

  return {
    getUserInfo,
    getUserAchievements,
    getXpLogs,
  };
};

export default useProfileApiController;
