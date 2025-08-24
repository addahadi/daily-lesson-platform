import type { NotificationData } from "@/Shared/lib/type";
import { formatTimestamp } from "@/Shared/lib/utils";
import { useNotificationApi } from "@/students/Api/notification.Api";
import { BookOpen, Check, Megaphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type NotificationItemProps = {
  notification: NotificationData;
  setNotifications: React.Dispatch<
    React.SetStateAction<NotificationData[] | null>
  >;
};

const NotificationItem = ({
  notification,
  setNotifications,
}: NotificationItemProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { markAsRead } = useNotificationApi();
  const handleMarkAsRead = async () => {
    if (notification.is_read) return;

    setIsLoading(true);
    const result = await markAsRead(notification.id);
    if (!result) return setIsLoading(false);
    setNotifications(
      (prev) =>
        prev?.map((item) =>
          item.id === notification.id ? { ...item, is_read: true } : item
        ) || null
    );

    toast.success(result?.message);
    setIsLoading(false);
  };

  const getIcon = () => {
    return notification.type === "announcement" ? (
      <Megaphone size={16} className="text-blue-500" />
    ) : (
      <BookOpen size={16} className="text-green-500" />
    );
  };

  const getBgColor = () => {
    if (notification.is_read)
      return "bg-gray-50 dark:bg-gray-800 border-l-gray-300 dark:border-l-gray-700";
    return notification.type === "announcement"
      ? "bg-blue-50 dark:bg-blue-900/20 border-l-blue-500"
      : "bg-green-50 dark:bg-green-900/20 border-l-green-500";
  };

  return (
    <div
      className={`border-l-4 p-4 mb-3 rounded-r-lg transition-all duration-200 ${getBgColor()} ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getIcon()}
            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
              {notification.type === "announcement"
                ? "Announcement"
                : "New Content"}
            </span>
            {!notification.is_read && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </div>

          <h4
            className={`font-semibold mb-1 ${
              notification.is_read
                ? "text-gray-600 dark:text-gray-400"
                : "text-gray-800 dark:text-gray-100"
            }`}
          >
            {notification.title}
          </h4>

          <p
            className={`text-sm mb-2 ${
              notification.is_read
                ? "text-gray-500 dark:text-gray-500"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {notification.body}
          </p>

          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formatTimestamp(notification.created_at)}
          </span>
        </div>

        {!notification.is_read && (
          <button
            onClick={handleMarkAsRead}
            disabled={isLoading}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors"
            title="Mark as read"
          >
            <Check size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
