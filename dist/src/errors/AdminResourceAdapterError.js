export class AdminServiceError extends Error {
    status;
    // biome-ignore lint/suspicious/noExplicitAny: WIP - Just for custom errors
    details;
    // biome-ignore lint/suspicious/noExplicitAny: WIP - Just for custom errors
    constructor(message, status = 400, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}
