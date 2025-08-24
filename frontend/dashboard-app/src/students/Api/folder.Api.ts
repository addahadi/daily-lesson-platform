import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/Shared/lib/utils";
import type {
  CourseCardProps,
  CourseSave,
  FolderType,
} from "@/Shared/lib/type";

const useFolderApiController = () => {
  const { getToken } = useAuth();

  const getAuthHeader = useCallback(async () => {
    const token = await getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, [getToken]);

  const createFolder = useCallback(
    async (title: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch("https://daily-lesson-platform.onrender.com/folder", {
          method: "POST",
          headers,
          body: JSON.stringify({ title }),
        });

        const data = await handleResponse<{ data: FolderType }>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Failed to create folder");
        return null;
      }
    },
    [getAuthHeader]
  );

  const getAllFolders = useCallback(async () => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`https://daily-lesson-platform.onrender.com/folder`, {
        method: "GET",
        headers,
      });

      const data = await handleResponse<FolderType[]>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data;
    } catch (err: any) {
      toastOnce(err.message || "Failed to fetch folders");
      return null;
    }
  }, [getAuthHeader]);
  const deleteFolder = useCallback(
    async (folderId: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/folder/${folderId}`,
          {
            method: "DELETE",
            headers,
          }
        );

        const data = await handleResponse<{ message: string }>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return false;
        }
        return true;
      } catch (err: any) {
        toastOnce(err.message || "Failed to delete folder");
        return false;
      }
    },
    [getAuthHeader]
  );

  const saveCourseToFolder = useCallback(
    async (course_id: string, folder_id: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch("https://daily-lesson-platform.onrender.com/folder/save", {
          method: "POST",
          headers,
          body: JSON.stringify({ course_id, folder_id }),
        });

        const data = await handleResponse<{ data: CourseSave }>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return null;
        }
        return data.data;
      } catch (err: any) {
        console.log(err);
        toastOnce(err.message || "Failed to save course");
        return null;
      }
    },
    [getAuthHeader]
  );

  const unsaveCourse = useCallback(
    async (course_id: string, folder_id: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/folder/save/${course_id}/${folder_id}`,
          {
            method: "DELETE",
            headers,
          }
        );

        const data = await handleResponse<{ message: string }>(response);
        if (typeof data === "string") {
          toastOnce(data);
          return false;
        }
        return true;
      } catch (err: any) {
        toastOnce(err.message || "Failed to unsave course");
        return false;
      }
    },
    [getAuthHeader]
  );
  const getCoursesInFolder = useCallback(
    async (folderId: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `https://daily-lesson-platform.onrender.com/folder/${folderId}/courses`,
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
        return data.data;
      } catch (err: any) {
        toastOnce(err.message || "Failed to fetch saved courses");
        return null;
      }
    },
    [getAuthHeader]
  );
  return {
    createFolder,
    deleteFolder,
    saveCourseToFolder,
    unsaveCourse,
    getAllFolders,
    getCoursesInFolder,
  };
};

export default useFolderApiController;
