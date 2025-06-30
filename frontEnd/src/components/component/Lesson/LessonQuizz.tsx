import { lessonApiController } from '@/Api/lesson.Api';
import { Button } from '@/components/ui/button'
import type QuizzProps from '@/lib/type'
import { useUser } from '@clerk/clerk-react';
import { Trophy } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const LessonQuizz = ({quizz} : {quizz : QuizzProps}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const {user} = useUser()
  const {lessonId , moduleId} = useParams()

  useEffect(() => {
    console.log(quizz)
    if (quizz?.selected_option_index) {
      setSelectedAnswer(quizz.selected_option_index);
    }
  }, [quizz]);
  
  async function handleClick(){
    try  {
      if(!selectedAnswer) return 
      if (!lessonId || !user?.id || !moduleId || !quizz.quizz_id) return;
      console.log(quizz.quizz_id)
      console.log(quizz.quizz_id , user.id , lessonId , selectedAnswer , moduleId)
      await lessonApiController().SubmitQuizzAnswer(quizz.quizz_id , user?.id, lessonId , selectedAnswer-1 , selectedAnswer-1 == quizz.correct_option_index , moduleId)
    } 
    catch(err){
      console.log(err)
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
                value={(index+1)}
                checked={selectedAnswer == index+1}
                onChange={(e) => setSelectedAnswer(parseInt(e.target.value))}
                className="text-purple-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          );
        })}
      </div>
      <div className=" m-auto w-full">
        {!quizz?.selected_option_index ? (
          <Button
            className=" bg-purple-600 text-white-1  m-auto mt-5"
            onClick={handleClick}
          >
            Submit
          </Button>
        ) : (
          <div
            className={`p-4 rounded-lg mt-5 ${
              !quizz?.is_correct
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <p
              className={`font-medium ${
                quizz?.is_correct
                  ? "text-green-800"
                  : "text-red-800"
              }`}
            >
              { quizz?.is_correct
                ? "Correct!"
                : "Incorrect"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              The correct answer is: {quizz?.options[quizz?.correct_option_index-1]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonQuizz