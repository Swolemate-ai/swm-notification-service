import { Router } from "express";
import userRoutes from "./user_routes";
import topicRoutes from "./topic_routes";
import notificationRoutes from "./notification_routes";
import { createFirebaseAuthMiddleware } from "../middlewares/firebaseAuthMiddleware";
import { container } from "../../../container";



const router = Router();
const authMiddleware = createFirebaseAuthMiddleware(container);

router.use('/users', authMiddleware, userRoutes);
router.use('/topics', topicRoutes);
router.use('/notifications', authMiddleware, notificationRoutes);

export default router;