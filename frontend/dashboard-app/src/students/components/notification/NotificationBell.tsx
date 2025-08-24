import type { NotificationData } from '@/Shared/lib/type';
import { Bell } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import NotificationModel from './NotificationModel';
import { useNotificationApi } from '@/students/Api/notification.Api';

const NotificationBell = () => {
    const [openModel, setOpenModel] = useState(false);
      const [notifications, setNotifications] = useState<NotificationData[] | null>(
        null
      );
      const [loading, setLoading] = useState(false);
      const { getUserNotifications } = useNotificationApi()
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        const data = await getUserNotifications();
        if (data) {
          setNotifications(data);
        }
        setLoading(false);
      };
      fetchData();
    }, [getUserNotifications]);
      const NonReadNotification = notifications?.filter(
        (notification) => !notification.is_read
      );

  return (
    <div>
      <button
        onClick={() => setOpenModel(true)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        {NonReadNotification && NonReadNotification.length > 0 && (
              <div className="absolute -top-1 -right-1">
                <span className="block h-3 w-3 rounded-full bg-red-500  " />
              </div>
            )}
            <Bell className="text-gray-800 dark:text-white w-5 h-5 md:w-6 md:h-6" />
    </button>

    <div className=" absolute top-10 right-10">
    {openModel && (
        <NotificationModel
        loading={loading}
        notifications={notifications}
        close={() => setOpenModel(false)}
        setNotifications={setNotifications}
        />
    )}
    </div>
    </div>
  )
}

export default React.memo(NotificationBell)