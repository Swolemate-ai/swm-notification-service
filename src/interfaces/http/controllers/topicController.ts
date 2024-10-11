import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { TopicService } from '../../../application/topic/services/TopicService';
// import { FCMService } from '../../../application/fcm_service';
import { Topic } from '../../../domain/topic';
import { logger } from '../../../cross_cutting/logging';
import { ExternalPublishingService } from '../../../application/ExternalPublishingService';


@injectable()
export class TopicController {
  constructor(
    @inject(TopicService) private topicService: TopicService,
    @inject('ExternalPublishingService') private publishingService: ExternalPublishingService
  ) {}


  createTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      const topicData: Topic = req.body;
      const newTopic = await this.topicService.createTopic(topicData);
      res.status(201).json(newTopic);
    } catch (error) {
      logger.error('Error creating topic:', error);
      res.status(500).json({ error: 'Failed to create topic' });
    }
  };

  getTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      const topicId = req.params.id;
      const topic = await this.topicService.getTopicById(topicId);
      if (topic) {
        res.status(200).json(topic);
      } else {
        res.status(404).json({ error: 'Topic not found' });
      }
    } catch (error) {
      logger.error('Error getting topic:', error);
      res.status(500).json({ error: 'Failed to get topic' });
    }
  };

  subscribeToTopic = async (req: Request, res: Response): Promise<void> => {
    try {
      const { topicId, tokens } = req.body;
      const topic = await this.topicService.getTopicById(topicId);
      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }

      await this.publishingService.subscribeToTopic(tokens, topic.name);
      await this.topicService.incrementSubscriberCount(topicId);

      res.status(200).json({ message: 'Successfully subscribed to topic' });
    } catch (error) {
      logger.error('Error subscribing to topic:', error);
      res.status(500).json({ error: 'Failed to subscribe to topic' });
    }
  };
}