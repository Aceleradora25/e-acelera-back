import { IdType, StackbyEndpoint } from "../types/types";

export enum STATUS_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOKEN_EXPIRED = 498,
  INTERNAL_SERVER_ERROR = 500,
}

export const STACKBY_ENDPOINTS_HASHTABLE: Partial<
  Record<IdType, StackbyEndpoint>
> = {
  [IdType.TOPIC_ID]: StackbyEndpoint.TOPICS,
  [IdType.THEME_ID]: StackbyEndpoint.THEMES,
};

export const STACKBY_SECRET_KEY = process.env.STACKBY_SECRET_KEY;
export const STACKBY_BASE_URL = process.env.STACKBY_BASE_URL;

export const IS_CACHE_ENABLED = process.env.CACHE_ENABLED === "TRUE";
export const DEFAULT_CACHE_TTL = 60 * 60 * 8;
export const CACHE_TTL = process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL, 10) : DEFAULT_CACHE_TTL;

export const makeRedisKey = (prefix: string, key: string, filterKey?: string): string =>
  `${prefix}:${key}${filterKey ? `:${filterKey}` : ""}`;

export const REDIS_STACKBY_KEYS = {
  Themes: (filterKey?: string) => makeRedisKey("stackby", StackbyEndpoint.THEMES, filterKey),
  Topics: (filterKey?: string) => makeRedisKey("stackby", StackbyEndpoint.TOPICS, filterKey),
  Exercises: (filterKey?: string) => makeRedisKey("stackby", StackbyEndpoint.EXERCISES, filterKey),
};
export const REDIS_PROGRESS_CALCULATION_BY_ENTITY_KEYS = {
  Themes: makeRedisKey("progressCalculation", StackbyEndpoint.THEMES),
  Topics: makeRedisKey("progressCalculation", StackbyEndpoint.TOPICS),
}