import { lessonApiController } from "@/students/Api/lesson.Api";
import { Button } from "@/students/components/ui/button";
import { Toast } from "@/students/components/ui/Toast";
import type { ToastProps } from "@/students/lib/type";
import type QuizzProps from "@/students/lib/type";
import { useUser } from "@clerk/clerk-react";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LessonQuizz = ({ quizz }: { quizz: QuizzProps }) => {
  const { user } = useUser();
  const { lessonId, moduleId } = useParams();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastProps>();
  useEffect(() => {
    if (quizz) {
      setSelectedAnswer(quizz.selected_option_index);
      const isAlreadySubmitted =
        quizz.selected_option_index !== null &&
        quizz.selected_option_index !== undefined;
      setIsSubmitted(isAlreadySubmitted);
      setIsCorrect(quizz.is_correct);
    }
  }, [quizz]);

  async function handleClick() {
    try {
      if (
        !lessonId ||
        !user?.id ||
        !moduleId ||
        !quizz.quizz_id ||
        selectedAnswer === null ||
        selectedAnswer === undefined
      )
        return;
      console.log(
        selectedAnswer == quizz.correct_option_index,
        selectedAnswer,
        quizz.correct_option_index
      );
      const xp = "50";
      const source = "quizz_complete";
      await lessonApiController().SubmitQuizzAnswer(
        quizz.quizz_id,
        user?.id,
        lessonId,
        selectedAnswer,
        selectedAnswer == quizz.correct_option_index,
        moduleId
      );
      if (selectedAnswer == quizz.correct_option_index) {
        setIsCorrect(true);
        setToast({
          type: "success",
          message: "you earned 50xp",
        });
        setIsSubmitted(true);
      } else {
        setIsCorrect(false);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-sm p-6 border border-purple-200">
      <div className="flex items-center space-x-2 mb-4">
        <Trophy className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-semibold text-gray-800">Challenge</h2>
      </div>
      <h3 className="text-lg font-medium text-purple-800 mb-3">
        {quizz?.question}
      </h3>
      <div className="flex flex-col gap-5">
        {quizz?.options?.map((option, index) => {
          return (
            <label
              key={index}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="quiz"
                value={index}
                checked={selectedAnswer == index}
                onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
                className="text-purple-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          );
        })}
      </div>
      <div className=" m-auto w-full">
        {!isSubmitted ? (
          <Button
            className=" bg-purple-600 text-white-1  m-auto mt-5"
            onClick={handleClick}
          >
            Submit
          </Button>
        ) : (
          <div
            className={`p-4 rounded-lg mt-5 ${
              !isCorrect
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <p
              className={`font-medium ${
                isCorrect ? "text-green-800" : "text-red-800"
              }`}
            >
              {isCorrect ? "Correct!" : "Incorrect"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              The correct answer is:{" "}
              {quizz?.options[quizz?.correct_option_index]}
            </p>
          </div>
        )}
      </div>
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

export default LessonQuizz;
