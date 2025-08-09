import useHomeApi from "@/students/Api/home.Api";
import { useUser } from "@clerk/clerk-react";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

const Welcome = () => {
  const { user } = useUser();
  const [streak, setStreak] = useState<number | undefined>();
  const { getDailyStreak } = useHomeApi();

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      const result = await getDailyStreak(user.id);
      setStreak(result[0].streak_count);
    }
    fetchData();
  }, [user]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-lg border border-gray-200 dark:border-gray-700 w-full mb-4 sm:mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <img
          src={user?.imageUrl}
          width={50}
          height={50}
          alt="profile"
          className="w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-full shadow-md flex-shrink-0 object-cover"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-1 sm:mb-2 break-words">
            Welcome, {user?.firstName || "Student"} 👋
          </h2>
          {streak !== 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-lg leading-relaxed">
              You've completed{" "}
              <span className="font-bold text-orange-500 dark:text-orange-400">
                {streak}
              </span>{" "}
              streak day{streak !== 1 ? "s" : ""}
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-lg leading-relaxed">
              You have{" "}
              <span className="font-bold text-orange-500 dark:text-orange-400">
                {streak}
              </span>{" "}
              streak days. Try completing 1 lesson to increase your streak!
            </p>
          )}
        </div>
      </div>

      <div
        className={`w-12 h-12 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
          streak !== 0
            ? "bg-orange-100 dark:bg-orange-900/30"
            : "bg-gray-100 dark:bg-gray-700"
        }`}
      >
        {streak !== 0 ? (
          <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
        ) : (
          <Zap className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        )}
      </div>
    </div>
  );
};

export default Welcome;
