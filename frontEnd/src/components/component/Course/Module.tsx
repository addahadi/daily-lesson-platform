import { CourseApiController } from '@/Api/course.Api';
import type { LessonCardProps, ModuleCardProps } from '@/lib/type'
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Modules = ({title , created_at , order_index , module_id} : ModuleCardProps) => {
    const { CourseId } = useParams(); 

    const [Lessons , setLessons] = useState<LessonCardProps[]>()
    const [open , setOpen] = useState<boolean>(false)
    useEffect(() => {
        async function fetchModules() {
            if (module_id){
            const result = await CourseApiController().getModuleLesson(module_id);
            if (result){
                console.log(result)
                setLessons(result);
            }
            }
        }
        fetchModules();
    
        },[module_id])
  
    return (
        <div key={module_id}>
            <div className="py-10 px-12 border-b border-gray-300 flex justify-between items-center">
                <div>
                <h3 className=" text-lg text-black-1">{title}</h3>
                <p className=" flex items-center text-gray-600 text-sm gap-3">
                    <span>{created_at}</span>
                    <span className="text-gray-500"> | </span>
                    <span>module:{order_index}</span>
                </p>
                </div>
                <div>
                <div
                    className=" text-orange-1 "
                    onClick={() => {
                     setOpen(!open)
                    }}
                >
                    {!open ? (
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span>Show Content</span>
                        <ChevronDown className=" text-orange-1" />
                    </div>
                    ) : (
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span>Hide Content</span>
                        <ChevronUp className=" text-orange-1 rotate-180" />
                    </div>
                    )}
                </div>
                </div>
            </div>
            {open && (
                Lessons?.map((lesson) => {
                    return (
                      <Link
                        to={`/dashboard/course/${CourseId}/module/${module_id}/lesson/${lesson.lesson_slug}`}
                        className=" bg-gray-200 border-b border-gray-300 px-12 py-4 flex justify-between items-center w-full "
                      >
                        <div className="flex flex-col">
                          <span className=" text-black-1 font-semibold">
                            {lesson.title}
                          </span>
                          <span className=" text-gray-600 text-sm">
                            Duration: {lesson.duration_minutes} minutes
                          </span>
                        </div>
                        <div className=" text-gray-500 text-sm">
                          <span>Level: {lesson.level}</span>
                        </div>
                      </Link>
                    );
                })
            )}
        </div>
    );
}

export default Modules