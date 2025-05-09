import { Request, Response, NextFunction } from "express"
import { isString, isAllowedOrigin, sendCorsResponse } from "../utils/corsUtils"

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  sendCorsResponse({ origin: undefined, res, next, allowed: true })
}
