import { Notification } from "./Notification";

export interface NotificationRepository{
    createNotification(notification: Notification): Promise<Notification>;
    getNotificationById(id: string): Promise<Notification | undefined>;
    getNotificationsByUserId(userId: string, limit: number, offset: number): Promise<Notification[]>;
    markNotificationAsRead(notificationId: string): Promise<Notification | undefined>;
    markNotificationAsSent(notificationId: string): Promise<Notification | undefined>;
    markNotificationAsFailed(notificationId: string): Promise<Notification | undefined>;
}