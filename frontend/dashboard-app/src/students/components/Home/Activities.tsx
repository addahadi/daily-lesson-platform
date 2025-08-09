import useHomeApi from "@/students/Api/home.Api";
import { useUser } from "@clerk/clerk-react";
import { BookOpen, CheckCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

const Activities = () => {
  const [total, setTotal] = useState<string>();
  const [LessonActivity, setLessonActivity] = useState<{
    completed_lessons: string;
    total_lessons: string;
  }>();
  const { user } = useUser();

  const { getTotalLessons, getEnrolledCoursesNumber } = useHomeApi();
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const result = await getEnrolledCoursesNumber(user?.id);
      const { total_courses } = result[0];
      console.log(result);
      setTotal(total_courses);
    }
    async function fetchLessons() {
      if (!user) return;
      const result = await getTotalLessons(user?.id);
      setLessonActivity(result[0]);
    }
    fetchLessons();
    fetchData();
  }, [user]);
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mb-4 sm:mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 w-full transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
              Active Courses
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {total || "0"}
            </p>
          </div>
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 ml-3 flex-shrink-0 ${
              total && parseInt(total)
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "bg-gray-100 dark:bg-gray-700"
            } rounded-lg flex items-center justify-center transition-colors`}
          >
            {total && parseInt(total) ? (
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            ) : (
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 dark:text-green-400 mr-1 flex-shrink-0" />
          <span className="text-green-600 dark:text-green-400">
            +2 this month
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700 w-full transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
              Lessons Completed
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {LessonActivity?.completed_lessons || "0"}
            </p>
          </div>
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 ml-3 flex-shrink-0 ${
              LessonActivity?.completed_lessons &&
              parseInt(LessonActivity?.completed_lessons)
                ? "bg-green-100 dark:bg-green-900/30"
                : "bg-gray-100 dark:bg-gray-700"
            } rounded-lg flex items-center justify-center transition-colors`}
          >
            {LessonActivity?.completed_lessons &&
            parseInt(LessonActivity?.completed_lessons) ? (
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            ) : (
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            of {LessonActivity?.total_lessons || "0"} total
          </span>
        </div>
      </div>
    </div>
  );
};

export default Activities;
