import { X } from "lucide-react";

const CourseCompleteModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          🎉 Course Completed!
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-center">
          Congratulations on completing the course! You’ve unlocked a huge
          milestone.
        </p>
      </div>
    </div>
  );
};

export default CourseCompleteModal;
