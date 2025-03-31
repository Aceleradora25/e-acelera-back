export enum STATUS_CODE {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  TOKEN_EXPIRED = 498,
  INTERNET_SERVER_ERROR = 500
}

export const ALLOWED_ORIGINS = [
  "http://localhost:3000/",
  "https://staging--e-acelera-homologacao.netlify.app/",
  "https://aceleradora-agil.com.br/"
]