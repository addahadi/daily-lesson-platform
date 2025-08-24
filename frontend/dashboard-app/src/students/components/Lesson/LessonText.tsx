import { renderMarkdown } from "@/Shared/lib/utils";

const LessonText = ({ text, heading }: { text: string; heading: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col p-4 sm:p-5 rounded-lg gap-4 mt-5 mb-5">
      <h1>
        <span className="text-black text-xl dark:text-gray-100 font-semibold">
          {heading}
        </span>
      </h1>

      <div
        className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
        dangerouslySetInnerHTML={{
          __html: text
            ? renderMarkdown(text)
            : '<p class="text-gray-500 italic">No content yet...</p>',
        }}
      />

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
