import type { ModuleCardProps, Lesson } from "@/Shared/lib/type";
import {
  Book,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Lock,
} from "lucide-react";
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import clsx from "clsx";

const LessonsListComponent = ({
  module,
}: {
  module: ModuleCardProps & { lessons: Lesson[] };
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { courseId } = useParams();

  return (
    <div
      className={clsx(
        "cursor-pointer p-3 rounded-lg border lg:p-2",
        module.isAccessible
          ? "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
          : "border-red-300 bg-red-50 dark:border-red-300 dark:bg-red-700"
      )}
    >
      {/* Module Header */}
      <div
        className="flex flex-row items-center px-2 py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown
            className={clsx(
              "w-4 h-4 shrink-0",
              module.isAccessible
                ? "text-gray-500 dark:text-gray-300"
                : "text-red-400"
            )}
          />
        ) : (
          <ChevronRight
            className={clsx(
              "w-4 h-4 shrink-0",
              module.isAccessible
                ? "text-gray-500 dark:text-gray-300"
                : "text-red-200"
            )}
          />
        )}

        <div className="flex gap-2 items-center flex-1">
          <Book
            className={clsx(
              "w-5 h-5 shrink-0",
              module.isAccessible
                ? "text-gray-500 dark:text-gray-300"
                : "text-red-400"
            )}
          />
          <span
            className={clsx(
              "text-sm md:text-base font-medium",
              module.isAccessible
                ? "text-gray-900 dark:text-gray-100"
                : "text-red-400 dark:text-red-100"
            )}
          >
            Module {module.order_index}: {module.title}
          </span>
        </div>

        {!module.isAccessible && (
          <div className="flex items-center gap-1 ml-2 justify-self-end">
            <Lock className="w-4 h-4 text-red-500 dark:text-red-400" />
            <span className="text-xs text-red-500 dark:text-red-400 font-medium">
              Locked
            </span>
          </div>
        )}
      </div>

      {/* Lessons */}
      {isOpen && (
        <div>
          {!module.isAccessible && (
            <div className="px-6 py-2 mb-2 bg-red-100 dark:bg-red-900 border-l-4 border-red-400 dark:border-red-600 rounded">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                🔒 Complete the previous module to unlock these lessons
              </p>
            </div>
          )}

          {module.lessons.map((lesson, index) => {
            const lessonClasses = clsx(
              "px-6 py-3 border-l-4",
              !module.isAccessible &&
                "cursor-not-allowed bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-600",
              lesson.completed
                ? "bg-green-50 dark:bg-green-900 cursor-pointer border-green-500"
                : "hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-gray-200 dark:border-gray-700"
            );

            const LessonContent = (
              <div className={lessonClasses}>
                <div className="flex items-center space-x-3">
                  {lesson.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-gray-300 dark:border-gray-600" />
                  )}

                  <FileText
                    className={clsx(
                      "w-4 h-4",
                      module.isAccessible
                        ? "text-gray-400 dark:text-gray-300"
                        : "text-red-400"
                    )}
                  />

                  <div className="flex-1">
                    <p
                      className={clsx(
                        "text-sm",
                        module.isAccessible
                          ? "text-gray-700 dark:text-gray-200"
                          : "text-red-600 dark:text-red-400"
                      )}
                    >
                      {lesson.title}
                    </p>
                    <p
                      className={clsx(
                        "text-xs",
                        module.isAccessible
                          ? "text-gray-500 dark:text-gray-400"
                          : "text-red-500 dark:text-red-400"
                      )}
                    >
                      Lesson {lesson.order_index}
                    </p>
                  </div>

                  {!module.isAccessible && (
                    <Lock className="w-3 h-3 text-red-400 dark:text-red-400" />
                  )}
                </div>
              </div>
            );

            return (
              <div key={index}>
                {module.isAccessible ? (
                  <Link
                    to={`/dashboard/course/${courseId}/module/${module.module_id}/lesson/${lesson.slug}`}
                  >
                    {LessonContent}
                  </Link>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => e.preventDefault()}
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

const LessonsList = React.memo(LessonsListComponent);
export default LessonsList;
