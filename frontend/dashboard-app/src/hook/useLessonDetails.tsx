import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useLessonApiController from "@/students/Api/lesson.Api";
import type {
  LessonDataType,
  QuizzProps,
  LessonSectionProps,
} from "@/lib/type";

export function useLessonDetails(
  lessonId: string,
  moduleId: string,
  courseId: string,
  enrollmentId: string,
  setClickedNavigationButton: React.Dispatch<
    React.SetStateAction<{ previous: boolean; next: boolean }>
  >
) {
  const { user } = useUser();
  const navigate = useNavigate();

  const [lessonDetail, setLessonDetail] = useState<LessonDataType>();
  const [lessonSections, setLessonSections] = useState<LessonSectionProps[]>();
  const [quizz, setQuizz] = useState<QuizzProps>();
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getLessonDetails, startLesson, getNextLesson } =
    useLessonApiController();

  useEffect(() => {
    async function fetchLessonDetails() {
      if (!lessonId || !user?.id || !moduleId) return;

      setLessonDetail(undefined);
      setLessonSections(undefined);
      setQuizz(undefined);
      setError(null);
      setLoading(true);

      const data = await getLessonDetails(lessonId, moduleId);
      if (!data) return;

      const {
        content: { sections },
        quizz,
      } = data;
      setLessonDetail(data);
      setLessonSections(sections);
      setLoading(false);

      if (quizz) {
        setQuizz({
          question: quizz.question,
          options: quizz.options,
          correct_option_index: quizz.correct_option_index,
          quizz_id: quizz.quizz_id,
          selected_option_index: quizz.selected_option_index,
          is_correct: quizz.is_correct,
        });
      }
    }
    fetchLessonDetails();
  }, [lessonId, moduleId, user, getLessonDetails]);

  useEffect(() => {
    async function startLessonProgress() {
      if (!(lessonId && moduleId && enrollmentId)) return;
      try {
        const isCompleted = await startLesson(enrollmentId, moduleId, lessonId);
        if(isCompleted === null) return;
        console.log(isCompleted)
        setCompleted(isCompleted as boolean);
      } catch (err) {
        console.error("Error starting lesson progress:", err);
      }
    }
    startLessonProgress();
  }, [enrollmentId, moduleId, lessonId, startLesson]);

  const handlePrevious = async () => {
    if (!lessonDetail?.order_index || !moduleId) return;
    try {
      setClickedNavigationButton((prev) => ({ ...prev, previous: true }));
      const prevSlug = await getNextLesson(
        parseInt(lessonDetail.order_index) - 1,
        moduleId
      );
      navigate(
        `/dashboard/course/${courseId}/module/${moduleId}/lesson/${prevSlug}`
      );
      setClickedNavigationButton((prev) => ({ ...prev, previous: false }));
    } catch (err) {
      console.error("Failed to load previous lesson:", err);
    }
  };

  const handleNext = async () => {
    if (!lessonDetail?.order_index || !moduleId) return;
    try {
      setClickedNavigationButton((prev) => ({ ...prev, next: true }));
      const nextSlug = await getNextLesson(
        parseInt(lessonDetail.order_index) + 1,
        moduleId
      );
      navigate(
        `/dashboard/course/${courseId}/module/${moduleId}/lesson/${nextSlug}`
      );
      setClickedNavigationButton((prev) => ({ ...prev, next: false }));
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
  };
}
