import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import type { Request, Response } from "express";
import { ProgressDTO } from "@/dtos/Progress.dto.js";
import { SaveStatusProgressDTO } from "@/dtos/SaveStatusProgress.dto.js";
import { ProgressService } from "@/services/progress/ProgressService.js";
import { StackbyService } from "@/services/StackbyService.js";
import { IdType, StackbyEndpoint } from "@/types/types.js";
import { STACKBY_ENDPOINTS_HASHTABLE, STATUS_CODE } from "@/utils/constants.js";

export class ProgressController {
	private progressService: ProgressService;
	private stackbyService: StackbyService;

	constructor() {
		this.progressService = new ProgressService();
		this.stackbyService = new StackbyService();
	}

	async getProgressPercentageById(req: Request, res: Response) {
		const dto = plainToInstance(ProgressDTO, req.params);
		const userId = req.user?.id;

		try {
			if (!userId) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Missing userId. You must pass a valid userId.",
				});
			}
			await validateOrReject(dto);

			const { id, idType } = dto;

			const endpoint = STACKBY_ENDPOINTS_HASHTABLE[idType as IdType];
			if (!endpoint) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "You must pass a valid id and an idType as params.",
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
				const result = await this.progressService.getProgressPercentageById(
					{ id, idType, userId },
					totalItems,
					themes,
					topics,
				);
				return res.status(STATUS_CODE.OK).json(result);
			} else {
				const totalItems = this.stackbyService.calculateTotalItems(
					id,
					endpoint,
					topics,
				);
				const topicProgress =
					await this.progressService.getProgressPercentageById(
						{
							id,
							idType,
							userId,
						},
						totalItems,
					);
				return res.status(STATUS_CODE.OK).json(topicProgress);
			}
		} catch (_error) {
			return res
				.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
				.json({ message: "Error processing the request" });
		}
	}

	async saveStatusProgress(req: Request, res: Response) {
		const { topicId, itemId } = req.params;
		const dto = plainToInstance(SaveStatusProgressDTO, req.body);

		const userId = req.user?.id;

		try {
			await validateOrReject(dto);
			const { elementType, itemStatus, themeId } = dto;

			if (!userId) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Missing userId. You must pass a valid userId.",
				});
			}

			const updatedProgress = await this.progressService.saveStatusProgress({
				elementType,
				itemId,
				itemStatus,
				themeId,
				topicId,
				userId,
			});

			return res.status(STATUS_CODE.OK).json(updatedProgress);
		} catch (_error) {
			return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
				message: "Internal server error while processing the request",
			});
		}
	}

	async getTopicExercisesStatusProgress(req: Request, res: Response) {
		const dto = plainToInstance(ProgressDTO, req.params);
		const userId = req.user?.id;

		try {
			await validateOrReject(dto);
			const { idType, id } = dto;

			if (!userId) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Missing userId. You must pass a valid userId.",
				});
			}

			if (!idType || !id) {
				return res
					.status(STATUS_CODE.BAD_REQUEST)
					.json({ message: "You must pass an id and an idType as params." });
			}
			const allProgressByTopic =
				await this.progressService.getAllStatusProgressById({
					id,
					idType: IdType.TOPIC_ID,
					userId,
				});

			if (allProgressByTopic.length === 0) {
				return res
					.status(STATUS_CODE.NOT_FOUND)
					.json({ message: "Progress not found" });
			}

			return res.status(STATUS_CODE.OK).json(allProgressByTopic);
		} catch (_error) {
			return res
				.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
				.json({ message: "Error processing the request" });
		}
	}

	async getExerciseStatusProgress(req: Request, res: Response) {
		const { itemId } = req.params;
		const userId = req.user?.id;

		if (!userId) {
			return res.status(STATUS_CODE.BAD_REQUEST).json({
				message: "Missing userId. You must pass a valid userId.",
			});
		}

		if (!itemId) {
			return res
				.status(STATUS_CODE.BAD_REQUEST)
				.json({ message: "You must pass an itemId and a topicId as params." });
		}

		try {
			const exerciseStatus =
				await this.progressService.getSingleStatusProgressByItemId(
					itemId,
					userId,
				);

			if (!exerciseStatus) {
				return res
					.status(STATUS_CODE.NOT_FOUND)
					.json({ message: "Status not found" });
			}

			return res.status(STATUS_CODE.OK).json(exerciseStatus);
		} catch (_error) {
			return res
				.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
				.json({ message: "Error processing the request" });
		}
	}
}
