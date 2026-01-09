import express from "express";
import { Role } from "@prisma/client";
declare global {
	namespace Express {
		interface Request {
			user?: {
				email: string;
				id: number;
			};
		}
	}
}
