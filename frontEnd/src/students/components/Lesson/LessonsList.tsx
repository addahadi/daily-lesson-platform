import useLessonApiController from "@/students/Api/lesson.Api";
import type { ModuleCardProps, Lesson } from "@/lib/type";
import { useUser } from "@clerk/clerk-react";
import {
  Book,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const LessonsList = ({
  module,
}: {
  module: ModuleCardProps & { lessons: Lesson[] };
}) => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const { courseId } = useParams();
  const [isModuleAccessible, setIsModuleAccessible] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const { checkValidLesson } = useLessonApiController();

  useEffect(() => {
    async function fetchData() {
      if (!(courseId && user?.id && module.module_id)) return;

      try {
        const result = await checkValidLesson(
          courseId,
          module.module_id,
          user.id
        );
        setIsModuleAccessible(result?.isAccessible || false);
      } catch (error) {
        console.error("Error checking lesson access:", error);
        setIsModuleAccessible(false);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId, module.module_id, user?.id]);

  if (loading) {
    return (
      <div className="cursor-pointer p-3 rounded-lg border border-gray-300 dark:border-gray-600 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer p-3 rounded-lg border lg:p-2 ${
        isModuleAccessible
          ? "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
          : "border-red-300 bg-red-50 dark:border-red-300 dark:bg-red-700"
      }`}
    >
      <div
        className="flex flex-row items-center px-2 py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronRight
            className={`w-4 h-4 shrink-0 ${
              isModuleAccessible
                ? "text-gray-500 dark:text-gray-300"
                : "text-red-400"
            }`}
          />
        ) : (
          <ChevronDown
            className={`w-4 h-4 shrink-0 ${
              isModuleAccessible
                ? "text-gray-500 dark:text-gray-300"
                : "text-red-200"
            }`}
          />
        )}

        <div className="flex gap-2 items-center flex-1">
          <Book
            className={`w-5 h-5 shrink-0 ${
              isModuleAccessible
                ? "text-gray-500 dark:text-gray-300"
                : "text-red-400"
            }`}
          />
          <span
            className={`text-sm md:text-base font-medium ${
              isModuleAccessible
                ? "text-gray-900 dark:text-gray-100"
                : "text-red-400 dark:text-red-100"
            }`}
          >
            Module {module.order_index}: {module.title}
          </span>
        </div>
          {!isModuleAccessible && (
            <div className="flex items-center gap-1 ml-2" style={{
              justifySelf:"end"
            }}>
              <Lock className="w-4 h-4 text-red-500 dark:text-red-400" />
              <span className="text-xs text-red-500 dark:text-red-400 font-medium">
                Locked
              </span>
            </div>
          )}
      </div>

      {isOpen && (
        <div>
          {!isModuleAccessible && (
            <div className="px-6 py-2 mb-2 bg-red-100 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-600 rounded">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                🔒 Complete the previous module to unlock these lessons
              </p>
            </div>
          )}

          {module.lessons.map((lesson, index) => {
            const LessonContent = (
              <div
                className={`px-6 py-3 border-l-4 ${
                  !isModuleAccessible &&
                  "cursor-not-allowed bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-600"
                } ${
                  lesson.completed
                    ? "bg-green-50 dark:bg-green-900 cursor-pointer border-green-500"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {lesson.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600" />
                  )}
                  <FileText
                    className={`w-4 h-4 ${
                      isModuleAccessible
                        ? "text-gray-400 dark:text-gray-300"
                        : "text-red-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        isModuleAccessible
                          ? "text-gray-700 dark:text-gray-200"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {lesson.title}
                    </p>
                    <p
                      className={`text-xs ${
                        isModuleAccessible
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      Lesson {lesson.order_index}
                    </p>
                  </div>
                  {!isModuleAccessible && (
                    <Lock className="w-3 h-3 text-red-400 dark:text-red-400" />
                  )}
                </div>
              </div>
            );

            return (
              <div key={index}>
                {isModuleAccessible ? (
                  <Link
                    to={`/dashboard/course/${courseId}/module/${module.module_id}/lesson/${lesson.slug}`}
                  >
                    {LessonContent}
                  </Link>
                ) : (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {LessonContent}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LessonsList;
