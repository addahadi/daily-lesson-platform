const LessonText = ({ text, heading }: { text: string; heading: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col p-4 sm:p-5 rounded-lg gap-4 mt-5 mb-5">
      <h1>
        <span className="text-black text-xl dark:text-gray-100 font-semibold">
          {heading}
        </span>
      </h1>

      <div className="overflow-auto text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
        {text}
      </div>

      {heading === "Summary" && (
        <div className="mt-4">
          <button className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-500 transition-colors font-medium">
            Mark as Completed
          </button>
        </div>
      )}
    </div>
  );
};

export default LessonText;
