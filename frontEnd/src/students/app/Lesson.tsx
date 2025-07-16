import LessonBar from "../components/Lesson/LessonBar";
import LessonNote from "../components/Lesson/LessonNote";
import LessonCode from "../components/Lesson/LessonCode";
import LessonQuizz from "../components/Lesson/LessonQuizz";
import LessonSummary from "../components/Lesson/LessonSummary";
import LessonText from "../components/Lesson/LessonText";
import LessonBullet from "../components/Lesson/LessonBullet";
import { Button } from "@/components/ui/button";
import { useLessonDetails } from "@/hook/useLessonDetails";
import { BookOpen, ChevronLeft, ChevronRight, Clock } from "lucide-react";

const Lesson = () => {
  const {
    lessonDetail,
    lessonSections,
    quizz,
    completed,
    setCompleted,
    handleNext,
    handlePrevious,
    loading,
    enrollmentId,
    courseId,
  } = useLessonDetails();

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
    <div key={lessonDetail.slug} className="flex flex-row gap-5 overflow-auto">
      <LessonBar enrollmentId={enrollmentId} courseId={courseId} />
      <div className="flex-1 px-5  ">
        <LessonNote />
        {/* Lesson Header */}
        <section className="bg-white border border-gray-200 flex flex-col p-5 rounded-lg gap-3 mt-16 mb-5 ">
          <div className="flex flex-row gap-2 text-gray-500 items-center">
            <BookOpen className="w-4 h-4" />
            <span>Lesson {lessonDetail.order_index}</span>
          </div>

          <h1 className="text-2xl font-semibold">{lessonDetail.title}</h1>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{lessonDetail.duration_minutes} min</span>
            </div>
          </div>

          <div className="flex flex-row gap-4 mt-3">
            <Button
              variant="outline"
              className="flex items-center border-orange-1"
              onClick={handlePrevious}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              variant="destructive"
              className="flex items-center bg-orange-1"
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
                {"bullets" in lessonSection && (
                  <LessonBullet
                    bullets={lessonSection.bullets}
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
            text={lessonSection.text}
            heading={lessonSection.heading}
            enrollementId={enrollmentId}
            completed={completed}
            setCompleted={setCompleted}
          />
        ))}
      </div>
    </div>
  );
};

export default Lesson;
