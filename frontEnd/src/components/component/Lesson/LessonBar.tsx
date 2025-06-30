import { lessonApiController } from '@/Api/lesson.Api'
import type { LessonBarProps } from '@/lib/type'

import  { useEffect, useState } from 'react'
import LessonsList from './LessonsList'

const LessonBar = ({
  courseId , 
  enrollmentId
} : {
  courseId : string | undefined 
  enrollmentId : string | undefined
}) => {
  
  const [CML , setCML] = useState<LessonBarProps>()
 
  useEffect(() => {
    async function fetchData() {
        if(!courseId || !enrollmentId) return
        const data = await lessonApiController().getLessonsDetails(courseId , enrollmentId)
        if(data){
            setCML(data)
            console.log(data)
        }
    }
    fetchData()
  }, [courseId , enrollmentId])

  return (
    <aside className = " shrink-0 px-4 py-6  bg-white w-[350px] min-h-screen">
        <h1 className=" text-black-1 font-semibold text-2xl mb-7 ">
            {CML?.course.title}
        </h1>
        <div className='flex flex-col gap-2'>
            
            {CML?.modules.map((module , index) => {
                return (
                  <LessonsList  key={index} module={module}/>
                )
            })}
        </div>
    </aside>
  )
}

export default LessonBar