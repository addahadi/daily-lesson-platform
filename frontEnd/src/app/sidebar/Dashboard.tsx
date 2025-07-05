import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookCheck,
  Telescope,
  UserRound,
  LogOut,
  Save,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/clerk-react";

const Dashboard = () => {
  const location = useLocation();

  const isActiveLink = (path: string) => location.pathname === path;
  const isLessonPage = location.pathname.includes("lesson");
  const sidebarWidth = isLessonPage ? "w-16" : "w-64";
  const gridCols = isLessonPage
    ? "grid-cols-[4rem_1fr]"
    : "grid-cols-[16rem_1fr]";

  return (
    <div className={`grid ${gridCols}  h-screen`}>
      <aside
        className={`row-span-2 col-start-1 col-end-2 bg-white shadow-sm border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20 h-screen ${sidebarWidth} ${
          isLessonPage ? "p-2" : "p-6"
        }`}
      >
        <div
          className={`border-b border-gray-200 pb-4 mb-4 flex items-center ${
            isLessonPage ? "justify-center" : ""
          }`}
        >
          <img src="/icon/logo.svg" alt="logo" width={40} height={40} />
          {!isLessonPage && (
            <h2 className="ml-3 text-xl  text-gray-800">Learn Dz</h2>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage ? "justify-center p-2" : "gap-3 px-4 py-3"
            } ${
              isActiveLink("/dashboard")
                ? "bg-orange-100 text-orange-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
            }`}
          >
            <LayoutDashboard size={20} />
            {!isLessonPage && <span>Dashboard</span>}
          </Link>

          <Link
            to="/dashboard/notes"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage ? "justify-center p-2" : "gap-3 px-4 py-3"
            } ${
              isActiveLink("/dashboard/notes")
                ? "bg-orange-100 text-orange-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
            }`}
          >
            <BookCheck size={20} />
            {!isLessonPage && <span>My Notes</span>}
          </Link>

          <Link
            to="/dashboard/saved"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage ? "justify-center p-2" : "gap-3 px-4 py-3"
            } ${
              isActiveLink("/dashboard/saved")
                ? "bg-orange-100 text-orange-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
            }`}
          >
            <Save size={20} />
            {!isLessonPage && <span>Saved</span>}
          </Link>

          <Link
            to="/dashboard/discover"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage ? "justify-center p-2" : "gap-3 px-4 py-3"
            } ${
              isActiveLink("/dashboard/discover")
                ? "bg-orange-100 text-orange-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
            }`}
          >
            <Telescope size={20} />
            {!isLessonPage && <span>Discover</span>}
          </Link>

          <Link
            to="/dashboard/profile"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage ? "justify-center p-2" : "gap-3 px-4 py-3"
            } ${
              isActiveLink("/dashboard/profile")
                ? "bg-orange-100 text-orange-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-orange-600"
            }`}
          >
            <UserRound size={20} />
            {!isLessonPage && <span>Profile</span>}
          </Link>
        </nav>

        <div className="border-t border-gray-200 pt-4">
          <Link
            to="/logout"
            className={`flex items-center rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors ${
              isLessonPage ? "justify-center p-2" : "gap-3 px-4 py-3"
            }`}
          >
            <LogOut size={20} />
            {!isLessonPage && <span>Logout</span>}
          </Link>
        </div>
      </aside>
      <div className="col-start-2 col-end-3  flex flex-col ">
        <header className="w-full  sticky top-0 z-10 py-3 bg-white border-b border-gray-200 px-6 flex items-center justify-end gap-4">
          <Input
            type="search"
            placeholder="Search..."
            className="w-80 max-w-sm"
          />
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <img
              src="/icon/notification.svg"
              alt="notifications"
              width={24}
              height={24}
            />
          </button>
          <UserButton />
        </header>

        <main className=" flex-1 bg-gray-50  h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
