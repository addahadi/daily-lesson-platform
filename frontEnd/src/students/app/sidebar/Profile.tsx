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
  const {getUserInfo} = useProfileApiController()
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
    <div>
      <UserInfo userData={userData} />
      <div className=" flex w-full gap-2 p-5">
        <div className=" w-full flex flex-col gap-3">
          <StreakCounter currentStreak={currentStreak} />
          <XpChart />
        </div>
        <AchievementBadges />
      </div>
    </div>
  );
};

export default Profile;
