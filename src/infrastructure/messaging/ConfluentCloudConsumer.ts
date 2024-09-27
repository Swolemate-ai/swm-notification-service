import { inject, injectable } from "tsyringe";
import { ConfluentCloudEngine } from "./kafka/ConfluentCloudEngine";
import { NotificationEventProcessor } from "../../domain/notification/NotificationEvent";
import { logger } from "../../cross_cutting/logging";



@injectable()
export class ConfluentCloudConsumer {

    constructor(
        @inject(ConfluentCloudEngine) private kafkaEngine: ConfluentCloudEngine,
        @inject('NotificationEventProcessor') private processor: NotificationEventProcessor) { }

    async start(topics: string[]): Promise<void> {
        for (const topic of topics) {
            await this.consumeTopic(topic);
        }
    }


    async consumeTopic(topic: string): Promise<void> {
        try {
            await this.kafkaEngine.consume(topic, async (message) => {
                try {
                    const event = JSON.parse(message.value!.toString());
                    await this.processor.process(event);
                } catch (error) {
                    logger.error(`Error processing message from topic ${topic}:`, error);
                    // Implement your error handling strategy here (e.g., dead-letter queue)
                }
            });
        } catch (error) {
            logger.error(`Error consuming from topic ${topic}:`, error);
            // Implement your error handling strategy here (e.g., retry logic)
        }
    }

}