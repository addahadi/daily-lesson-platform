import homeApiController from "@/students/Api/home.Api";
import { Button } from "@/students/components/ui/button";
import type { EnrolledLessons } from "@/students/lib/type";
import { getLevelColor } from "@/students/lib/utils";
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
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      await homeApiController()
        .getEnrolledCourses(user.id)
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
          homeApiController()
            .getNextLesson(course.course_id, course.enrollment_id)
            .catch((err) => {
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
      <div className="flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center shadow-sm">
        <BookX size={48} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">
          no Enrolled Courses
        </h3>
        <Button
          variant="destructive"
          className=" bg-orange-1 mt-6 text-white"
          onClick={() => {
            navigate("/dashboard/discover");
          }}
        >
          discover our courses
        </Button>
      </div>
    );
  }
  if (noLesson) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-8 text-center shadow-sm">
        <BookX size={48} className="text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">
          You're all caught up!
        </h3>
        <p className="text-gray-500 mt-2">
          There are no lessons left to continue at the moment.
        </p>
      </div>
    );
  }
  return (
    <div className=" bg-white p-5 rounded-lg border border-gray-200 w-full">
      <h1 className=" text-xl text-black-1 font-semibold mb-5">
        Continue Learning
      </h1>
      <section className="flex flex-col gap-5 w-full">
        {lessons &&
          lessons[0] &&
          courses?.map((course, index) => {
            return (
              <div
                key={index}
                className="flex items-center flex-col p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className=" flex justify-between items-center w-full">
                  <h2 className=" font-semibold">{course.title}</h2>
                  <span
                    className={`
                                 rounded-full p-1 px-2 ${getLevelColor(
                                   lessons && lessons[0].lesson.level
                                 )}
                                `}
                  >
                    {lessons && lessons[0].lesson.level}
                  </span>
                </div>
                <div className=" mt-2 px-2 w-full text-gray-500 ">
                  <p className="flex gap-2 items-center">
                    <span>
                      {lessons && lessons[0].lesson.duration_minutes} minutes
                    </span>
                    <Clock className=" w-5 h-5 " />
                  </p>
                </div>
                <div className="flex items-center gap-4 w-full mt-5">
                  <div className="w-full">
                    <div className=" w-full flex justify-between items-center text-gray-500 mb-2">
                      <span>
                        {lessons && lessons[0].progressPercentage}% complete
                      </span>
                      <span>
                        {lessons && lessons[0].total_modules}/
                        {lessons && lessons[0].total_progressed_modules}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-1 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${lessons && lessons[0].progressPercentage}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Play className="w-4 h-4 mr-1" />
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
