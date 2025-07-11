import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Lesson } from "@/lib/adminType";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import EditTitle from "../components/EditTitle";
import AdminLessonCard from "../components/AdminLessonCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

const LessonManagement = () => {
  const [isCreate, setIsCreate] = useState(false);
  const { CourseId, ModuleId } = useParams();
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: "1",
      title: "What is React?",
      content: "Introduction to React library and its core concepts",
      duration: 15,
      level: "beginner",
      slug: "what-is-react",
      order_index: 1,
      hasQuiz: true,
    },
    {
      id: "2",
      title: "Setting up Development Environment",
      content: "Learn how to set up React development environment",
      duration: 25,
      level: "beginner",
      slug: "setting-up-development-environment",
      order_index: 2,
      hasQuiz: false,
    },
    {
      id: "3",
      title: "Your First React Component",
      content: "Create your first React component and understand JSX",
      duration: 30,
      level: "intermediate",
      slug: "your-first-react-component",
      order_index: 3,
      hasQuiz: true,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <Link
          to={`/admin/courses/1`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Link>
      </div>
      <Card className=" mb-14">
        <CardContent className=" flex flex-row gap-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                javascript
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{lessons.length} lessons</span>
                <span>2024 total duration</span>
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
      <div className="mb-12 w-full flex justify-center items-center ">
        {(editLesson || isCreate) && (
          <EditLesson
            lesson={editLesson}
            close={() => {
              setEditLesson(null);
              setIsCreate(false);
            }}
          />
        )}
      </div>
      <div className="space-y-4">
        {lessons.map((lesson) => {
          return (
            <AdminLessonCard
              module_id={ModuleId}
              lesson={lesson}
              course_id={CourseId}
              setEditLesson={setEditLesson}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LessonManagement;

type EditLessonProps = {
  lesson: Lesson | null;
  close: () => void;
};

const EditLesson = ({ lesson, close }: EditLessonProps) => {
  const [formData, setFormData] = useState({
    title: lesson?.title || "",
    content: lesson?.content || "",
    duration: lesson?.duration || 15,
    level: lesson?.level || "easy",
    slug: lesson?.slug || "",
    order_index: lesson?.order_index || 1,
    hasQuiz: lesson?.hasQuiz || false,
  });
  function handleChange(key: string, value: string | number) {}
  function handleSubmit(e: React.FormEvent) {}
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
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Brief description of what this lesson covers"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) =>
                  handleChange("duration", parseInt(e.target.value))
                }
                placeholder="15"
                required
              />
            </div>
            <div>
              <Label>Difficulty Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => handleChange("level", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">beginner</SelectItem>
                  <SelectItem value="intermediate">intermediate</SelectItem>
                 
                  <SelectItem value="hard">hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Order Index</Label>
              <Input
                id="order_index"
                type="number"
                min="1"
                value={formData.order_index}
                onChange={(e) =>
                  handleChange("order_index", parseInt(e.target.value))
                }
                placeholder="1"
                required
              />
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
              {lesson ? "Update Lesson" : "Create Lesson"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
