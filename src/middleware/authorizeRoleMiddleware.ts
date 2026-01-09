import type { Request, Response, NextFunction } from "express";
import { STATUS_CODE } from "../utils/constants.js";
import { Role } from "@prisma/client";


export const authorizeRoleMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const user = req.user; 

        if (!user || user.role === Role.VIEWER) {
            return res.status(STATUS_CODE.FORBIDDEN).json({
                message: "You do not have permission to perform this action",
            });
        }

        next();
    };
