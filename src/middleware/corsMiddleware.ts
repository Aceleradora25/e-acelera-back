import { Request, Response, NextFunction } from "express"
import {isString, isAllowedOrigin, sendCorsResponse} from "../utils/corsUtils"

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req?.headers.origin

  if (!origin) {
    return next()
  }

  if (isString(origin) && isAllowedOrigin(origin)) {
    sendCorsResponse({ origin, res, next, allowed: true })
    return
  }

  sendCorsResponse({ origin: undefined, res, next, allowed: false })
}
