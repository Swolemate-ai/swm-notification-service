import { Consumer, Kafka, logLevel, Message, Producer, ProducerRecord, SASLOptions } from "kafkajs";
import { injectable } from "tsyringe";
import { kafkaConfig } from "../../../cross_cutting/config";
import { logger } from "../../../cross_cutting/logging";
import { INotificationEvent } from "../../../domain/notification/NotificationEvent";

type PlainSASLConfig = {
  mechanism: 'plain';
  username: string;
  password: string;
};


function isPlainSASLConfig(config: any): config is PlainSASLConfig {
  return config && config.mechanism === 'plain' && 'username' in config && 'password' in config;
}

@injectable()
export class ConfluentCloudEngine {
  private producer: Producer;
  private consumer: Consumer;
  // private schemaRegistry: SchemaRegistry;

  private static instance: ConfluentCloudEngine;

  constructor() {
    if (!kafkaConfig.sasl) {
      throw new Error("Kafka configuration is missing SASL credentials");
    }
    if (!isPlainSASLConfig(kafkaConfig.sasl)) {
      throw new Error('Invalid SASL configuration: expected plain mechanism with username and password');
    }

    const sasl: SASLOptions = {
      mechanism: 'plain',
      username: kafkaConfig.sasl.username,
      password: kafkaConfig.sasl.password
    };

    const kafka = new Kafka({
      clientId: 'swolemate-notification-service',
      brokers: kafkaConfig.brokers,
      ssl: true,
      sasl,
      logLevel: logLevel.INFO
    });

    this.producer = kafka.producer({
      allowAutoTopicCreation: true,
    });
    this.consumer = kafka.consumer({ groupId: 'notification-service' });
    // this.consumer = kafka.consumer({ groupId: 'profile.registered' });
  }


  public static getInstance(): ConfluentCloudEngine {
    if (!ConfluentCloudEngine.instance) {
      ConfluentCloudEngine.instance = new ConfluentCloudEngine();
    }
    return ConfluentCloudEngine.instance;
  }

  async connect() {
    try {
      logger.info("Connecting to Kafka...");
      await this.producer.connect();
      await this.consumer.connect();
      logger.info('Connected to Kafka Successfully');
    } catch (error) {
      logger.error('Error connecting to Kafka:', error);
    }
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async publish(event: INotificationEvent): Promise<void> {

    logger.info('Publishing event:', event);

    try {

      const record: ProducerRecord = {
        topic: event.eventType,
        messages: [{ value: JSON.stringify(event) }],
      };

      await this.producer.send(record);
    } catch (error) {
      logger.error('Error publishing to Kafka:', error);
      throw error;
    }
  }

  async consume(topic: string, callback: (message: Message) => Promise<void>) {
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        logger.info(`Received message from topic ${topic}, partition ${partition}`);
        logger.info(`Message: ${message.value!.toString()}`);
        await callback(message);
      },
    });
  }
}

export const confluentCloudEngine = ConfluentCloudEngine.getInstance();