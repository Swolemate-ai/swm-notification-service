import { Router } from "express";
import { container } from "../../../container";
import { TopicController } from "../controllers/topicController";


const router = Router();

const topicController = container.resolve(TopicController);


router.post('/', topicController.createTopic);
router.get('/:id', topicController.getTopic);
router.post('/subscribe', topicController.subscribeToTopic);
router.post('/consume', topicController.consumeMessage);

export default router;