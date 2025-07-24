import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { handleResponse, toastOnce } from "@/lib/utils";
import type { CourseSave, FolderType } from "@/lib/type";


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
        const response = await fetch("http://localhost:8090/folder", {
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


  
const getAllFolders = useCallback(
  async (page = 1) => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(
        `http://localhost:8090/folder?page=${page}`,
        {
          method: "GET",
          headers,
        }
      );

      const data = await handleResponse<{data : FolderType[]}>(response);
      if (typeof data === "string") {
        toastOnce(data);
        return null;
      }
      return data.data;
    } catch (err: any) {
      toastOnce(err.message || "Failed to fetch folders");
      return null;
    }
  },
  [getAuthHeader]
);
  const deleteFolder = useCallback(
    async (folderId: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `http://localhost:8090/folder/${folderId}`,
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
        const response = await fetch("http://localhost:8090/folder/save", {
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
        toastOnce(err.message || "Failed to save course");
        return null;
      }
    },
    [getAuthHeader]
  );

  const unsaveCourse = useCallback(
    async (saveId: string) => {
      try {
        const headers = await getAuthHeader();
        const response = await fetch(
          `http://localhost:8090/folder/save/${saveId}`,
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

  return {
    createFolder,
    deleteFolder,
    saveCourseToFolder,
    unsaveCourse,
    getAllFolders
  };
};

export default useFolderApiController;
