import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useEnroll from "@/hook/useEnroll";
import { lessonApiController } from "@/Api/lesson.Api";
import type QuizzProps from "@/lib/type";
import type { LessonSectionProps } from "@/lib/type";

export function useLessonDetails() {
  const { courseId, moduleId, lessonId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const { enrollmentId } = useEnroll(courseId, user?.id);

  const [lessonDetail, setLessonDetail] = useState<any>();
  const [lessonSections, setLessonSections] = useState<LessonSectionProps[]>();
  const [quizz, setQuizz] = useState<QuizzProps>();
  const [completed, setCompleted] = useState<boolean | undefined>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLessonDetails() {
      if (!lessonId || !user?.id) return;

      setLessonDetail(undefined);
      setLessonSections(undefined);
      setQuizz(undefined);
      setError(null);
      setLoading(true);

      try {
        const { "0": data } = await lessonApiController().getLessonDetails(
          lessonId,
          user.id
        );

        const {
          content: { sections },
          question,
          options,
          correct_option_index,
          quizz_id,
          selected_option_index,
          is_correct,
        } = data;

        setLessonDetail(data);
        setLessonSections(sections);
        setQuizz({
          question,
          options,
          correct_option_index,
          quizz_id,
          selected_option_index,
          is_correct,
        });
      } catch (err: any) {
        console.error("Error fetching lesson details:", err);
        setError("Failed to load lesson details");
      } finally {
        setLoading(false);
      }
    }

    fetchLessonDetails();
  }, [lessonId, user]);

  useEffect(() => {
    async function startLessonProgress() {
      if (!(lessonId && moduleId && enrollmentId)) return;

      try {
        const response = await lessonApiController().startLesson(
          enrollmentId,
          moduleId,
          lessonId
        );
        setCompleted(response.completed);
      } catch (err) {
        console.error("Error starting lesson progress:", err);
      }
    }

    startLessonProgress();
  }, [enrollmentId, moduleId, lessonId]);

  const handlePrevious = async () => {
    if (!lessonDetail || !moduleId) return;
    try {
      const { result } = await lessonApiController().getNextLesson(
        lessonDetail.order_index - 1,
        moduleId
      );
      navigate(
        `/dashboard/course/${courseId}/module/${moduleId}/lesson/${result[0].slug}`
      );
    } catch (err) {
      console.error("Failed to load previous lesson:", err);
    }
  };

  const handleNext = async () => {
    if (!lessonDetail || !moduleId) return;
    try {
      const { result } = await lessonApiController().getNextLesson(
        lessonDetail.order_index + 1,
        moduleId
      );
      navigate(
        `/dashboard/course/${courseId}/module/${moduleId}/lesson/${result[0].slug}`
      );
    } catch (err) {
      console.error("Failed to load next lesson:", err);
    }
  };

  return {
    lessonDetail,
    lessonSections,
    quizz,
    completed,
    setCompleted,
    handlePrevious,
    handleNext,
    loading,
    error,
    enrollmentId,
    courseId,
  };
}
