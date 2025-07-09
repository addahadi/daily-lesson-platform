import { lessonApiController } from "@/students/Api/lesson.Api";
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

  async function handleComplete() {
    if (!enrollementId || !moduleId || !lessonId || !user?.id) return;

    await lessonApiController()
      .markAsComplete(enrollementId, moduleId, lessonId, user.id)
      .then(() => {
        setCompleted(true);
        setToast({
          type: "success",
          message: "you earned 50xp",
        });
      })
      .catch(() => {
        setCompleted(false);
      });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-7 mb-7 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{heading}</h2>
      <p className="text-gray-700 leading-relaxed mb-6">{text}</p>
      {!completed ? (
        <button
          onClick={handleComplete}
          className="w-full px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Mark as Completed
        </button>
      ) : (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Lesson Completed!</span>
        </div>
      )}
      {toast && (
        <Toast
          type={toast ? toast.type : "success"}
          message={toast ? toast.message : ""}
          onClose={() => setToast(undefined)}
        />
      )}
    </div>
  );
};

export default LessonSummary;
