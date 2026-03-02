import prisma from "../../../client";
import { CreateExerciseDTO } from "../../dtos/CreateExercise.dto";
import { UpdateExerciseDTO } from "../../dtos/UpdateExercise.dto";
import { createPaginationMeta, pagination } from "../../utils/pagination";

export class ExerciseService {
	async getAllExercises(page: number = 1, limit: number = 10) {
		const { skip, take } = pagination(page, limit);

		const total = await prisma.exercise.count();
		const exercises = await prisma.exercise.findMany({
		 include: {
					topic: true,
				},
				orderBy: {
					sequence: "asc",
				},
				skip,
				take,});
		return {
			data: exercises,
			meta: createPaginationMeta(total, page, take),
		};
	}

	async createExercise(dto: CreateExerciseDTO) {
		const exercise = await prisma.exercise.create({
			data: {
				title: dto.title,
				shortDescription: dto.shortDescription,
				description: dto.description,
				sequence: dto.sequence || 0,
				topicId: dto.topicId || null,
				isActive: true,
			},
			include: { topic: true },
		});

		return exercise;
	}

	async updateExercise(id: string, dto: UpdateExerciseDTO) {
		const existing = await prisma.exercise.findUnique({ where: { id } });
		if (!existing) {
			throw new Error("Exercise not found");
		}

		const updated = await prisma.exercise.update({
			where: { id },
			data: {
				...dto,
			},
			include: { topic: true },
		});

		return updated;
	}

	async deleteExercise(id: string) {
		const deleted = await prisma.exercise.delete({ where: { id } });
		return deleted;
	}

	async getExerciseById(id: string) {
		return await prisma.exercise.findUnique({
			include: {
				topic: true,
			},
			where: { id },
		});
	}

	async getExercisesByTopicId(topicId: string) {
		return await prisma.exercise.findMany({
			orderBy: {
				sequence: "asc",
			},
			where: { topicId },
		});
	}
}
