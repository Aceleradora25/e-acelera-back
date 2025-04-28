import { Request, Response, NextFunction } from "express"
import {isString, isAllowedOrigin, sendCorsResponse} from "../utils/corsUtils"
import { STATUS_CODE } from "../utils/constants"

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req?.headers.origin

  if (!origin) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith("Bearer ")) {
      next()
      return
    }
    res.status(STATUS_CODE.FORBIDDEN).json({ message: "NOT ALLOWED" })
    return
  }

  if (isString(origin) && isAllowedOrigin(origin)) {
    sendCorsResponse({ origin, res, next, allowed: true })
    return
  }

  sendCorsResponse({ origin: undefined, res, next, allowed: false })
}
