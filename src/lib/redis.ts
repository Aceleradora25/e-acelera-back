import { Redis } from "@upstash/redis";

export const redis =
  process.env.IS_CACHE_ENABLED === "TRUE" ? Redis.fromEnv() : null;
