
import type { Course } from '@/lib/adminType'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDuration, getLevelColor } from '@/lib/utils';
import { BookOpen, Clock, Edit, Trash2, Users } from 'lucide-react';
import type { SetStateAction } from 'react';



const AdminCourseCard = ({
  course,
  setEditedCourse,
}: {
  course: Course;
  setEditedCourse: React.Dispatch<SetStateAction<Course | null>>;
}) => {
  function handleEditCourse() {
    setEditedCourse(course)
  }
  function handleDeleteCourse() {}
  return (
    <Card className="w-full shadow-md">
      <CardHeader className=" flex flex-row gap-2">
        <div className=" object-cover w-[200px]  h-full">
          <img
            src={course.img}
            className=" w-full h-[80px] rounded-lg"
            alt="course-img"
          />
        </div>
        <div className=" flex-1 flex justify-between w-full items-center">
          <div className="flex flex-col gap-2">
            <CardTitle className=" text-lg">{course.title}</CardTitle>
            <CardDescription className=" flex flex-row gap-2">
              <Badge variant="secondary">{course.category}</Badge>
              <Badge className={getLevelColor(course.difficulty)}>
                {course.difficulty}
              </Badge>
            </CardDescription>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleEditCourse()}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleDeleteCourse()}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className=" flex flex-row">
        <div className="w-[200px]"></div>
        <div className=" p-5 w-full">
          <p className=" flex-1 text-sm text-gray-600 ">{course.description.slice(0,60)}...</p>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 mt-4">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>{course.moduleCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{course.lessonCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(course.totalDuration)}</span>
            </div>
          </div>
          <Button variant="outline" className=" w-full">
            Manage the course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCourseCard