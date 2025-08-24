import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import type { LessonBarProps, LessonDataType } from "@/Shared/lib/type";

const useLessonApiController = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getLessonDetails = useCallback(
    async (lessonId: string, moduleId: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/lesson/${lessonId}/${moduleId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "GET",
          headers,
        });
        const data = await handleResponse<LessonDataType>(response);
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
    [getAuthHeader]
  );

  const getLessonsDetails = useCallback(
    async (courseId: string, enrollmentId: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/lesson/all-lessons?courseId=${courseId}&enrollmentId=${enrollmentId}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "GET",
          headers,
        });
        const data = await handleResponse<LessonBarProps>(response);
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
    [getAuthHeader]
  );


  const startLesson = useCallback(
    async (enrollmentId: string, moduleId: string, lessonId: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/lesson/start-lesson`;
      const requestBody = { enrollmentId, moduleId, lessonId };
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });
        const data = await handleResponse<boolean>(response);

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
    [getAuthHeader]
  );

  const SubmitQuizzAnswer = useCallback(
    async (
      quizz_id: string,
      lesson_id: string,
      selected_option_index: number,
      is_correct: boolean,
      module_id: string
    ) => {
      const queryParams = new URLSearchParams({
        quizz_id,
        lesson_id,
        selected_option: selected_option_index.toString(),
        correct: is_correct.toString(),
        module_id,
      });
      const URL = `https://daily-lesson-platform.onrender.com/lesson/answer-submit?${queryParams}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "POST",
          headers,
        });
        const data = await handleResponse<any>(response);
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
    [getAuthHeader]
  );

  const getNextLesson = useCallback(
    async (order_index: number, module_id: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/lesson/next-lesson/${module_id}/${order_index}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "GET",
          headers,
        });
        const data = await handleResponse<string>(response);
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
    [getAuthHeader]
  );

  const markAsComplete = useCallback(
    async (enrollmentId: string, moduleId: string, lessonId: string) => {
      const URL = `https://daily-lesson-platform.onrender.com/lesson/completed`;
      const requestBody = {
        enrollmentId,
        moduleId,
        lessonSlug: lessonId,
      };

      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });
        const data = await handleResponse<{
          lessonId: string;
          moduleProgress: string;
          xpAwarded: number;
          CourseCompletedAlert: boolean;
        }>(response);

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
    [getAuthHeader]
  );

  return {
    getLessonDetails,
    getLessonsDetails,
    startLesson,
    SubmitQuizzAnswer,
    getNextLesson,
    markAsComplete,
  };
};

export default useLessonApiController;
