import { Notification } from "../domain/notification";

export interface PushNotificationService {
    sendNotificationToToken(notification: Notification, token: string): Promise<string>;
    sendNotificationToTopic(notification: Notification, topic: string): Promise<string>;
}