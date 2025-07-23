import { useCallback } from "react";

const useLessonApiController = () => {
  
  const getLessonDetails = useCallback(
    async (lessonId: string, userId: string) => {
      const queryParams = new URLSearchParams({ userId, lessonId });
      const URL = `http://localhost:8090/lesson/get?${queryParams}`;
      try {
        const response = await fetch(URL, { method: "GET" });
        if (response.ok) {
          const { data } = await response.json();
          return data;
        }
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const getLessonsDetails = useCallback(
    async (courseId: string, enrollmentId: string) => {
      const URL = `http://localhost:8090/lesson/getlessons?courseId=${courseId}&enrollmentId=${enrollmentId}`;
      try {
        const response = await fetch(URL, { method: "GET" });
        if (response.ok) {
          const { data } = await response.json();
          return data;
        }
      } catch (err) {
        console.error(err);
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
        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (err) {
        console.error(err);
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
        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (err) {
        console.error(err);
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
        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (err) {
        console.error("Fetch error", err);
      }
    },
    []
  );

  const getNextLesson = useCallback(
    async (order_index: number, course_id: string) => {
      const URL = `http://localhost:8090/lesson/nextlesson/${course_id}/${order_index}`;
      try {
        const response = await fetch(URL, { method: "GET" });
        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (err) {
        console.error(err);
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
        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (err) {
        console.error(err);
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
