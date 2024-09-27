import { inject, injectable } from "tsyringe";
import { IInternalNotificationEvent, 
  INotificationEvent, 
  INotificationEventHandler, 
  InternalEventDefinition, 
  InternalNotificationEvent, 
  InternalNotificationEventDispatcher } from "../../../domain/notification/NotificationEvent";
import { NotificationDefinition, Notification } from "../../../domain/notification";
import { logger } from "../../../cross_cutting/logging";
import { UserService } from "../../user/services/UserService";
import { User } from "../../../domain/user";
import { FieldValue } from "firebase-admin/firestore";
import { NotificationService } from "../../notification/service";

@injectable()
export class ProfileCreatedEventHandler implements INotificationEventHandler {
 public readonly eventType = NotificationDefinition.PROFILE_REGISTERED;

 constructor(
  @inject(UserService) private userService: UserService,
  @inject(NotificationService) private notificationService: NotificationService,
  @inject("InternalNotificationEventDispatcher") private dispatcher: InternalNotificationEventDispatcher
) {}

  async handle(event: INotificationEvent): Promise<void> {
    logger.info('Handling ProfileCreated event');
    // Implementation for handling ProfileCreated event

    //Create user in with DB
    const user: User = {
      id: event.payload.id,
      email: event.payload.email,
      displayName: event.payload.name,
      notificationPreferences:{
        emailNotifications: true,
        pushNotifications: true,
        topics: [ 
          NotificationDefinition.MATCH_REQUEST, 
          NotificationDefinition.MATCH_REQUEST_ACCEPTED,]
      }
    }
    const newUser = await this.userService.createUser(user);

    //Create notification in the database
    const notification : Notification = {
      id: '',
      relatedEntityId: newUser.id,
      type: this.eventType,
      title: 'Welcome to Swolemate!',
      content: `Welcome to Swolemate! Your profile has been created successfully.`,
      createdAt: FieldValue.serverTimestamp(),
      isRead: false,
      status: 'pending'
    }

    const createdNotification = await this.notificationService.createNotification(notification);

    const newInternalNotificationEvent: IInternalNotificationEvent =
    new InternalNotificationEvent(createdNotification.id, InternalEventDefinition.EMAIL_NOTIFICATION);

    //Dispatch the event
    await this.dispatcher.dispatch(newInternalNotificationEvent);
  }
}