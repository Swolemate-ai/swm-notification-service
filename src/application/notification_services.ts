// import { KafkaEngine} from '../infrastructure/messaging/kafka';
// import { FirebaseCloudMessagingService } from './fcm.service';
// import { Notification, NotificationType, NotificationEvent } from './types';
// import { NotificationModel } from './notification.model';
// import { UserModel } from '../users/user.model';
// import { EmailService } from '../email/email.service';

// export class NotificationService {
//   constructor(
//     private kafkaService: KafkaEngine,
//     private fcmService: FirebaseCloudMessagingService,
//     private emailService: EmailService
//   ) {}

//   async start() {
//     await this.kafkaService.connect();
//     await this.kafkaService.consume('notification-events', async (message) => {
//       const event: NotificationEvent = JSON.parse(message.value!.toString());
//       await this.processEvent(event);
//     });
//   }

//   async stop() {
//     await this.kafkaService.disconnect();
//   }

//   private async processEvent(event: NotificationEvent) {
//     try {
//       switch (event.type) {
//         case 'MATCH_REQUEST_SENT':
//           await this.createNotification({
//             id: uuidv4(),
//             userId: event.payload.receiverId,
//             type: NotificationType.MATCH_REQUEST,
//             content: `You have a new match request from ${event.payload.senderName}`,
//             relatedEntityId: event.payload.requestId,
//             createdAt: new Date(),
//             isRead: false,
//           });
//           break;
//         // Handle other event types...
//         default:
//           console.warn(`Unhandled event type: ${event.type}`);
//       }
//     } catch (error) {
//       console.error(`Error processing event ${event.type}:`, error);
//       // Implement retry logic or dead-letter queue here
//     }
//   }

//   async createNotification(notification: Notification) {
//     try {
//       const savedNotification = await this.saveNotificationToDb(notification);

//       const user = await UserModel.findById(notification.userId);
//       if (!user) {
//         throw new Error(`User not found: ${notification.userId}`);
//       }

//       if (user.deviceToken && user.notificationPreferences.pushEnabled) {
//         await this.fcmService.sendPushNotification(savedNotification, user.deviceToken);
//       }

//       if (user.notificationPreferences.emailEnabled) {
//         await this.sendEmailNotification(savedNotification, user.email);
//       }

//       return savedNotification;
//     } catch (error) {
//       console.error('Error creating notification:', error);
//       throw error;
//     }
//   }

//   // ... (rest of the methods remain the same)
// }
