import AchievementBadges from "@/students/components/profile/AcheivmentBadges";
import StreakCounter from "@/students/components/profile/streakCounter";
import UserInfo from "@/students/components/profile/UserInfo";
import XpChart from "@/students/components/profile/XpChart";
import type { UserInfoProps } from "@/lib/type";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

import useProfileApiController from "@/students/Api/profile.Api";

const Profile = () => {
  const [userData, setUserData] = useState<UserInfoProps>();
  const [currentStreak, setCurrentStreak] = useState<number>();
  const { user } = useUser();
  const { getUserInfo } = useProfileApiController();

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      const result = await getUserInfo(user?.id);
      setUserData(result[0]);
      setCurrentStreak(result[0].streak_count);
    };
    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <UserInfo userData={userData} />
      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-6 p-4 lg:p-6">
        <div className="w-full lg:w-2/3 flex flex-col gap-4 lg:gap-6">
          <StreakCounter currentStreak={currentStreak} />
          <XpChart />
        </div>
        <div className="w-full lg:w-1/3">
          <AchievementBadges />
        </div>
      </div>
    </div>
  );
};

export default Profile;
