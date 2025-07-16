import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "Jul 10", completed: 45 },
  { date: "Jul 11", completed: 60 },
  { date: "Jul 12", completed: 52 },
  { date: "Jul 13", completed: 70 },
  { date: "Jul 14", completed: 66 },
  { date: "Jul 15", completed: 88 },
  { date: "Jul 16", completed: 102 },
];

export default function CompletedLessonsChart({
  chartData
} : {chartData : Record<string , number>[]}) {
  return (
    <div className="flex flex-col gap-4 w-full mt-4 p-6">
      <h1 className=" w-full text-2xl font-semibold text-gray-800">
        Completed Lessons Over Time
      </h1>
      <section className=" mt-8">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#10b981"
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
