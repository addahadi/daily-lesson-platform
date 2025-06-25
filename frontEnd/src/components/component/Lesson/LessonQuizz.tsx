import { Button } from '@/components/ui/button'
import type QuizzProps from '@/lib/type'
import { Trophy } from 'lucide-react'

const LessonQuizz = ({quizz} : {quizz : QuizzProps}) => {
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
        {quizz?.options.map((option, index) => {
          return (
            <label
              key={index}
              className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="radio"
                name="quiz"
                value={index}
                className="text-purple-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          );
        })}
      </div>
      <div className=' m-auto w-full'>
        <Button className=" bg-purple-600 text-white-1  m-auto mt-5">Submit</Button>
      </div>
    </div>
  );
}

export default LessonQuizz