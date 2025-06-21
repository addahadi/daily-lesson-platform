import { CourseApiController } from "@/Api/course.Api";
import DiscoverSection from "@/components/component/DiscoverSection"
import type { CourseCardProps } from "@/lib/type"
import { Courses } from "@/lib/utils"
import { useEffect, useState } from "react";

const Discover = () => {
  const [CourseCardData, setCourseCardData] = useState<CourseCardProps[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      const result = await CourseApiController().getAllCourses();
      if(result)
        setCourseCardData(result);
    }
    fetchCourses();
  }, []);
    
  return (
    <div className="flex flex-col gap-20">
      <DiscoverSection
        sectionTitle="Top Courses"
        Courses={ CourseCardData as CourseCardProps[]}
      />
      <DiscoverSection
        sectionTitle="New Courses"
        Courses={Courses as CourseCardProps[]}
      />
    </div>
  );
}

export default Discover