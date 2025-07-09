import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import AdminCourseCard from "../components/AdminCourseCard";
import type { Course } from "@/lib/adminType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Label } from "@/components/ui/label";


const CourseManegement = () => {
    const [courses, setCourses] = useState<Course[]>([
      {
        id: "1",
        title: "React Fundamentals",
        description:
          "Learn the basics of React development including components, state, and props.",
        category: "Frontend Development",
        difficulty: "beginner",
        slug: "react-fundamentals",
        img: "/placeholder.svg",
        moduleCount: 5,
        lessonCount: 25,
        totalDuration: 480,
      },
      {
        id: "2",
        title: "Advanced JavaScript",
        description:
          "Deep dive into advanced JavaScript concepts and modern ES6+ features.",
        category: "Programming",
        difficulty: "advanced",
        slug: "advanced-javascript",
        img: "/placeholder.svg",
        moduleCount: 8,
        lessonCount: 42,
        totalDuration: 720,
      },
    ]);
    
    
    const [editedCourse , setEditedCourse] = useState<Course | null>(null)
    const [isCreate , setIsCreate] = useState(false)

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
            <Plus  className=" w-5 h-5  text-white"/>
            <span>new course</span>
        </Button>
      </div>
        <div className=" mt-8">
          {
            (editedCourse || isCreate) &&
            <div  className=" w-full justify-center items-center">
              <EditCourse  editedCourse={editedCourse} close={() => {
                setEditedCourse(null)
                setIsCreate(false)
                }}/>
            </div>
          }
          <section className=" mt-14 w-full grid grid-cols-2 gap-3">
            {
                courses.map((course) => {
                    return <AdminCourseCard course={course}  setEditedCourse = {setEditedCourse} />
                })
            }
          </section>
        </div>
    </div>
  );
}


const EditCourse = ({
  editedCourse,
  close
} : {
  editedCourse: Course  | null 
  close : () => void 
}) => {



  const [courseInfo, setCourseInfo] = useState({
    id: editedCourse?.id || '',
    title: editedCourse?.title || '',
    description:
      editedCourse?.description || '',
    category: editedCourse?.category || '',
    difficulty:  editedCourse?.difficulty || '',
    slug:  editedCourse?.slug || '',
    img:  editedCourse?.img || '',
    moduleCount: editedCourse?.moduleCount || '',
    lessonCount: editedCourse?.lessonCount || '',
    totalDuration: editedCourse?.totalDuration || '',
  });



  const handleChange = (type : string ,event: string) => {

  };
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>edit course</CardTitle>
        <Button variant="ghost" size="icon" onClick={close}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
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
              className=" w-full rounded-lg border border-gray-200 p-2"
              placeholder="Describe what students will learn"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Difficulty Level</Label>
              <select
                value={courseInfo.difficulty}
                onChange={(e) => handleChange("difficulty", e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text-primary
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

          <div>
            <div className=" mt-6">
              <Label>Course Image URL</Label>
              <Input
                id="img"
                placeholder="https://example.com/image.jpg"
                type="file"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" className=" text-white bg-gray-900">Save Course</Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 



export default CourseManegement