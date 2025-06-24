import { lessonApiController } from "@/Api/lesson.Api";
import LessonBar from "@/components/component/Lesson/LessonBar";
import LessonBullet from "@/components/component/Lesson/LessonBullet";
import LessonCode from "@/components/component/Lesson/LessonCode";
import LessonText from "@/components/component/Lesson/LessonText";
import { Button } from "@/components/ui/button";
import useEnroll from "@/hook/useEnroll";
import type { LessonSectionProps } from "@/lib/type";
import { useUser } from "@clerk/clerk-react";
import { BookOpen, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

const Lesson = () => {
  const {courseId , moduleId,lessonId} = useParams();
  const [lessonDetail , setLessonDetail] = useState<any>();
  const [lessonSections , setLessonSections] = useState<LessonSectionProps[]>()
  const {user} = useUser()
  const { enrollmentId } = useEnroll(
    courseId ? courseId : "",
    user?.id ? user.id : ""
  );

  useEffect(() => {
    async function fetchData(){
      if(!lessonId) return 
      const {"0" : data} = await lessonApiController().getLessonDetails(lessonId)
      console.log(data)
      const {content : {sections}} = data 
      setLessonSections(sections)
      setLessonDetail(data)
    }
    fetchData()
  }, [])
  

  useEffect(() => {
    async function fetchData() {
      if(!(lessonId && moduleId && enrollmentId)) return 

      const response = await lessonApiController().startLesson(enrollmentId , moduleId , lessonId)
      console.log(response)
    }
    fetchData();
  }, [enrollmentId , user?.id , moduleId , lessonId])
  return (
    <div className="flex flex-row gap-5">
      <LessonBar />
      <div className=" flex-1 px-5">

        <section className=" bg-white-1 flex flex-col p-5 rounded-lg gap-3 mt-5 mb-5">
          <div className="flex flex-row gap-2  text-gray-500 items-center">
            <BookOpen className="w-4 h-4" />
            <span>Lesson {lessonDetail?.order_index}</span>
          </div>
          <h1 className=" text-2xl font-semibold">{lessonDetail?.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{lessonDetail?.duration_minutes} min</span>
            </div>
          </div>
          <div className="flex flex-row gap-4 mt-3">
            <Button
              variant="outline"
              className="flex items-center border-orange-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>
            <Button className="flex items-center bg-orange-1" variant="destructive">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
        <section className="flex flex-col gap-3">
          {lessonSections?.map((lessonSection) => {
            return (
              <>
                {"text" in lessonSection && (
                  <LessonText
                    text={lessonSection.text}
                    heading={lessonSection.heading}
                  />
                )}
                {"code" in lessonSection && (
                  <LessonCode
                    code={lessonSection.code}
                    heading={lessonSection.heading}
                  />
                )}
                {"bullets" in lessonSection && (
                  <LessonBullet
                    bullets={lessonSection.bullets}
                    heading={lessonSection.heading}
                  />
                )}
              </>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export default Lesson