import { Card, CardContent } from "@/components/ui/card";
import BackTo from "../components/ui/BackTo";
import { useLocation, useParams } from "react-router-dom";
import { Badge, Clock, Eye, Save } from "lucide-react";
import { formatDuration, getLevelColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentBlockEditor from "../components/lesson/ContentBlockEditor";
import { useEffect, useState } from "react";
import type { section } from "@/lib/adminType";
import useLessonApi from "../api/lesson.api";
import { toast, Toaster } from "sonner";
import LoadingSpinner from "@/components/ui/loading";
import QuizzEditor from "../components/lesson/QuizzEditor";
import type { QuizzProps } from "@/lib/type";

const LessonContent = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const lesson = useLocation().state?.State;
  const [sections, setSections] = useState<section[]>();
  const [change, setChange] = useState(false);
  const { updateLessonContent, updateAddLessonQuizz } = useLessonApi();
  const [loading, setLoading] = useState(false);
  const [quizz, setQuizz] = useState<QuizzProps | null>(null);

  useEffect(() => {
    if (!lesson) return;
    setSections(lesson.content.sections);
    
  }, [lesson]);

  async function handleSave() {
    if (!lessonId || !sections) return;
    setLoading(true);

    if (quizz) {
      const { question, options, correct_option_index } = quizz;
      const isValid =
        question &&
        options &&
        Array.isArray(options) &&
        options.filter((option) => option.trim() !== "").length > 0 &&
        correct_option_index !== undefined;

      if (!isValid) {
        toast.error("Please complete the quiz before saving.");
        setLoading(false);
        return;
      }

      const result = await updateAddLessonQuizz(lessonId, quizz);
      if (result) {
        setQuizz(result);
      } else {
        toast.error("Failed to update/insert quiz.");
      }
    }

    const contentPayload = {
      sections: sections,
    };

    const updated = await updateLessonContent(lessonId, contentPayload);
    setLoading(false);

    if (updated) {
      setSections(updated.content.sections);
      toast.success("The lesson content is saved.");
      setChange(false);
    } else {
      toast.error("Failed to save lesson content.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 w-full">
      <BackTo
        title="back to module"
        URL={`course/${courseId}/module/${moduleId}`}
      />
      <Card className="mb-14">
        <CardContent className="flex flex-row justify-between items-center p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold mb-2">
              {lesson ? lesson.title : "Lesson Title"}
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <Badge className={getLevelColor(lesson?.level)}>
                {lesson?.level}
              </Badge>
              <div className="flex items-center gap-1 text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(lesson?.duration_minutes)}</span>
              </div>
              <Badge className="text-xs">/{lesson?.slug}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={!change}>
              {loading ? (
                <LoadingSpinner size={20} />
              ) : (
                <div className="flex items-center gap-1">
                  <Save className="w-4 h-4" />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-full">
        <Tabs defaultValue="lesson" className="w-full">
          <TabsList>
            <TabsTrigger value="lesson" className="w-full">
              Lesson
            </TabsTrigger>
            <TabsTrigger value="quizz" className="w-full">
              Quizz
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="lesson"
            className="w-full bg-white rounded-lg border p-6 border-gray-200"
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Lesson Content
                </h1>
                <span className="text-sm text-gray-400 font-semibold">
                  Create different sections for your lesson content
                </span>
              </div>
            </div>
            {sections && (
              <ContentBlockEditor
                sections={sections}
                setSections={setSections}
                setChange={setChange}
              />
            )}
          </TabsContent>

          <TabsContent
            value="quizz"
            className="w-full bg-white rounded-lg border p-6 border-gray-200"
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Lesson Quiz
                </h1>
                <span className="text-sm text-gray-400 font-semibold">
                  Create a quiz to test student understanding of this lesson.
                </span>
              </div>
            </div>
            <QuizzEditor
              quizz={quizz}
              setQuizz={(q) => {
                setQuizz(q);
                setChange(true);
              }}
              setChange= {setChange}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  );
};

export default LessonContent;
