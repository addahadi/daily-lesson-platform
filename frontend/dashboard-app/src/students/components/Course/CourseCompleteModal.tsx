import { X } from "lucide-react";

const CourseCompleteModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-[90%] max-w-sm relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <div className="text-center">
          <span className="text-6xl mb-4 block">🎉</span>
          <h2 className="text-3xl font-extrabold mb-3 text-gray-900 dark:text-white">
            Course Completed!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            Congratulations on completing the course! You’ve unlocked a huge milestone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCompleteModal;
