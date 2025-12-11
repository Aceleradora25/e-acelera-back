export class AdminServiceError extends Error {
	status: number;
	// biome-ignore lint/suspicious/noExplicitAny: WIP - Just for custom errors
	details?: any;

	// biome-ignore lint/suspicious/noExplicitAny: WIP - Just for custom errors
	constructor(message: string, status = 400, details?: any) {
		super(message);
		this.status = status;
		this.details = details;
	}
}
