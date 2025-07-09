import type { CourseCardProps } from "@/lib/type";
import { getLevelColor } from "@/lib/utils";
import { Clock, Heart, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CourseCard({
  slug,
  title,
  category,
  level,
  img_url,
  description,
}: CourseCardProps) {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex`}
    >
      <div className={`relative w-80  flex-shrink-0`}>
        <img
          src={img_url}
          alt={title}
          className={`w-full object-cover h-full`}
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
              level
            )}`}
          >
            {level}
          </span>
        </div>
        <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200">
          <Heart className={`w-4 h-4`} />
        </button>
      </div>

      <div className={`p-6 flex-1`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
            {title}
          </h3>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{5} hours</span>
          </div>
          <p className="text-sm text-gray-600 font-bold">by admin</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 capitalize">
              {level} • {category}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            onClick={() => navigate(`/dashboard/course/${slug}`)}
          >
            <Play className="w-4 h-4" />
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
