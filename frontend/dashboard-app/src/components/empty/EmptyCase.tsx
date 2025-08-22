import { Button } from "@/components/ui/button";
import clsx from "clsx";

type EmptyCaseProps = {
  icon: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  color?: "orange" | "blue" | "green" | "red" | "purple"; // extend as needed
};

const EmptyCase = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  color = "orange", // default fallback
}: EmptyCaseProps) => {
  // Build dynamic Tailwind classes
  const bgLight = `bg-${color}-100`;
  const bgDark = `dark:bg-${color}-300/10`;
  const textMain = `text-${color}-500`;
  const btnBg = `bg-${color}-500 hover:bg-${color}-600`;

  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center text-gray-600 dark:text-gray-400">
      {/* Icon inside circle */}
      <div
        className={clsx(
          bgLight,
          bgDark,
          "p-4 rounded-full mb-4 flex justify-center items-center"
        )}
      >
        <div
          className={clsx(textMain, "w-8 h-8 flex justify-center items-center")}
        >
          {icon}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {primaryAction && (
          <Button
            className={clsx(btnBg, "text-white")}
            onClick={primaryAction.onClick}
          >
            {primaryAction.icon && (
              <span className="mr-2">{primaryAction.icon}</span>
            )}
            {primaryAction.label}
          </Button>
        )}

        {secondaryAction && (
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 dark:text-gray-200"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.icon && (
              <span className="mr-2">{secondaryAction.icon}</span>
            )}
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyCase;
