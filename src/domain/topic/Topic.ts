import { Timestamp } from 'firebase-admin/firestore';

export interface Topic {
    id: string;
    name: string;
    description: string;
    subscriberCount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }