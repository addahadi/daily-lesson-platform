
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const BackTo = ({ URL, title, state }: { URL: string; title: string; state: any }) => {

  return (
    <div className="mb-6">
      <Link
        to={URL}
        state={state}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-50 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {title}
      </Link>
    </div>
  );
};

export default BackTo;
