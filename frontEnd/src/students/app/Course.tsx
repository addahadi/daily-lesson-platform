import { Award, BookCheck, BookOpen, Clock, Globe } from "lucide-react";
import {  useState } from "react";
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
  const { CourseData, slug  , buttonAction , setButtonAction , url , setUrl} = useCourseAndEnrollment(
    CourseId,
    user
  );

  const {EnrollToCourse} = useUserApiController()
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
      case "continue learning":
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
    <div className="  w-full relative ">
      <div className="relative">
        <img
          src={CourseData?.img_url}
          alt="Course Banner"
          className="w-full h-[330px] object-cover"
        />
        <div className="absolute bottom-20 left-8 text-white">
          <h1 className="text-4xl font-bold">{CourseData?.title}</h1>
          <p className="text-lg mt-2">{CourseData?.description}</p>
        </div>
        <section className=" px-7 -mt-7 absolute w-full">
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Level
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {CourseData?.level}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Duration
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {" "}
                    5 hours
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Total Modules
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {CourseData?.total}
                  </p>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-orange-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Language
                  </p>
                  <p className="text-lg font-semibold text-gray-900">English</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className=" w-full p-6 mt-20">
        <h2 className="text-xl font-semibold mb-4 text-black-1">
          What You’ll Learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mt-8">
          {CourseData?.content.map((items: string, index: number) => {
            return (
              <div key={index} className="flex items-start space-x-3">
                <BookCheck className="text-orange-1" />
                <p className="text-gray-700">{items}</p>
              </div>
            );
          })}
        </div>
      </section>
      <ModuleSection Course_Id={slug ? slug : ""} />
      <div className="w-full p-3  fixed bottom-0 left-0 bg-white shadow-lg flex justify-end">
        <Button
        value="destructive"
        onClick={Enroll}
        disabled={loading}
        >
          {
            loading 
            ? <LoadingSpinner  size={20}/>
            : <span>{buttonAction}</span>
          }
        </Button>
      </div>
      <Toaster />
    </div>
  );
};

export default Course;
