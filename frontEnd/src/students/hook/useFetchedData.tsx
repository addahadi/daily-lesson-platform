import { useEffect, useState } from "react";
import { CourseApiController } from "@/students/Api/course.Api";
import { userApiController } from "@/students/Api/user.Api";
import type { CourseProps } from "@/students/lib/type";

export function useCourseAndEnrollment(
  CourseId: string | undefined,
  user: any
) {
  const [CourseData, setCourseData] = useState<CourseProps | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    async function fetchCourseAndCheckEnrollment() {
      if (!CourseId) return;

      const courseResult = await CourseApiController().getCourseBySlug(
        CourseId
      );
      if (courseResult) {
        setCourseData(courseResult);
        setSlug(courseResult.id);
        console.log(courseResult);

        if (user) {
          const enrollResult = await userApiController().checkEnroll(
            courseResult.id,
            user.id
          );
          if (enrollResult?.exists !== undefined) {
            setEnrolled(enrollResult.exists);
          }
        }
      }
    }

    fetchCourseAndCheckEnrollment();
  }, [CourseId, user]);

  return { CourseData, enrolled, slug, setEnrolled };
}
