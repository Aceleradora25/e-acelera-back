import prisma from "../../../client";
import { pagination } from "../../utils/pagination";

export class ExerciseService {
	async getAllExercises(page: number = 1, limit: number = 10) {
		const { skip, take } = pagination(page, limit);

		const [exercises, total] = await Promise.all([
			prisma.exercise.findMany({
				include: {
					topic: true,
				},
				orderBy: {
					sequence: "asc",
				},
				skip,
				take,
			}),
			prisma.exercise.count({ where: {} }),
		]);
		return {
			data: exercises,
			meta: { total, page, limit: take, totalPages: Math.ceil(total / take) },
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
