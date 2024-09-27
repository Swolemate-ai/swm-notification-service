import { container } from "../../../container";
import { Router } from "express";
import { NotificationController } from "../controllers/notificationController";


const router = Router();

const notificationController = container.resolve(NotificationController);



router.get('/user', notificationController.getUserNotifications);
router.put('/markread', notificationController.markNotificationAsRead);

export default router;