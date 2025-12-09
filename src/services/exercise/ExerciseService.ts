import prisma from "@/root/client.js";

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
