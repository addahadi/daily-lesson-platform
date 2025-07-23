import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

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

        if (res.ok) {
          const result = await res.json();
          return result.data;
        } else if (res.status === 404) {
          return null;
        }
      } catch (err) {
        console.error("Error fetching all notes:", err);
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

        if (res.ok) {
          const result = await res.json();
          return result.data;
        }
      } catch (err) {
        console.error("Error fetching lesson note:", err);
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

        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.error("Error adding note:", err);
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
