import { Options } from 'amqplib';
import { KafkaConfig } from 'kafkajs';

export const MESSAGING_CONFIG: Options.Connect = {
  protocol: 'amqp',
  hostname: process.env.RABBITMQ_HOST || 'localhost',
  port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
  username: process.env.RABBITMQ_USER || 'guest',
  password: process.env.RABBITMQ_PASSWORD || 'guest',
  vhost: process.env.RABBITMQ_VHOST || '/',
};

export const EXCHANGE_TYPES = {
  DIRECT: 'direct',
  FANOUT: 'fanout',
  TOPIC: 'topic',
};

export const QUEUES = {
  TASK_CREATED: 'task_created',
  TASK_UPDATED: 'task_updated',
  TASK_DELETED: 'task_deleted',
};


// export const MESSAGING_CONFIG = {
//     rabbitMQ: {
//       url: process.env.RABBITMQ_URL || 'amqp://localhost',
//       exchange: process.env.RABBITMQ_EXCHANGE || 'task_exchange',
//       queues: {
//         tasks: process.env.RABBITMQ_TASK_QUEUE || 'task_queue',
//         notifications: process.env.RABBITMQ_NOTIFICATION_QUEUE || 'notification_queue',
//       },
//     },
//     kafka: {
//       clientId: process.env.KAFKA_CLIENT_ID || 'task-management-service',
//       brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
//       topic: process.env.KAFKA_TOPIC || 'task-events',
//     },
//   };

export const kafkaConfig = {
  clientId: 'swolemate-notification-service',
  brokers: [process.env.CONFLUENT_BOOTSTRAP_SERVERS!],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.CONFLUENT_API_KEY!,
    password: process.env.CONFLUENT_API_SECRET!
  },
};

export const SendGridConfig = {
  apiKey: process.env.SENDGRID_API_KEY,
  verifiedSenderEmail: process.env.SENDGRID_VERIFIED_SENDER_EMAIL,
};