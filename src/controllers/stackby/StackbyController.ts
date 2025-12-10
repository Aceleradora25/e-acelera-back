import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import type { NextFunction, Request, Response } from "express";
import { StackbyParamsDto } from "../../dtos/StackbyEndpoint.dto.js";
import { BadRequestError } from "../../errors/HttpErrors.js";
import { StackbyService } from "../../services/StackbyService.js";
import { STATUS_CODE } from "../../utils/constants.js";
import { buildStackbyFilter } from "../../utils/filter-factory.js";

export class StackbyController {
	private stackbyService: StackbyService;

	constructor() {
		this.stackbyService = new StackbyService();
	}

	async getStackbyData(req: Request, res: Response, next: NextFunction) {
		try {
			const payload = { ...req.params, ...req.query };

			const dto = plainToInstance(StackbyParamsDto, payload, {
				enableImplicitConversion: true,
			});

			await validateOrReject(dto);

			if (!dto.endpoint) {
				throw new BadRequestError(
					"An endpoint is required. Must be 'Exercises', 'Topics' or 'Themes'.",
				);
			}

			const { endpoint } = dto;

			const filter = buildStackbyFilter(dto);

			const data = await this.stackbyService.fetchStackbyData(endpoint, filter);
			return res.status(STATUS_CODE.OK).json(data);
		} catch (error) {
			next(error);
		}
	}
}
