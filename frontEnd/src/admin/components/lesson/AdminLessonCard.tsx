import type { Lesson } from "@/lib/adminType";
import { formatDuration, getLevelColor } from "@/lib/utils";
import { Clock } from "lucide-react";
import AdminCard from "../AdminCard";
import { Badge } from "@/components/ui/badge";

const AdminLessonCard = ({
  lesson,
  course_id,
  module_id,
  setEditLesson,
}: {
  lesson: Lesson;
  course_id: string | undefined;
  module_id: string | undefined;
  setEditLesson: (lesson: Lesson | null) => void;
}) => {
  function handleEditModule() {
    setEditLesson(lesson);
  }
  function handleDeleteModule() {}
  return (
    <AdminCard
      id={module_id}
      title={lesson.title}
      State = {lesson}
      URL={`/admin/course/${course_id}/module/${module_id}/lesson/${lesson.id}`}
      handleEditModule={handleEditModule}
      handleDeleteModule={handleDeleteModule}
    >
      <div className="flex items-center gap-4 text-sm">
        <Badge className={getLevelColor(lesson.level)}>{lesson.level}</Badge>
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(lesson.duration_minutes)}</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          /{lesson.slug}
        </Badge>
      </div>
    </AdminCard>
  );
};

export default AdminLessonCard;
