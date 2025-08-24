import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import type { CourseCardProps, CourseProps, LessonCardProps, ModuleCardProps } from "@/Shared/lib/type";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";

const useCourseApiController = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getAllCourses = useCallback(
    async (page: number = 1) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/course/getall?page=${page}`,
          {
            method: "GET",
            headers,
          }
        );

        const data = await handleResponse<CourseCardProps[]>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  const getFilteredCourses = useCallback(
    async (filter: URLSearchParams) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/course/filtered-courses?${filter}`,
          {
            method: "GET",
            headers,
          }
        );

        const data = await handleResponse<CourseCardProps[]>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  const getCourseModules = useCallback(
    async (id: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/course/getmodules/${id}`,
          {
            method: "GET",
            headers,
          }
        );

        const data = await handleResponse<ModuleCardProps[]>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  const getCourseBySlug = useCallback(
    async (slug: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/course/getbyslug?slug=${slug}`,
          {
            method: "GET",
            headers,
          }
        );

        const data = await handleResponse<CourseProps>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  const getModuleLesson = useCallback(
    async (id: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/course/getlessons/${id}`,
          {
            method: "GET",
            headers,
          }
        );

        const data = await handleResponse<LessonCardProps[]>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  return {
    getAllCourses,
    getFilteredCourses,
    getCourseModules,
    getCourseBySlug,
    getModuleLesson,
  };
};

export default useCourseApiController;
