import { IdType, StackbyEndpoint } from "../types/types.js";
export var STATUS_CODE;
(function (STATUS_CODE) {
    STATUS_CODE[STATUS_CODE["OK"] = 200] = "OK";
    STATUS_CODE[STATUS_CODE["CREATED"] = 201] = "CREATED";
    STATUS_CODE[STATUS_CODE["NO_CONTENT"] = 204] = "NO_CONTENT";
    STATUS_CODE[STATUS_CODE["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    STATUS_CODE[STATUS_CODE["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    STATUS_CODE[STATUS_CODE["FORBIDDEN"] = 403] = "FORBIDDEN";
    STATUS_CODE[STATUS_CODE["NOT_FOUND"] = 404] = "NOT_FOUND";
    STATUS_CODE[STATUS_CODE["TOKEN_EXPIRED"] = 498] = "TOKEN_EXPIRED";
    STATUS_CODE[STATUS_CODE["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(STATUS_CODE || (STATUS_CODE = {}));
export const STACKBY_ENDPOINTS_HASHTABLE = {
    [IdType.TOPIC_ID]: StackbyEndpoint.TOPICS,
    [IdType.THEME_ID]: StackbyEndpoint.THEMES,
};
export const STACKBY_SECRET_KEY = process.env.STACKBY_SECRET_KEY;
export const STACKBY_BASE_URL = process.env.STACKBY_BASE_URL;
export const IS_CACHE_ENABLED = process.env.CACHE_ENABLED === "TRUE";
export const DEFAULT_CACHE_TTL = 60 * 60 * 8;
export const CACHE_TTL = process.env.CACHE_TTL
    ? parseInt(process.env.CACHE_TTL, 10)
    : DEFAULT_CACHE_TTL;
export const makeRedisKey = (prefix, key, filterKey) => `${prefix}:${key}${filterKey ? `:${filterKey}` : ""}`;
export const REDIS_STACKBY_KEYS = {
    Exercises: (filterKey) => makeRedisKey("stackby", StackbyEndpoint.EXERCISES, filterKey),
    Themes: (filterKey) => makeRedisKey("stackby", StackbyEndpoint.THEMES, filterKey),
    Topics: (filterKey) => makeRedisKey("stackby", StackbyEndpoint.TOPICS, filterKey),
};
export const REDIS_PROGRESS_CALCULATION_BY_ENTITY_KEYS = {
    Themes: makeRedisKey("progressCalculation", StackbyEndpoint.THEMES),
    Topics: makeRedisKey("progressCalculation", StackbyEndpoint.TOPICS),
};
