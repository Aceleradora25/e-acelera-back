import type { NextFunction, Request, Response } from "express";
import { AppError } from "@/errors/AppError.js";

export function errorHandlerMiddleware(
	// biome-ignore lint/suspicious/noExplicitAny: TODO: WIP
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (err instanceof AppError) {
		return res.status(err.statusCode).json({
			details: err.details,
			error: err.message,
		});
	}

	if (Array.isArray(err)) {
		return res.status(400).json({
			details: err.map((e) => ({
				constraints: e.constraints,
				property: e.property,
			})),
			error: "Validation failed",
		});
	}

	// biome-ignore lint/suspicious/noConsole: TODO: Melhorar observalidade do projeto através de logs mais robustos.
	console.error(err);
	return res.status(500).json({ error: "Internal Server Error" });
}
