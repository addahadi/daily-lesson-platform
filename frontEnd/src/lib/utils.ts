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
