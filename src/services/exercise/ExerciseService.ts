import prisma from "../../../client";
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
