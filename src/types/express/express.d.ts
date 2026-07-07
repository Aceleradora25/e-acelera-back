import { Role } from '@prisma/client';
import express from 'express';
declare global {
	namespace Express {
		interface Request {
			user?: {
				email: string;
				id: number;
				role: Role;
			};
		}
	}
}
