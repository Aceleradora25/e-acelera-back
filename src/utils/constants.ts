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

export const ALLOWED_HOSTS = [
  "staging--e-acelera-homologacao.netlify.app",
  "aceleradora-agil.com.br",
]

export const isProduction = process.env.NODE_ENV !== "development";
