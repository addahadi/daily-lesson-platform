import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  deleteState,
}: CourseCardProps & { is_saved: boolean } & {
  handleDelete?: (course_id: string) => void;
} & { deleteState: boolean }) {
  const navigate = useNavigate();
  const [openModel, setOpenModel] = useState(false);
  const [Saved , setIsSaved] = useState(is_saved)
  return (
    <div className="relative">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl dark:shadow-gray-900/25 dark:hover:shadow-gray-900/40 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col lg:flex-row border border-gray-200 dark:border-gray-700">
        {/* Image Section */}
        <div className="relative w-full lg:w-80 h-48 lg:h-auto flex-shrink-0">
          <img
            src={img_url}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Level Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(
                level
              )}`}
            >
              {level}
            </span>
          </div>

          {/* Bookmark Button */}
          {Saved ? (
            <button
              disabled={deleteState}
              className={`
                ${
                  handleDelete
                    ? "cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                    : "cursor-default"
                }
                absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600
              `}
            >
              {handleDelete ? (
                <BookmarkCheck
                  onClick={() => handleDelete(id)}
                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                />
              ) : (
                <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setOpenModel(true)}
              className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600"
            >
              <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          {/* Title */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
              {title}
            </h3>
          </div>

          {/* Meta Information */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{Math.round(parseInt(total_duration) / 60)} hours</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">
              by admin
            </p>
          </div>

          {/* Category and Level */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {level} • {category}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-between mt-auto">
            <button
              className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
              onClick={() => navigate(`/dashboard/course/${slug}`)}
            >
              <Play className="w-4 h-4" />
              Check Out
            </button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {openModel && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 dark:bg-opacity-70 p-4">
          <SaveModel
            course_id={id}
            close={() => {
              setOpenModel(false);
            }}
            setIsSaved={setIsSaved}
          />
        </div>
      )}
      <Toaster />
    </div>
  );
}

type saveModelType = {
  close: () => void;
  course_id: string | undefined;
  setIsSaved: (isSaved: boolean) => void;
};

const SaveModel = ({ close, course_id, setIsSaved }: saveModelType) => {
  const [folders, setFolders] = useState<FolderType[] | null>(null);
  const { getAllFolders, saveCourseToFolder } = useFolderApiController();
  const [selectedFolder, setSelectedFolder] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const cached = localStorage.getItem(FOLDER_CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        setFolders(data.data);
        return;
      }
      const data = await getAllFolders();
      if (data) {
        setFolders(data);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    console.log(selectedFolder, course_id);
    if (!selectedFolder || !course_id) return;
    setLoading(true);
    const data = await saveCourseToFolder(course_id, selectedFolder);
    if (data) {
      toast.success("course was saved successfully");
      setLoading(false);
      localStorage.removeItem(CACHE_KEY_DISCOVER);
      setIsSaved(true);
      close();
      return;
    }
  };

  return (
    <Card className="w-full max-w-sm mx-4 shadow-xl border border-gray-400 dark:border-gray-600 dark:bg-gray-800 animate-in fade-in-0 zoom-in-95 duration-200">
      <CardHeader className="flex flex-row justify-between items-center pb-4">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
          Save Course
        </h1>
        <div
          onClick={close}
          className="p-1 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-900 dark:text-gray-100" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Folders
            </Label>
            <Select
              value={selectedFolder}
              onValueChange={(e) => {
                setSelectedFolder(e);
              }}
            >
              <SelectTrigger className="w-full mt-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {folders &&
                  folders.map((folder) => (
                    <SelectItem
                      key={folder.id}
                      value={folder.id}
                      className="dark:text-white dark:hover:bg-gray-700"
                    >
                      {folder.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading || !selectedFolder}
            variant="destructive"
            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner color="white" size={20} />
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
