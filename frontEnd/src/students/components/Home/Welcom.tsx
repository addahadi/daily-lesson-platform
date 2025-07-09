import useHomeApi from "@/students/Api/home.Api";
import { useUser } from "@clerk/clerk-react";
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

const Welcom = () => {
  const { user } = useUser();
  const [streak, setSteak] = useState<number | undefined>();
  const {getDailyStreak} = useHomeApi()
  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      const result = await getDailyStreak(user.id);
      setSteak(result[0].streak_count);
    }
    fetchData();
  }, [user]);
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 w-full mb-5 flex flex-row  justify-between">
      <div>
        <img
          src={user?.imageUrl}
          width={50}
          alt="profile"
          className="rounded-full shadow-md"
        />
        <div className=" mt-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome , {user?.firstName || "Student"} 👋
          </h2>
          {!(streak == 0) ? (
            <p className="text-gray-600 text-lg mt-2">
              You’ve completed{" "}
              <span className="font-bold text-orange-500">{streak}</span> Streak
              days
            </p>
          ) : (
            <p className="text-gray-600 text-lg mt-2">
              you have{" "}
              <span className="font-bold text-orange-500">{streak}</span> try to
              complete 1 lesson to increase your streak day
            </p>
          )}
        </div>
      </div>
      <div
        className={`w-12 h-12  rounded-lg flex items-center justify-center
           ${!(streak == 0) ? "bg-orange-100" : "bg-gray-100"} 
          `}
      >
        {!(streak == 0) ? (
          <Zap className="w-6 h-6 text-orange-600" />
        ) : (
          <Zap className="w-6 h-6 text-gray-500" />
        )}
      </div>
    </div>
  );
};

export default Welcom;
