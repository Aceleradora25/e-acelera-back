import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import type { Request, Response } from "express";
import { ProgressDTO } from "../../dtos/Progress.dto.js";
import { SaveStatusProgressDTO } from "../../dtos/SaveStatusProgress.dto.js";
import { ProgressService } from "../../services/progress/ProgressService.js";
import { StackbyService } from "../../services/StackbyService.js";
import { IdType, StackbyEndpoint } from "../../types/types.js";
import {
	STACKBY_ENDPOINTS_HASHTABLE,
	STATUS_CODE,
} from "../../utils/constants.js";

export class ProgressController {
	private progressService: ProgressService;
	private stackbyService: StackbyService;

	constructor() {
		this.progressService = new ProgressService();
		this.stackbyService = new StackbyService();
	}

	private isInvalidRouteParam(value: string | undefined): boolean {
		if (!value) return true;
		const normalized = value.trim().toLowerCase();
		return normalized === "null" || normalized === "undefined";
	}

	async getProgressPercentageById(req: Request, res: Response) {
		const dto = plainToInstance(ProgressDTO, req.params);
		const userId = req.user?.id;

		try {
			if (!userId) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Missing userId.",
				});
			}

			await validateOrReject(dto);
			const { id, idType } = dto;

			const endpoint = STACKBY_ENDPOINTS_HASHTABLE[idType as IdType];
			if (!endpoint) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Invalid idType.",
				});
			}

			const topics = await this.stackbyService.fetchStackbyData(
				StackbyEndpoint.TOPICS,
			);

			if (idType === IdType.THEME_ID) {
				const themes = await this.stackbyService.fetchStackbyData(
					StackbyEndpoint.THEMES,
				);

				const totalItems = this.stackbyService.calculateTotalItems(
					id,
					endpoint,
					themes,
					topics,
				);

				const result =
					await this.progressService.getProgressPercentageById(
						{ id, idType, userId },
						totalItems,
						themes,
						topics,
					);

				return res.status(STATUS_CODE.OK).json(result);
			}

			const totalItems = this.stackbyService.calculateTotalItems(
				id,
				endpoint,
				topics,
			);

			const result =
				await this.progressService.getProgressPercentageById(
					{ id, idType, userId },
					totalItems,
				);

			return res.status(STATUS_CODE.OK).json(result);
		} catch {
			return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
				message: "Internal error",
			});
		}
	}

	async saveStatusProgress(req: Request, res: Response) {
		const { topicId, itemId } = req.params;
		const dto = plainToInstance(SaveStatusProgressDTO, req.body);
		const userId = req.user?.id;

		try {
			await validateOrReject(dto);

			if (!userId) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Missing userId.",
				});
			}

			if (
				this.isInvalidRouteParam(topicId) ||
				this.isInvalidRouteParam(itemId)
			) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Invalid topicId or itemId.",
				});
			}

			const { elementType, itemStatus, themeId } = dto;

			const updatedProgress =
				await this.progressService.saveStatusProgress({
					elementType,
					itemId,
					itemStatus,
					themeId,
					topicId,
					userId,
				});

			return res.status(STATUS_CODE.OK).json(updatedProgress);
		} catch {
			return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
				message: "Internal error",
			});
		}
	}

	async getTopicExercisesStatusProgress(req: Request, res: Response) {
		const dto = plainToInstance(ProgressDTO, req.params);
		const userId = req.user?.id;

		try {
			await validateOrReject(dto);

			if (!userId) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Missing userId.",
				});
			}

			const { id } = dto;

			const result =
				await this.progressService.getAllStatusProgressById({
					id,
					idType: IdType.TOPIC_ID,
					userId,
				});

			if (!result.length) {
				return res.status(STATUS_CODE.NOT_FOUND).json({
					message: "Progress not found",
				});
			}

			return res.status(STATUS_CODE.OK).json(result);
		} catch {
			return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
				message: "Internal error",
			});
		}
	}

	async getExerciseStatusProgress(req: Request, res: Response) {
		const { itemId, topicId } = req.params;
		const userId = req.user?.id;

		try {
			if (!userId) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Missing userId.",
				});
			}

			if (
				this.isInvalidRouteParam(topicId) ||
				this.isInvalidRouteParam(itemId)
			) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Invalid params.",
				});
			}

			const result =
				await this.progressService.getSingleStatusProgressByItemId(
					itemId,
					userId,
				);

			if (!result) {
				return res.status(STATUS_CODE.NOT_FOUND).json({
					message: "Status not found",
				});
			}

			return res.status(STATUS_CODE.OK).json(result);
		} catch {
			return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
				message: "Internal error",
			});
		}
	}
}