import prisma from "../../../client";
import { CreateExerciseDTO } from "../../dtos/CreateExercise.dto";
import { UpdateExerciseDTO } from "../../dtos/UpdateExercise.dto";

export class ExerciseService {
	async getAllExercises() {
		return await prisma.exercise.findMany({
			include: {
				topic: true,
			},
			orderBy: {
				sequence: "asc",
			},
		});
	}

	async createExercise(dto: CreateExerciseDTO) {
		const exercise = await prisma.exercise.create({
			data: {
				title: dto.title,
				shortDescription: dto.shortDescription,
				description: dto.description,
				sequence: dto.sequence || 0,
				topicId: dto.topicId || null,
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
				...(dto.title !== undefined && { title: dto.title }),
				...(dto.shortDescription !== undefined && { shortDescription: dto.shortDescription }),
				...(dto.description !== undefined && { description: dto.description }),
				...(dto.sequence !== undefined && { sequence: dto.sequence }),
				...(dto.topicId !== undefined && { topicId: dto.topicId }),
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
