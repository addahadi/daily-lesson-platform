import { Card, CardContent } from "@/Shared/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

type AdminActivityProps = {
  Icon: React.ElementType;
  header: string;
  value: number;
  secondaryValue: string;
  percentage?: number;
};

const AdminActivity = ({
  Icon,
  header,
  value,
  secondaryValue,
  percentage,
}: AdminActivityProps) => {
  const isPositive = percentage !== undefined && percentage > 0;

  return (
    <Card className="pt-5 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-gray-900/25 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="flex flex-col gap-2">
        <div className="w-full flex justify-between items-center">
          <h1 className="font-semibold text-gray-600 dark:text-gray-300">
            {header}
          </h1>
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="text-3xl w-full font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {value}
        </div>
        <div className="text-gray-400 dark:text-gray-500">{secondaryValue}</div>
        {percentage !== undefined && (
          <div
            className={`mt-2 flex flex-row gap-1 ${
              isPositive
                ? "text-green-500 dark:text-green-400"
                : "text-red-500 dark:text-red-400"
            } items-center`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{percentage}% from last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminActivity;
