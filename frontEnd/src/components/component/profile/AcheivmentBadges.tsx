import profileApiController from "@/Api/profile.Api";
import type { achievementsProps, UserInfoProps } from "@/lib/type";
import { useUser } from "@clerk/clerk-react";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";


const AchievementBadges = () => {
  const {user} = useUser()
  const [achievements , setAchievements] = useState<achievementsProps[]>()

  useEffect(() => {
    if(!user?.id) return
    const fetchData = async () => {
      const result = await profileApiController().getUserAchievements(user.id)
      setAchievements(result)
    }
    fetchData()
  },[user])
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 h-full  w-full">
      <div className="flex items-center gap-2 mb-6">
        <Star className="text-yellow-500" size={20} />
        <h2 className="text-xl font-semibold">
          Achievements 
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievements && achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-3 rounded-lg border transition-all ${
              achievement.earned
                ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200"
                : "bg-gray-50 border-gray-200 opacity-60"
            }`}
          >
            <div className="text-center space-y-1">
              <div className="text-2xl">{achievement.icon}</div>
              <h4 className="font-medium text-xs">{achievement.name}</h4>
              <p className="text-xs text-gray-500 leading-tight">
                {achievement.description}
              </p>
              {achievement.earned ? (
                <span className="inline-block text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Earned!
                </span>
              ) : (
                <div className="text-xs text-gray-500">
                  Not Earned!
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t text-center">
        <p className="text-sm text-gray-500">
          Keep learning to unlock more achievements! 🌟
        </p>
      </div>
    </div>
  );
};

export default AchievementBadges;
