import type { section } from "@/lib/adminType";
import { useAuth } from "@clerk/clerk-react";

const useLessonApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const getAllLessons = async (moduleId : string) => {
    const URL = `http://localhost:8090/admin/lesson/${moduleId}`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      else if (response.status === 404){
        return null;
      }
    } catch (err) {
      console.error(err);
    }
  };
  const createUpdateLesson = async (moduleId : string , requestBody : Record<string , string | number | null>) => {
    const URL = `http://localhost:8090/admin/lesson/${moduleId}`;
    
    
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "POST", headers , body : JSON.stringify(requestBody) });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      } else if (response.status === 404) {
        return null;
      }
    } catch (err) {
      console.error(err);
    }
  }


  const updateOrderIndex = async (
    moduleId : string,
    requestBody: {
      id: string;
      order_index: number;
    }[]
  ) => {
    const URL = `http://localhost:8090/admin/lesson/order/${moduleId}`;

    try {
      const headers = await getAuthHeader();
      const res = await fetch(URL, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json", // make sure this is set
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server Error: ${res.status} - ${errorText}`);
      }

      
    } catch (err) {
      console.error("Failed to update order:", err);
      throw err;
    }
  };



  const updateLessonContent = async (
    lessonId: string,
    requestBody: { sections: section[] }
  ) => {
    const URL = `http://localhost:8090/admin/lesson/content/${lessonId}`;

    try {
      const headers = await getAuthHeader();
      const res = await fetch(URL, {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (res.ok) {
        const result = await res.json();
        return result.data;
      }
    } catch (err) {
      console.error("Failed to update order:", err);
      throw err;
    }
  };
  return {
    getAllLessons,
    createUpdateLesson,
    updateOrderIndex,
    updateLessonContent
  };
};

export default useLessonApi;
