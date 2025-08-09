import type { LessonCardProps, ModuleCardProps } from "@/lib/type";
import useCourseApiController from "@/students/Api/course.Api";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  BarChart3,
  PlayCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const Modules = ({
  title,
  created_at,
  order_index,
  module_id,
}: ModuleCardProps) => {
  const [Lessons, setLessons] = useState<LessonCardProps[]>();
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { getModuleLesson } = useCourseApiController();

  useEffect(() => {
    async function fetchModules() {
      if (module_id && open && !Lessons) {
        setLoading(true);
        const result = await getModuleLesson(module_id);
        if (result) {
          console.log(result);
          setLessons(result);
        }
        setLoading(false);
      }
    }
    fetchModules();
  }, [module_id, open]);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full">
      
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
              {title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(created_at)}
              </span>
              <span className="text-gray-400 dark:text-gray-600">•</span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                Module {order_index}
              </span>
              {Lessons && (
                <>
                  <span className="text-gray-400 dark:text-gray-600">•</span>
                  <span className="flex items-center gap-1">
                    <PlayCircle className="w-4 h-4" />
                    {Lessons.length} lesson{Lessons.length !== 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <div className="flex-shrink-0">
            <button
              onClick={toggleOpen}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              <span className="hidden sm:inline">
                {!open ? "Show Content" : "Hide Content"}
              </span>
              <span className="sm:hidden">{!open ? "Show" : "Hide"}</span>
              {!open ? (
                <ChevronDown className="w-4 h-4 transition-transform duration-200" />
              ) : (
                <ChevronUp className="w-4 h-4 transition-transform duration-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="bg-gray-50 dark:bg-gray-800/50">
          {loading ? (
            <div className="px-4 sm:px-6 lg:px-8 py-8 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-orange-500 rounded-full animate-spin"></div>
                <span>Loading lessons...</span>
              </div>
            </div>
          ) : Lessons && Lessons.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Lessons.map((lesson, index) => (
                <div
                  key={lesson.lesson_id || index}
                  className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
      
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mt-0.5">
                          <PlayCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1 leading-tight">
                            {lesson.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {lesson.duration_minutes} min
                              {parseInt(lesson.duration_minutes) !== 1 ? "s" : ""}
                            </span>
                            <span className="text-gray-400 dark:text-gray-600">
                              •
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-3.5 h-3.5" />
                              {lesson.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 sm:px-6 lg:px-8 py-8 text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  No lessons available
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Lessons for this module will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Modules;
