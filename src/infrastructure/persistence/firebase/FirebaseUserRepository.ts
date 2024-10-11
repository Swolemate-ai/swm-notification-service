import * as admin from 'firebase-admin';
import { User } from '../../../domain/user';
import { logger } from '../../../cross_cutting/logging';
import { inject, injectable } from 'tsyringe';
import { getFirestore } from 'firebase-admin/firestore';
import { UserRepository } from '../../../domain/user/UserRepository';

@injectable()
export class FirebaseUserRepository  implements UserRepository {
  private firestore: admin.firestore.Firestore;
  // private appdb: admin.firestore.Firestore;

  constructor(@inject("FirebaseApp") firebaseApp: admin.app.App) {
    // this.firestore = firebaseApp.firestore();
    this.firestore = getFirestore(firebaseApp, "swm-notifications");
  }

  async createUser(user: User): Promise<User> {
    const userRef = this.firestore.collection('users').doc(user.id);
    await userRef.set({
      ...user,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    logger.info(`User created: ${user.id}`);
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const userDoc = await this.firestore.collection('users').doc(id).get();
    if (!userDoc.exists) {
      return undefined;
    }
    return userDoc.data() as User;
  }

  // async getUserByProfileId(profileId: string): Promise<User | undefined> {
  //   const userQuery = await this.firestore.collection('users').where('profileId', '==', profileId).get();
  //   if (userQuery.empty) {
  //     return undefined;
  //   }
  //   return userQuery.docs[0].data() as User;
  // }

  async updateUserFCMToken(userId: string, token: string): Promise<User | undefined> {
    const userRef = this.firestore.collection('users').doc(userId);
    if (!userRef) {
      logger.error(`User not found: ${userId}`);
      return undefined;
    }
    await userRef.update({
      fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    logger.info(`Updated FCM token for user: ${userId}`);
    return this.getUserById(userId);
  }
}