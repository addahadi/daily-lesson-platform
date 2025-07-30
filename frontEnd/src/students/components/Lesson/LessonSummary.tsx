import useLessonApiController from "@/students/Api/lesson.Api";
import { Toast } from "@/components/ui/Toast";
import type { ToastProps } from "@/lib/type";
import { useUser } from "@clerk/clerk-react";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const LessonSummary = ({
  text,
  heading,
  enrollementId,
  completed,
  setCompleted,
}: {
  text: string;
  heading: string;
  enrollementId: string | undefined;
  completed: boolean | undefined;
  setCompleted: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}) => {
  const { moduleId, lessonId } = useParams();
  const { user } = useUser();
  const [toast, setToast] = useState<ToastProps>();
  const { markAsComplete } = useLessonApiController();

  async function handleComplete() {
    if (!enrollementId || !moduleId || !lessonId || !user?.id) return;

    await markAsComplete(enrollementId, moduleId, lessonId, user.id)
      .then(() => {
        setCompleted(true);
        setToast({
          type: "success",
          message: "You earned 50 XP",
        });
      })
      .catch(() => {
        setCompleted(false);
      });
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 mt-7 mb-7 w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {heading}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
        {text}
      </p>

      {!completed ? (
        <button
          onClick={handleComplete}
          className="w-full px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors font-medium cursor-pointer focus:outline-none"
        >
          Mark as Completed
        </button>
      ) : (
        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Lesson Completed!</span>
        </div>
      )}

      {toast && (
        <Toast
          type={toast?.type ?? "success"}
          message={toast?.message ?? ""}
          onClose={() => setToast(undefined)}
        />
      )}
    </div>
  );
};

export default LessonSummary;
