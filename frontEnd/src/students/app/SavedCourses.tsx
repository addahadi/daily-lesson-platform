import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFolderApiController from "../Api/folder.Api";
import type { CourseCardProps } from "@/lib/type";
import LoadingSpinner from "@/components/ui/loading";
import EmptyCase from "../components/empty/EmptyCase";
import { File, ArrowLeft } from "lucide-react";
import CourseCard from "../components/Discover/CourseCard";
import { toast } from "sonner";
import { CACHE_KEY_DISCOVER } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const SavedCourses = () => {
  const { libraryId } = useParams();
  const title = useLocation().state?.title;
  const [courses, setCourses] = useState<CourseCardProps[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteState, setDeleteState] = useState(false);
  const navigate = useNavigate();
  const { getCoursesInFolder, unsaveCourse } = useFolderApiController();

  useEffect(() => {
    if (!title) {
      navigate("/dashboard/library");
    }
  }, [title, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!libraryId) return;
      setLoading(true);
      const data = await getCoursesInFolder(libraryId);
      if (data) {
        setCourses(data);
        setLoading(false);
        return;
      }
      setLoading(false);
    };
    fetchData();
  }, [getCoursesInFolder, libraryId]);

  const handleDelete = async (course_id: string) => {
    setDeleteState(true);
    if (!course_id || !libraryId) return;
    const data = await unsaveCourse(course_id, libraryId);
    if (data) {
      toast.success("course was unsaved successfully");
      setDeleteState(false);
      setCourses((prev) => {
        return (
          prev?.filter((course) => {
            return course.id != course_id;
          }) || null
        );
      });
      localStorage.removeItem(CACHE_KEY_DISCOVER);
    } else {
      setDeleteState(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 p-4 sm:p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/library")}
          className="text-orange-400 hover:text-orange-400/80 dark:text-orange-300 dark:hover:text-orange-200 transition-colors p-2 sm:px-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Back to Folders</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </div>

      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 dark:text-gray-100 transition-colors break-words">
          {title}
        </h1>
        <div className="font-semibold text-sm sm:text-base text-gray-400 dark:text-gray-500 transition-colors">
          {courses !== null && courses.length} course
          {courses !== null && courses.length !== 1 ? "s" : ""} saved
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64 w-full">
          <LoadingSpinner size={40} color="orange-500" />
        </div>
      ) : (
        <div>
          {courses === null || courses.length === 0 ? (
            <div className="flex justify-center items-center w-full py-12 sm:py-16">
              <EmptyCase
                title="No saved courses"
                description="You haven't saved any course yet."
                icon={<File className="w-8 h-8" />}
              />
            </div>
          ) : (
            /* Responsive Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {courses.map((course) => {
                return (
                  <div key={course.id} className="w-full">
                    <CourseCard
                      slug={course.slug}
                      title={course.title}
                      category={course.category}
                      level={course.level}
                      img_url={course.img_url}
                      total_duration={course.total_duration}
                      id={course.id}
                      is_saved={true}
                      handleDelete={handleDelete}
                      deleteState={deleteState}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default SavedCourses;
