import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/lib/utils";

const useNoteApi = () => {
  const { getToken } = useAuth();

  const getAllNotes = useCallback(
    async (userId: string, page: number) => {
      const token = await getToken();
      const URL = `http://localhost:8090/note/all-notes?userId=${userId}&page=${page}`;

      try {
        const res = await fetch(URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await handleResponse<{ data: any[] }>(res);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getToken]
  );

  const getLessonNote = useCallback(
    async (lessonId: string, userId: string) => {
      const token = await getToken();
      const URL = `http://localhost:8090/note/lesson-note/${lessonId}/${userId}`;

      try {
        const res = await fetch(URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await handleResponse<{ data: any }>(res);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getToken]
  );

  const addNote = useCallback(
    async (
      title: string,
      content: string,
      lessonId: string,
      userId: string
    ) => {
      const token = await getToken();
      const body = JSON.stringify({ title, content, lessonId, userId });

      try {
        const res = await fetch(`http://localhost:8090/note/add-note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        });

        const data = await handleResponse(res);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getToken]
  );

  return {
    getAllNotes,
    getLessonNote,
    addNote,
  };
};

export default useNoteApi;
