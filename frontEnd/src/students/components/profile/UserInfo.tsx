import type { UserInfoProps } from "@/students/lib/type";
import { Edit, User } from "lucide-react";
import { useState } from "react";

const UserInfo = ({ userData }: { userData: UserInfoProps | undefined }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>();
  return (
    <div className="p-8 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-4 border-white/20 overflow-hidden bg-white/20 flex items-center justify-center">
            {userData?.avatar_url &&
            userData.avatar_url !== "/placeholder.svg" ? (
              <img
                src={userData.avatar_url}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={32} className="text-white" />
            )}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
            <h1 className="text-3xl font-bold">{userData?.name}</h1>
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="text-white hover:bg-white/20 p-2 rounded-md transition-colors"
            >
              <Edit size={16} />
            </button>
          </div>
          <p className="text-blue-100 mb-4 max-w-2xl">{userData?.bio}</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              Level {userData?.level}
            </span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              {userData?.xp} XP
            </span>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
              Member since {userData?.created_at}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
