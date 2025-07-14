import { FileText, Clock } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { Module } from "@/lib/adminType";
import AdminCard from "./AdminCard";

const AdminModuleCard = ({
  module,
  course_id,
  setEditModel,
}: {
  module: Module;
  course_id: string;
  setEditModel: (module: Module | null) => void;
}) => {
  function handleEditModule() {
    setEditModel(module);
  }

  function handleDeleteModule() {
    // Implement delete logic if needed
  }
  return (
    <AdminCard
      key={module.id}
      State = {module}
      id={module.id}
      title={module.title}
      URL={`/admin/course/${course_id}/module/${module.id}`}
      handleEditModule={handleEditModule}
      handleDeleteModule={handleDeleteModule}
    >
      <div className="flex items-center gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <FileText className="w-4 h-4" />
          <span>{module.lessoncount} lessons</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(module.totalduration)}</span>
        </div>
      </div>
    </AdminCard>
  );
};

export default AdminModuleCard;
