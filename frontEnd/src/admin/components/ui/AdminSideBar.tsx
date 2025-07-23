import {
  Bell,
  BookCheck,
  ChartSpline,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const navigationItems = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    path: "/admin/welcom",
  },
  {
    name: "Lesson Management",
    icon: BookCheck,
    path: "/admin/course-management",
  },
  {
    name: "User Management",
    icon: User,
    path: "/admin/user-management",
  },
  {
    name: "Analytics",
    icon: ChartSpline,
    path: "/admin/analytics",
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/admin/notification",
  },
];

const AdminSideBar = () => {
  return (
    <div className=" min-h-screen  sticky top-0 left-0  bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600 flex flex-col h-screen w-[300px]">
      {/* Header Section */}
      <section className="border-b border-gray-200 dark:border-gray-700">
        <section className="py-6 px-6 flex gap-2 items-center">
          <div className="rounded-md p-2 bg-blue-600">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-black dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Learning platform
            </p>
          </div>
        </section>
      </section>

      {/* Navigation Section */}
      <section className="flex-1 px-6">
        <div className="mt-8 mb-8">
          <h1 className="text-gray-500 dark:text-gray-400 font-semibold">
            NAVIGATION
          </h1>
        </div>

        <div className="flex ml-[2px] flex-col gap-3">
          {navigationItems.map((item) => {
            return (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AdminSideBar;
