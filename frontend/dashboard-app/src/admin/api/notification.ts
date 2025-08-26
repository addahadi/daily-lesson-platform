import type { NotificationType } from "@/Shared/lib/adminType";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { data } from "react-router-dom";
import { toast } from "sonner";

const useNotificationApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getCoursesId = useCallback(async () => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/notifications/courses-ids`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });
      const result = await handleResponse<any>(response);

      if (typeof result === "string") {
        toastOnce(result);
        return null;
      }
      return result.data;
    } catch (err: any) {
      toastOnce(err.message || "Error fetching courses ids");
      return null;
    }
  }, [getAuthHeader]);

  const getCourseNotifications = useCallback(
    async (page: number) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/notifications?page=${page}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });
        const result = await handleResponse<NotificationType[]>(response);

        if (typeof result === "string") {
          toastOnce(result);
          return null;
        }
        return result;
      } catch (err: any) {
        toastOnce(err.message || "Error fetching notifications");
        return null;
      }
    },
    [getAuthHeader]
  );

  const createNotification = useCallback(
    async (requestBody: {
      type: string;
      title: string;
      message: string;
      sent_to: string;
      content_type: string;
      course_id: string;
    }) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/notifications/`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });

        const result = await handleResponse<any>(response);
        if (typeof result === "string") {
          toastOnce(result);
          return null;
        }
        return result.data;
      } catch (err: any) {
        toastOnce(err.message || "Error creating notification");
        return null;
      }
    },
    [getAuthHeader]
  );

  const updateNotification = useCallback(
    async (
      requestBody: {
        type: string;
        title: string;
        message: string;
        sent_to: string;
        content_type: string;
        course_id: string;
      },
      id: string
    ) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/notifications/${id}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "PUT",
          headers,
          body: JSON.stringify(requestBody),
        });

        const result = await handleResponse<any>(response);
        if (typeof result === "string") {
          toastOnce(result);
          return null;
        }
        return result.data;
      } catch (err: any) {
        toastOnce(err.message || "Error updating notification");
        return null;
      }
    },
    [getAuthHeader]
  );

  const deleteNotification = useCallback(
    async (id: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/notifications/${id}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "DELETE",
          headers,
        });

        const result = await handleResponse<{ message: string }>(response);
        if (typeof result === "string") {
          toastOnce(result);
          return false;
        }

        toast.success(
          result.message || "The notification was deleted successfully"
        );
        return true;
      } catch (err: any) {
        toastOnce(err.message || "Error deleting notification");
        return false;
      }
    },
    [getAuthHeader]
  );

  const createUserNotification = async ({
    sent_to,
    courseId,
    notificationId,
  }: {
    sent_to: string;
    courseId: string;
    notificationId: string;
  }) => {
    const headers = await getAuthHeader();
    try {
      const requestBody = { sent_to, courseId, notificationId };
      const response = await fetch(
        "https://daily-lesson-platform.onrender.com/admin/notifications/user-notifications",
        {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        }
      );

      const result = await handleResponse<any>(
        response
      );
      if (typeof result === "string") {
        toastOnce(result);
        return;
      }
      return result.data;
    } catch (err: any) {
      toastOnce(err.message || "Something went wrong");
    }
  };

  return {
    getCoursesId,
    getCourseNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    createUserNotification,
  };
};

export default useNotificationApi;
