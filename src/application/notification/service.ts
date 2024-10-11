import { inject, injectable } from "tsyringe";
import * as admin from 'firebase-admin';
import { Notification, NotificationRepository } from '../../domain/notification';
import { logger } from "../../cross_cutting/logging";
import { not } from "joi";
import { getFirestore } from "firebase-admin/firestore";

@injectable()
export class NotificationService {
    
    constructor(@inject("NotificationRepository") private notificationRepository: NotificationRepository) {}

    async createNotification(notification: Notification): Promise<Notification> {
        return await this.notificationRepository.createNotification(notification);
    }

    async getNotificationById(id: string): Promise<Notification | undefined> {
       return await this.notificationRepository.getNotificationById(id);
    }

    async getNotificationsByUserId(userId: string, limit: number = 10, offset: number = 0): Promise<Notification[]> {
        const snapshot = await this.notificationRepository.getNotificationsByUserId(userId, limit, offset);
        return snapshot;
    }

    async markNotificationAsSent(notificationId: string): Promise<Notification | undefined> {
        return await this.notificationRepository.markNotificationAsSent(notificationId);
    }

    async markNotificationAsFailed(notificationId: string): Promise<Notification | undefined> {
        return await this.notificationRepository.markNotificationAsFailed(notificationId);
    }

    async markNotificationAsRead(notificationId: string): Promise<Notification | undefined> {
       return await this.notificationRepository.markNotificationAsRead(notificationId);
    }
}