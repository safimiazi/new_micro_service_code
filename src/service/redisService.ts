import { redis } from "@/config/redis";

export const RedisService = {
    async logEmail (id, data)  {
        await redis.set(`email:${id}`, JSON.stringify(data));
        console.log(`Email logged to Redis: email:${id}`);
    }
}