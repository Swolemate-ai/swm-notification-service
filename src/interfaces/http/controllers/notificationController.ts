import { Request, Response } from 'express';
import { Notification } from '../../../domain/notification';
import { inject, injectable } from 'tsyringe';;
import { NotificationService } from '../../../application/notification/service';


@injectable()
export class NotificationController {

  // constructor(private notificationService: NotificationService) {}
  constructor(
    @inject(NotificationService) private notificationService: NotificationService,
  ) {}


  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;

      const notifications = await this.notificationService.getNotificationsByUserId(userId, limit, offset);
      res.json(notifications);
    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async markNotificationAsRead(req: Request, res: Response) {
    try {
      const notificationId = req.params.notificationId;
      const notification = await this.notificationService.markNotificationAsRead(notificationId);
      if (notification) {
        res.json(notification);
      } else {
        res.status(404).json({ error: 'Notification not found' });
      }
    } catch (error) {
      console.error('Error in markNotificationAsRead:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // async deleteNotification(req: Request, res: Response) {
  //   try {
  //     const notificationId = req.params.notificationId;
  //     await this.notificationService.deleteNotification(notificationId);
  //     res.status(204).send();
  //   } catch (error) {
  //     console.error('Error in deleteNotification:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // }
}