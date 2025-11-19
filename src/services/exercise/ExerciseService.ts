import prisma from "../../../client.js";

export class ExerciseService {
  async getAllExercises() {
    try {
      return await prisma.exercise.findMany({
        include: {
          topic: true,
        },
        orderBy: {
          sequence: 'asc',
        },
      });
    } catch (error) {
      throw new Error("Error fetching exercises from database");
    }
  }

  async getExerciseById(id: string) {
    try {
      return await prisma.exercise.findUnique({
        where: { id },
        include: {
          topic: true,
        },
      });
    } catch (error) {
      throw new Error("Error fetching exercise by ID from database");
    }
  }

  async getExercisesByTopicId(topicId: string) {
    try {
      return await prisma.exercise.findMany({
        where: { topicId },
        orderBy: {
          sequence: 'asc',
        },
      });
    } catch (error) {
      throw new Error("Error fetching exercises by topic ID from database");
    }
  }
}