import { CodeIcon } from "lucide-react";



const LessonCode = ({ code, heading }: { code: string; heading: string }) => {
  return (
    <div className="bg-white border border-gray-200 flex flex-col p-5 rounded-lg gap-3 mt-5 mb-5">
      <h1 className="flex flex-row gap-4">
        <CodeIcon className="w-4 h-4 bg-orange-1 text-orange-1" />
        <span className="text-black-1 text-xl">{heading}</span>
      </h1>
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-green-400 text-sm whitespace-pre-wrap">
          <code>{code.replace(/\\n/g, "\n")}</code>
        </pre>
      </div>
    </div>
  );
};


export default LessonCode