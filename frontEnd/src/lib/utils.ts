import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}




export const Courses = [
  {
    title: "Introduction to JavaScript",
    category: "Web Development",
    level: "Beginner",
    guest: false,
    img_url: "https://source.unsplash.com/featured/?javascript,code",
  },
  {
    title: "Advanced React Patterns",
    category: "Frontend",
    level: "Advanced",
    guest: false,
    img_url: "https://source.unsplash.com/featured/?reactjs,code",
  },
  {
    title: "Python for Data Science",
    category: "Data Science",
    level: "Intermediate",
    guest: true,
    img_url: "https://source.unsplash.com/featured/?python,data",
  },
  {
    title: "Building REST APIs with Express",
    category: "Backend",
    level: "Intermediate",
    guest: false,
    img_url: "https://source.unsplash.com/featured/?nodejs,backend",
  },
  {
    title: "Building REST APIs with Express",
    category: "Backend",
    level: "Intermediate",
    guest: false,
    img_url: "https://source.unsplash.com/featured/?nodejs,backend",
  },
];



export function getLevelColor(level : string | undefined) {
  switch (level) {
    case "beginner":
      return "bg-green-100 text-green-800";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800";
    case "advanced":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
