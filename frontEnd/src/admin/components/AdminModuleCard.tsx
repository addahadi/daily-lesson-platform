import { FileText, Clock } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import type { Module } from "@/lib/adminType";
import AdminCard from "./AdminCard";
import React, { useState, type SetStateAction } from "react";
import { toast } from "sonner";
import useModuleApi from "../api/module.api";

const AdminModuleCard = ({
  module,
  course_id,
  setEditModel,
  setModules
}: {
  module: Module;
  course_id: string;
  setEditModel: (module: Module | null) => void;
  setModules : React.Dispatch<SetStateAction<Module[]>>
}) => {

  const [loading , setLoading] = useState(false)
  const {deleteModule} = useModuleApi()
  
  function handleEditModule() {
    setEditModel(module);
  }

  async function handleDeleteModule() {
    setLoading(true);
    const result = await deleteModule(module.id);
    if (result !== null) {
      setLoading(false);
      toast.success(result);
    }
    setLoading(false);
    setModules((prev) => {
      return prev.filter((mod) => {
        return mod.id != module.id;
      });
    });
  }
  return (
    <AdminCard
      key={module.id}
      State={module}
      id={module.id}
      title={module.title}
      URL={`/admin/course/${course_id}/module/${module.id}`}
      handleEditModule={handleEditModule}
      handleDeleteModule={handleDeleteModule}
      loading={loading}
      manageTitle="Manage Module Content"
    >
      <div className="flex items-center gap-6 text-sm text-gray-500 ">
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
