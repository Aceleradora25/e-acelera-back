export class AppError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 400, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
