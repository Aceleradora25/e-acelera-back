import { Response, NextFunction } from "express"
import { ALLOWED_ORIGINS, STATUS_CODE } from "./constants"

export function isString(value: string | undefined): value is string {
  return typeof value === "string"
}

export function isAllowedOrigin(requestOrigin: string): boolean {
  return ALLOWED_ORIGINS.includes(requestOrigin);
}

export function sendCorsResponse({
  origin,
  allowed,
  res,
  next
}: {
  origin: string | undefined
  allowed: boolean
  res: Response
  next: NextFunction
}) {

  if (!allowed) {
    res.status(STATUS_CODE.FORBIDDEN).json({ message: "NOT ALLOWED" })
    return
  }

  res.setHeader("Access-Control-Allow-Origin", "*")

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
  next()
}
