import Redis from "ioredis";
import { injectable } from "tsyringe";
import { CACHE_CONFIG } from "../../../cross_cutting/config";

@injectable()
export class RedisClient {
    private static instance: RedisClient;
    private redisInstance: Redis;
  
    constructor() {
        this.redisInstance = new Redis({
            host: CACHE_CONFIG.host,
            port: CACHE_CONFIG.port,
            password: CACHE_CONFIG.password,});
    }
  
    public static getInstance(): RedisClient {
      if (!RedisClient.instance) {
        RedisClient.instance = new RedisClient();
      }
  
      return RedisClient.instance;
    }

    public async get(key: string): Promise<string | null> {
        return this.redisInstance.get(key);
    }

    public async set(key: string, value: string): Promise<string> {
        return this.redisInstance.set(key, value);
    }
}


export const createRedisClient = ():RedisClient => {
    return RedisClient.getInstance();
  }