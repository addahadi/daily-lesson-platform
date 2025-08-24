import type { Course } from "@/Shared/lib/adminType";
import { Card, CardDescription, CardTitle } from "@/Shared/components/ui/card";
import { Button } from "@/Shared/components/ui/button";
import { Badge } from "@/Shared/components/ui/badge";
import { formatDuration, getLevelColor } from "@/Shared/lib/utils";
import { BookOpen, Clock, Edit, Eye, EyeOff, Users } from "lucide-react";
import { useState, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useCourseApi from "../api/course.api";

const AdminCourseCard = ({
  course,
  setEditedCourse,
}: {
  course: Course;
  setEditedCourse: React.Dispatch<SetStateAction<Course | null>>;
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { ToggleCourseView } = useCourseApi();
  const [is_published, setIs_published] = useState(course.is_published);

  const handleEditCourse = () => {
    setEditedCourse(course);
  };

  const handleToggleCourseView = async () => {
    setLoading(true);
    const result = await ToggleCourseView(course.id);
    if (result) {
      toast.success(result);
      setIs_published(!is_published);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <Card className="flex flex-col w-full h-full bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm border dark:border-gray-700">
      <div className="grid grid-cols-[180px_1fr] gap-4 p-4 h-full">
        {/* Left: Image */}
        <div className="w-full h-full">
          <img
            src={course.img_url}
            alt="Course"
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        {/* Right: Content */}
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription className="flex gap-2 mt-1">
                <Badge variant="outline">{course.category}</Badge>
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleEditCourse}
                className="dark:bg-gray-700 dark:border-gray-600 hover:dark:bg-gray-600"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={loading}
                onClick={handleToggleCourseView}
                className="dark:bg-gray-700 dark:border-gray-600 hover:dark:bg-gray-600"
              >
                {is_published ? (
                  <Eye className=" w-4 h-4" />
                ) : (
                  <EyeOff className=" w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-3">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.modulecount} Modules</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.lessoncount} Lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.totalduration)}</span>
            </div>
          </div>

          {/* This pushes the button to the bottom */}
          <div className="mt-auto pt-4">
            <Button
              variant="outline"
              className="w-full dark:bg-gray-700 dark:border-gray-600 hover:dark:bg-gray-600"
              onClick={() =>
                navigate(`/admin/course/${course.id}`, { state: { course } })
              }
            >
              Manage modules
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdminCourseCard;
