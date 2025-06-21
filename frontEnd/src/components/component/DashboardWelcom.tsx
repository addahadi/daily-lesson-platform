import { useUser } from "@clerk/clerk-react";

const DashboardWelcome = () => {
  const { user } = useUser();

  const weeklyLessonsCompleted = 12;

  return (
    <div className="neumorphic p-6 flex items-center gap-4">
      <img
        src={user?.imageUrl}
        width={50}
        alt="profile"
        className="rounded-full shadow-md"
      />
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome back, {user?.firstName || "Student"} 👋
        </h2>
        <p className="text-gray-600">
          You’ve completed{" "}
          <span className="font-bold text-orange-500">
            {weeklyLessonsCompleted}
          </span>{" "}
          lessons this week.
        </p>
      </div>
    </div>
  );
};

export default DashboardWelcome;
