import { useEffect, useState } from "react";
import useCourseApiController from "@/students/Api/course.Api";
import useUserApiController from "@/students/Api/user.Api";
import type { CourseProps } from "@/Shared/lib/type";
import { COURSE_CACH_KEY, getCach, setCache } from "@/Shared/lib/utils";

const CACHE_TTL = 3600 * 1000; // 1 hour

export function useCourseAndEnrollment(
  CourseId: string | undefined,
  user: any
) {
  const [CourseData, setCourseData] = useState<CourseProps | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [buttonAction, setButtonAction] = useState("");
  const [url, setUrl] = useState<{ lesson_id: string; module_id: string }>();

  const { getCourseBySlug } = useCourseApiController();
  const { checkEnroll } = useUserApiController();

  useEffect(() => {
    async function fetchCourseAndCheckEnrollment() {
      if (!CourseId) return;

      const cacheKey = `${COURSE_CACH_KEY}_${CourseId}`;
      const cachedCourse = getCach(cacheKey);

      if (cachedCourse) {
        setCourseData(cachedCourse);
        setSlug(cachedCourse.id);
      } else {
        const courseResult = await getCourseBySlug(CourseId);
        if (courseResult) {
          setCourseData(courseResult);
          setSlug(courseResult.id);
          setCache(cacheKey, courseResult, CACHE_TTL);
        }
      }
      if (user) {
        const result = await checkEnroll(CourseId, user?.id);
        if (result && result.action) {
          setButtonAction(result.action);
          if (result.data) setUrl(result.data);
        }
      }
    }

    fetchCourseAndCheckEnrollment();
  }, [CourseId, user, getCourseBySlug, checkEnroll]);

  return { CourseData, slug, setButtonAction, buttonAction, url, setUrl };
}
