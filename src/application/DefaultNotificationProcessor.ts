import { inject, injectable } from "tsyringe";
import { INotificationEvent, INotificationEventDispatcher, NotificationEventProcessor } from "../domain/notification/NotificationEvent";
import { logger } from "../cross_cutting/logging";


@injectable()
export class DefaultNotificationProcessor implements NotificationEventProcessor {
  constructor(
    @inject("NotificationEventDispatcher") private dispatcher: INotificationEventDispatcher
  ) {}

  async process(event: INotificationEvent): Promise<void> {
    //log the event
    await this.dispatcher.dispatch(event);
  }

  // private async handleProfileCreated(event: INotificationEvent): Promise<void> {
  //   const { profileId, email } = event.payload;
  //   await this.notificationService.sendEmail(
  //     email,
  //     "Welcome to Swolemate!",
  //     "Your profile has been created successfully."
  //   );
  // }

  // private async handleMatchRequestAccepted(event: INotificationEvent): Promise<void> {
  //   const { senderProfileId, receiverProfileId } = event.payload;
  //   await this.notificationService.sendPushNotification(
  //     senderProfileId,
  //     "Match Request Accepted",
  //     "Your match request has been accepted!"
  //   );
  //   await this.notificationService.sendPushNotification(
  //     receiverProfileId,
  //     "New Match",
  //     "You have a new match!"
  //   );
  // }
}