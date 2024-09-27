import { Kafka, Producer, Consumer, Message, KafkaConfig } from 'kafkajs';
import { kafkaConfig } from '../../../cross_cutting/config/messaging';

export class KafkaEngine {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor() {
    this.kafka = new Kafka(kafkaConfig as KafkaConfig);
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'notification-service' });
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async produce(topic: string, message: string) {
    await this.producer.send({
      topic,
      messages: [{ value: message }],
    });
  }

  async consume(topic: string, callback: (message: Message) => Promise<void>) {
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        await callback(message);
      },
    });
  }
}