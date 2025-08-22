import LoadingSpinner from "@/components/ui/loading";
import { renderMarkdown } from "@/lib/utils";
import useLessonApiController from "@/students/Api/lesson.Api";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast} from "sonner";

const LessonSummary = ({
  text,
  heading,
  enrollementId,
  completed,
  setCompleted,
  setCourseCompleted,
}: {
  text: string;
  heading: string;
  enrollementId: string | undefined;
  completed: boolean | null;
  setCourseCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  setCompleted : React.Dispatch<React.SetStateAction<boolean | null>>;
}) => {
  const { moduleId, lessonId } = useParams();
  const { markAsComplete } = useLessonApiController();
  const [loading , setLoading] = useState(false)
  async function handleComplete() {
    if (!enrollementId || !moduleId || !lessonId) return;
    setLoading(true)
    const result =  await markAsComplete(enrollementId, moduleId, lessonId)
    if(result){
      toast.success(result.message)
      if(result.data){
        setCourseCompleted(result.data?.CourseCompletedAler)
        setCompleted(true)
      }  
    }
    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 mt-7 mb-7 w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {heading}
      </h2>
      <div
        className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
        dangerouslySetInnerHTML={{
          __html: text
            ? renderMarkdown(text)
            : '<p class="text-gray-500 italic">No content yet...</p>',
        }}
      />
        

      {!completed ? (
        <button
          disabled={loading}
          onClick={handleComplete}
          className="w-full px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors font-medium "
        >
          {loading ? (
            <LoadingSpinner size={20} color="gray-100" />
          ) : (
            <span>Mark as Completed</span>
          )}
        </button>
      ) : (
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Lesson Completed!</span>
        </div>
      )}
    </div>
  );
};

export default LessonSummary;
