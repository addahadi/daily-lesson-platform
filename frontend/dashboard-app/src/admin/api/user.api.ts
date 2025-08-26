import type { UserInfo } from "@/Shared/lib/adminType";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { toast } from "sonner";

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
        toastOnce(err.message || "Failed to fetch users");
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
        const response = await fetch(URL, { method: "DELETE", headers });

        const result = await handleResponse<any>(response);
        if (typeof result === "string") {
          toastOnce(result);
          return false;
        }
        toast.success(result.message || "User deleted successfully");
        return true;
      } catch (err: any) {
        toastOnce(err.message || "Failed to delete user");
        return false;
      }
    },
    [getAuthHeader]
  );

  const updateUser = useCallback(
    async (userId: string, role: string, status: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/user/${userId}`;
      const requestBody = { role, status };
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });

        const result = await handleResponse<UserInfo>(response);
        if (typeof result === "string") {
          toastOnce(result);
          return null;
        }
        toast.success("User updated successfully");
        return result.data;
      } catch (err: any) {
        toastOnce(err.message || "Failed to update user");
        return null;
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
