import type { NotificationData } from "@/Shared/lib/type";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

export const useNotificationApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getUserNotifications = useCallback(async () => {
    const headers = await getAuthHeader();
    try {
      const response = await fetch(`https://daily-lesson-platform.onrender.com/notifications/`, {
        method: "GET",
        headers,
      });

      const data = await handleResponse<NotificationData[]>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data;
    } catch (error: any) {
      toastOnce(error.message || "Failed to fetch notifications");
      return null;
    }
  }, [getAuthHeader]);


  const markAllRead = async () => {
    const headers = await getAuthHeader();
    try {
      const response = await fetch(
        `https://daily-lesson-platform.onrender.com/notifications/mark-all-read`,
        {
          method: "PATCH",
          headers,
        }
      );

      const data = await handleResponse<any>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data;
    } catch (error: any) {
      toastOnce(error.message || "Failed to mark all as read");
      return null;
    }
  };

  const markAsRead = async (notificationId: string) => {
    const headers = await getAuthHeader();
    try {
      const response = await fetch(
        `https://daily-lesson-platform.onrender.com/notifications/${notificationId}`,
        {
          method: "PATCH",
          headers,
        }
      );

      const data = await handleResponse<{ message: string }>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data;
    } catch (error: any) {
      toastOnce(error.message || "Failed to mark notification as read");
      return null;
    }
  };

  return {
    getUserNotifications,
    markAllRead,
    markAsRead,
  };
};
