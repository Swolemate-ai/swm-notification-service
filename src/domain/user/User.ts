import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export interface User {
    id: string;
    email: string;
    displayName: string;
    fcmTokens?: string[];
    notificationPreferences: NotificationPreferences;
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
  }

  export interface NotificationPreferences {
    emailNotifications: boolean;
    pushNotifications: boolean;
    topics: string[];
  }