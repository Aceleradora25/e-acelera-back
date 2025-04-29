import { Request, Response, NextFunction } from "express"
import { isString, isAllowedHost, sendCorsResponse } from "../utils/corsUtils"
import { isProduction, STATUS_CODE } from "../utils/constants"

export function corsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const host = req?.headers.host;

  console.log(host, origin)

  if (!isProduction) {
    sendCorsResponse({ host, res, next, allowed: true })
    return
  }

  if (isString(host) && isAllowedHost(host)) {
    sendCorsResponse({ host, res, next, allowed: true })
    return
  }

  sendCorsResponse({ host: undefined, res, next, allowed: false })
}
