import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Lesson, Module } from "@/lib/adminType";
import { ArrowLeft, Clock, FileText, X } from "lucide-react";
import React, { useEffect, useState, type SetStateAction } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import EditTitle from "../components/ui/EditTitle";
import AdminLessonCard from "../components/lesson/AdminLessonCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDuration } from "@/lib/utils";
import useLessonApi from "../api/lesson.api";
import LoadingSpinner from "@/components/ui/loading";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableAdminCard from "../components/DraggbleAdminCard";
import BackTo from "../components/ui/BackTo";

const LessonManagement = () => {
  const [isCreate, setIsCreate] = useState(false);
  const { courseId, moduleId } = useParams();
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const module = useLocation().state?.State as Module;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [noLessons, setNoLessons] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { getAllLessons, updateOrderIndex } = useLessonApi();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  async function handleSaveOrder() {
    const requestBody = lessons.map((l, index) => {
      return {
        id: l.id,
        order_index: index,
      };
    });
    try {
      if (!requestBody || !moduleId) return;
      setIsSaving(true);
      await updateOrderIndex(moduleId, requestBody);
      toast.success("lesson order updated successfully");
    } catch (err) {
      toast.error("field to save");
    } finally {
      setIsSaving(false);
    }
  }
  useEffect(() => {
    const fetchLessons = async () => {
      if (moduleId) {
        setLoading(true);
        const data = await getAllLessons(moduleId);
        if (data) {
          setLessons(data);
        } else {
          setNoLessons(true);
        }
        setLoading(false);
      }
    };
    fetchLessons();
  }, [moduleId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <BackTo title="back to course" URL={`/admin/course/${courseId}`} />
      <Card className=" mb-14">
        <CardContent className=" flex flex-row gap-2 p-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {module ? module.title : "Module Title"}
            </h2>
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
          </div>
        </CardContent>
      </Card>
      <EditTitle
        title="Course Lessons"
        setIsCreate={setIsCreate}
        description="Manage individual lessons and their content"
        buttonTitle="Add Lesson"
        size="text-xl"
      />
      {loading && (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size={40} />
        </div>
      )}

      <div className="mb-12 w-full flex justify-center items-center ">
        {(editLesson || isCreate) && (
          <EditLesson
            lesson={editLesson}
            moduleId={moduleId}
            setLessons={setLessons}
            close={() => {
              setEditLesson(null);
              setIsCreate(false);
            }}
          />
        )}
      </div>

      {noLessons ? (
        <div className="text-center text-gray-500">
          No lessons found for this module.
        </div>
      ) : (
        <div className="space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) return;

              const oldIndex = lessons.findIndex((l) => l.id === active.id);
              const newIndex = lessons.findIndex((l) => l.id === over.id);

              if (oldIndex === -1 || newIndex === -1) return;

              const newLessons = arrayMove(lessons, oldIndex, newIndex).map(
                (m, i) => ({ ...m, order_index: i + 1 })
              );
              setLessons(newLessons);
            }}
          >
            <SortableContext
              items={lessons.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <DraggableAdminCard key={lesson.id} Id={lesson.id}>
                    <AdminLessonCard
                      lesson={lesson}
                      module_id={moduleId}
                      course_id={courseId}
                      setEditLesson={setEditLesson}
                    />
                  </DraggableAdminCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {lessons.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Drag and drop to reorder modules
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveOrder}>
              {isSaving ? (
                <LoadingSpinner size={20} color="white" />
              ) : (
                "Save Order"
              )}
            </Button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default LessonManagement;

type EditLessonProps = {
  lesson: Lesson | null;
  moduleId: string | undefined;
  setLessons: React.Dispatch<SetStateAction<Lesson[]>>;
  close: () => void;
};

const EditLesson = ({
  lesson,
  close,
  moduleId,
  setLessons,
}: EditLessonProps) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || "",
    content: lesson?.content || null,
    duration_minutes: lesson?.duration_minutes || 0,
    level: lesson?.level || "easy",
    slug: lesson?.slug || "",
    description: lesson?.description || "",
  });
  const { createUpdateLesson } = useLessonApi();
  const [loading, setLoading] = useState(false);
  function handleChange(key: string, value: string | number) {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!moduleId) return;
    setLoading(true);
    const result = await createUpdateLesson(moduleId, formData);
    if (result) {
      setLessons(
        (prev) =>
          prev &&
          prev.map((l) => {
            if (l.id === result.id) {
              return result;
            }
            return l;
          })
      );
      setLoading(false);
      toast.success("successful inserting");
    } else {
      setLoading(false);
      toast.success("unsuccessful inserting");
    }
  }
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{lesson ? "Edit Lesson" : "Create New Lesson"}</CardTitle>
        <Button variant="ghost" size="icon" onClick={close}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Lesson Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter lesson title"
              required
            />
          </div>

          <div>
            <Label>Content Description</Label>
            <textarea
              id="content"
              className="w-full p-2 border rounded-md "
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description of what this lesson covers"
              rows={3}
              required
            />
          </div>

          <div className=" flex flex-row gap-4">
            <div className=" w-full">
              <Label>Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration_minutes}
                onChange={(e) =>
                  handleChange("duration_minutes", parseInt(e.target.value))
                }
                placeholder="15"
                required
              />
            </div>
            <div className=" w-full">
              <Label>Difficulty Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleChange("level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className=" w-full border  border-gray-200">
                  <SelectItem value="beginner">beginner</SelectItem>
                  <SelectItem value="intermediate">intermediate</SelectItem>

                  <SelectItem value="hard">hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              placeholder="lesson-url-slug (auto-generated)"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit">
              {loading ? (
                <LoadingSpinner size={20} />
              ) : lesson ? (
                <span>Update Lesson</span>
              ) : (
                <span>Create Lesson</span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
