
import exp from 'constants';
import { v4 as uuidv4 } from 'uuid';

export interface INotificationEvent<T = any> {
    eventId: string;
    eventType: string;
    aggregateId: string;
    aggregateType: string;
    timestamp: Date;
    version: number;
    payload: T;
}


// Abstract base class for domain events
export abstract class NotificationEvent<T = any> implements INotificationEvent<T> {
    public readonly eventId: string;
    public readonly timestamp: Date;
  
    constructor(
      public readonly eventType: string,
      public readonly aggregateId: string,
      public readonly aggregateType: string,
      public readonly version: number,
      public readonly payload: T
    ) {
      this.eventId = uuidv4();
      this.timestamp = new Date();
    }
  }

export interface NotificationEventProcessor{
    process(event: INotificationEvent): Promise<void>;
    };

// Define the type for event handlers
export interface INotificationEventHandler<T extends INotificationEvent = INotificationEvent> {
    eventType: string;
    handle(event: T): Promise<void>;
}

// Event Publisher interface
export interface INotificationEventPublisher {
    publish(event: INotificationEvent): Promise<void>;
}

// Event Dispatcher interface
export interface INotificationEventDispatcher {
    dispatch(event: INotificationEvent): Promise<void>;
}


// Define the internal event types
export enum InternalEventDefinition {
  EMAIL_NOTIFICATION = 'EMAIL_NOTIFICATION',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  SMS_NOTIFICATION = 'SMS_NOTIFICATION',
  APP_NOTIFICATION = 'APP_NOTIFICATION',
}

export interface IInternalNotificationEvent {
  notificationId: string;
  internalEventType: InternalEventDefinition;
}

export interface InternalNotificationEventHandler<T extends IInternalNotificationEvent = IInternalNotificationEvent> {
  internalEventType: InternalEventDefinition;
  handle(event: T): Promise<void>;
}

export interface InternalNotificationEventDispatcher {
  dispatch(event: IInternalNotificationEvent): Promise<void>;
}


export class InternalNotificationEvent implements IInternalNotificationEvent {

  constructor(
    public readonly notificationId: string,
    public readonly internalEventType: InternalEventDefinition,
  ) {
  }
}

