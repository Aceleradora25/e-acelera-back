import type { NextFunction, Request, Response } from 'express';
import prisma from '../../client.js';
import { TokenService } from '../services/TokenService.js';
import { STATUS_CODE } from '../utils/constants.js';
import { Role } from '@prisma/client';

export async function validateTokenMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const tokenService = new TokenService();
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res
			.status(STATUS_CODE.UNAUTHORIZED)
			.json({ message: 'Token was not provided' });
	}

	const extractToken = await tokenService.extractToken(token);
	const email = extractToken?.email;

	try {
		if (!email) {
			return res
				.status(STATUS_CODE.TOKEN_EXPIRED)
				.json({ message: 'Token invalid' });
		}

		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return res
				.status(STATUS_CODE.NOT_FOUND)
				.json({ message: 'User not found' });
		}

		// TODO: Propriedade role não deveria estar estatica no login, ao invés disso olhar na documentação do OAUTH como passar essa propriedade dependendo da conta.
		req.user = { email, id: +user.id, role: Role.VIEWER };
		next();
	} catch (_error) {
		return res
			.status(STATUS_CODE.UNAUTHORIZED)
			.json({ message: 'Authentication failed' });
	}
}
