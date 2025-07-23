import { BookOpen, Users, Bell } from "lucide-react";

const AdminWelcome = () => {
  return (
    <div className=" min-h-screen  bg-white dark:bg-gray-800 p-6">
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, Admin!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Use the sidebar to navigate between pages and start managing your
          platform.
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center">
            <BookOpen
              size={16}
              className="mr-2 text-blue-500 dark:text-blue-400"
            />
            <span>Manage Courses</span>
          </div>
          <div className="flex items-center">
            <Users
              size={16}
              className="mr-2 text-green-500 dark:text-green-400"
            />
            <span>Manage Users</span>
          </div>
          <div className="flex items-center">
            <Bell
              size={16}
              className="mr-2 text-orange-500 dark:text-orange-400"
            />
            <span>Notifications</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcome;
