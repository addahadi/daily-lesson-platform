import profileApiController from "@/Api/profile.Api";
import AchievementBadges from "@/components/component/profile/AcheivmentBadges";
import StreakCounter from "@/components/component/profile/streakCounter";
import UserInfo from "@/components/component/profile/UserInfo"
import XpChart from "@/components/component/profile/XpChart";
import type { UserInfoProps } from "@/lib/type";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const Profile = () => {
  const [userData, setUserData] = useState<UserInfoProps>();
  const [currentStreak , setCurrentStreak] = useState<number>()
  const {user} = useUser()
  
  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      const result = await profileApiController().getUserInfo(user?.id);
      setUserData(result[0]);
      setCurrentStreak(result[0].streak_count)
    };
    fetchData();
  }, [user]); 

  return (
    <div>
      <UserInfo userData = {userData} />
      <div  className=" flex w-full gap-2 p-5">
        <div className=" w-full flex flex-col gap-3">
          <StreakCounter currentStreak={currentStreak} />
          <XpChart />
        </div>
        <AchievementBadges  />
      </div>
    </div>
  )
}

export default Profile