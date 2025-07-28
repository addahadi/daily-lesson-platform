import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import useFolderApiController from "../Api/folder.Api"
import type { CourseCardProps } from "@/lib/type"
import LoadingSpinner from "@/components/ui/loading"
import EmptyCase from "../components/empty/EmptyCase"
import { File } from "lucide-react"
import CourseCard from "../components/Discover/CourseCard"
import { toast } from "sonner"
import { CACHE_KEY_DISCOVER } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

const SavedCourses = () => {
    const {libraryId} = useParams()
    const title = useLocation().state.title
    const [courses, setCourses] = useState<CourseCardProps[] | null>(null);
    const [loading , setLoading] = useState(false)
    const [deleteState , setDeleteState] = useState(false)
    const navigate = useNavigate()
    const {getCoursesInFolder , unsaveCourse} = useFolderApiController()
    useEffect(() => {
        if(!title){
            navigate("/dashboard/library")
        }
    },[title])
    useEffect(() => {
      const fetchData = async () => {
        if(!libraryId) return
        setLoading(true)
        const data = await getCoursesInFolder(libraryId)
        if(data){
          setCourses(data)
          setLoading(false)
          return
        }
        setLoading(false)
      }
      fetchData()
    },[getCoursesInFolder , libraryId])
    const handleDelete = async (course_id : string) => {
      setDeleteState(true)
      if(!course_id || !libraryId) return
      const data = await unsaveCourse(course_id , libraryId)
      if(data){
        toast.success("course was unsaved successfuly")
        setDeleteState(false)
        setCourses((prev) => {
          return prev?.filter((course) => {
            return course.id != course_id
          }) || null
        })
        localStorage.removeItem(CACHE_KEY_DISCOVER)
      }
      else {
        setDeleteState(false)
      }
    }
  return (
    <div className=" h-screen p-6">
      <div className="">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/library")}
          className=" text-orange-400 hover:text-orange-400/80"
        >
          ← Back to Folders
        </Button>
      </div>
      <div className=" mt-8 flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-gray-800">{title}</h1>
        <div className="  font-semibold text-gray-400">
          {courses !== null && courses.length} courses saved
        </div>
      </div>


      {
        loading 
        ? <div className=" h-64 flex justify-center items-center">
          <LoadingSpinner size={40} color="orange-500"/>
        </div>
        : <div> 
          {
            courses === null
            ? (
              <EmptyCase
                title="No saved courses"
                description="You haven’t saved any course yet."
                icon= {<File className=" w-8 h-8" />}
              />
            )
            : (
              <div  className=" mt-6 grid grid-cols-2">
                {
                  courses.map((course) => {
                    return (
                      <CourseCard
                        slug={course.slug}
                        title={course.title}
                        category={course.category}
                        level = {course.level}
                        img_url= {course.img_url}
                        total_duration= {course.total_duration}
                        id={course.id}
                        is_saved = {true}
                        handleDelete={handleDelete}
                        deleteState = {deleteState}                      
                      />
                    )
                  })   
                }
              </div>
            )
          }
        </div>
      }
      <Toaster />
    </div>
  );
}

export default SavedCourses