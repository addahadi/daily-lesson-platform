import { Card, CardContent } from "@/components/ui/card";
import BackTo from "../components/ui/BackTo";
import { useLocation, useParams } from "react-router-dom";
import {  Clock, Eye, Save } from "lucide-react";
import {Badge} from "@/components/ui/badge"
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

    const contentPayload = { sections };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 w-full">
      <BackTo
        title="back to module"
        URL={`course/${courseId}/module/${moduleId}`}
      />
      <Card className="mb-14 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="flex flex-row justify-between items-center p-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {lesson ? lesson.title : "Lesson Title"}
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <Badge
                className={`${getLevelColor(
                  lesson?.level
                )} text-white dark:text-gray-100`}
              >
                {lesson?.level}
              </Badge>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(lesson?.duration_minutes)}</span>
              </div>
              <Badge className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                /{lesson?.slug}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={!change}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
            >
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
          <TabsList className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-lg">
            <TabsTrigger
              value="lesson"
              className="w-full data-[state=active]:bg-white data-[state=active]:dark:bg-gray-700 data-[state=active]:text-gray-900 data-[state=active]:dark:text-gray-100 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Lesson
            </TabsTrigger>
            <TabsTrigger
              value="quizz"
              className="w-full data-[state=active]:bg-white data-[state=active]:dark:bg-gray-700 data-[state=active]:text-gray-900 data-[state=active]:dark:text-gray-100 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Quizz
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="lesson"
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-4"
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Lesson Content
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
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
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-4"
          >
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Lesson Quiz
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
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
              setChange={setChange}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  );
};

export default LessonContent;
