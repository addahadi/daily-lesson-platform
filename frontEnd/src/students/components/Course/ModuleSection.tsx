import type { ModuleCardProps } from "@/lib/type";
import { useEffect, useState } from "react";
import Modules from "./Module";
import useCourseApiController from "@/students/Api/course.Api";

const ModuleSection = ({ Course_Id }: { Course_Id: string }) => {
  const [modules, setModules] = useState<ModuleCardProps[]>([]);
  const { getCourseModules } = useCourseApiController();

  useEffect(() => {
    async function fetchModules() {
      if (Course_Id) {
        const result = await getCourseModules(Course_Id);
        if (result) {
          console.log(result);
          setModules(result);
        }
      }
    }
    fetchModules();
  }, [Course_Id]);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 sm:mb-20">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 text-gray-900 dark:text-white">
        Course Modules
      </h2>

      {modules.length > 0 ? (
        <div className="w-full rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20 overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {modules.map((module, index) => (
              <div
                key={module.module_id || index}
                className="transition-colors "
              >
                <Modules {...module} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-8 sm:p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No modules available
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Course modules will appear here once they're added.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ModuleSection;
