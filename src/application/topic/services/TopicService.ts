import * as admin from 'firebase-admin';
import { Topic } from '../../../domain/topic';
import { logger } from '../../../cross_cutting/logging';
import { inject, injectable } from 'tsyringe';

@injectable()
export class TopicService {
  private firestore: admin.firestore.Firestore;

  constructor(@inject("FirebaseApp") firebaseApp: admin.app.App) {
    this.firestore = firebaseApp.firestore();
  }

  async createTopic(topic: Topic): Promise<Topic> {
    const topicRef = this.firestore.collection('topics').doc(topic.id);
    await topicRef.set({
      ...topic,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    logger.info(`Topic created: ${topic.id}`);
    return topic;
  }

  async getTopicById(id: string): Promise<Topic | undefined> {
    const topicDoc = await this.firestore.collection('topics').doc(id).get();
    if (!topicDoc.exists) {
      return undefined;
    }
    return topicDoc.data() as Topic;
  }

  async incrementSubscriberCount(topicId: string): Promise<Topic | undefined> {
    const topicRef = this.firestore.collection('topics').doc(topicId);
    await topicRef.update({
      subscriberCount: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    logger.info(`Incremented subscriber count for topic: ${topicId}`);
    return this.getTopicById(topicId);
  }
}