import { useCallback } from "react";
import type { section } from "@/Shared/lib/adminType";
import { useAuth } from "@clerk/clerk-react";
import type { QuizzProps } from "@/Shared/lib/type";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";

const useLessonApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getAllLessons = useCallback(
    async (moduleId: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/lesson/${moduleId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        const data = await handleResponse<any>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data ?? null;
      } catch (err: any) {
        toastOnce(err.message || "Failed to fetch lessons");
        return null;
      }
    },
    [getAuthHeader]
  );

  const createUpdateLesson = useCallback(
    async (
      moduleId: string,
      requestBody: Record<string, string | number | null>
    ) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/lesson/${moduleId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });

        const data = await handleResponse<any>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data ?? null;
      } catch (err: any) {
        toastOnce(err.message || "Failed to create/update lesson");
        return null;
      }
    },
    [getAuthHeader]
  );

  const updateOrderIndex = useCallback(
    async (
      moduleId: string,
      requestBody: { id: string; order_index: number }[]
    ) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/lesson/order/${moduleId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "PUT",
          headers,
          body: JSON.stringify(requestBody),
        });

        const data = await handleResponse<any>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.message ?? null;
      } catch (err: any) {
        toastOnce(err.message || "Failed to update lesson order");
        return null;
      }
    },
    [getAuthHeader]
  );

  const updateLessonContent = useCallback(
    async (lessonId: string, requestBody: { sections: section[] }) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/lesson/content/${lessonId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "PUT",
          headers,
          body: JSON.stringify(requestBody),
        });

        const data = await handleResponse<any>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data ?? null;
      } catch (err: any) {
        toastOnce(err.message || "Failed to update lesson content");
        return null;
      }
    },
    [getAuthHeader]
  );

  const updateAddLessonQuizz = useCallback(
    async (lessonId: string, requestBody: QuizzProps) => {
      const URL = `https://daily-lesson-platform.onrender.com/admin/lesson/quizz/${lessonId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "PUT",
          headers,
          body: JSON.stringify(requestBody),
        });

        const data = await handleResponse<any>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data ?? null;
      } catch (err: any) {
        toastOnce(err.message || "Failed to update lesson quiz");
        return null;
      }
    },
    [getAuthHeader]
  );

  const deleteLesson = async (lessonId: string) => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/lesson/delete/${lessonId}`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, {
        method: "PUT",
        headers,
      });

      const data = await handleResponse<any>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.message ?? null;
    } catch (err: any) {
      toastOnce(err.message || "Failed to delete the lesson");
      return null;
    }
  };

  return {
    getAllLessons,
    createUpdateLesson,
    updateOrderIndex,
    updateLessonContent,
    updateAddLessonQuizz,
    deleteLesson,
  };
};

export default useLessonApi;
