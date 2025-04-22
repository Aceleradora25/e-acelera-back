import { Request, Response, NextFunction } from 'express';
import { ALLOWED_ORIGINS, STATUS_CODE } from '../utils/constants';


function isString(value: string | undefined) {
  return typeof value === 'string';
}

function isAllowedOrigin(requestOrigin: string): boolean {
  return ALLOWED_ORIGINS.includes(requestOrigin);
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
    res.status(STATUS_CODE.FORBIDDEN).json({message: "NOT ALLOWED AMIGO"});
    return;
  }

  if(origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
}

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req?.headers.origin;
  console.log('@@@@REFERER', req?.headers.referer)
  console.log('@@@@HOST', req?.headers.host)
  console.log("@@@@HEADERS", JSON.stringify(req?.headers))

  if(isString(origin) && isAllowedOrigin(origin)) {
    sendCorsResponse({origin, res, next, allowed: true});
  }

  sendCorsResponse({origin: undefined, res, next, allowed: false});

  // if (origin && ALLOWED_ORIGINS.includes(origin)) {
  //   res.header('Access-Control-Allow-Origin', origin);
  //   res.header('Access-Control-Allow-Credentials', 'true');

  //   if (req.method === 'OPTIONS') {
  //     return res.sendStatus(STATUS_CODE.NO_CONTENT);
  //   }

  //   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  //   next();
  // } else {
  //   res.status(STATUS_CODE.FORBIDDEN).json({ message: 'Origem não permitida pelo CORS.' });
  // }
}
