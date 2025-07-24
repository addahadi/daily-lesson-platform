import { Button } from "@/components/ui/button";

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
};

const EmptyCase = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyCaseProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 px-4 text-center text-gray-600 dark:text-gray-400">
      {/* Icon inside circle */}
      <div className="bg-orange-100 dark:bg-orange-300/10 p-4 rounded-full mb-4">
        <div className="text-orange-500 w-8 h-8">{icon}</div>
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
            className="bg-orange-500 hover:bg-orange-600 text-white"
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
