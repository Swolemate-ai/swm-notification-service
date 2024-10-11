import * as admin from 'firebase-admin';
import { User } from '../../../domain/user';
import { logger } from '../../../cross_cutting/logging';
import { inject, injectable } from 'tsyringe';
import { getFirestore } from 'firebase-admin/firestore';
import { UserRepository } from '../../../domain/user/UserRepository';

@injectable()
export class UserService {

  constructor(@inject("UserRepository") private userRepo: UserRepository) {
  }

  async createUser(user: User): Promise<User> {
    return await this.userRepo.createUser(user);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return await this.userRepo.getUserById(id);
  }

  async updateUserFCMToken(userId: string, token: string): Promise<User | undefined> {
    return await this.userRepo.updateUserFCMToken(userId, token);
  }
}