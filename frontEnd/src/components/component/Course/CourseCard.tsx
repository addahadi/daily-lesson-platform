import type { CourseCardProps } from "@/lib/type";
import { useNavigate } from "react-router-dom";

export default function CourseCard({
  title,
  category,
  level,
  guest,
  img_url,
  slug,
}: CourseCardProps) {
  const truncatedTatile = title.slice(0 , 20) + "..."

  const navigate = useNavigate()
  return (
    <div className="border rounded-2xl flex-shrink-0  shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden flex flex-col h-full w-[300px]">
      {img_url && (
        <img src={img_url} alt={title} className="h-40 w-full object-cover" />
      )}
      <div className="flex flex-col flex-grow p-4">
        <h4 className="text-xl font-semibold mb-2 text-gray-800">
          {truncatedTatile}
        </h4>
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {category}
          </span>
          <span className="text-xs font-medium text-white bg-gradient-to-r from-orange-1 to-orange-400 px-2 py-1 rounded">
            {level}
          </span>
        </div>

        {guest ? (
          <button
            disabled
            className="mt-auto w-full bg-gray-200 text-gray-500 py-2 rounded-lg font-medium cursor-not-allowed"
          >
            Sign up to view lessons
          </button>
        ) : (
          <button
            onClick={() => navigate(`/dashboard/course/${slug}`)}
            className="mt-auto w-full bg-orange-1 hover:bg-orange-500 text-white py-2 rounded-lg font-medium transition-colors duration-200"
          >
            View Course
          </button>
        )}
      </div>
    </div>
  );
}
