import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/TokenService";

export async function validateTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const tokenService = new TokenService();
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token was not provided" });
    }
    const extractToken = await tokenService.extractToken(token);
    const email = extractToken?.email
    try {
        if (!email) {
            return res.status(401).json({ message: "Token invalid" });
        }
        req.user = { email };
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication failed" });
    }
}
