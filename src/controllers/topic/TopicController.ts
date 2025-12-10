import { plainToInstance } from "class-transformer";
import { ValidationError, validateOrReject } from "class-validator";
import type { Request, Response } from "express";
import { GetTopicByIdDTO } from "../../dtos/GetTopicById.dto.js";
import { GetTopicsByThemeIdDTO } from "../../dtos/GetTopicsByThemeId.dto.js";
import { TopicService } from "../../services/topic/TopicService.js";
import { STATUS_CODE } from "../../utils/constants.js";

export class TopicController {
	private topicService: TopicService;

	constructor() {
		this.topicService = new TopicService();
	}

	async getAllTopics(_req: Request, res: Response) {
		try {
			const topics = await this.topicService.getAllTopics();
			return res.status(STATUS_CODE.OK).json(topics);
		} catch (_error) {
			return res
				.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
				.json({ message: "Error fetching topics" });
		}
	}

	async getTopicById(req: Request, res: Response) {
		const dto = plainToInstance(GetTopicByIdDTO, req.params, {
			enableImplicitConversion: true,
		});

		try {
			await validateOrReject(dto);
			const topic = await this.topicService.getTopicById(dto.id);

			if (!topic) {
				return res
					.status(STATUS_CODE.NOT_FOUND)
					.json({ message: "Topic not found" });
			}

			return res.status(STATUS_CODE.OK).json(topic);
		} catch (error) {
			if (
				Array.isArray(error) &&
				error.every((err) => err instanceof ValidationError)
			) {
				return res
					.status(STATUS_CODE.BAD_REQUEST)
					.json({ message: "Invalid Topic ID" });
			}

			return res
				.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
				.json({ message: "Error fetching topic" });
		}
	}

	async getTopicsByThemeId(req: Request, res: Response) {
		const dto = plainToInstance(GetTopicsByThemeIdDTO, req.params, {
			enableImplicitConversion: true,
		});

		try {
			await validateOrReject(dto);
			const topics = await this.topicService.getTopicsByThemeId(dto.themeId);
			return res.status(STATUS_CODE.OK).json(topics);
		} catch (error) {
			if (
				Array.isArray(error) &&
				error.every((err) => err instanceof ValidationError)
			) {
				return res
					.status(STATUS_CODE.BAD_REQUEST)
					.json({ message: "Invalid Theme ID" });
			}
			return res
				.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
				.json({ message: "Error fetching topics by theme ID" });
		}
	}
}
