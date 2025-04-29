import { Response, NextFunction } from "express"
import { ALLOWED_HOSTS, isProduction, STATUS_CODE } from "./constants"

export function isString(value: string | undefined): value is string {
  return typeof value === "string"
}

export function isAllowedHost(requestHost: string): boolean {
  return ALLOWED_HOSTS.includes(requestHost);
}

export function sendCorsResponse({
  host,
  allowed,
  res,
  next
}: {
  host: string | undefined
  allowed: boolean
  res: Response
  next: NextFunction
}) {
  const origin = isProduction ? `https://${host}/` : `http://${host}/`;

  if (!allowed) {
    res.status(STATUS_CODE.FORBIDDEN).json({ message: "NOT ALLOWED" })
    return
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
  next()
}
