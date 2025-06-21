import type { CourseProps, ToastProps } from "@/lib/type";
import { BookCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { CourseApiController } from "@/Api/course.Api";
import { useParams } from "react-router-dom";
import ModuleSection from "@/components/component/Course/ModuleSection";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { userApiController } from "@/Api/user.Api";
import { Toast } from "@/components/ui/Toast";
const Course = () => {
  const [CourseData , setCourseData] = useState<CourseProps>()
  const { CourseId } = useParams(); 
  const [slug , setSlug] = useState<string | undefined>(undefined);
  const {user} = useUser();
  const [toast , setToast] = useState<ToastProps>()
  
  useEffect(() => {
    async function fetchData(){
        if (CourseId) {
          const result = await CourseApiController().getCourseBySlug(CourseId);
          if (result) {
            setCourseData(result);
            setSlug(result.id)
            console.log(result)
          }
        }
    }
    fetchData()
  }, [])

  async function Enroll(){
    if (slug && user) {
      await userApiController().EnrollToCourse(slug, user.id).then((response) => {
        console.log(response)
        setToast({type : "success"  , message : response.message})
      }).catch((error) => {
        setToast({type : "error" , message : error.message})
      });
    }
  }  
  return (
    <div>
      <div className="w-full relative">
        <img
          src={CourseData?.img_url}
          alt="Course Banner"
          className="w-full h-[330px] object-cover"
        />
        <div className="absolute bottom-20 left-8 text-white">
          <h1 className="text-4xl font-bold">{CourseData?.title}</h1>
          <p className="text-lg mt-2">
            {CourseData?.description}
          </p>
        </div>
        <section className=" px-7 -mt-7 absolute w-full">
          <div className="flex justify-around  w-full py-7 bg-gray-100 text-center shadow-lg">
            <div className=" font-semibold">
              Level: <span>{CourseData?.level}</span>
            </div>
            <div className=" font-semibold">
              Duration: <span>5 hours</span>
            </div>
            <div className=" font-semibold">
              Total Modules: <span>{CourseData?.total}</span>
            </div>
            <div className=" font-semibold">
              Language: <span>English</span>
            </div>
          </div>
        </section>
      </div>
      <section className=" w-full p-6 mt-20">
        <h2 className="text-xl font-semibold mb-4 text-black-1">
          What You’ll Learn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6 mt-8">
          {
            CourseData?.content.map((items : string , index : number) => {
              return (
                <div key={index} className="flex items-start space-x-3">
                  <BookCheck className="text-orange-1" />
                  <p className="text-gray-700">{items}</p>
                </div>
              )
            })
          }
        </div>
      </section>
      <ModuleSection Course_Id={slug ? slug : ""} />
      <div className="w-full p-3  fixed bottom-0 left-0 bg-white shadow-lg flex justify-end">
        <Button type="button" variant="destructive" className="w-fit"  onClick={Enroll}>Enroll me</Button> 
      </div>
      {toast &&<Toast  type={toast ? toast.type : "success"}  message={toast ? toast.message : ''} onClose={() => setToast(undefined)} />}
    </div>
  );
}

export default Course