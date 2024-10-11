export interface ExternalPublishingService {
    subscribeToTopic(tokens: string[], topic: string): Promise<void>;
    unsubscribeFromTopic(tokens: string[], topic: string): Promise<void>;
}