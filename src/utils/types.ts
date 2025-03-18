export interface UserToken {
    name: string
    email: string
    sub: string
    id: string
    provider: string
    accessToken: string
    iat: number
    exp: number
    jti: string
  }