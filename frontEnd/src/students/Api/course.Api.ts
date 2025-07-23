import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import type { CourseCardProps, CourseProps } from "@/lib/type";
import { toast } from "sonner";

const useCourseApiController = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getAllCourses = useCallback(async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch("http://localhost:8090/course/getall", {
        method: "GET",
        headers,
      });

      if (response.ok) {
        const { data } = await response.json();
        return data as CourseCardProps[];
      } else if (response.status === 404) {
        return null;
      }
    } catch (err) {
      console.error("Error fetching all courses:", err);
    }
  }, [getAuthHeader]);

  const getFilteredCourses = useCallback(
    async (filter: URLSearchParams) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `http://localhost:8090/course/filtered-courses?${filter}`,
          {
            method: "GET",
            headers,
          }
        );

        if (response.ok) {
          const { data } = await response.json();
          return data as CourseCardProps[];
        } else if (response.status === 404) {
          return null;
        }
      } catch (err) {
        console.error("Error fetching filtered courses:", err);
      }
    },
    [getAuthHeader]
  );

  const getCourseModules = useCallback(
    async (id: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `http://localhost:8090/course/getmodules/${id}`,
          {
            method: "GET",
            headers,
          }
        );

        if (response.ok) {
          const { data } = await response.json();
          return data
        }
      } catch (err) {
        console.error("Error fetching course modules:", err);
      }
    },
    [getAuthHeader]
  );

  const getCourseBySlug = useCallback(
    async (slug: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `http://localhost:8090/course/getbyslug?slug=${slug}`,
          {
            method: "GET",
            headers,
          }
          
        );

        if (response.ok) {
          const { data } = await response.json();
          return data as CourseProps;
        }
        else if (response.status === 404) {
          toast("no such a course")
        }        
        else {
          throw new Error("Error status : " + response.status)
        }
      } catch (err) {
        console.error("Error fetching course by slug:", err);
        toast("something went wrong")
        return null
      }
    },
    [getAuthHeader]
  );

  const getModuleLesson = useCallback(
    async (id: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `http://localhost:8090/course/getlessons/${id}`,
          {
            method: "GET",
            headers,
          }
        );

        if (response.ok) {
          const { data } = await response.json();
          return data;
        }
      } catch (err) {
        console.error("Error fetching module lessons:", err);
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
