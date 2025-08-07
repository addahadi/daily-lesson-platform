import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/Toast";
import type { QuizzProps } from "@/lib/type";
import useLessonApiController from "@/students/Api/lesson.Api";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const LessonQuizz = ({ quizz }: { quizz: QuizzProps }) => {
  const { lessonId, moduleId } = useParams();
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const { SubmitQuizzAnswer } = useLessonApiController();
  const [loading ,setLoading] = useState(false)
  useEffect(() => {
    if (
      quizz &&
      quizz?.selected_option_index !== null &&
      quizz?.selected_option_index !== undefined
    ) {
      setSelectedAnswer(quizz.selected_option_index);
      setIsSubmitted(true);
      setIsCorrect(quizz.is_correct as boolean);
    }
  }, [quizz]);

  async function handleClick() {
    try {
      if (
        !lessonId ||
        !moduleId ||
        !quizz.quizz_id ||
        selectedAnswer === null ||
        selectedAnswer === undefined
      ) return;
      const isAnswerCorrect = selectedAnswer === quizz.correct_option_index;
      setLoading(true)
      const message = await SubmitQuizzAnswer(
        quizz.quizz_id,
        lessonId,
        selectedAnswer,
        isAnswerCorrect,
        moduleId
      );
      if(message){
        if (isAnswerCorrect) {
          toast.success(message)
        }
        setIsCorrect(isAnswerCorrect);
        setIsSubmitted(true);
      }
      setLoading(false)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-sm p-5 sm:p-6 border border-purple-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Challenge
        </h2>
      </div>

      <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-4">
        {quizz?.question}
      </h3>

      <div className="flex flex-col gap-4">
        {quizz?.options?.map((option, index) => (
          <label
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer
              ${
                selectedAnswer === index
                  ? "border-purple-600 bg-purple-50 dark:bg-purple-900"
                  : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
              }
            `}
          >
            <input
              type="radio"
              name="quiz"
              value={index}
              checked={selectedAnswer === index}
              onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
              className="accent-purple-600"
            />
            <span className="text-gray-800 dark:text-gray-200">{option}</span>
          </label>
        ))}
      </div>

      <div className="w-full mt-6">
        {!isSubmitted ? (
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600 w-full sm:w-auto"
            disabled={loading}
            onClick={handleClick}
          >
            Submit
          </Button>
        ) : (
          <div
            className={`p-4 rounded-lg mt-4 border ${
              isCorrect
                ? "bg-green-50 border-green-300 dark:bg-green-900 dark:border-green-600"
                : "bg-red-50 border-red-300 dark:bg-red-900 dark:border-red-600"
            }`}
          >
            <p
              className={`font-medium ${
                isCorrect
                  ? "text-green-800 dark:text-green-300"
                  : "text-red-800 dark:text-red-400"
              }`}
            >
              {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              The correct answer is:{" "}
              <span className="font-medium">
                {quizz?.options[quizz?.correct_option_index]}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonQuizz;
