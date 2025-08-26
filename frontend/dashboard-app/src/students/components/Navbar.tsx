import { Button } from "@/Shared/components/ui/button";
import {  Moon, Sun } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import NotificationBell from "./notification/NotificationBell";


const Navbar = () => {
  const [isDark, setIsDark] = useState(false);


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
  return (
    <header className="w-full sticky top-0 z-30 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 flex items-center justify-end gap-2 md:gap-4">
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
        <div className=" relative">
          <NotificationBell />
        </div>
        <div className=" h-full flex items-center justify-center">
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
