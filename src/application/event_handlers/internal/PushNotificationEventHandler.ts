import { inject, injectable } from "tsyringe";
import { InternalEventDefinition, InternalNotificationEvent, InternalNotificationEventHandler } from "../../../domain/notification/NotificationEvent";
import { NotificationService } from "../../notification/service";
import { UserService } from "../../user/services/UserService";
import { FCMService } from "../../fcm_service";
import { logger } from "../../../cross_cutting/logging";


@injectable()
export class PushNotificationRequestHandler implements InternalNotificationEventHandler {
    public readonly internalEventType =  InternalEventDefinition.PUSH_NOTIFICATION;

    constructor(
        @inject(NotificationService) private notificationService: NotificationService,
        @inject(UserService)private userService: UserService,
        @inject(FCMService) private fcmService: FCMService) {}

    async handle(event: InternalNotificationEvent): Promise<void> {
        // Grab notification details from the event and send email
        const notification = await this.notificationService.getNotificationById(event.notificationId);

        if (!notification) {
            throw new Error(`Notification with id ${event.notificationId} not found`);
        }
        const user  = await this.userService.getUserById(notification.relatedEntityId);

        if (!user) {
            throw new Error(`User with id ${notification.relatedEntityId} not found`);
        }
        // In a real implementation, this would integrate with an email service
        logger.info(`Sending Push Notofication to ${user.email} with subject: ${notification.title}`);
        // Simulate sending email
        if (!user.fcmTokens) {
            logger.info(`User ${user.email} does not have any FCM tokens`);
            return;
        }
        if(user.notificationPreferences?.pushNotifications === false) {
            logger.info(`User ${user.email} has disabled push notifications`);
            return;
        }
        for (const token of user.fcmTokens) {
            await this.fcmService.sendNotificationToToken(notification, token);
        }
        
        // await new Promise(resolve => setTimeout(resolve, 100));
        logger.info(`Push Notification sent to ${user.email}`);
        await this.notificationService.markNotificationAsSent(notification.id);
    }
}