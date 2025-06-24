

import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookCheck,
  Telescope,
  UserRound,
  LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/clerk-react";

const Dashboard = () => {
  
  const location = useLocation();

  const isActiveLink = (path : string) => {
    return location.pathname === path;
  };

  // Check if we're on a lesson page
  const isLessonPage =
    location.pathname.includes("/course/") &&
    location.pathname.includes("/module/") &&
    location.pathname.includes("/lesson/");

  const sidebarWidth = isLessonPage ? "w-16" : "w-64";

  return (
    <div className="flex h-screen bg-gray-50">
      <aside
        className={`${sidebarWidth} bg-white shadow-sm border-r border-gray-200 flex flex-col transition-all duration-300`}
      >
        <div
          className={`${isLessonPage ? "p-3" : "p-6"} border-b border-gray-200`}
        >
          <div className="flex items-center justify-center">
            <img src="/icon/logo.svg" alt="logo" width={40} height={40} />
            {!isLessonPage && (
              <h2 className="ml-3 text-xl font-bold text-gray-800">Learn Dz</h2>
            )}
          </div>
        </div>

        <nav className={`flex-1 ${isLessonPage ? "p-3" : "p-6"}`}>
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center ${
                isLessonPage ? "justify-center p-3" : "gap-3 px-4 py-3"
              } rounded-lg font-medium transition-colors ${
                isActiveLink("/dashboard")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
              }`}
              title={isLessonPage ? "Dashboard" : ""}
            >
              <LayoutDashboard size={20} />
              {!isLessonPage && <span>Dashboard</span>}
            </Link>

            <Link
              to="/dashboard/lessons"
              className={`flex items-center ${
                isLessonPage ? "justify-center p-3" : "gap-3 px-4 py-3"
              } rounded-lg font-medium transition-colors ${
                isActiveLink("/dashboard/lessons")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
              }`}
              title={isLessonPage ? "My Lessons" : ""}
            >
              <BookCheck size={20} />
              {!isLessonPage && <span>My Lessons</span>}
            </Link>

            <Link
              to="/dashboard/discover"
              className={`flex items-center ${
                isLessonPage ? "justify-center p-3" : "gap-3 px-4 py-3"
              } rounded-lg font-medium transition-colors ${
                isActiveLink("/dashboard/discover")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
              }`}
              title={isLessonPage ? "Discover" : ""}
            >
              <Telescope size={20} />
              {!isLessonPage && <span>Discover</span>}
            </Link>

            <Link
              to="/dashboard/profile"
              className={`flex items-center ${
                isLessonPage ? "justify-center p-3" : "gap-3 px-4 py-3"
              } rounded-lg font-medium transition-colors ${
                isActiveLink("/dashboard/profile")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
              }`}
              title={isLessonPage ? "Profile" : ""}
            >
              <UserRound size={20} />
              {!isLessonPage && <span>Profile</span>}
            </Link>
          </div>
        </nav>

        <div
          className={`${isLessonPage ? "p-3" : "p-6"} border-t border-gray-200`}
        >
          <Link
            to="/logout"
            className={`flex items-center ${
              isLessonPage ? "justify-center p-3" : "gap-3 px-4 py-3"
            } rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors`}
            title={isLessonPage ? "Logout" : ""}
          >
            <LogOut size={20} />
            {!isLessonPage && <span>Logout</span>}
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-end gap-4">
            <Input
              type="search"
              placeholder="Search..."
              className="w-80 max-w-sm"
            />
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <img
                  src="/icon/notification.svg"
                  alt="notifications"
                  width={24}
                  height={24}
                />
              </button>
              <UserButton />
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;