import type { NotificationData } from "@/Shared/lib/type";
import { CheckCheck, X } from "lucide-react";
import NotificationItem from "./NotificationItem";
import LoadingSpinner from "@/Shared/components/ui/loading";
import { useNotificationApi } from "@/students/Api/notification.Api";
import { useState } from "react";
import { toast, Toaster } from "sonner";

const NotificationModel = ({
  loading,
  close,
  notifications,
  setNotifications,
}: {
  loading: boolean;
  close: () => void;
  notifications: NotificationData[] | null;
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationData[] | null>
  >;
}) => {
  const { markAllRead } = useNotificationApi();
  const [Markloading, setMarkLoading] = useState(false);

  async function handleMarkAsRead() {
    setMarkLoading(true);
    const result = await markAllRead();
    if (result) {
      toast.success(result.message);
      setMarkLoading(false);
      return;
    }
    setMarkLoading(false);
  }

  return (
    <div
      className="
        bg-white dark:bg-gray-900
        border border-gray-300 dark:border-gray-700
        rounded-lg md:rounded-lg
        w-full max-w-sm md:w-[350px]
        h-full md:h-auto
        fixed md:relative
        top-0 right-0 md:top-auto md:right-auto
        z-50
        flex flex-col
      "
    >
      {/* Header */}
      <header className="bg-gray-100 dark:bg-gray-800 rounded-t-lg p-4 flex flex-col gap-3">
        <div className="flex justify-between items-center w-full">
          <h1 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
            Notifications
          </h1>
          <X
            onClick={close}
            className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer hover:text-black dark:hover:text-white"
          />
        </div>
        <div className="flex flex-row gap-5 items-center">
          <button
            disabled={Markloading}
            onClick={handleMarkAsRead}
            className={`disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 text-sm text-orange-500 hover:underline ${
              Markloading ? "opacity-50" : ""
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all Read</span>
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="overflow-y-auto flex-1 p-3">
        {loading ? (
          <div className="w-full h-[300px] flex justify-center items-center">
            <LoadingSpinner color="orange-500" size={30} />
          </div>
        ) : notifications === null ? (
          <div className="w-full h-[300px] flex justify-center items-center">
            <span className="text-gray-800 dark:text-gray-300">
              No notifications found
            </span>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              setNotifications={setNotifications}
            />
          ))
        )}
      </main>
      <Toaster />
    </div>
  );
};

export default NotificationModel;
