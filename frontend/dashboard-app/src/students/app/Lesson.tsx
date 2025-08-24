import LessonBar from "../components/Lesson/LessonBar";
import { Toaster } from "sonner";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import  { useState } from "react";
import CourseCompleteModal from "../components/Course/CourseCompleteModal";
import LessonContent from "../components/Lesson/LessonContent";
import useEnroll from "@/Shared/hook/useEnroll";

const Lesson = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const { user } = useUser();
  const { enrollmentId } = useEnroll(courseId, user?.id);
  const [courseCompleted, setCourseCompleted] = useState(false);

  return (
    <div
      className="flex flex-row gap-5 overflow-auto max-lg:flex-col"
    >
      <div className="max-lg:w-full">
        <LessonBar enrollmentId={enrollmentId} courseId={courseId} />
      </div>
      <LessonContent
        lessonId={lessonId as string}
        moduleId={moduleId as string}
        courseId={courseId as string}
        enrollmentId={enrollmentId as string}
        setCourseCompleted={setCourseCompleted}
      />
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
