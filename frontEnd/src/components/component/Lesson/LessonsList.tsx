import { lessonApiController } from "@/Api/lesson.Api";
import type { ModuleCardProps, Lesson } from "@/lib/type";
import { useUser } from "@clerk/clerk-react";
import { Book, CheckCircle, ChevronDown, ChevronRight, FileText, Lock } from "lucide-react";
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

  useEffect(() => {
    async function fetchData() {
      if (!(courseId && user?.id && module.module_id)) return;

      try {
        const result = await lessonApiController().checkValidLesson(
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
      <div className="cursor-pointer p-3 rounded-lg border border-gray-500 animate-pulse">
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer p-3 rounded-lg border ${
        isModuleAccessible
          ? "border-gray-500 bg-white"
          : "border-red-300 bg-red-50"
      }`}
    >
      <div
        className="cursor-pointer p-3 flex flex-row justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronRight
            className={`w-4 h-4 shrink-0 ${
              isModuleAccessible ? "text-gray-500" : "text-red-400"
            }`}
          />
        ) : (
          <ChevronDown
            className={`w-4 h-4 shrink-0 ${
              isModuleAccessible ? "text-gray-500" : "text-red-400"
            }`}
          />
        )}
        <div className="flex flex-row gap-2 items-center">
          <Book
            className={`w-6 h-6 shrink-0 ${
              isModuleAccessible ? "text-gray-500" : "text-red-400"
            }`}
          />
          <span
            className={isModuleAccessible ? "text-gray-900" : "text-red-600"}
          >
            Module {module.order_index}: {module.title}
          </span>
          {!isModuleAccessible && (
            <div className="flex items-center gap-1 ml-2">
              <Lock className="w-4 h-4 text-red-500" />
              <span className="text-xs text-red-500 font-medium">Locked</span>
            </div>
          )}
        </div>
      </div>

      {isOpen && (
        <div>
          {!isModuleAccessible && (
            <div className="px-6 py-2 mb-2 bg-red-100 border-l-4 border-red-400 rounded">
              <p className="text-sm text-red-700 font-medium">
                🔒 Complete the previous module to unlock these lessons
              </p>
            </div>
          )}

          {module.lessons.map((lesson, index) => {
            const LessonContent = (
              <div
                className={`px-6 py-3 border-l-4 ${
                  !isModuleAccessible &&
                  "cursor-not-allowed border-l-red-200 bg-red-25"
                } ${
                  lesson.completed
                    ? " bg-green-50 cursor-pointer border-l-green-500"
                    : "hover:bg-gray-50 cursor-pointer border-l-gray-200"
                }  `}
              >
                <div className="flex items-center space-x-3">
                  {
                    lesson.completed 
                      ? <CheckCircle className="w-5 h-5 text-green-500" />
                      : <div className=" w-5 h-5 rounded-full border border-gray-50" />
                  }
                  <FileText
                    className={`w-4 h-4 ${
                      isModuleAccessible ? "text-gray-400" : "text-red-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        isModuleAccessible ? "text-gray-600" : "text-red-600"
                      }`}
                    >
                      {lesson.title}
                    </p>
                    <p
                      className={`text-xs ${
                        isModuleAccessible ? "text-gray-500" : "text-red-500"
                      }`}
                    >
                      Lesson {lesson.order_index}
                    </p>
                  </div>
                  {!isModuleAccessible && (
                    <Lock className="w-3 h-3 text-red-400" />
                  )}
                </div>
              </div>
            );

            return (
              <div key={index}>
                {isModuleAccessible ? (
                  <Link to={`/dashboard/course/${courseId}/module/${module.module_id}/lesson/${lesson.slug}`}>
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
