import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CompletedLessonsChart({
  chartData,
}: {
  chartData: Record<string, any>[];
}) {
  // Map data safely (reactive to chartData changes)
  const MappedChartData = useMemo(() => {
    return chartData.map((data) => ({
      date: data.date ? data.date.toString().split("T")[0] : "",
      completed: data.completed ?? 0,
    }));
  }, [chartData]);

  return (
    <div className="flex flex-col gap-4 w-full mt-4 p-6">
      <h1 className="w-full text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Completed Lessons Over Time
      </h1>
      <section className="mt-8">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={MappedChartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                {/* Blue gradient */}
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />{" "}
                  {/* blue-500 */}
                  <stop
                    offset="50%"
                    stopColor="#60a5fa"
                    stopOpacity={0.6}
                  />{" "}
                  {/* blue-400 */}
                  <stop
                    offset="95%"
                    stopColor="#bfdbfe"
                    stopOpacity={0.2}
                  />{" "}
                  {/* blue-200 */}
                </linearGradient>
              </defs>

              {/* Axes */}
              <XAxis
                dataKey="date"
                stroke="currentColor"
                className="text-gray-700 dark:text-gray-300"
              />
              <YAxis
                allowDecimals={false}
                stroke="currentColor"
                className="text-gray-700 dark:text-gray-300"
              />

              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(107, 114, 128, 0.2)"
                className="dark:stroke-gray-600/30"
              />

              {/* Tooltip */}
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--tooltip-bg)",
                  borderRadius: "0.5rem",
                  border: "none",
                  color: "var(--tooltip-text)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />

              {/* Area */}
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#3b82f6" // blue-500
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCompleted)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
