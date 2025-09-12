import { Redis } from "@upstash/redis";

export const redis =
  process.env.IS_CACHE_ENABLED === "TRUE" &&
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;
