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

  const {getTotalLessons , getEnrolledCoursesNumber} = useHomeApi()
  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      const result = await getEnrolledCoursesNumber(
        user?.id
      );
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
    <div className="flex flex-row gap-4  w-full mb-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border w-full  ">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Courses</p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <div
            className={`w-12 h-12 ${
              LessonActivity?.completed_lessons &&
              parseInt(LessonActivity?.completed_lessons)
                ? "bg-blue-100"
                : "bg-gray-100"
            } rounded-lg flex items-center justify-center`}
          >
            {total && parseInt(total) ? (
              <BookOpen className="w-6 h-6 text-blue-600" />
            ) : (
              <BookOpen className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-green-600">+2 this month</span>
        </div>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border w-full ">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Lessons Completed
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {LessonActivity?.completed_lessons}
            </p>
          </div>
          <div
            className={`w-12 h-12 ${
              LessonActivity?.completed_lessons &&
              parseInt(LessonActivity?.completed_lessons)
                ? "bg-green-100"
                : "bg-gray-100"
            } rounded-lg flex items-center justify-center`}
          >
            {LessonActivity?.completed_lessons &&
            parseInt(LessonActivity?.completed_lessons) ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <CheckCircle className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-gray-600">
            of {LessonActivity?.total_lessons} total
          </span>
        </div>
      </div>
    </div>
  );
};

export default Activities;
