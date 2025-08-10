import Toastify from "toastify-js"


type ApiResponse<T> =
  | {
      data?: T;
      message?: string;
      status: boolean;
      final?: boolean;
      action?: string;
    }
  | string;

interface ApiError {
  message: string;
  error?: string;
}

export const handleResponse = async <T = any>(
  response: Response
): Promise<ApiResponse<T>> => {
  const contentType = response.headers.get("content-type");

  if (response.ok) {
    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  }

  // Try to parse JSON error body if available
  let errorMsg = "Unexpected error occurred";
  try {
    const errorBody: ApiError = await response.json();
    if (errorBody?.message) errorMsg = errorBody.message;
  } catch {
    // fallback if not JSON
    errorMsg = response.statusText || errorMsg;
  }

  switch (response.status) {
    case 400:
      throw new Error(errorMsg || "Bad Request");
    case 401:
      throw new Error(errorMsg || "Unauthorized");
    case 403:
      throw new Error(errorMsg || "Forbidden");
    case 404:
      throw new Error(errorMsg || "Not Found");
    case 500:
      throw new Error(errorMsg || "Internal Server Error");
    default:
      throw new Error(errorMsg);
  }
};

const shownErrors = new Set<string>();

export const toastOnce = (message: string) => {
  if (shownErrors.has(message)) return;
  shownErrors.add(message);
  setTimeout(() => shownErrors.delete(message), 3000);
  Toastify({
    text: message,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left",
  }).showToast();
};



export function getLevelColor(level: string | undefined) {
  switch (level) {
    case "beginner":
      return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800";
    case "intermediate":
      return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800";
    case "advanced":
      return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800";
    default:
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600";
  }
}