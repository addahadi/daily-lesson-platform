import type { Module } from "@/lib/adminType";
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

  const getCourseModules = async ( courseId : string) => {
    const URL = `http://localhost:8090/admin/course/course-modules/${courseId}`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });
      if (response.ok) {
        const result = await response.json();
        return result.data;
      } else if (response.status === 404) {
        return null;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createModule = async (courseId: string, title : string) => {
    const requestBody = {
      title: title, 
    }
    const URL = `http://localhost:8090/admin/course/modules/${courseId}`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const result = await response.json();
        return result.data;
      } else if(response.status === 404) {
        return null
      }
    } catch (err) {
      console.error(err);
    }
  }
  const updateModule = async (moduleId: string, title: string) => {
    const requestBody = {
      title: title, 
    }
    const URL = `http://localhost:8090/admin/course/modules/${moduleId}`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, {
        method: "PUT",
        headers,
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const result = await response.json();
        return result.data;
      } else if(response.status === 404) {
        return null
      }
    } catch (err) {
      console.error(err);
    }
  }
  const updateModuleOrder = async (courseId: string, orderedModules: { id: string; order_index: number }[]) => {
    const URL = `http://localhost:8090/admin/course/module-order/${courseId}`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ orderedModules }),
      });
      if (response.ok) {
        const result = await response.json();
        return result.data;
      } else if(response.status === 404) {
        return null
      }
    }
    catch (err) {
      console.error(err);
    }
  }

;
    return {
        getCourseModules,
        createModule ,
        updateModule, 
        updateModuleOrder
  };
};

export default useModuleApi;
