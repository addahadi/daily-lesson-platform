import { Award, BookCheck, BookOpen, Clock, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModuleSection from "@/students/components/Course/ModuleSection";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import useUserApiController from "@/students/Api/user.Api";
import { useCourseAndEnrollment } from "@/hook/useFetchedData";
import { Toaster } from "@/components/ui/sonner";
import LoadingSpinner from "@/components/ui/loading";

const Course = () => {
  const { user } = useUser();
  const { CourseId } = useParams();
  const { CourseData, slug, buttonAction, setButtonAction, url, setUrl } =
    useCourseAndEnrollment(CourseId, user);

  const { EnrollToCourse } = useUserApiController();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function Enroll() {
    switch (buttonAction) {
      case "enroll":
        if (!slug || !user?.id) return;
        setLoading(true);
        console.log(user.id);
        const result = await EnrollToCourse(slug, user?.id);
        setLoading(false);
        if (result) {
          setButtonAction(result.action);
          setUrl(result.data);
        }
        break;
      case "Continue learning":
        navigate(
          `/dashboard/course/${CourseId}/module/${url?.module_id}/lesson/${url?.lesson_id}`
        );
        break;
      case "start the first lesson":
        navigate(
          `/dashboard/course/${CourseId}/module/${url?.module_id}/lesson/${url?.lesson_id}`
        );
        break;
    }
  }

  return (
    <div className="w-full relative bg-white dark:bg-gray-900 min-h-screen">
      <div className="relative">
        {/* Hero Section with Course Banner */}
        <div className="relative overflow-hidden">
          <img
            src={CourseData?.img_url}
            alt="Course Banner"
            className="w-full h-[250px] sm:h-[300px] lg:h-[400px] object-cover"
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Course Title and Description */}
          <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 text-white">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 leading-tight">
              {CourseData?.title}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl line-clamp-3">
              {CourseData?.description}
            </p>
          </div>
        </div>

        <section className="px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-8 relative z-10">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 shadow-lg dark:shadow-gray-900/20">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Level */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Level
                  </p>
                  <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {CourseData?.level}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Duration
                  </p>
                  <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                    5 hours
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Modules
                  </p>
                  <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {CourseData?.total}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Language
                  </p>
                  <p className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                    English
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
          What You'll Learn
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {CourseData?.content.map((items: string, index: number) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
            >
              <div className="flex-shrink-0 mt-0.5">
                <BookCheck className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              </div>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {items}
              </p>
            </div>
          ))}
        </div>
      </section>

      <ModuleSection Course_Id={slug ? slug : ""} />

      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex justify-end">
            <Button
              onClick={Enroll}
              disabled={loading}
              className="w-full sm:w-auto min-w-[160px] h-11 sm:h-12 text-sm sm:text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <LoadingSpinner size={20} />
              ) : (
                <span className="capitalize">{buttonAction}</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="h-20 sm:h-24" />

      <Toaster />
    </div>
  );
};

export default Course;
