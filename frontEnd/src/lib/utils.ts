import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}








export const renderMarkdown = (text : string) => {
  return text
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(
      /`(.*?)`/g,
      '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    )
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n/g, "<br>")
    .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>');
};
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
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


export const FOLDER_CACHE_KEY = "cached_folders";
export const CACHE_KEY_DISCOVER = "discover_courses";
export const COURSE_CACH_KEY = "course_page";




export function formatTimestamp(isoString : string) {
  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long", // or "short" for "Jul"
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true, // Use 24h format with `false`
  });
}




export const setCache = (key : string , data : any , ttl : number) => {
  const now = Date.now()
  const item = {
    data,
    expiry : now  + ttl,
  }

  localStorage.setItem(key , JSON.stringify(item))
}


export const getCach = (key : string) => {
  const itemStr = localStorage.getItem(key)
  if(!itemStr) return null 

  const item = JSON.parse(itemStr)
  const now = Date.now()

  if(now > item.expiry){
    localStorage.removeItem(key)
    return null
  }
  return item.data
}




// utils/handleResponse.ts

type ApiResponse<T> = {
  data? : T 
  message? : string
  status : boolean
} | string 


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
  toast.error(message);
}




