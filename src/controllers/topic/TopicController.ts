import { plainToInstance } from "class-transformer";
import { ValidationError, validateOrReject } from "class-validator";
import type { Request, Response } from "express";
import { GetTopicByIdDTO } from "../../dtos/GetTopicById.dto";
import { GetTopicsByThemeIdDTO } from "../../dtos/GetTopicsByThemeId.dto";
import { TopicService } from "../../services/topic/TopicService.js";
import { STATUS_CODE } from "../../utils/constants.js";
import { CreateTopicDTO } from "../../dtos/CreateTopic.dto";
import { UpdateTopicDTO } from "../../dtos/UpdateTopic.dto";
import { getPaginationParams } from "../../utils/pagination";

export class TopicController {
	private topicService: TopicService;

	constructor() {
		this.topicService = new TopicService();
	}

	async createTopic(req: Request, res: Response) {
		const dto = plainToInstance(CreateTopicDTO, req.body, {
			enableImplicitConversion: true,
		});

		try {
			await validateOrReject(dto);

			const topic = await this.topicService.createTopic(dto);

			return res.status(STATUS_CODE.CREATED).json(topic);
		} catch (error: any) {
			if (
				Array.isArray(error) &&
				error.every((err) => err instanceof ValidationError)
			) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: error[0].constraints?.isNotEmpty || "Invalid data",
				});
			}

			return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
				message: "Error creating topic",
				details: error,
			});
		}
	}

	async getAllTopics(req: Request, res: Response) {

		try {
			const { page, limit } = getPaginationParams(req);
			const topics = await this.topicService.getAllTopics(page, limit);
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

	async updateTopic(req: Request, res: Response) {
		const id = req.params.id.trim();

		const dto = plainToInstance(UpdateTopicDTO, req.body, {
			enableImplicitConversion: true,
		});

		try {
			await validateOrReject(dto);

			const topic = await this.topicService.updateTopic(id, dto);

			return res.status(STATUS_CODE.OK).json(topic);
		} catch (error: any) {
			if (
				Array.isArray(error) &&
				error.every((err) => err instanceof ValidationError)
			) {
				return res.status(STATUS_CODE.BAD_REQUEST).json({
					message: "Invalid data for update",
				});
			}

			return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
				message: "Error updating topic",
				details: error,
			});
		}
	}

	async deleteTopic(req: Request, res: Response) {
		const id = req.params.id.trim();
		try {
			await this.topicService.deleteTopic(id);
			return res.status(STATUS_CODE.OK).json({ message: "Topic deleted with success" });
		} catch (error: any) {
			return res
				.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
				.json({ message: "Error deleting topic", details: error });
		}
	}
}
