import { useEffect, useState } from "react";
import useCourseApiController from "@/students/Api/course.Api";
import useUserApiController from "@/students/Api/user.Api";
import type { CourseProps } from "@/lib/type";

export function useCourseAndEnrollment(
  CourseId: string | undefined,
  user: any
) {
  const [CourseData, setCourseData] = useState<CourseProps | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [buttonAction,setButtonAction] = useState("")
  const [url, setUrl] = useState<{
    lesson_id: string;
    module_id: string;
  }>();
  const {getCourseBySlug} = useCourseApiController()
  const {checkEnroll} = useUserApiController()

  useEffect(() => {
    async function fetchCourseAndCheckEnrollment() {
      if (!CourseId) return;
      console.log(CourseId)
      const courseResult = await getCourseBySlug(
        CourseId
      );
      if (courseResult) {
        setCourseData(courseResult);
        setSlug(courseResult.id);

        if (user) {
          const result = await checkEnroll(courseResult.id, user?.id);
          console.log(result)
          if (result) setButtonAction(result.action);
          if(result.data )setUrl(result.data)
          
        }
      }
    }

    fetchCourseAndCheckEnrollment();
  }, [CourseId, user]);

  return { CourseData, slug, setButtonAction , buttonAction , url , setUrl};
}
