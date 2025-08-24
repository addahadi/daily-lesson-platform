import type { Lesson } from "@/Shared/lib/adminType";
import { formatDuration, getLevelColor } from "@/Shared/lib/utils";
import { Clock } from "lucide-react";
import AdminCard from "../AdminCard";
import { Badge } from "@/Shared/components/ui/badge";
import { useState, type SetStateAction } from "react";
import useLessonApi from "@/admin/api/lesson.api";
import { toast } from "sonner";

const AdminLessonCard = ({
  lesson,
  course_id,
  module_id,
  setEditLesson,
  setLessons,
}: {
  lesson: Lesson;
  course_id: string | undefined;
  module_id: string | undefined;
  setEditLesson: (lesson: Lesson | null) => void;
  setLessons: React.Dispatch<SetStateAction<Lesson[]>>;
}) => {
  const [loading, setLoading] = useState(false);
  const { deleteLesson } = useLessonApi();
  function handleEditModule() {
    setEditLesson(lesson);
  }

  async function handleDeleteModule() {
    setLoading(true);
    const result = await deleteLesson(lesson.id);
    if (result !== null) {
      setLoading(false);
      toast.success(result);
    }
    setLoading(false);
    setLessons((prev) => {
      return prev.filter((les) => {
        return les.id != lesson.id;
      });
    });
  }
  return (
    <AdminCard
      id={module_id}
      title={lesson.title}
      State={lesson}
      URL={`/admin/course/${course_id}/module/${module_id}/lesson/${lesson.id}`}
      handleEditModule={handleEditModule}
      loading={loading}
      handleDeleteModule={handleDeleteModule}
      manageTitle="Manage Lesson Content"
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
