import React, { useEffect, useState } from "react";
import EditTitle from "../components/EditTitle";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLevelColor } from "@/lib/utils";
import type { Module } from "@/lib/adminType";
import { Button } from "@/components/ui/button";
import useModuleApi from "../api/module.api";
import LoadingSpinner from "@/components/ui/loading";

// dnd-kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableAdminCard from "../components/DraggbleAdminCard";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  slug: string;
  img: string;
}

const ModuleManagement = () => {
  const [isCreate, setIsCreate] = useState(false);
  const [editModule, setEditModule] = useState<Module | null>(null);
  const location = useLocation();
  const course = location.state?.course as Course;
  const { getCourseModules, updateModuleOrder } = useModuleApi();
  const [loading, setLoading] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [noModules, setNoModules] = useState(false);
  const { courseId } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    if (!course) return;
    const fetchModules = async () => {
      setLoading(true);
      const response = await getCourseModules(course.id);
      if (response && response.length > 0) {
        setModules(response);
        setNoModules(false);
      } else {
        setModules([]);
        setNoModules(true);
      }
      setLoading(false);
    };
    fetchModules();
  }, [course]);

  const handleSaveOrder = async () => {
    const orderedModules = modules.map(({ id, order_index }) => ({
      id,
      order_index,
    }));
    setIsSaving(true);
    const response = await updateModuleOrder(course.id, orderedModules);
    if (!response) {
      setIsSaving(false);
      toast.error("Failed to save module order");
      return;
    }
    setModules((prev) =>
      prev.map((m) => {
        const updatedModule = response.find(
          (r: Partial<Module>) => r.id === m.id
        );
        return updatedModule
          ? { ...m, order_index: updatedModule.order_index }
          : m;
      })
    );
    setIsSaving(false);
    toast.success("Module order saved successfully");
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <Link
          to="/admin/course-management"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
      </div>

      <Card className="mb-14">
        <CardContent className="flex flex-row gap-4 p-6">
          <div className="w-[200px] h-full">
            <img
              src={course?.img}
              className="w-full h-full object-cover rounded-lg"
              alt="Course"
            />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {course?.title}
            </h1>
            <div className="flex flex-row gap-3">
              <Badge variant="outline">{course?.category}</Badge>
              <Badge
                variant="destructive"
                className={`${getLevelColor(course?.difficulty)}`}
              >
                {course?.difficulty}
              </Badge>
            </div>
            <div className="text-gray-500 text-sm">
              {course?.description.slice(0, 100)}...
            </div>
          </div>
        </CardContent>
      </Card>

      <EditTitle
        title="Course Modules"
        setIsCreate={setIsCreate}
        description="Organize your lessons into modules"
        buttonTitle="Add Module"
        size="text-xl"
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size={40} color="gray" />
        </div>
      ) : (
        <div>
          <div className=" w-full">
            <div className="mb-12 w-full flex justify-center items-center">
              {(editModule || isCreate) && (
                <EditModule
                  module={editModule}
                  setModules={setModules}
                  setNoModules={setNoModules}
                  close={() => {
                    setEditModule(null);
                    setIsCreate(false);
                  }}
                  isCreate={isCreate}
                />
              )}
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (!over || active.id === over.id) return;
                const oldIndex = modules.findIndex((m) => m.id === active.id);
                const newIndex = modules.findIndex((m) => m.id === over.id);
                const newModules = arrayMove(modules, oldIndex, newIndex).map(
                  (m, i) => ({ ...m, order_index: i + 1 })
                );
                setModules(newModules);
              }}
            >
              <SortableContext
                items={modules.map((m) => m.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {modules.map((module) => (
                    <DraggableAdminCard
                      key={module.id}
                      module={module}
                      course_id={course.id}
                      setEditModel={setEditModule}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {modules.length > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                Drag and drop to reorder modules
              </div>
            )}
            {!noModules && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveOrder}>
                  {isSaving ? (
                    <LoadingSpinner size={20} color="white" />
                  ) : (
                    "Save Order"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {noModules && !isCreate && !editModule && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No modules yet
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first module
          </p>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default ModuleManagement;

// ------------------------
// EditModule Component
// ------------------------

const EditModule = ({
  module,
  setModules,
  close,
  isCreate,
  setNoModules,
}: {
  module?: Module | null;
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  setNoModules: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
  
  isCreate: boolean;
}) => {
  const [newModule, setNewModule] = useState({
    id: module?.id || "",
    title: module?.title || "",
    order_index: module?.order_index || 0,
    lessoncount: module?.lessoncount || 0,
    totalduration: module?.totalduration || 0,
  });
  const { createModule , updateModule } = useModuleApi();
  const { courseId } = useParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({
      ...prev,
      [name]: name === "order_index" ? parseInt(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!newModule.title) {
      toast.error("Module title is required");
      return;
    }
    if (!courseId) return;
    if(isCreate){
      const response = await createModule(courseId, newModule.title.trim());
      if (response) {
        const NewModule = {
          id: response.id,
          title: response.title,
          order_index: response.order_index,
          lessoncount: 0,
          totalduration: 0,
        };
        setModules((prev) => 
          {
            const updatedModules = [...prev, NewModule];
            return updatedModules.sort((a, b) => a.order_index - b.order_index);
          });
        setNoModules(false);
        toast.success("Module created successfully");
        close();
      }
    }
    else {
      const response = await updateModule(newModule.id, newModule.title.trim());
      if (response) {
        setModules((prev) =>
          prev.map((m) => (m.id === response.id ? response : m))
        );
        toast.success("Module updated successfully");
        close();
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          <span>{isCreate ? "Create Module" : "Edit Module"}</span>
          <div>
            <X
              onClick={close}
              className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-900"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="text"
            name="title"
            value={newModule.title}
            onChange={handleChange}
            placeholder="Module Title"
            className="w-full"
          />
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
