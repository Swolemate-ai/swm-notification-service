import { inject, injectable } from "tsyringe";
import { INotificationEvent, INotificationEventHandler, InternalEventDefinition, InternalNotificationEvent, InternalNotificationEventDispatcher } from "../../../domain/notification/NotificationEvent";
import { NotificationDefinition, Notification } from "../../../domain/notification";
import { UserService } from "../../user/services/UserService";
import { NotificationService } from "../../notification/service";


@injectable()
export class MatchEventHandler implements INotificationEventHandler{
    public readonly eventType = NotificationDefinition.MATCH_REQUEST_ACCEPTED;

    constructor(
        @inject(NotificationService) private notificationService: NotificationService,
        @inject(UserService) private userService: UserService,
        @inject("InternalNotificationEventDispatcher") private dispatcher: InternalNotificationEventDispatcher
    ) {}

    async handle(event: INotificationEvent): Promise<void> {

        const internalEvents = new Set<InternalEventDefinition>();

         //Get User
         const user = await this.userService.getUserById(event.payload.profileId);
         const requestor = await this.userService.getUserById(event.payload.matchedProfileId);
         if (!user) {
            throw new Error(`User with id ${event.payload.profileId} not found`);
        }

        if (!requestor) {
            throw new Error(`User with id ${event.payload.matchedProfileId} not found`);
        }
        //Create Notification in the database
        const notification : Notification = {
            id: '',
            relatedEntityId: event.payload.receivedProfileId,
            type: this.eventType,
            title: 'New Fitness Partner Match',
            content: `You have a new fitness partner: ${requestor.displayName}`,
            isRead: false,
            status: 'pending'
        }


        if(user.notificationPreferences?.emailNotifications === true) {
            internalEvents.add(InternalEventDefinition.EMAIL_NOTIFICATION);
        }
        if(user.notificationPreferences.pushNotifications === true) {
            if(user.fcmTokens && user.fcmTokens.length > 0) {
                notification.token = user.fcmTokens[0];
                internalEvents.add(InternalEventDefinition.PUSH_NOTIFICATION);

            }
        }

        if(internalEvents.size > 0) {
            const createdNotification = await this.notificationService.createNotification(notification);
            internalEvents.forEach(async (event) => {
                await this.dispatcher.dispatch(new InternalNotificationEvent(createdNotification.id, event));
            });
            return;
        }

        await this.notificationService.createNotification(notification);

        //Issue Email and Push Notification
    }
}