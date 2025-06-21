
import  { useState } from "react";
import { CheckCircle, HelpCircle } from "lucide-react";

const TodaysLesson = () => {
  const [isCompleted, setIsCompleted] = useState(false);

  const lesson = {
    title: "Loops in JavaScript",
    description:
      "Learn about `for`, `while`, and `forEach` loops and when to use them.",
    helpLink: "/community/help",
  };

  return (
    <div className="neumorphic p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        📆 Today’s Lesson
      </h2>
      <h3 className="text-lg font-medium text-gray-900">{lesson.title}</h3>
      <p className="text-gray-600">{lesson.description}</p>

      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <button
          onClick={() => setIsCompleted(true)}
          disabled={isCompleted}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            isCompleted
              ? "bg-green-100 text-green-700 cursor-default"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {isCompleted ? (
            <span className="flex items-center gap-2">
              <CheckCircle size={18} /> Completed
            </span>
          ) : (
            "Mark as Complete"
          )}
        </button>
        <a
          href={lesson.helpLink}
          className="text-orange-500 hover:underline flex items-center gap-1"
        >
          <HelpCircle size={18} /> Ask for Help
        </a>
      </div>
    </div>
  );
};

export default TodaysLesson;
