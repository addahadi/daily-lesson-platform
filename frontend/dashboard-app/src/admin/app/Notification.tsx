import type { NotificationType } from "@/lib/adminType";
import { NotificationList } from "../components/notification/NotificationList";
import React, {
  useEffect,
  useState,
  type SetStateAction,
} from "react";
import { Button } from "@/components/ui/button";
import { Bell, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useNotificationApi from "../api/notification";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import EmptyCase from "@/components/empty/EmptyCase";

const Notification = () => {
  const [isCreate, setIsCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [Edit , setEdit] = useState<NotificationType | null>(null)
  const { getCourseNotifications, deleteNotification , createUserNotification} = useNotificationApi();
  const [page , setPage] = useState(1)
  const [showMore , setShowMore] = useState(false)
  const fetchNotifications = async (currentPage: number) => {
    setLoading(true);
    const result = await getCourseNotifications(currentPage);
    if (result && result.data) {
      console.log(result)
      setNotifications((prev) => {
        if (result.data && prev) {
          const updatedResult = [...prev, ...result.data];
          return currentPage === 1 ? result.data : updatedResult;
        }
        return prev;
      });

      if (result.final !== undefined) setShowMore(result.final);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications(1);
  }, [getCourseNotifications]);

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };


  
  const handleNotificationCreated = (newNotification: NotificationType) => {
    setNotifications((prev) => [newNotification, ...prev]);
    setIsCreate(false);
  };

  const handleNotificationUpdated = (updatedNotification : NotificationType) => {
    setNotifications((prev) => {
      return prev.map((notification) => {
        if(notification.id === updatedNotification.id){
          return updatedNotification
        }
        return notification
      })
    })
    setEdit(null)
    setIsCreate(false)
  }

  const handleDeleteNotification = async (DeletedNotification : NotificationType) => {  
    const response = await deleteNotification(DeletedNotification.id)
    if(response){
      setNotifications((prev) => {
        return prev.filter((notification) => {
          return notification.id != DeletedNotification.id
        })
      })
      return
    }
  }
  return (
    <div className="min-h-screen  bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="">
        <div className=" w-full px-6 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Notifications
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Send updates and announcements to your users
            </p>
          </div>
          <Button
            onClick={() => setIsCreate(true)}
            variant="destructive"
            className="flex flex-row gap-2 items-center bg-gray-800 text-white"
          >
            <Plus className=" w-4 h-4" />
            <span>New Notification</span>
          </Button>
        </div>
      </header>
      <section className=" p-6">
        {(isCreate || Edit !== null) && (
          <div className="flex justify-center items-center mt-4 mb-8">
            <CreateNotification
              setIsCreate={setIsCreate}
              Edit={Edit}
              close={() => {
                setIsCreate(false);
                setEdit(null);
              }}
              onNotificationCreated={handleNotificationCreated}
              onNotificationUpdated={handleNotificationUpdated}
            />
          </div>
        )}
        <div>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">
                Loading notifications...
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <EmptyCase
              title="No Notifications Yet"
              description="You haven’t create any notifications to users. When you do, they’ll appear here for tracking and management."
              icon={
                <Bell className="w-6 h-6" />
              }
              color="blue"
            />
          ) : (
            <NotificationList
              notifications={notifications}
              OpenEdit={setEdit}
              onDelete={handleDeleteNotification}
              createUserNotification={createUserNotification}
            />
          )}
        </div>
      </section>
      {showMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={handleShowMore} variant="outline">
            Show More Users
          </Button>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default Notification;

type CreateNotificationType = {
  setIsCreate: React.Dispatch<SetStateAction<boolean>>;
  close: () => void;
  onNotificationCreated: (notification: NotificationType) => void;
  Edit: NotificationType | null;
  onNotificationUpdated : (notification: NotificationType) => void; 
};

function CreateNotification({
  close,
  onNotificationCreated,
  Edit,
  onNotificationUpdated
}: CreateNotificationType) {
  const [notificationInfo, setNotificationInfo] = useState({
    id : Edit?.id || "",
    type: Edit?.type  || "",
    title: Edit?.title || "",
    message: Edit?.body || "",
    sent_to: Edit?.sent_to || "",
    content_type: Edit?.content_type || "",
    course_id: Edit?.course_id || "",
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getCoursesId, createNotification , updateNotification } = useNotificationApi();

  function handleChange(type: string, value: string) {
    setNotificationInfo((prev) => {
      return {
        ...prev,
        [type]: value,
      };
    });
  }

  const handleSubmit = async () => {
    if (
      !notificationInfo.type ||
      !notificationInfo.title ||
      !notificationInfo.message ||
      !notificationInfo.sent_to
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      notificationInfo.sent_to === "enrolled_users" &&
      notificationInfo.content_type !== "course" &&
      !notificationInfo.course_id
    ) {
      toast.error("Please select a course for enrolled users");
      return;
    }

    setIsSubmitting(true);

    if (Edit) {
      const updatedNotification = await updateNotification(
        notificationInfo,
        notificationInfo.id
      );
      if (updatedNotification) {
        onNotificationUpdated(updatedNotification);
        toast.success("Notification updated successfully");
      }
    } else {
      const newNotification = await createNotification(notificationInfo);
      if (newNotification) {
        onNotificationCreated(newNotification);
        toast.success("Notification created successfully");
      }
    }

    setNotificationInfo({
      type: "",
      title: "",
      message: "",
      sent_to: "",
      content_type: "",
      course_id: "",
      id: "",
    });

    setIsSubmitting(false);
  };

  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getCoursesId();
        if (data) {
          setCourses(data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getCoursesId]);

  return (
    <Card className="w-full max-w-2xl mx-auto dark:bg-gray-800 bg-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>New Notification</CardTitle>
        <Button variant="ghost" size="icon" onClick={close}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className=" flex flex-col gap-4">
        <div>
          <Label>Type *</Label>
          <Select
            value={notificationInfo.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger className=" dark:bg-gray-700">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className=" dark:bg-gray-700">
              <SelectItem value="new_content">New Content</SelectItem>
              <SelectItem value="announcement">Announcement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {notificationInfo.type === "new_content" && (
          <div>
            <Label>Content Type *</Label>
            <Select
              value={notificationInfo.content_type}
              onValueChange={(value) => handleChange("content_type", value)}
            >
              <SelectTrigger className=" dark:bg-gray-700">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent className=" dark:bg-gray-700">
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="module">Module</SelectItem>
                <SelectItem value="lesson">Lesson</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div>
          <Label>Title *</Label>
          <Input
            className=" dark:bg-gray-700"
            placeholder="Enter a title"
            value={notificationInfo.title}
            onChange={(e) => {
              handleChange("title", e.target.value);
            }}
          />
        </div>
        <div>
          <Label>Message *</Label>
          <Textarea
            className=" dark:bg-gray-700"
            placeholder="Enter a message"
            value={notificationInfo.message}
            onChange={(e) => {
              handleChange("message", e.target.value);
            }}
          />
        </div>
        <div>
          <Label>Send to *</Label>
          <Select
            value={notificationInfo.sent_to}
            onValueChange={(value) => handleChange("sent_to", value)}
          >
            <SelectTrigger className=" dark:bg-gray-700">
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>
            <SelectContent className=" dark:bg-gray-700">
              <SelectItem value="all_users">All users</SelectItem>
              <SelectItem
                value="enrolled_users"
                disabled={
                  notificationInfo.type !== "new_content" ||
                  notificationInfo.content_type === "course"
                }
              >
                Enrolled Users
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        { notificationInfo.type !== "announcement"        
        && <div>
          <Label>Course *</Label>
          <Select
            value={notificationInfo.course_id}
            onValueChange={(value) => handleChange("course_id", value)}
          >
            <SelectTrigger className=" dark:bg-gray-700">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent className=" dark:bg-gray-700">
              {loading ? (
                <SelectItem value="loading" disabled>
                  Loading courses...
                </SelectItem>
              ) : courses && courses.length > 0 ? (
                courses.map((course: any) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  No courses available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        }
        <Button
          variant="destructive"
          className=" text-white bg-gray-900 mt-4 dark:bg-blue-600"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </Button>
      </CardContent>
    </Card>
  );
}
