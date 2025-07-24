import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { handleResponse, toastOnce } from "@/lib/utils";

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
        const response = await fetch(`http://localhost:8090/auth/enroll`, {
          method: "POST",
          headers,
          body: JSON.stringify(requestBody),
        });

        const data = await handleResponse<{ data: any }>(response);
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
    async (courseId: string, userId: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `http://localhost:8090/auth/is-enroll?courseId=${courseId}&userId=${userId}`,
          {
            method: "GET",
            headers,
          }
        );

        const data = await handleResponse<{ data: any }>(response);
        if (typeof data === "string") {
          console.log(data)
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
          `http://localhost:8090/auth/getenroll?courseId=${courseId}&userId=${userId}`,
          {
            method: "GET",
            headers,
          }
        );

        const data = await handleResponse<{ data: any }>(response);
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
