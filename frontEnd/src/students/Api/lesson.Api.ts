import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/lib/utils"; 

const useLessonApiController = () => {
  const getLessonDetails = useCallback(
    async (lessonId: string, userId: string) => {
      const queryParams = new URLSearchParams({ userId, lessonId });
      const URL = `http://localhost:8090/lesson/get?${queryParams}`;
      try {
        const response = await fetch(URL, { method: "GET" });
        const data = await handleResponse<{ data: any }>(response);
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
    []
  );

  const getLessonsDetails = useCallback(
    async (courseId: string, enrollmentId: string) => {
      const URL = `http://localhost:8090/lesson/getlessons?courseId=${courseId}&enrollmentId=${enrollmentId}`;
      try {
        const response = await fetch(URL, { method: "GET" });
        const data = await handleResponse<{ data: any[] }>(response);
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
    []
  );

  const checkValidLesson = useCallback(
    async (courseId: string, moduleId: string, userId: string) => {
      const URL = `http://localhost:8090/lesson/checklesson`;
      const requestBody = { courseId, moduleId, userId };
      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const data = await handleResponse(response);
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
    []
  );

  const startLesson = useCallback(
    async (enrollmentId: string, moduleId: string, lessonId: string) => {
      const URL = `http://localhost:8090/lesson/startlesson`;
      const requestBody = { enrollmentId, moduleId, lessonId };
      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const data = await handleResponse(response);
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
    []
  );

  const SubmitQuizzAnswer = useCallback(
    async (
      quizz_id: string,
      user_id: string,
      lesson_id: string,
      selected_option_index: number,
      is_correct: boolean,
      module_id: string
    ) => {
      const queryParams = new URLSearchParams({
        quizz_id,
        user_id,
        lesson_id,
        selected_option: selected_option_index.toString(),
        correct: is_correct.toString(),
        module_id,
      });

      const URL = `http://localhost:8090/lesson/submitanswer?${queryParams}`;
      try {
        const response = await fetch(URL, { method: "GET" });
        const data = await handleResponse(response);
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
    []
  );

  const getNextLesson = useCallback(
    async (order_index: number, course_id: string) => {
      const URL = `http://localhost:8090/lesson/nextlesson/${course_id}/${order_index}`;
      try {
        const response = await fetch(URL, { method: "GET" });
        const data = await handleResponse(response);
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
    []
  );

  const markAsComplete = useCallback(
    async (
      enrollmentId: string,
      moduleId: string,
      lessonId: string,
      userId: string
    ) => {
      const requestBody = {
        enrollmentId,
        moduleId,
        lessonSlug: lessonId,
        userId,
      };
      const URL = `http://localhost:8090/lesson/markascomplete`;
      try {
        const response = await fetch(URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const data = await handleResponse(response);
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
    []
  );

  return {
    getLessonDetails,
    getLessonsDetails,
    checkValidLesson,
    startLesson,
    SubmitQuizzAnswer,
    getNextLesson,
    markAsComplete,
  };
};

export default useLessonApiController;
