import prisma from "../../../client.js";

export class ExerciseService {
  async getAllExercises() {
      return await prisma.exercise.findMany({
        include: {
          topic: true,
        },
        orderBy: {
          sequence: 'asc',
        },
      });
  }

  async getExerciseById(id: string) {
      return await prisma.exercise.findUnique({
        where: { id },
        include: {
          topic: true,
        },
      });
  }

  async getExercisesByTopicId(topicId: string) {
      return await prisma.exercise.findMany({
        where: { topicId },
        orderBy: {
          sequence: 'asc',
        },
      });
  }
}