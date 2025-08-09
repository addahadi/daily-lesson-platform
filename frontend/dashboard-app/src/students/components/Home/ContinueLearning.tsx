import useHomeApi from "@/students/Api/home.Api";
import { Button } from "@/components/ui/button";
import type { EnrolledLessons } from "@/lib/type";
import { getLevelColor } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { BookX, Clock, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ContinueLearning = () => {
  const { user } = useUser();
  const [courses, setCourses] =
    useState<{ title: string; course_id: string; enrollment_id: string }[]>();
  const [lessons, setLessons] = useState<EnrolledLessons | undefined>();
  const [noLesson, setNoLesson] = useState(false);
  const [noCourse, setNoCourse] = useState(false);
  const navigate = useNavigate();
  const { getEnrolledCourses, getNextLesson } = useHomeApi();

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      await getEnrolledCourses(user.id)
        .then((response) => {
          if (response == null) {
            setNoCourse(true);
          }
          setCourses(response);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    fetchData();
  }, [user]);

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
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 sm:p-8 text-center shadow-sm transition-colors">
        <BookX
          size={40}
          className="sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mb-3 sm:mb-4"
        />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Enrolled Courses
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-sm">
          Start your learning journey by discovering our available courses
        </p>
        <Button
          variant="destructive"
          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-6 py-2 text-sm sm:text-base transition-colors"
          onClick={() => {
            navigate("/dashboard/discover");
          }}
        >
          Discover Our Courses
        </Button>
      </div>
    );
  }

  if (noLesson) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-6 sm:p-8 text-center shadow-sm transition-colors">
        <BookX
          size={40}
          className="sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500 mb-3 sm:mb-4"
        />
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
          You're All Caught Up!
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-sm">
          There are no lessons left to continue at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-700 w-full transition-colors">
      <h1 className="text-lg sm:text-xl text-gray-900 dark:text-white font-semibold mb-4 sm:mb-5">
        Continue Learning
      </h1>
      <section className="flex flex-col gap-4 sm:gap-5 w-full">
        {lessons &&
          lessons[0] &&
          courses?.map((course, index) => {
            return (
              <div
                key={index}
                className="flex items-center flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-2 sm:gap-4">
                  <h2 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate flex-1">
                    {course.title}
                  </h2>
                  <span
                    className={`
                      rounded-full py-1 px-2 sm:px-3 text-xs sm:text-sm font-medium self-start sm:self-center flex-shrink-0 ${getLevelColor(
                        lessons && lessons[0].lesson.level
                      )}
                    `}
                  >
                    {lessons && lessons[0].lesson.level}
                  </span>
                </div>

                <div className="mt-2 sm:mt-3 px-0 sm:px-2 w-full text-gray-500 dark:text-gray-400">
                  <p className="flex gap-2 items-center text-sm">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {lessons && lessons[0].lesson.duration_minutes} minutes
                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full mt-4 sm:mt-5">
                  <div className="w-full flex-1">
                    <div className="w-full flex justify-between items-center text-gray-500 dark:text-gray-400 mb-2 text-xs sm:text-sm">
                      <span>
                        {lessons && lessons[0].progressPercentage}% complete
                      </span>
                      <span>
                        {lessons && lessons[0].total_progressed_modules}/
                        {lessons && lessons[0].total_modules}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-orange-500 dark:bg-orange-400 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${lessons && lessons[0].progressPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base font-medium min-w-fit">
                    <Play className="w-4 h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    Continue
                  </button>
                </div>
              </div>
            );
          })}
      </section>
    </div>
  );
};

export default ContinueLearning;
