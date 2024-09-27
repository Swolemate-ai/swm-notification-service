import { Notification } from "./Notification";

export interface NotificationRepository{
    getUserNotifications(userId: string, limit: number, offset: number): Promise<Notification[]>;
    saveNotification(notification: Notification): Promise<Notification>;
    markNotificationAsRead(notificationId: string): Promise<Notification | null>;
    deleteNotification(notificationId: string): Promise<void>;
}