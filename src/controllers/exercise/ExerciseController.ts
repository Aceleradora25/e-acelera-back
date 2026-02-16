import { plainToInstance } from "class-transformer";
import { ValidationError, validateOrReject } from "class-validator";
import type { Request, Response } from "express";
import { GetExerciseByIdDTO } from "../../dtos/GetExerciseById.dto";
import { GetExercisesByTopicIdDTO } from "../../dtos/GetExercisesByTopicId.dto";
import { ExerciseService } from "../../services/exercise/ExerciseService.js";
import { STATUS_CODE } from "../../utils/constants.js";
import { getPaginationParams } from "../../utils/pagination";

export class ExerciseController {
	private exerciseService: ExerciseService;

	constructor() {
		this.exerciseService = new ExerciseService();
	}

	async getAllExercises(req: Request, res: Response) {
		try {
			const { page, limit } = getPaginationParams(req);
			const exercises = await this.exerciseService.getAllExercises(page, limit);
			return res.status(STATUS_CODE.OK).json(exercises);
		} catch (_error) {
			return res
				.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
				.json({ message: "Error fetching exercises" });
		}
	}

	async getExerciseById(req: Request, res: Response) {
		const dto = plainToInstance(GetExerciseByIdDTO, req.params, {
			enableImplicitConversion: true,
		});

		try {
			await validateOrReject(dto);
			const exercise = await this.exerciseService.getExerciseById(dto.id);

			if (!exercise) {
				return res
					.status(STATUS_CODE.NOT_FOUND)
					.json({ message: "Exercise not found" });
			}

			return res.status(STATUS_CODE.OK).json(exercise);
		} catch (error) {
			if (
				Array.isArray(error) &&
				error.every((err) => err instanceof ValidationError)
			) {
				return res
					.status(STATUS_CODE.BAD_REQUEST)
					.json({ message: "Invalid Exercise ID" });
			}
			return res
				.status(STATUS_CODE.INTERNAL_SERVER_ERROR)
				.json({ message: "Error fetching exercise" });
		}
	}

	async getExercisesByTopicId(req: Request, res: Response) {
		const dto = plainToInstance(GetExercisesByTopicIdDTO, req.params, {
			enableImplicitConversion: true,
		});

		try {
			await validateOrReject(dto);
			const exercises = await this.exerciseService.getExercisesByTopicId(
				dto.topicId,
			);
			return res.status(STATUS_CODE.OK).json(exercises);
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
				.json({ message: "Error fetching exercises by topic ID" });
		}
	}
}
