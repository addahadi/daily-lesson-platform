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
