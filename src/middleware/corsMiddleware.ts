import { Request, Response, NextFunction } from "express"
import {isString, isAllowedOrigin, sendCorsResponse} from "../utils/corsUtils"

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const origin = req?.headers.origin

  if (!origin) {
    return
  }

  if (isString(origin) && isAllowedOrigin(origin)) {
    sendCorsResponse({ origin, res, next, allowed: true })
    return
  }

}
