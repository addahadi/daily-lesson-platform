import useLessonApiController from "@/students/Api/lesson.Api";
import type { LessonBarProps } from "@/lib/type";

import { useEffect, useState } from "react";
import LessonsList from "./LessonsList";

const LessonBar = ({
  courseId,
  enrollmentId,
}: {
  courseId: string | undefined;
  enrollmentId: string | undefined;
}) => {
  const [CML, setCML] = useState<LessonBarProps>();
  const {getLessonsDetails} = useLessonApiController()
  useEffect(() => {
    async function fetchData() {
      console.log(courseId, enrollmentId);
      if (!courseId || !enrollmentId) return;
      const data = await getLessonsDetails(
        courseId,
        enrollmentId
      );
      console.log(data);
      if (data) {
        setCML(data);
      }
    }
    fetchData();
  }, [courseId, enrollmentId]);

  return (
    <aside className=" shrink-0 px-4 py-6  bg-white w-[350px] min-h-screen">
      <h1 className=" text-black-1 font-semibold text-2xl mb-7 ">
        {CML?.course.title}
      </h1>
      <div className="flex flex-col gap-2">
        {CML?.modules.map((module, index) => {
          return <LessonsList key={index} module={module} />;
        })}
      </div>
    </aside>
  );
};

export default LessonBar;
