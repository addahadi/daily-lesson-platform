import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AdminModuleCard from "./AdminModuleCard";
import type {Module} from "@/lib/adminType";
const DraggableAdminCard = ({
  module,
  course_id,
  setEditModel,
}: {
  module: Module;
  course_id: string;
  setEditModel: (module: Module | null) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: module.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AdminModuleCard
        module={module}
        course_id={course_id}
        setEditModel={setEditModel}
      />
    </div>
  );
};

export default DraggableAdminCard;
