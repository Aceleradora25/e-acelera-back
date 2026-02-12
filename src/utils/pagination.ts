export function pagination(page: number, limit: number) {
    const allowedLimits = [10, 25, 50];
    const finalLimit = allowedLimits.includes(limit) ? limit : 10;

    const skip = (page - 1) * finalLimit; 

    return {skip, take: finalLimit}
}
