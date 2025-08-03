import { handleResponse, toastOnce } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { toast } from "sonner";

const useNotificationApi = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const getCoursesId = useCallback(async () => {
    const URL = `http://localhost:8090/admin/notifications/courses-ids`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      if(response.status === 404){
        return null;
      }
    } 
    catch (err) {
      console.error("Error fetching courses ids:", err);
    }
  }, [getAuthHeader]);

  const getCourseNotifications = useCallback(async () => {
    const URL = `http://localhost:8090/admin/notifications/`;
    try {
      const headers = await getAuthHeader();
      const response = await fetch(URL, { method: "GET", headers });

      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      if(response.status === 404){
        return null;
      }
    } 
    catch (err) {
      console.error("Error fetching notifications:", err);
    }
  }, [getAuthHeader]);


  const createNotification = useCallback(
    async (requestBody: {
      type: string;
      title: string;
      message: string;
      sent_to: string;
      content_type: string;
      course_id: string;
    }) => {
      const URL = `http://localhost:8090/admin/notifications/`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, { method: "POST", headers , body : 
          JSON.stringify(requestBody)
         });

        if (response.ok) {
          const result = await response.json();
          return result.data;
        }
        if (response.status === 404) {
          return null;
        }
      } catch (err) {
        console.error("Error inserting or updating:", err);
      }
    },
    [getAuthHeader]
  );


  const updateNotification = useCallback(
    async (requestBody: {
      type: string;
      title: string;
      message: string;
      sent_to: string;
      content_type: string;
      course_id: string;
    } , id : string) => {
      const URL = `http://localhost:8090/admin/notifications/${id}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "PUT",
          headers,
          body: JSON.stringify(requestBody),
        });
        console.log(response)
        if (response.ok) {
          const result = await response.json();
          return result.data;
        }
        if (response.status === 404) {
          return null;
        }
      } catch (err) {
        console.error("Error inserting or updating:", err);
      }
    },
    [getAuthHeader]
  );



  const deleteNotification = useCallback(async (id : string) => {
      const URL = `http://localhost:8090/admin/notifications/${id}`;
      try {
        const headers = await getAuthHeader();
        const response = await fetch(URL, {
          method: "DELETE",
          headers,
        });

        if (response.ok) {
          toast.success("the notification was deleted successfully")
          return true
          
        }
        else {
          toast.error("failed to delete the notification")
          return false
        }        
        
      } catch (err) {
        console.error("Error deletion :", err);
      }
    },
    [getAuthHeader]
  );
  
  const createUserNotification = async ({
    sent_to,
    courseId,
    notificationId
  } : {
    sent_to :string
    courseId : string
    notificationId : string
  }) =>  {
      const headers = await getAuthHeader();
          try {  
            const requestBody = {
              sent_to,
              courseId,
              notificationId
            }
            const response = await fetch(
              "http://localhost:8090/admin/notifications/user-notifications",
              {
                method: "POST",
                headers,
                body: JSON.stringify(requestBody),
              }
            );
      
            const result = await handleResponse<{ message : string ,data : any}>(response);
            if (typeof result === "string") {
              toastOnce(result);
              return
            }
            toast(result.message)
          } catch (err: any) {
            toastOnce(err.message || "Something went wrong");
            return 
          }
  }

  return {
    getCoursesId,
    getCourseNotifications,
    createNotification,
    updateNotification,
    deleteNotification,
    createUserNotification
  }
};

export default useNotificationApi;
