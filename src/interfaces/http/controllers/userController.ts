import { Request, Response } from 'express';
import { UserService } from '../../../application/user/services/UserService';
import { logger } from '../../../cross_cutting/logging';
import { User } from '../../../domain/user';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UserController {
  constructor(@inject(UserService) private userService: UserService) {}


  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: User = req.body;
      const newUser = await this.userService.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      logger.error('Error creating user:', error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  };

  getUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error('Error getting user:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  };

  updateUserFCMToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, token } = req.body;
      const profile = req.userProfile;
      const updatedUser = await this.userService.updateUserFCMToken(profile.id, token);
      if (updatedUser) {
        res.status(200).json({ message: 'FCM token updated' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error('Error updating user FCM token:', error);
      res.status(500).json({ error: 'Failed to update user FCM token' });
    }
  };
}