import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import AdminCourseCard from "../components/AdminCourseCard";
import type { Course } from "@/lib/adminType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCourseApi from "../api/course.api";
import LoadingSpinner from "@/components/ui/loading";
import uploadImageToCloudinary from "../api/Cloudinary";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const CourseManegement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [editedCourse, setEditedCourse] = useState<Course | null>(null);
  const [isCreate, setIsCreate] = useState(false);

  const { getCourses } = useCourseApi();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const data = await getCourses();
      setCourses(data || []);
      setLoading(false);
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
      <div className="w-full flex justify-between items-start">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Course Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your courses, modules, and lessons
          </p>
        </div>
        <Button
          onClick={() => setIsCreate(true)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>New Course</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <LoadingSpinner size={60} />
        </div>
      ) : courses.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
              No courses found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              Create your first course to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          {(editedCourse || isCreate) && (
            <div className="w-full flex justify-center items-center mb-8">
              <EditCourse
                editedCourse={editedCourse}
                close={() => {
                  setEditedCourse(null);
                  setIsCreate(false);
                }}
                isCreate={isCreate}
              />
            </div>
          )}
          <section className="grid grid-cols-2  gap-6">
            {Array.isArray(courses) &&
              courses.map((course) => (
                <AdminCourseCard
                  key={course.id}
                  course={course}
                  setEditedCourse={setEditedCourse}
                />
              ))}
          </section>
        </div>
      )}
    </div>
  );
};

function EditCourse({ editedCourse = {}, close, isCreate }: any) {
  const { UpdateCourse } = useCourseApi();
  const [isLoading, setIsLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState({
    id: editedCourse?.id || "",
    title: editedCourse?.title || "",
    description: editedCourse?.description || "",
    category: editedCourse?.category || "",
    level: editedCourse?.level || "",
    slug: editedCourse?.slug || "",
    img_url: editedCourse?.img_url || "",
    modulecount: editedCourse?.modulecount || "",
    lessoncount: editedCourse?.lessoncount || "",
    totalduration: editedCourse?.totalduration || "",
    content: editedCourse?.content || [""],
  });

  const handleChange = (type: string, value: string, index?: number) => {
    if (type === "content" && typeof index === "number") {
      const updatedContent = [...courseInfo.content];
      updatedContent[index] = value;
      setCourseInfo({ ...courseInfo, content: updatedContent });
    } else {
      setCourseInfo({ ...courseInfo, [type]: value });
    }
  };

  const addContentReason = () => {
    setCourseInfo({ ...courseInfo, content: [...courseInfo.content, ""] });
  };

  const removeContentReason = (index: number) => {
    setCourseInfo({
      ...courseInfo,
      content: courseInfo.content.filter((_, i: number) => i !== index),
    });
  };

  const handleImgChange = async (file: File | undefined) => {
    if (!file) return;
    const ImgUrl = await uploadImageToCloudinary(file);
    if (ImgUrl) {
      setCourseInfo({ ...courseInfo, img_url: ImgUrl });
    }
  };

  const handleSubmit = () => {
    const updateCourse = async () => {
      if (isCreate) {
        if (
          !courseInfo.title ||
          !courseInfo.description ||
          !courseInfo.category ||
          !courseInfo.level ||
          !courseInfo.slug ||
          !courseInfo.img_url ||
          courseInfo.content.length === 0
        ) {
          toast("Please fill all required fields", {
            description: "All fields are required to create the course.",
            duration: 1000,
          });
          return;
        }
      }

      const requestBody = {
        title: courseInfo.title,
        description: courseInfo.description,
        category: courseInfo.category,
        difficulty: courseInfo.level,
        slug: courseInfo.slug,
        img_url: courseInfo.img_url,
        content: courseInfo.content,
      };

      setIsLoading(true);
      const response = await UpdateCourse(requestBody);
      setIsLoading(false);

      if (response) {
        close();
      }
    };
    updateCourse();
  };

  return (
    <div className="   w-[800px]">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
          <CardTitle className="text-xl font-semibold">
            {isCreate ? "Create New Course" : "Edit Course"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Course Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter course title"
                  required
                  value={courseInfo.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Category *
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Frontend Development"
                  value={courseInfo.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Description *
              </Label>
              <textarea
                id="description"
                value={courseInfo.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="Describe what students will learn"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Difficulty Level *
                </Label>
                <select
                  value={courseInfo.level}
                  onChange={(e) => handleChange("level", e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="">Select difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="hard">Advanced</option>
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  URL Slug *
                </Label>
                <Input
                  value={courseInfo.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                  id="slug"
                  placeholder="course-url-slug"
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Course Image *
              </Label>
              <Input
                id="img"
                placeholder="Upload course image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImgChange(e.target.files?.[0])}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-700 dark:file:text-blue-300"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Why Enroll in this Course?
              </Label>
              {courseInfo.content.map((reason: string, index: number) => (
                <div key={index} className="flex gap-2 items-center">
                  <Input
                    value={reason}
                    onChange={(e) =>
                      handleChange("content", e.target.value, index)
                    }
                    placeholder={`Reason #${index + 1}`}
                    className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeContentReason(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addContentReason}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                + Add Reason
              </Button>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={close}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                {isLoading ? (
                  <LoadingSpinner size={20} />
                ) : (
                  <span>{isCreate ? "Create Course" : "Update Course"}</span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}

export default CourseManegement;
