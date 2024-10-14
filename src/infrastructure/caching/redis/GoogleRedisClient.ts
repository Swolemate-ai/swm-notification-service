import { injectable } from "tsyringe";
import { GOOGLE_REDIS_CONFIG } from "../../../cross_cutting/config";
import Redis from "ioredis";

@injectable()
export class GoogleRedisClient {
    private static instance: GoogleRedisClient;
    private redisInstance: Redis;
  
    constructor() {
        this.redisInstance = new Redis({
            host: GOOGLE_REDIS_CONFIG.host,
            port: GOOGLE_REDIS_CONFIG.port,});
    }
  
    public static getInstance(): GoogleRedisClient {
      if (!GoogleRedisClient.instance) {
        GoogleRedisClient.instance = new GoogleRedisClient();
      }
  
      return GoogleRedisClient.instance;
    }

    public async get(key: string): Promise<string | null> {
        return this.redisInstance.get(key);
    }

    public async set(key: string, value: string): Promise<void> {
        this.redisInstance.set(key, value);
    }
}