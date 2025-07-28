import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CourseCardProps, FolderType } from "@/lib/type";
import { FOLDER_CACHE_KEY, getLevelColor } from "@/lib/utils";
import useFolderApiController from "@/students/Api/folder.Api";
import { Bookmark, BookmarkCheck, Clock, Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CACHE_KEY_DISCOVER } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/loading";
import { Toaster } from "@/components/ui/sonner";


export default function CourseCard({
  slug,
  title,
  category,
  level,
  img_url,
  total_duration,
  id,
  is_saved,
  handleDelete,
  deleteState
}: CourseCardProps & {is_saved : boolean} & {handleDelete? : (course_id : string) => void} & {deleteState : boolean}) {
  const navigate = useNavigate();
  const [openModel ,setOpenModel] = useState(false)
  return (
    <div>
      <div
        className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex`}
      >
        <div className={`relative w-80  flex-shrink-0`}>
          <img
            src={img_url}
            alt={title}
            className={`w-full object-cover h-full`}
          />
          <div className="absolute top-4 left-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                level
              )}`}
            >
              {level}
            </span>
          </div>

          {is_saved ? (
            <button 
            
            disabled={deleteState}
            className={`
            
            ${handleDelete ? "cursor-pointer" : "cursor-default"}
            absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-300  hover:shadow-lg transition-all duration-200`}>
              {handleDelete ? (
                <BookmarkCheck
                  
                  onClick={() => handleDelete(id)}
                  className={`w-4 h-4`}
                />
              ) : (
                <BookmarkCheck
                  
                  className={`w-4 h-4`}
                />
              )}
            </button>
          ) : (
            <button
              onClick={() => setOpenModel(true)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-300  hover:shadow-lg transition-all duration-200"
            >
              <Bookmark className={`w-4 h-4`} />
            </button>
          )}
        </div>

        <div className={`p-6 flex-1`}>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{parseInt(total_duration) / 60} hours</span>
            </div>
            <p className="text-sm text-gray-600 font-bold">by admin</p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 capitalize">
                {level} • {category}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              onClick={() => navigate(`/dashboard/course/${slug}`)}
            >
              <Play className="w-4 h-4" />
              Check Out
            </button>
          </div>
        </div>
      </div>
      {openModel && (
        <div className=" z-50 absolute h-screen   flex justify-center items-center w-full top-0 left-0">
          <SaveModel
            course_id={id}
            close={() => {
              setOpenModel(false);
            }}
          />
        </div>
      )}
      <Toaster/>
    </div>
  );
}


type saveModelType = {
  close : () => void
  course_id : string | undefined
}


const SaveModel = ({
  close  ,
  course_id
} : saveModelType) => {
  const [folders , setFolders] = useState<FolderType[] | null>(null)
  const {getAllFolders , saveCourseToFolder} = useFolderApiController()
  const [selectedFolder , setSelectedFolder] = useState<string>()
  const [loading , setLoading] = useState(false)
  useEffect(() => {
    
    const fetchData = async () => {
      const cached = localStorage.getItem(FOLDER_CACHE_KEY)
      if(cached){
        const data = JSON.parse(cached)
        setFolders(data.data)
        return      
      }
      const data = await getAllFolders()
      if(data){
        setFolders(data)
      }
    }
    fetchData()
  },[])
  const handleSave = async () => {
    console.log(selectedFolder , course_id)
    if(!selectedFolder || !course_id) return
    setLoading(true)
    const data = await saveCourseToFolder(course_id , selectedFolder)
    if(data){
      toast.success("course was saved successfully")
      setLoading(false)
      localStorage.removeItem(CACHE_KEY_DISCOVER)
      return
    }
  }
  return (
    <Card className=" w-[250px] shadow-xl border border-gray-400">
      <CardHeader className=" flex flex-row justify-between items-center">
        <h1 className=" text-xl font-semibold text-gray-800">Save Course</h1>
        <div
          onClick={close}
          className=" p-1 rounded-lg flex justify-center items-center cursor-pointer   hover:bg-gray-300 "
        >
          <X className=" w-5 h-5 text-gray-900" />
        </div>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Folders</Label>
          <Select
          value={selectedFolder}
          onValueChange={(e) => {
            setSelectedFolder(e)
          }}          
          >
            <SelectTrigger className=" w-full">
              <SelectValue placeholder="Folders" />
            </SelectTrigger>
            <SelectContent>
              {
                folders && folders.map((folder) => {
                  return <SelectItem value={folder.id}>
                    {folder.title}
                  </SelectItem>
                })
              }
            </SelectContent>            
          </Select>
        </div>
        <div className=" mt-5">
          <Button 
          
          onClick={handleSave}
          
          variant="destructive" className="
           bg-orange-500 hover:bg-orange-600
          w-full">
            {
              loading ? 
              <LoadingSpinner color="white-1" size={20} />
              : <span>Save</span>
            }
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}