import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";

const useUserApiController = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const EnrollToCourse = useCallback(
    async (courseId: string, userId: string) => {
      const requestBody = { courseId, userId };

      try {
        const headers = await getAuthHeader();
        const response = await fetch(`https://daily-lesson-platform.onrender.com/auth/enroll`, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });

        const data = await handleResponse<any>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }

        return data;
      } catch (error: any) {
        toastOnce(error.message || "Something went wrong");
        return null;
      }
    },
    [getAuthHeader]
  );

  const checkEnroll = useCallback(
    async (courseSlug: string, userId: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/auth/is-enroll?courseSlug=${courseSlug}&userId=${userId}`,
          {
            method: "GET",
            headers,
          }
        );

        const data = await handleResponse<{
          lesson_id: string;
          module_id: string;
        }>(response);
        if (typeof data === "string") {
          console.log(data);
          toastOnce(data);
          return null;
        }
        return data;
      } catch (error: any) {
        toastOnce(
          error.message || "Something went wrong while checking enrollment"
        );
        return null;
      }
    },
    [getAuthHeader]
  );

  const getEnroll = useCallback(
    async (courseId: string, userId: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/auth/getenroll?courseId=${courseId}&userId=${userId}`,
          {
            method: "GET",
            headers,
          }
        );

        const data = await handleResponse<{ enrollmentid: string }[]>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }

        return data.data;
      } catch (error: any) {
        toastOnce(
          error.message || "Something went wrong while getting enrollment info"
        );
        return null;
      }
    },
    [getAuthHeader]
  );

  return {
    EnrollToCourse,
    checkEnroll,
    getEnroll,
  };
};

export default useUserApiController;
