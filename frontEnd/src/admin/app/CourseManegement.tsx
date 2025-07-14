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
import { useFetcher } from "react-router-dom";
import uploadImageToCloudinary from "../api/Cloudinary";
import { Toaster  } from "@/components/ui/sonner";
import { toast } from "sonner";

const CourseManegement = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading , setLoading] = useState(false);
    const [editedCourse , setEditedCourse] = useState<Course | null>(null)
    const [isCreate , setIsCreate] = useState(false)

    const {getCourses} = useCourseApi()


    useEffect(() => {
      const fetchCourses = async () => {
        setLoading(true)
        const data = await getCourses();
        console.log(data)
        if (data) {
          setCourses(data);
        } else {
          setCourses([]);
        }
        setLoading(false)
      };
      fetchCourses()
    }, []);



  return (
    <div className="min-h-screen  bg-white  p-6">
      <div className=" w-full flex justify-between">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-text-primary mb-2">
            Course Management
          </h1>
          <p className="text-text-secondary">
            Manage your courses, modules, and lessons
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setIsCreate(true)}
          className="  text-white bg-gray-900  hover:bg-gray-700"
        >
          <Plus className=" w-5 h-5  text-white" />
          <span>new course</span>
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <LoadingSpinner size={60} />
        </div>
      ) : courses.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-text-secondary text-lg">No courses found</p>
        </div>
      ) : (
        <div className=" mt-8">
          {(editedCourse || isCreate) && (
            <div className=" w-full justify-center items-center">
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
          <section className=" mt-14 w-full grid grid-cols-2 gap-3">
            {Array.isArray(courses) &&
              courses?.map((course) => {
                return (
                  <AdminCourseCard
                    course={course}
                    setEditedCourse={setEditedCourse}
                  />
                );
              })}
          </section>
        </div>
      )}
    </div>
  );
}




function EditCourse({ editedCourse = {}, close , isCreate }: any) {
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
    setCourseInfo({
      ...courseInfo,
      content : [...courseInfo.content , ""]
    })
  };

  const removeContentReason = (index: number) => {
    setCourseInfo({
      ...courseInfo,
      content : courseInfo.content.filter((_ : string ,i: number) => i !== index)
    })
  };


  const handleImgChange = async (file: File | undefined) => {
    if(!file) return 
    const ImgUrl = await uploadImageToCloudinary(file);
    if(ImgUrl){
      setCourseInfo({
        ...courseInfo,
        img_url: ImgUrl,
      });
    }
  }

  const handleSubmit = () => {
    const updateCourse = async () => {
      if (isCreate) {
        console.log(courseInfo)
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
          console.error("Please fill all required fields");
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
        console.log("Course updated successfully:", response);
        close();
      } else {
        console.error("Failed to update course");
      }
    };
    updateCourse();
  };


  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {isCreate ? "Create New Course" : "Edit Course"}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={close}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Course Title</Label>
              <Input
                id="title"
                placeholder="Enter course title"
                required
                value={courseInfo.title}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                id="category"
                placeholder="e.g., Frontend Development"
                value={courseInfo.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <textarea
              id="description"
              value={courseInfo.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2"
              placeholder="Describe what students will learn"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Difficulty Level</Label>
              <select
                value={courseInfo.level}
                onChange={(e) => handleChange("difficulty", e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="beginner">beginner</option>
                <option value="intermediate">intermediate</option>
                <option value="hard">hard</option>
              </select>
            </div>
            <div>
              <Label>URL Slug</Label>
              <Input
                value={courseInfo.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                id="slug"
                placeholder="course-url-slug (auto-generated)"
              />
            </div>
          </div>

          <div className="mt-6">
            <Label>Course Image URL</Label>
            <Input
              id="img"
              placeholder="https://example.com/image.jpg"
              type="file"
              onChange={(e) => {
                handleImgChange(e.target.files?.[0]);
              }}
            />
          </div>

          <div className="mt-6 space-y-2">
            <Label>Why Enroll in this Course?</Label>
            {courseInfo.content.map((reason: string, index: number) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={reason}
                  onChange={(e) =>
                    handleChange("content", e.target.value, index)
                  }
                  placeholder={`Reason #${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeContentReason(index)}
                  className="text-red-500"
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addContentReason}
              className="mt-2"
            >
              + Add Reason
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="text-white bg-gray-900"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <LoadingSpinner size={20} />
              ) : (
                <span>

                  {isCreate ? "Create Course" : "Update Course"}</span>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      <Toaster />
    </Card>
  );
}


export default CourseManegement