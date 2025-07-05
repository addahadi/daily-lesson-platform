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
import profileApiController from "@/Api/profile.Api";

type XpData = {
  xp_per_day: number;
  day: string;
};
const testData = [
  { date: "2025-07-01", xp: 100 },
  { date: "2025-07-02", xp: 200 },
  { date: "2025-07-03", xp: 150 },
];

export default function XpChart() {
  const [data, setData] = useState<XpData[]>([]);
  const {user} = useUser()
  useEffect(() => {
    if(!user?.id) return  
    const fetchData = async () => {
      const data = await profileApiController().getXpLogs(user.id)
      setData(data)
      console.log(data)
    }
    fetchData()
  }, [user]);

  const formattedData = data.map((item) => ({
    date: item.day,
    xp: Number(item.xp_per_day),
  }));
  return (
    <div className="w-full h-96 bg-white rounded-2xl shadow-lg p-4 pb-14">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Your XP Progress
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={testData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
            }}
            labelStyle={{ color: "#6b7280", fontWeight: "500" }}
            formatter={(value: number) => [`${value} XP`, "Earned"]}
          />
          <Line
            type="monotone"
            dataKey="xp"
            stroke="#6366f1" // Indigo-500
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6, fill: "#4f46e5" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
