import { IdType, StackbyEndpoint } from "../types/types"

export enum STATUS_CODE {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOKEN_EXPIRED = 498,
  INTERNAL_SERVER_ERROR = 500
}

export const STACKBY_ENDPOINTS_HASHTABLE: Partial<Record<IdType, StackbyEndpoint>> = {
  [IdType.TOPIC_ID]: StackbyEndpoint.TOPICS,
  [IdType.THEME_ID]: StackbyEndpoint.THEMES
}

export const STACKBY_SECRET_KEY = process.env.STACKBY_SECRET_KEY
export const STACKBY_BASE_URL = process.env.STACKBY_BASE_URL
