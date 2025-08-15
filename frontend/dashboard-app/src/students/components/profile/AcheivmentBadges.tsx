import type { achievementsProps } from "@/lib/type";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import useProfileApiController from "@/students/Api/profile.Api";
const AchievementBadges = () => {
  const [achievements, setAchievements] = useState<achievementsProps[]>();
  const { getUserAchievements } = useProfileApiController();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUserAchievements();
      if(result){
        setAchievements(result);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 h-full w-full border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Star className="text-yellow-500 dark:text-yellow-400" size={20} />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          Achievements
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements &&
          achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-3 rounded-lg border transition-all ${
                achievement.earned
                  ? "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700"
                  : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-60"
              }`}
            >
              <div className="text-center space-y-1">
                <div className="text-xl sm:text-2xl">{achievement.icon}</div>
                <h4 className="font-medium text-xs sm:text-sm text-gray-900 dark:text-white">
                  {achievement.name}
                </h4>
                <p className="text-xs leading-tight text-gray-500 dark:text-gray-400">
                  {achievement.description}
                </p>
                {achievement.earned ? (
                  <span className="inline-block text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                    Earned!
                  </span>
                ) : (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Not Earned!
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Keep learning to unlock more achievements! 🌟
        </p>
      </div>
    </div>
  );
};

export default AchievementBadges;
