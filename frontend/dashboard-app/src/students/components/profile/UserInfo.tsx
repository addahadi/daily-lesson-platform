import type { UserInfoProps } from "@/lib/type";
import { User } from "lucide-react";

const UserInfo = ({ userData }: { userData: UserInfoProps | undefined }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600 text-white">
      <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/20 overflow-hidden bg-white/20 flex items-center justify-center">
            {userData?.avatar_url &&
            userData.avatar_url !== "/placeholder.svg" ? (
              <img
                src={userData.avatar_url}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={28} className="text-white sm:w-8 sm:h-8" />
            )}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left w-full md:w-auto">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center md:justify-start mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold break-words">
              {userData?.name || "Loading..."}
            </h1>
          </div>

          <p className="text-orange-100 dark:text-orange-200 mb-4 max-w-2xl text-sm sm:text-base">
            {userData?.bio || "No bio available"}
          </p>

          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="bg-white/20 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              Level {userData?.level || 1}
            </span>
            <span className="bg-white/20 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              {userData?.xp || 0} XP
            </span>
            <span className="bg-white/20 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              Member since {userData?.created_at.split("T")[0] || "Recently"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
