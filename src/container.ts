import { container } from 'tsyringe';

//External services
// In your dependency injection setup (e.g., src/infrastructure/di/container.ts)
import { IFileStorageService } from './infrastructure/external-services/contracts/IFileStorageService';
import { S3FileStorageService } from './infrastructure/external-services/implementations/S3FileStorageService';
import { GCSFileStorageService } from './infrastructure/external-services/implementations/GCFileStorageService';
import { initializeFirebase } from './cross_cutting/config';
import { FCMService } from './application/fcm_service';
import { UserService } from './application/user/services/UserService';
import { TopicService } from './application/topic/services/TopicService';
import { NotificationController } from './interfaces/http/controllers/notificationController';
import { UserController } from './interfaces/http/controllers/userController';
import { TopicController } from './interfaces/http/controllers/topicController';
import { DefaultNotificationProcessor } from './application/DefaultNotificationProcessor';
import { NotificationService } from './application/notification/service';
import { ConfluentCloudEngine } from './infrastructure/messaging/kafka/ConfluentCloudEngine';
import { ConfluentCloudConsumer } from './infrastructure/messaging/ConfluentCloudConsumer';
import { DefaultInternalNotificationEventDispatcher, NotificationEventDispatcher } from './application/NotificationEventDispatcher';
import { INotificationEventDispatcher, INotificationEventHandler, InternalNotificationEventDispatcher, InternalNotificationEventHandler } from './domain/notification/NotificationEvent';
import { ProfileCreatedEventHandler } from './application/event_handlers/external/ProfileCreatedEventHandler';
import { EmailNotificationRequestHandler } from './application/event_handlers/internal/EmailNotificationRequestHandler';
import { IEmailService } from './application/contracts/IEmailService';
import { SendGridEmailService } from './infrastructure/messaging/sendgrid/SendGridEmailService';

// Choose which implementation to use
// container.registerSingleton<IFileStorageService>('IFileStorageService', S3FileStorageService);
// Or, to use Google Cloud Storage:
// container.registerSingleton<IFileStorageService>('IFileStorageService', GCSFileStorageService);


// Register repositories
// container.registerSingleton<UserRepository>('UserRepository', MongoUserRepository);


// Register services
// container.registerSingleton<UserService>(UserService);


// Register use cases


// Register controllers

const firebaseApp = initializeFirebase();
container.register("FirebaseApp", { useValue: firebaseApp });

// Initialize ConfluentCloudEngine
const confluentCloudEngine = ConfluentCloudEngine.getInstance();
container.registerInstance(ConfluentCloudEngine, confluentCloudEngine);


// Register services
container.register<IEmailService>('EmailService', { useClass: SendGridEmailService });

container.register(FCMService, { useClass: FCMService });
container.registerSingleton<UserService>(UserService);
container.register(TopicService, { useClass: TopicService });

// Register controllers
container.register(NotificationController, { useClass: NotificationController });
container.registerSingleton<UserController>(UserController);
container.register(TopicController, { useClass: TopicController });


container.registerSingleton<DefaultNotificationProcessor>("NotificationEventProcessor", DefaultNotificationProcessor);
container.registerSingleton<INotificationEventDispatcher>("NotificationEventDispatcher", NotificationEventDispatcher);
container.registerSingleton<NotificationService>(NotificationService);  // This is a singleton because it has no state
container.registerSingleton<ConfluentCloudConsumer>(ConfluentCloudConsumer);


container.register<INotificationEventHandler>('NotificationEventHandler', { useClass: ProfileCreatedEventHandler });

// container.registerSingleton<DefaultNotificationProcessor>("NotificationEventProcessor", DefaultNotificationProcessor);
container.registerSingleton<InternalNotificationEventDispatcher>("InternalNotificationEventDispatcher", DefaultInternalNotificationEventDispatcher);

container.register<InternalNotificationEventHandler>('InternalNotificationEventHandler', { useClass: EmailNotificationRequestHandler });


export { container };