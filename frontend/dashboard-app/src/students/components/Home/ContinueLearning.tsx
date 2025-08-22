import useHomeApi from "@/students/Api/home.Api";
import { Button } from "@/components/ui/button";
import type { EnrolledLessons } from "@/lib/type";
import { getLevelColor } from "@/lib/utils";
import {BookX, Clock, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";



type Courses = { title: string; course_id: string; enrollment_id: string , course_slug : string}[];
const ContinueLearning = () => {
  const [courses, setCourses] = useState<Courses>();
  const [lessons, setLessons] = useState<EnrolledLessons | undefined>();
  const [noLesson, setNoLesson] = useState(false);
  const [noCourse, setNoCourse] = useState(false);
  const navigate = useNavigate();
  const { getEnrolledCourses, getNextLesson } = useHomeApi();

  useEffect(() => {
    async function fetchData() {
      const result = await getEnrolledCourses();
      if (result == null) {
        setNoCourse(true);
      }
      setCourses(result as Courses);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!courses || courses.length === 0) return;

      try {
        const lessonPromises = courses.map((course) =>
          getNextLesson(course.course_id, course.enrollment_id).catch((err) => {
            console.error("Error for course:", course.course_id, err);
            return null;
          })
        );

        const lessons = await Promise.all(lessonPromises);
        const nonNullLessons = lessons.filter((lesson) => lesson !== null);
        setLessons(nonNullLessons);
        if (nonNullLessons.length === 0) {
          setNoLesson(true);
        }
        console.log(lessons);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    }

    fetchData();
  }, [courses]);

  if (noCourse) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-900 border border-dashed border-orange-300 dark:border-gray-600 rounded-2xl p-8 sm:p-10 text-center shadow-md transition-colors">
        <BookX
          size={56}
          className="text-orange-400 dark:text-orange-500 mb-4 sm:mb-6 animate-pulse"
        />
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          No Enrolled Courses
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-md">
          Start your learning journey today by exploring our wide range of
          courses designed to boost your skills.
        </p>
        <Button
          variant="destructive"
          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-8 py-3 text-sm sm:text-base font-semibold shadow rounded-xl transition-all"
          onClick={() => {
            navigate("/dashboard/discover");
          }}
        >
          Browse Courses
        </Button>
      </div>
    );
  }


  if (noLesson) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-800 dark:to-gray-900 border border-dashed border-indigo-300 dark:border-gray-600 rounded-2xl p-8 sm:p-10 text-center shadow-md transition-colors">
        <Clock
          size={56}
          className="text-orange-400 dark:text-orange-500 mb-4 sm:mb-6 animate-spin-slow"
        />
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          You’re All Caught Up 🎉
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md">
          You’ve completed all your current lessons. Check back later for new
          content or review past lessons to strengthen your knowledge.
        </p>
      </div>
    );
  }

  const getLevelVariant = (level: string) => {
    switch (level) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "warning";
      case "Advanced":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-700 w-full transition-colors">
      <h1 className="text-lg sm:text-xl text-gray-900 dark:text-white font-semibold mb-4 sm:mb-5">
        Continue Learning
      </h1>
      <section className="flex flex-col gap-4 sm:gap-5 w-full">
        {lessons &&
          lessons[0] &&
          courses?.map((course, index) => {
            const currentLesson = lessons[index]?.lesson; // match course ↔ lesson
            if (!currentLesson) return null;

            return (
              <div
                className="
              flex flex-col p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow hover:shadow-lg transition-all border border-gray-700
              
              
              "
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">
                    {course.title}
                  </h2>
                  <Badge variant={getLevelVariant(currentLesson.level)}>
                    {currentLesson.level}
                  </Badge>
                </div>

                {/* Lesson Info */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {currentLesson.module_title}
                  </p>
                  <p className="text-sm text-foreground font-medium">
                    {currentLesson.lesson_title}
                  </p>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{currentLesson.duration_minutes} minutes</span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">
                      {lessons[index].progressPercentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div
                      className="h-2 bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${lessons[index].progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Button */}
                <Button
                  onClick={() =>
                    navigate(
                      `/dashboard/course/${course.course_slug}/module/${currentLesson.module_id}/lesson/${currentLesson.slug}`
                    )
                  }
                  className="w-full bg-orange-500 text-white hover:bg-orange-600"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              </div>
            );
          })}
      </section>
    </div>
  );
};

export default ContinueLearning;
