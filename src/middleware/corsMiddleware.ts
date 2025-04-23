import { Request, Response, NextFunction } from "express"
import { ALLOWED_ORIGINS, STATUS_CODE } from "../utils/constants"

function isString(value: string | undefined) {
  return typeof value === "string"
}

function isAllowedOrigin(requestOrigin: string): boolean {
  return ALLOWED_ORIGINS.includes(requestOrigin)
}

function sendCorsResponse({
  origin,
  allowed,
  res,
  next,
}: {
origin: string | undefined,
allowed:boolean,
res: Response,
next:NextFunction
}) {
  if(!allowed) {
    res.status(STATUS_CODE.FORBIDDEN).json({message: "NOT ALLOWED"})
    return
  }

  if(origin) {
    res.setHeader("Access-Control-Allow-Origin", origin)
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization")
  next()
}

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req?.headers.origin

  if(isString(origin) && isAllowedOrigin(origin)) {
    sendCorsResponse({origin, res, next, allowed: true})
    return
  }

  sendCorsResponse({origin: undefined, res, next, allowed: false})

}
