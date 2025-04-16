import { Request, Response, NextFunction } from 'express';

const allowedOrigins = [
  'http://localhost:3000',
  'https://staging--e-acelera-homologacao.netlify.app',
  'https://aceleradora-agil.com.br'
];

export function customCors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204); 
    }

    next();
  } else {
    res.status(403).json({ message: 'Origem não permitida pelo CORS.' });
  }
}
