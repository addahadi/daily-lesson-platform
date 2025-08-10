import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookCheck,
  Telescope,
  UserRound,
  LogOut,
  Save,
  Moon,
  Sun,
  Bell,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import NotificationModel from "@/students/components/notification/NotificationModel";
import type { NotificationData } from "@/lib/type";
import { useNotificationApi } from "@/students/Api/notification.Api";
import LogOutButton from "@/components/ui/LogOutButton";

const Dashboard = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const [openModel ,setOpenModel] = useState(false)
  const [notifications , setNotifications] = useState<NotificationData[] | null>(null)
  const [loading , setLoading] = useState(false)
 
  const {user} = useUser()
  const {getUserNotifications} = useNotificationApi()
  
  
  useEffect(() => {
    
    const fetchData = async () => {
      if(!user?.id) return
      setLoading(true)
      const result = await getUserNotifications(user.id);
      if(result){
        setNotifications(result)
        setLoading(false)
      }
      setLoading(false)
    }
    fetchData()

  },[user])
  
  
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark =
      savedTheme === "dark" || (!savedTheme && systemPrefersDark);

    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  const isActiveLink = (path: string) => location.pathname === path;
  const isLessonPage = location.pathname.includes("lesson");

  const sidebarWidth = isLessonPage ? "w-16 lg:w-16" : "w-16 md:w-64";

  const gridCols = isLessonPage
    ? "grid-cols-[4rem_1fr]"
    : "grid-cols-[4rem_1fr] md:grid-cols-[16rem_1fr]";

  return (
    <div className={`grid ${gridCols} h-screen bg-gray-50 dark:bg-gray-900`}>
      <aside
        className={`row-span-2 col-start-1 col-end-2 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 flex flex-col fixed left-0 top-0 z-20 h-screen ${sidebarWidth} ${
          isLessonPage ? "p-2" : "p-2 md:p-6"
        }`}
      >
        <div
          className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 flex items-center ${
            isLessonPage ? "justify-center" : "justify-center md:justify-start"
          }`}
        >
          <img src="/icon/logo.svg" alt="logo" width={40} height={40} />
          {!isLessonPage && (
            <h2 className="ml-3 text-xl text-gray-800 dark:text-gray-100 hidden md:block">
              Learn Dz
            </h2>
          )}
        </div>

        <nav className="flex-1 space-y-2">
          <Link
            to="/dashboard"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage
                ? "justify-center p-2"
                : "justify-center md:justify-start gap-3 p-2 md:px-4 md:py-3"
            } ${
              isActiveLink("/dashboard")
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400"
            }`}
          >
            <LayoutDashboard size={20} />
            {!isLessonPage && (
              <span className="hidden md:inline">Dashboard</span>
            )}
          </Link>

          <Link
            to="/dashboard/notes"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage
                ? "justify-center p-2"
                : "justify-center md:justify-start gap-3 p-2 md:px-4 md:py-3"
            } ${
              isActiveLink("/dashboard/notes")
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400"
            }`}
          >
            <BookCheck size={20} />
            {!isLessonPage && (
              <span className="hidden md:inline">My Notes</span>
            )}
          </Link>

          <Link
            to="/dashboard/library"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage
                ? "justify-center p-2"
                : "justify-center md:justify-start gap-3 p-2 md:px-4 md:py-3"
            } ${
              isActiveLink("/dashboard/library")
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400"
            }`}
          >
            <Save size={20} />
            {!isLessonPage && (
              <span className="hidden md:inline">My library</span>
            )}
          </Link>

          <Link
            to="/dashboard/discover"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage
                ? "justify-center p-2"
                : "justify-center md:justify-start gap-3 p-2 md:px-4 md:py-3"
            } ${
              isActiveLink("/dashboard/discover")
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400"
            }`}
          >
            <Telescope size={20} />
            {!isLessonPage && (
              <span className="hidden md:inline">Discover</span>
            )}
          </Link>

          <Link
            to="/dashboard/profile"
            className={`flex items-center rounded-lg font-medium transition-colors ${
              isLessonPage
                ? "justify-center p-2"
                : "justify-center md:justify-start gap-3 p-2 md:px-4 md:py-3"
            } ${
              isActiveLink("/dashboard/profile")
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400"
            }`}
          >
            <UserRound size={20} />
            {!isLessonPage && <span className="hidden md:inline">Profile</span>}
          </Link>
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <LogOutButton isLessonPage={isLessonPage} />
        </div>
      </aside>

      <div className="col-start-2 col-end-3 flex flex-col">
        <header className="w-full sticky top-0 z-10 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 flex items-center justify-between md:justify-end gap-2 md:gap-4">

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Input
              type="search"
              placeholder="Search..."
              className="w-32 sm:w-48 md:w-80 max-w-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <div className=" relative">
              <button
                onClick={() => setOpenModel(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Bell className=" text-white w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className=" absolute top-10 right-10">
                {openModel && (
                  <NotificationModel
                    loading={loading}
                    notifications={notifications}
                    close={() => setOpenModel(false)}
                  />
                )}
              </div>
            </div>
            <div className="scale-75 md:scale-100">
              <UserButton />
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gray-50 dark:bg-gray-900 h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
