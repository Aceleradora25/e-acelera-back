import { Request } from "express";

export function pagination(page: number, limit: number) {
    const allowedLimits = [10, 25, 50];
    const finalLimit = allowedLimits.includes(limit) ? limit : 10;

    const skip = (page - 1) * finalLimit; 

    return {skip, take: finalLimit}
}

export function createPaginationMeta(total: number, page: number, limit: number) {
    return { 
        total, 
        page, 
        limit, 
        totalPages: Math.ceil(total / limit) 
    };
}

export function getPaginationParams (req: Request) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
return { page, limit };
}



