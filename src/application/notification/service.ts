import { inject, injectable } from "tsyringe";
import * as admin from 'firebase-admin';
import { Notification } from '../../domain/notification';
import { logger } from "../../cross_cutting/logging";
import { not } from "joi";
import { getFirestore } from "firebase-admin/firestore";

@injectable()
export class NotificationService {
    private firestore: admin.firestore.Firestore;
    constructor(@inject("FirebaseApp") private firebaseApp: admin.app.App) {
        // this.firestore = firebaseApp.firestore();
        this.firestore = getFirestore(firebaseApp, "swm-notifications");
    }

    async createNotification(notification: Notification): Promise<Notification> {
        //const notificationRef = this.firestore.collection('notifications').doc();

        //Note this return a promise with a WriteResult
        //   ...notification,
        //   createdAt: admin.firestore.FieldValue.serverTimestamp(),
        //   updatedAt: admin.firestore.FieldValue.serverTimestamp()
        // });

        //does not include id in store

        // const notificationRef = await this.firestore.collection('notifications').add({
        //     ...notification,
        //     createdAt: admin.firestore.FieldValue.serverTimestamp(),
        // });

        const notificationRef = this.firestore.collection('notifications').doc(); // Generate a new document reference
        const notificationWithId = {
            ...notification,
            id: notificationRef.id, // Include the document ID in the notification data
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await notificationRef.set(notificationWithId);

        logger.info(`Notification created: ${notificationRef.id}`);

        const notificationDoc = await notificationRef.get();
        return notificationDoc.data() as Notification;
    }

    async getNotificationById(id: string): Promise<Notification | undefined> {
        const notificationDoc = await this.firestore.collection('notifications').doc(id).get();
        if (!notificationDoc.exists) {
            return undefined;
        }
        return notificationDoc.data() as Notification;
    }

    async getNotificationsByUserId(userId: string, limit: number = 10, offset: number = 0): Promise<Notification[]> {
        // const notificationsQuery = await this.firestore.collection('notifications')
        // .where('relatedEntityId', '==', userId).get();
        // if (notificationsQuery.empty) {
        //     return [];
        // }
        // return notificationsQuery.docs.map(doc => doc.data() as Notification);

        //Support for pagination
        let notificationsQuery = this.firestore.collection('notifications')
            .where('relatedEntityId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(limit);

        if (offset > 0) {
            const offsetSnapshot = await this.firestore.collection('notifications')
                .where('relatedEntityId', '==', userId)
                .orderBy('createdAt', 'desc')
                .limit(offset)
                .get();

            if (!offsetSnapshot.empty) {
                const lastVisible = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
                notificationsQuery = notificationsQuery.startAfter(lastVisible);
            }
        }

        const snapshot = await notificationsQuery.get();
        if (snapshot.empty) {
            return [];
        }
        return snapshot.docs.map(doc => doc.data() as Notification);
    }

    async markNotificationAsSent(notificationId: string): Promise<Notification | undefined> {
        const notificationRef = this.firestore.collection('notifications').doc(notificationId);
        if (!notificationRef) {
            return undefined;
        }
        await notificationRef.update({
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        logger.info(`Notification marked as sent: ${notificationId}`);
        return this.getNotificationById(notificationId);
    }

    async markNotificationAsFailed(notificationId: string): Promise<Notification | undefined> {
        const notificationRef = this.firestore.collection('notifications').doc(notificationId);
        if (!notificationRef) {
            return undefined;
        }
        await notificationRef.update({
            status: 'failed',
        });
        logger.info(`Notification marked as sent: ${notificationId}`);
        return this.getNotificationById(notificationId);
    }

    async markNotificationAsRead(notificationId: string): Promise<Notification | undefined> {
        const notificationRef = this.firestore.collection('notifications').doc(notificationId);
        if (!notificationRef) {
            return undefined;
        }
        await notificationRef.update({
            isRead: true,
            readAt: admin.firestore.FieldValue.serverTimestamp()
        });
        logger.info(`Notification marked as read: ${notificationId}`);
        return this.getNotificationById(notificationId);
    }
}