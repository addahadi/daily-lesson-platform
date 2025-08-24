import React, { useEffect, useState } from "react";
import useLessonApiController from "@/students/Api/lesson.Api";
import type { LessonBarProps } from "@/Shared/lib/type";
import LessonsList from "./LessonsList";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/Shared/components/ui/button";

const LessonBarComponent = ({
  courseId,
  enrollmentId,
}: {
  courseId: string | undefined;
  enrollmentId: string | undefined;
}) => {
  const [CML, setCML] = useState<LessonBarProps>();
  const { getLessonsDetails } = useLessonApiController();
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!courseId || !enrollmentId) return;

      const data = await getLessonsDetails(courseId, enrollmentId);
      if (data) {
        setCML(data);
      }
    }
    fetchData();
  }, [courseId, enrollmentId, getLessonsDetails]);

  return (
    <aside className="shrink-0 px-4 py-6 w-full lg:w-[350px] bg-white dark:bg-gray-900 lg:min-h-screen">
      <h1 className="text-gray-900 dark:text-gray-100 font-semibold xl:text-2xl mb-5 lg:text-xl flex flex-row gap-2 items-center">
        {/* Toggle Button only visible on small screens */}
        <Button
          onClick={() => setExpand((prev) => !prev)}
          variant="outline"
          className="lg:hidden z-[1000] dark:hover:bg-gray-700"
        >
          {expand ? (
            <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </Button>
        <span>{CML?.course.title}</span>
      </h1>

      <div className={`flex flex-col gap-2 ${!expand ? "max-lg:hidden" : ""}`}>
        {CML?.modules.map((module, index) => (
          <LessonsList key={index} module={module} />
        ))}
      </div>
    </aside>
  );
};

const LessonBar = React.memo(LessonBarComponent);

export default LessonBar;
