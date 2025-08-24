import type { UserInfo } from "@/Shared/lib/adminType";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

const useUserApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getUsers = useCallback(
    async (page: number) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/user?page=${page}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });
        const result = await handleResponse<UserInfo[]>(response);
        if (typeof result === "string") {
          toastOnce(result);
          return null;
        }
        return result;
      } catch (err: any) {
        toastOnce(err.message);
        return null;
      }
    },
    [getAuthHeader]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/user/${userId}`;
      try {
        const headers = await getAuthHeader();
        await fetch(URL, { method: "DELETE", headers });
      } catch (err) {
        console.error("deleteUser error:", err);
      }
    },
    [getAuthHeader]
  );

  const updateUser = useCallback(
    async (userId: string, role: string, status: string) => {
      const requestBody = { role, status };
      const URL = `https://daily-lesson-platform.onrender.com/admin/user/${userId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const result = await response.json();
          return result.data;
        }
      } catch (err) {
        console.error("updateUser error:", err);
      }
    },
    [getAuthHeader]
  );

  return {
    getUsers,
    updateUser,
    deleteUser,
  };
};

export default useUserApi;
