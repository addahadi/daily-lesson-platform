import { useAuth } from "@clerk/clerk-react";

const useNoteApi = () => {
  const { getToken } = useAuth();

  const getAllNotes = async (userId: string, page: number) => {
    const token = await getToken();
    const URL = `http://localhost:8090/note/all-notes?userId=${userId}&page=${page}`;
    const res = await fetch(URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const result = await res.json();
      return result.data;
    }
    else if (res.status === 404){
      return null
    }
  };

  const getLessonNote = async (lessonId: string, userId: string) => {
    const token = await getToken();
    const URL = `http://localhost:8090/note/lesson-note/${lessonId}/${userId}`;
    const res = await fetch(URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const result = await res.json();
      return result.data;
    }
  };

  const addNote = async (
    title: string,
    content: string,
    lessonId: string,
    userId: string
  ) => {
    const token = await getToken();
    const body = JSON.stringify({ title, content, lessonId, userId });
    const res = await fetch(`http://localhost:8090/note/add-note`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });
    if (res.ok) return await res.json();
  };

  return {
    getAllNotes,
    getLessonNote,
    addNote,
  };
};

export default useNoteApi;
