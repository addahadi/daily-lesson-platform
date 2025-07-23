import { useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

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

        if (response.ok) {
          const data = await response.json();
          return data;
        } else if (response.status === 404) {
          toast("Failed to enroll to the course");
          return null;
        } else {
          throw new Error(`Enroll failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error enrolling to course:", error);
        toast("Something went wrong");
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
        if (response.ok) {
          const data = await response.json();
          return data;
        }
        else {
            throw new Error(`checking failed with status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
        toast("something went wrong")
        return null
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

        if (response.ok) {
          const { data } = await response.json();
          return data;
        }
      } catch (error) {
        console.error("Error getting enrollment info:", error);
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
