import LessonBar from "../components/Lesson/LessonBar";
import LessonNote from "../components/Lesson/LessonNote";
import LessonCode from "../components/Lesson/LessonCode";
import LessonQuizz from "../components/Lesson/LessonQuizz";
import LessonSummary from "../components/Lesson/LessonSummary";
import LessonText from "../components/Lesson/LessonText";
import { Button } from "@/components/ui/button";
import { useLessonDetails } from "@/hook/useLessonDetails";
import { BookOpen, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Toaster } from "sonner";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useEnroll from "@/hook/useEnroll";
import  { useState } from "react";
import CourseCompleteModal from "../components/Course/CourseCompleteModal";

const Lesson = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const { user } = useUser();
  const { enrollmentId } = useEnroll(courseId, user?.id);
  const [courseCompleted,setCourseCompleted] = useState(false)
  // Local state for navigation button disabling (so LessonBar doesn't see it)
  const [clickedNavigationButton, setClickedNavigationButton] = useState({
    previous: false,
    next: false,
  });

  const {
    lessonDetail,
    lessonSections,
    quizz,
    completed,
    handleNext,
    handlePrevious,
    setCompleted,
    loading,
  } = useLessonDetails(
    lessonId!,
    moduleId!,
    courseId!,
    enrollmentId!,
    setClickedNavigationButton // pass setter so hook can update button state
  );

  const Summary = lessonSections?.filter(
    (section) => section.heading === "Summary"
  );

  if (loading || !lessonDetail) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Loading lesson...
      </div>
    );
  }

  return (
    <div
      key={lessonDetail.slug}
      className="flex flex-row gap-5 overflow-auto max-lg:flex-col"
    >
      {/* LessonBar only depends on stable props */}
      <div className="max-lg:w-full">
        <LessonBar enrollmentId={enrollmentId} courseId={courseId} />
      </div>

      <div className="flex-1 px-5">
        <LessonNote />

        {/* Lesson Header */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col p-5 rounded-lg gap-3 mt-16 mb-5">
          <div className="flex flex-row gap-2 text-gray-500 dark:text-gray-400 items-center">
            <BookOpen className="w-4 h-4" />
            <span>Lesson {lessonDetail.order_index}</span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {lessonDetail.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{lessonDetail.duration_minutes} min</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-3">
            <Button
              disabled={
                !lessonDetail.previous || clickedNavigationButton.previous
              }
              variant="outline"
              className="flex items-center border-orange-1 text-orange-1 hover:bg-orange-50 dark:hover:bg-gray-800"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              disabled={!lessonDetail.next || clickedNavigationButton.next}
              variant="destructive"
              className="flex items-center bg-orange-500 hover:bg-orange-600 text-white dark:text-white"
              onClick={handleNext}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Lesson Sections */}
        <section className="flex flex-col">
          {lessonSections?.map((lessonSection, index) => {
            if (lessonSection.heading === "Summary") return null;

            return (
              <div key={index}>
                {"text" in lessonSection && (
                  <LessonText
                    text={lessonSection.text}
                    heading={lessonSection.heading}
                  />
                )}
                {"code" in lessonSection && (
                  <LessonCode
                    code={lessonSection.code}
                    heading={lessonSection.heading}
                  />
                )}
              </div>
            );
          })}
        </section>

        {/* Quizz */}
        {quizz && (
          <section>
            <LessonQuizz quizz={quizz} />
          </section>
        )}

        {/* Summary */}
        {Summary?.map((lessonSection, index) => (
          <LessonSummary
            key={`summary-${index}`}
            text={lessonSection?.text}
            heading={lessonSection.heading}
            enrollementId={enrollmentId}
            completed={completed}
            setCourseCompleted={setCourseCompleted}
            setCompleted={setCompleted}
          />
        ))}
      </div>
      {
        courseCompleted && <CourseCompleteModal         
        onClose={() => {
          setCourseCompleted(false)
        }}
        />
      }
      <Toaster />
    </div>
  );
};

export default Lesson;
