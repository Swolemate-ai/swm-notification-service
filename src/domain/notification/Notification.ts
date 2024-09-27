import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { InternalEventDefinition, InternalNotificationEvent } from "./NotificationEvent";



export enum NotificationDefinition {
    PROFILE_REGISTERED = 'profile.registered',
    PROFILE_UPDATED = 'profile.updated',
    PROFILE_DELETED = 'profile.deleted',
    MATCH_REQUEST = 'match.request',
    MATCH_REQUEST_ACCEPTED = 'match.request.accepted',
    NEW_MESSAGE = 'new.message',
    WORKOUT_REMINDER = 'workout.reminder',

}

export interface Notification {
    id: string;
    type: NotificationDefinition;
    title: string;
    content: string;
    relatedEntityId: string;
    createdAt?: Timestamp | FieldValue;
    data?: Record<string, string>;
    readAt?: Timestamp | FieldValue;
    sentAt?: Timestamp | FieldValue;
    isRead: boolean;
    topic?: string;
    token?: string;
    status: 'pending' | 'sent' | 'failed';
}

//   export interface Notification {
//     id: string;
//     title: string;
//     body: string;
//     data?: Record<string, string>;
//     topic?: string;
//     token?: string;
//     sentAt: Timestamp;
//     status: 'pending' | 'sent' | 'failed';
//   }

// export class NewNotificationEvent extends InternalNotificationEvent{
//     constructor(public readonly notification: Notification) {
//         super(notification.id, InternalEventDefinition.EMAIL_NOTIFICATION);
//     }
// }