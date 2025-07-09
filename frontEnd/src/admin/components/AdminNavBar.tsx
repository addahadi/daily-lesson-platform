import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Bell, Search } from "lucide-react";

const AdminNavBar = () => {
  const { user } = useUser();
  return (
    <header className="  flex-1 w-full h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 w-80 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>

        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">{user?.fullName}</p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full p-2">
            <UserButton />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminNavBar;
