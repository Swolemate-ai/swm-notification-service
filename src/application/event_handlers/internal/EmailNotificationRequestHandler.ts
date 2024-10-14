import { inject, injectable } from "tsyringe";
import { InternalEventDefinition, InternalNotificationEvent, InternalNotificationEventHandler } from "../../../domain/notification/NotificationEvent";
import { IEmailService } from "../../contracts/IEmailService";
import { NotificationService } from "../../notification/service";
import { UserService } from "../../user/services/UserService";
import { logger } from "../../../cross_cutting/logging";


@injectable()
export class EmailNotificationRequestHandler implements InternalNotificationEventHandler {
    public readonly internalEventType =  InternalEventDefinition.EMAIL_NOTIFICATION;

    constructor(
        @inject(NotificationService) private notificationService: NotificationService,
        @inject(UserService)private userService: UserService,
        @inject('EmailService') private emailService: IEmailService) {}

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
        logger.info(`Sending email to ${user.email} with subject: ${notification.title}`);
        // Simulate sending email
        await this.emailService.sendEmail(user.email, notification.title, notification.content);
        // await new Promise(resolve => setTimeout(resolve, 100));
        logger.info(`Email sent to ${user.email}`);
        await this.notificationService.markNotificationAsSent(notification.id);
    }
}