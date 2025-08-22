import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import {  Moon } from "lucide-react";

const AdminNavBar = () => {
  const { user } = useUser();

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <header className="flex-1 w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div></div>

      <div className="flex items-center gap-3">
        {/* Toggle Theme Button */}
        <Button
          onClick={toggleTheme}
          size="icon"
          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <Moon className="w-4 h-4" />
        </Button>

        {/* User Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Admin User
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.fullName}
            </p>
          </div>
          <Button  size="sm" className="rounded-full p-2">
            <UserButton />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavBar;
