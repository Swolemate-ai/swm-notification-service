import { Router } from "express";
import { container } from "../../../container";
import { TopicController } from "../controllers/topicController";


const router = Router();

const topicController = container.resolve(TopicController);


router.post('/topics', topicController.createTopic);
router.get('/topics/:id', topicController.getTopic);
router.post('/topics/subscribe', topicController.subscribeToTopic);

export default router;