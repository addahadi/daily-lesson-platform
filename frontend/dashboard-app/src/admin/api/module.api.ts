import { handleResponse, toastOnce } from "@/Shared/lib/utils";
import { useAuth } from "@clerk/clerk-react";

const useModuleApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const getCourseModules = async (courseId: string) => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/course/course-modules/${courseId}`;
    try {
      const headers = await getAuthHeader();
      const res = await fetch(URL, { method: "GET", headers });

      const data = await handleResponse<any>(res);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }

      return data.data;
    } catch (err: any) {
      toastOnce(err.message || "Failed to fetch modules");
      return null;
    }
  };

  const createModule = async (courseId: string, title: string) => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/course/modules/${courseId}`;
    try {
      const headers = await getAuthHeader();
      const res = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ title }),
      });

      const data = await handleResponse<any>(res);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }

      return data.data;
    } catch (err: any) {
      toastOnce(err.message || "Failed to create module");
      return null;
    }
  };

  const updateModule = async (moduleId: string, title: string) => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/course/modules/${moduleId}`;
    try {
      const headers = await getAuthHeader();
      const res = await fetch(URL, {
        method: "PUT",
        headers,
        body: JSON.stringify({ title }),
      });

      const data = await handleResponse<any>(res);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }

      return data.data;
    } catch (err: any) {
      toastOnce(err.message || "Failed to update module");
      return null;
    }
  };

  const updateModuleOrder = async (
    courseId: string,
    orderedModules: { id: string; order_index: number }[]
  ) => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/course/module-order/${courseId}`;
    try {
      const headers = await getAuthHeader();
      const res = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ orderedModules }),
      });

      const data = await handleResponse<any>(res);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }

      return data.data;
    } catch (err: any) {
      toastOnce(err.message || "Failed to update module order");
      return null;
    }
  };

  const deleteModule = async (moduleId: string) => {
    const URL = `https://daily-lesson-platform.onrender.com/admin/course/modules/${moduleId}`;
    try {
      const headers = await getAuthHeader();
      const res = await fetch(URL, { method: "DELETE", headers });

      const data = await handleResponse<any>(res);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }

      return data.message;
    } catch (err: any) {
      toastOnce(err.message || "Failed to delete the module");
      return null;
    }
  };

  return {
    getCourseModules,
    createModule,
    updateModule,
    updateModuleOrder,
    deleteModule,
  };
};

export default useModuleApi;
