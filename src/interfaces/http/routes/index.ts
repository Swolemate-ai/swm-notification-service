import { Router } from "express";
import userRoutes from "./user_routes";
import topicRoutes from "./topic_routes";
import notificationRoutes from "./notification_routes";



const router = Router();

router.use('/users', userRoutes);
router.use('/topics', topicRoutes);
router.use('/notifications', notificationRoutes);

export default router;