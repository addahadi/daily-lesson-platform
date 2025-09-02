import { useClerk } from "@clerk/clerk-react";
import { LogOut } from "lucide-react";
import { useState } from "react";
import LoadingSpinner from "./loading";

export default function LogOutButton({ isLessonPage} : {isLessonPage: boolean}) {
  const clerk = useClerk();
  const [loading ,setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    await clerk.signOut();
    // Now redirect to Astro landing page with full reload
    window.location.href = "https://devlevelup.vercel.app/";
    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center rounded-lg font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${
        isLessonPage
          ? "justify-center p-2"
          : "justify-center md:justify-start gap-3 p-2 md:px-4 md:py-3"
      }`}
    >
        {
            loading ? (
                <LoadingSpinner  color="red-600" size={20}/>
            ) : (
                <LogOut size={20} />
            )
        }
      {!isLessonPage && <span className="hidden md:inline">Logout</span>}
    </button>
  );
}
