import type { CourseCardProps, CourseProps } from "@/students/lib/type";

export function CourseApiController() {
  async function getAllCourses() {
    try {
      const response = await fetch("http://localhost:8090/course/getall", {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        const { data } = result;
        return data as CourseCardProps[];
      } else if (response.status === 404) {
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getFilteredCourses(filter: URLSearchParams) {
    try {
      const response = await fetch(
        `http://localhost:8090/course/filtered-courses?${filter}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const result = await response.json();
        const { data } = result;
        return data as CourseCardProps[];
      } else if (response.status === 404) {
        return null;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getCourseModules(id: string) {
    const URL = `http://localhost:8090/course/getmodules/${id}`;
    try {
      const response = await fetch(URL, {
        method: "GET",
      });
      if (response.ok) {
        const result = await response.json();
        const { data } = result;
        return data as CourseCardProps[];
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getCourseBySlug(slug: string) {
    const URL = `http://localhost:8090/course/getbyslug?slug=${slug}`;
    try {
      const response = await fetch(URL, {
        method: "GET",
      });

      if (response.ok) {
        const result = await response.json();
        const { data } = result;
        console.log(data);
        return data as CourseProps;
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getModuleLesson(id: string) {
    const URL = `http://localhost:8090/course/getlessons/${id}`;
    try {
      const response = await fetch(URL, {
        method: "GET",
      });
      if (response.ok) {
        const result = await response.json();
        const { data } = result;
        return data;
      }
    } catch (err) {
      console.log(err);
    }
  }

  return {
    getAllCourses,
    getCourseBySlug,
    getCourseModules,
    getModuleLesson,
    getFilteredCourses,
  };
}
