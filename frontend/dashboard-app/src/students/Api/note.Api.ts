import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";
import type { notesProps } from "@/Shared/lib/type";

const useNoteApi = () => {
  const { getToken } = useAuth();
  const getAllNotes = useCallback(
    async (page: number) => {
      const token = await getToken();
      const URL = `https://daily-lesson-platform.onrender.com/note/all-notes?page=${page}`;

      try {
        const res = await fetch(URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await handleResponse<notesProps[]>(res);
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

  const deleteNote = async (lessonId: string) => {
    const token = await getToken();
    const URL = `https://daily-lesson-platform.onrender.com/note/delete-note/${lessonId}`;
    try {
      const res = await fetch(URL, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await handleResponse<any>(res);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.message;
    } catch (err: any) {
      toastOnce(err.message || "Something went wrong");
      return null;
    }
  };
  const getLessonNote = useCallback(
    async (lessonId: string) => {
      const token = await getToken();
      const URL = `https://daily-lesson-platform.onrender.com/note/lesson-note/${lessonId}`;

      try {
        const res = await fetch(URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        type note = {
          title: string;
          content: string;
        };
        const data = await handleResponse<note>(res);
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
    async (title: string, content: string, lessonId: string) => {
      const token = await getToken();
      const body = JSON.stringify({ title, content, lessonId });

      try {
        const res = await fetch(`https://daily-lesson-platform.onrender.com/note/add-note`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        });

        const data = await handleResponse<any>(res);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.message;
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
    deleteNote,
  };
};

export default useNoteApi;
