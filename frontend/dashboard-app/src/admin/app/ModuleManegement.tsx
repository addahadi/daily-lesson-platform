import React, { useEffect, useState } from "react";
import EditTitle from "../components/ui/EditTitle";
import { useLocation, useParams } from "react-router-dom";
import { BookOpen, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Shared/components/ui/card";
import { Badge } from "@/Shared/components/ui/badge";
import { getLevelColor } from "@/Shared/lib/utils";
import type { Module } from "@/Shared/lib/adminType";
import { Button } from "@/Shared/components/ui/button";
import useModuleApi from "../api/module.api";
import LoadingSpinner from "@/Shared/components/ui/loading";

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
import { Input } from "@/Shared/components/ui/input";
import { toast } from "sonner";
import { Toaster } from "@/Shared/components/ui/sonner";
import AdminModuleCard from "../components/AdminModuleCard";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  slug: string;
  img_url: string;
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
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Card className="mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="flex flex-col md:flex-row gap-6 p-6 bg-white dark:bg-gray-800">
          <div className="w-full md:w-[200px] h-[120px] md:h-[140px]">
            <img
              src={course?.img_url}
              className="w-full h-full object-cover rounded-lg shadow-sm"
              alt="Course"
            />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              {course?.title}
            </h1>
            <div className="flex flex-row gap-3 flex-wrap">
              <Badge
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700"
              >
                {course?.category}
              </Badge>
              <Badge
                variant="outline"
                className={`${getLevelColor(course?.level)} border-current`}
              >
                {course?.level}
              </Badge>
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {course?.description.slice(0, 150)}...
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
          <div className="text-center">
            <LoadingSpinner size={40} color="gray" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              Loading modules...
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full">
            {(editModule || isCreate) && (
              <div className="mb-8 w-full flex justify-center items-center">
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
              </div>
            )}

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
                    <DraggableAdminCard key={module.id} Id={module.id}>
                      <AdminModuleCard
                        module={module}
                        course_id={course.id}
                        setEditModel={setEditModule}
                        setModules={setModules}
                      />
                    </DraggableAdminCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {modules.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  Drag and drop to reorder modules
                </div>
                {!noModules && (
                  <Button
                    onClick={handleSaveOrder}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                  >
                    {isSaving ? <LoadingSpinner size={20} /> : "Save Order"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {noModules && !isCreate && !editModule && (
        <div className="text-center py-16">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No modules yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Get started by creating your first module to organize your course
            content
          </p>
          <Button
            onClick={() => setIsCreate(true)}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
          >
            Create First Module
          </Button>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default ModuleManagement;

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
  const [isLoading, setIsLoading] = useState(false);
  const { createModule, updateModule } = useModuleApi();
  const { courseId } = useParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewModule((prev) => ({
      ...prev,
      [name]: name === "order_index" ? parseInt(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!newModule.title.trim()) {
      toast.error("Module title is required");
      return;
    }
    if (!courseId) return;

    setIsLoading(true);

    if (isCreate) {
      const response = await createModule(courseId, newModule.title.trim());
      if (response) {
        const NewModule = {
          id: response.id,
          title: response.title,
          order_index: response.order_index,
          lessoncount: 0,
          totalduration: 0,
        };
        setModules((prev) => {
          const updatedModules = [...prev, NewModule];
          return updatedModules.sort((a, b) => a.order_index - b.order_index);
        });
        setNoModules(false);
        toast.success("Module created successfully");
        close();
      }
    } else {
      const response = await updateModule(newModule.id, newModule.title.trim());
      if (response) {
        setModules((prev) =>
          prev.map((m) => (m.id === response.id ? response : m))
        );
        toast.success("Module updated successfully");
        close();
      }
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {isCreate ? "Create Module" : "Edit Module"}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={close}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Module Title *
            </label>
            <Input
              type="text"
              name="title"
              value={newModule.title}
              onChange={handleChange}
              placeholder="Enter module title"
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={close}
              disabled={isLoading}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !newModule.title.trim()}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isLoading ? (
                <LoadingSpinner size={20} />
              ) : (
                <span>{isCreate ? "Create Module" : "Save Changes"}</span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
