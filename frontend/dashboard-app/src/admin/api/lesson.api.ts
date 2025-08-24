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
      const URL = `http://localhost:8090/admin/lesson/${moduleId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "GET", headers });

        if (response.ok) {
          const result = await response.json();
          return result.data;
        } else if (response.status === 404) {
          return null;
        }
      } catch (err) {
        console.error(err);
      }
    },
    [getAuthHeader]
  );

  const createUpdateLesson = useCallback(
    async (
      moduleId: string,
      requestBody: Record<string, string | number | null>
    ) => {
      const URL = `http://localhost:8090/admin/lesson/${moduleId}`;
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
        } else if (response.status === 404) {
          return null;
        }
      } catch (err) {
        console.error(err);
      }
    },
    [getAuthHeader]
  );

  const updateOrderIndex = useCallback(
    async (
      moduleId: string,
      requestBody: {
        id: string;
        order_index: number;
      }[]
    ) => {
      const URL = `http://localhost:8090/admin/lesson/order/${moduleId}`;

      try {
        const headers = await getAuthHeader();
        const res = await fetch(URL, {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Server Error: ${res.status} - ${errorText}`);
        }
      } catch (err) {
        console.error("Failed to update order:", err);
        throw err;
      }
    },
    [getAuthHeader]
  );

  const updateLessonContent = useCallback(
    async (lessonId: string, requestBody: { sections: section[] }) => {
      const URL = `http://localhost:8090/admin/lesson/content/${lessonId}`;

      try {
        const headers = await getAuthHeader();
        const res = await fetch(URL, {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (res.ok) {
          const result = await res.json();
          return result.data;
        }
      } catch (err) {
        console.error("Failed to update lesson content:", err);
        throw err;
      }
    },
    [getAuthHeader]
  );

  const updateAddLessonQuizz = useCallback(
    async (lessonId: string, requestBody: QuizzProps) => {
      const URL = `http://localhost:8090/admin/lesson/quizz/${lessonId}`;

      try {
        const headers = await getAuthHeader();
        const res = await fetch(URL, {
          method: "PUT",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (res.ok) {
          const result = await res.json();
          return result.data;
        } else return null;
      } catch (err) {
        console.error("Failed to update lesson content:", err);
        throw err;
      }
    },
    [getAuthHeader]
  );

  const deleteLesson = async (lessonId: string) => {
    const URL = `http://localhost:8090/admin/lesson/delete/${lessonId}`;
    try {
      const headers = await getAuthHeader();
      const res = await fetch(URL, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });

      const data = await handleResponse<any>(res);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.message;
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
