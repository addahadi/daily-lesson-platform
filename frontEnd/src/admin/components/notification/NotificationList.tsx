import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { NotificationType } from '@/lib/adminType';
import { Edit, Trash2 } from 'lucide-react';
import type { SetStateAction } from 'react';
import type React from 'react';


interface NotificationListProps {
  notifications: NotificationType[];
  OpenEdit: React.Dispatch<SetStateAction<NotificationType | null>>;
  onDelete: (notification: NotificationType) => void;
}

export function NotificationList({ notifications, OpenEdit, onDelete }: NotificationListProps) {
  const getTypeDisplay = (type: string) => {
    return type === 'new_content' ? 'Content' : 'Announcement';
  };

  const getTargetDisplay = (notification: NotificationType) => {
    switch (notification.sent_to) {
      case 'all_users':
        return 'All Users';
      case 'enrolled_users':
        return 'Enrolled Users';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {notifications.length === 0 ? (
        <Card className="border border-border shadow-none">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No notifications sent yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className="border border-border shadow-none"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          {getTypeDisplay(notification.type)}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <h3 className="font-medium text-foreground leading-tight">
                        {notification.title}
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {notification.body}
                    </p>

                    <Badge>{getTargetDisplay(notification)}</Badge>
                  </div>
                  <div className=" flex flex-row gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(notification)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => OpenEdit(notification)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}