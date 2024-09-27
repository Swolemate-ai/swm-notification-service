import { injectable, injectAll } from "tsyringe";
import { IInternalNotificationEvent, INotificationEvent, INotificationEventDispatcher, INotificationEventHandler, InternalNotificationEventDispatcher, InternalNotificationEventHandler } from "../domain/notification/NotificationEvent";
import { logger } from "../cross_cutting/logging";


@injectable()
export class NotificationEventDispatcher implements INotificationEventDispatcher {
  constructor(
    @injectAll('NotificationEventHandler') private handlers: INotificationEventHandler[]
  ) { }

  async dispatch(event: INotificationEvent): Promise<void> {
    logger.info(`Dispatching event: ${event.eventType}`);
    // Handle the event internally
    const relevantHandlers = this.handlers.filter(h => h.eventType === event.eventType);
    await Promise.all(relevantHandlers.map(handler => handler.handle(event)));
    logger.info(`External Event Processed Successully : ${event.eventType}`);
  }
}

@injectable()
export class DefaultInternalNotificationEventDispatcher implements InternalNotificationEventDispatcher {
  constructor(
    @injectAll('InternalNotificationEventHandler') private handlers: InternalNotificationEventHandler[]
  ) { }

  async dispatch(event: IInternalNotificationEvent): Promise<void> {
    logger.info(`Dispatching event: ${event.internalEventType}`);
    // Handle the event internally
    const relevantHandlers = this.handlers.filter(h => h.internalEventType === event.internalEventType);
    await Promise.all(relevantHandlers.map(handler => handler.handle(event)));
    logger.info(`Internal Events handled internally: ${event.internalEventType}`);
  }
}