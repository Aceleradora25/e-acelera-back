import { Redis } from "@upstash/redis";
import { IS_CACHE_ENABLED } from "../utils/constants";

export const redis = IS_CACHE_ENABLED ? Redis.fromEnv() : null;
