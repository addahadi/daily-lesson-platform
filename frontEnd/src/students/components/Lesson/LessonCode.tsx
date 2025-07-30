import { CodeIcon } from "lucide-react";

const LessonCode = ({ code, heading }: { code: string; heading: string }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col p-4 sm:p-5 rounded-lg gap-4 mt-5 mb-5">
      <h1 className="flex items-center gap-3">
        <CodeIcon className="w-5 h-5 text-orange-500" />
        <span className="text-black text-xl dark:text-gray-100 font-semibold">
          {heading}
        </span>
      </h1>

      <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
        <pre className="text-green-400 text-sm leading-relaxed whitespace-pre-wrap font-mono">
          <code>{code.replace(/\\n/g, "\n")}</code>
        </pre>
      </div>
    </div>
  );
};

export default LessonCode;
