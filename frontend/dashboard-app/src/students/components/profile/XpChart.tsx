import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import useProfileApiController from "@/students/Api/profile.Api";
import type { XpData } from "@/Shared/lib/type";

export default function XpChart() {
  const [data, setData] = useState<XpData[]>([]);
  const { user } = useUser();
  const { getXpLogs } = useProfileApiController();

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      const data = await getXpLogs();

      if (data) {
        setData(data);
      }
    };
    fetchData();
  }, [user]);

  const formattedData = data.map((item) => ({
    date: item.day,
    xp: Number(item.xp_per_day),
  }));

  return (
    <div className="w-full h-80 sm:h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3 sm:p-4 pb-8 sm:pb-14 border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-white">
        Your XP Progress
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-300 dark:text-gray-600"
          />
          <XAxis
            dataKey="date"
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
            fontSize={12}
          />
          <YAxis
            stroke="currentColor"
            className="text-gray-600 dark:text-gray-400"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg)",
              borderRadius: "0.5rem",
              border: "1px solid var(--tooltip-border)",
              color: "var(--tooltip-text)",
            }}
            labelStyle={{
              color: "var(--tooltip-label)",
              fontWeight: "500",
            }}
            formatter={(value: number) => [`${value} XP`, "Earned"]}
            wrapperStyle={
              {
                "--tooltip-bg": "white",
                "--tooltip-border": "#fed7aa", // orange-200
                "--tooltip-text": "#7c2d12", // orange-900
                "--tooltip-label": "#ea580c", // orange-600
              } as React.CSSProperties
            }
          />
          <Line
            type="monotone"
            dataKey="xp"
            stroke="#f97316" // orange-500
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 2, stroke: "#fdba74" }} // orange-300
            activeDot={{ r: 5, fill: "#ea580c", strokeWidth: 2 }} // orange-600
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
